<script lang="ts" setup>
	import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
	import type { Ref, ComponentPublicInstance } from 'vue'

	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import DateTextInput from './DateTextInput.vue'
	import { VDatePicker } from 'vuetify/components'
	import { useValidation } from '@/composables/validation/useValidation'
	import { useDateFormat } from '@/composables/date/useDateFormat'
	import { useDateInitialization, type DateValue, type DateInput } from '@/composables/date/useDateInitialization'
	import { useDatePickerAccessibility } from '@/composables/date/useDatePickerAccessibility'

	const { parseDate, formatDate } = useDateFormat()
	const { initializeSelectedDates } = useDateInitialization()
	const { updateAccessibility } = useDatePickerAccessibility()

	const props = withDefaults(defineProps<{
		modelValue?: DateInput
		placeholder?: string
		format?: string
		dateFormatReturn?: string
		isBirthDate?: boolean
		showWeekNumber?: boolean
		required?: boolean
		displayRange?: boolean
		displayIcon?: boolean
		displayAppendIcon?: boolean
		displayPrependIcon?: boolean
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
		customRules?: { type: string, options: any }[]
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
		customWarningRules?: { type: string, options: any }[]
		disabled?: boolean
		noIcon?: boolean
		noCalendar?: boolean
		isOutlined?: boolean
		readOnly?: boolean
		width?: string
		disableErrorHandling?: boolean
		showSuccessMessages?: boolean
		bgColor?: string
	}>(), {
		modelValue: undefined,
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		displayPrependIcon: true,
		customRules: () => [],
		customWarningRules: () => [],
		disabled: false,
		noIcon: false,
		noCalendar: false,
		isOutlined: true,
		readOnly: false,
		width: '100%',
		disableErrorHandling: false,
		showSuccessMessages: true,
		bgColor: undefined,
	})

	const datePickerRef: Ref<ComponentPublicInstance | null> = ref(null)

	const emit = defineEmits<{
		(e: 'update:modelValue', value: DateValue): void
		(e: 'closed'): void
		(e: 'focus'): void
		(e: 'blur'): void
	}>()

	const selectedDates = ref<Date | Date[] | null>(
		initializeSelectedDates(props.modelValue as DateInput | null, props.format, props.dateFormatReturn),
	)

	const isDatePickerVisible = ref(false)
	const validation = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: 'Date',
		customRules: props.customRules,
		warningRules: props.customWarningRules,
		disableErrorHandling: props.disableErrorHandling,
	})
	const { errors, warnings, successes, validateField, clearValidation } = validation

	const errorMessages = errors
	const warningMessages = warnings
	const successMessages = successes
	const displayFormattedDate = ref('')

	const textInputValue = ref<string>('')

	// Variable pour éviter les mises à jour récursives
	const isUpdatingFromInternal = ref(false)

	// Déclaration de la fonction validateDates avant son utilisation
	const validateDates = (forceValidation = false) => {
		if (props.noCalendar) {
			// En mode no-calendar, on délègue la validation au DateTextInput
			return
		}

		// Réinitialiser la validation
		clearValidation()

		// Si la gestion des erreurs est désactivée, on effectue la validation interne
		// mais on n'ajoute pas les messages d'erreur
		const shouldDisplayErrors = !props.disableErrorHandling

		// Vérifier si le champ est requis et vide
		if ((forceValidation || !isUpdatingFromInternal.value) && props.required && (!selectedDates.value || (Array.isArray(selectedDates.value) && selectedDates.value.length === 0))) {
			if (shouldDisplayErrors) {
				errors.value.push('La date est requise.')
			}
			return
		}

		if (!selectedDates.value) return

		// Préparer les dates à valider
		const datesToValidate = Array.isArray(selectedDates.value)
			? selectedDates.value
			: [selectedDates.value]

		// Valider chaque date
		if (shouldDisplayErrors) {
			datesToValidate.forEach((date) => {
				validateField(
					date,
					props.customRules,
					props.customWarningRules,
				)
			})

			// Dédoublonner les messages (au cas où plusieurs dates auraient les mêmes messages)
			errors.value = [...new Set(errors.value)]
			warnings.value = [...new Set(warnings.value)]
			successes.value = [...new Set(successes.value)]
		}
	}

	// Fonction centralisée pour mettre à jour le modèle
	const updateModel = (value: DateValue) => {
		// Éviter les mises à jour inutiles
		if (JSON.stringify(value) === JSON.stringify(props.modelValue)) return

		try {
			isUpdatingFromInternal.value = true
			emit('update:modelValue', value)
		}
		finally {
			// S'assurer que le flag est toujours réinitialisé
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}

	// Watcher pour mettre à jour le modèle lorsque les dates sélectionnées changent
	watch(selectedDates, (newValue) => {
		// Valider les dates
		validateDates()

		// Mettre à jour le modèle si nécessaire
		if (newValue !== null) {
			updateModel(formattedDate.value)

			// Mettre à jour textInputValue pour le DateTextInput
			try {
				isUpdatingFromInternal.value = true
				if (Array.isArray(newValue)) {
					// Pour les plages de dates, utiliser la première date
					if (newValue.length > 0) {
						textInputValue.value = formatDate(newValue[0], props.format)
					}
				}
				else {
					// Pour une date unique
					textInputValue.value = formatDate(newValue, props.format)
				}
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
		else {
			updateModel(null)
			// Réinitialiser textInputValue
			textInputValue.value = ''
		}
	})

	const getMessageClasses = () => ({
		'dp-width': true,
		'v-messages__message--success': successMessages.value.length > 0,
		'v-messages__message--error': errorMessages.value.length > 0,
		'v-messages__message--warning': warningMessages.value.length > 0 && errorMessages.value.length < 1,
	})

	const inputStyle = computed(() => ({
		'min-width': '100%',
	}))

	// Date(s) formatée(s) en chaîne de caractères pour la valeur de retour
	const formattedDate = computed<DateValue>(() => {
		if (!selectedDates.value) return ''

		const returnFormat = props.dateFormatReturn || props.format

		if (Array.isArray(selectedDates.value)) {
			if (selectedDates.value.length >= 2) {
				return [
					formatDate(selectedDates.value[0], returnFormat),
					formatDate(selectedDates.value[1], returnFormat),
				] as [string, string]
			}
			return ''
		}

		return formatDate(selectedDates.value, returnFormat)
	})

	watch(formattedDate, (newValue) => {
		if (!newValue || newValue === '') {
			textInputValue.value = ''
		}
		else if (typeof newValue === 'string') {
			// Si on a un format de retour différent, on doit convertir la date
			if (props.dateFormatReturn) {
				const date = parseDate(newValue, props.dateFormatReturn)
				if (date) {
					textInputValue.value = formatDate(date, props.format)
				}
			}
			else {
				textInputValue.value = newValue
			}
		}
	}, { immediate: true })

	watch(textInputValue, (newValue) => {
		// Éviter les mises à jour récursives
		if (isUpdatingFromInternal.value) return

		// Parse la date avec le format d'affichage
		const date = parseDate(newValue, props.format)
		if (date) {
			// Si on a un format de retour, formater la date dans ce format
			const formattedValue = props.dateFormatReturn
				? formatDate(date, props.dateFormatReturn)
				: formatDate(date, props.format)
			updateModel(formattedValue)

			// Mettre à jour selectedDates sans déclencher de watchers supplémentaires
			try {
				isUpdatingFromInternal.value = true
				selectedDates.value = date
				// Mettre à jour l'affichage formaté
				displayFormattedDate.value = formatDate(date, props.format)
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
		else if (newValue) {
			// Même si la date n'est pas valide, conserver la valeur saisie
			// pour éviter que la date ne disparaisse
			updateModel(newValue)
			// Mettre à jour l'affichage formaté pour qu'il corresponde à ce qui est saisi
			try {
				isUpdatingFromInternal.value = true
				displayFormattedDate.value = newValue
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
		else {
			updateModel(null)
			// Réinitialiser l'affichage formaté
			try {
				isUpdatingFromInternal.value = true
				displayFormattedDate.value = ''
				selectedDates.value = null
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
	})

	// Date(s) formatée(s) en chaîne de caractères pour l'affichage
	const displayFormattedDateComputed = computed(() => {
		if (!selectedDates.value) return null

		if (Array.isArray(selectedDates.value)) {
			if (selectedDates.value.length >= 2) {
				return `${formatDate(selectedDates.value[0], props.format)} - ${formatDate(
					selectedDates.value[selectedDates.value.length - 1],
					props.format,
				)}`
			}
			return formatDate(selectedDates.value[0], props.format)
		}

		return formatDate(selectedDates.value, props.format)
	})

	watch(displayFormattedDateComputed, (newValue) => {
		if (!props.noCalendar && newValue) {
			displayFormattedDate.value = newValue
		}
	})

	const updateSelectedDates = (input: DateValue) => {
		if (Array.isArray(input)) {
			const dates = input
				.map(date => (date ? parseDate(date, props.format) : null))
				.filter((date): date is Date => date !== null)

			if (dates.length === 0) {
				selectedDates.value = null
				return
			}

			selectedDates.value = dates
			return
		}

		const date = input ? parseDate(input, props.format) : null
		selectedDates.value = date === null ? null : date
	}

	// Gestionnaire de clic en dehors
	const handleClickOutside = (event: MouseEvent) => {
		if (!isDatePickerVisible.value) return

		const target = event.target as HTMLElement
		const container = target.closest('.date-picker-container')

		// Si on clique dans le conteneur du DatePicker, on ne fait rien
		if (container) return
		emit('closed')
		// Déclencher la validation à la fermeture
		validateDates()
	}

	const todayInString = computed(() => {
		return (new Date().toLocaleDateString('fr-FR', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		})).replace(/\b\w/g, l => l.toUpperCase())
	})

	onMounted(() => {
		document.addEventListener('click', handleClickOutside)

		// Initialiser l'affichage formaté
		if (displayFormattedDateComputed.value) {
			displayFormattedDate.value = displayFormattedDateComputed.value
		}

		// Valider les dates au montage
		validateDates()
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleClickOutside)
	})

	const dateTextInputRef = ref()

	const validateOnSubmit = () => {
		if (props.noCalendar) {
			return dateTextInputRef.value?.validateOnSubmit()
		}
		// Forcer la validation pour ignorer les conditions de validation interactive
		validateDates(true)
		// Retourner directement un booléen pour maintenir la compatibilité avec les tests existants
		return errors.value.length === 0
	}

	const showDatePicker = () => {
		if (props.disabled || props.readOnly) return

		isDatePickerVisible.value = true

		// Mettre à jour l'accessibilité après l'ouverture du DatePicker
		nextTick(() => {
			updateAccessibility(datePickerRef)
		})
	}

	const openDatePicker = () => {
		showDatePicker()
	}

	type ViewMode = 'month' | 'year' | 'months' | undefined

	// Variable pour suivre le mode d'affichage actuel du DatePicker
	const currentViewMode = ref<ViewMode>(props.isBirthDate ? 'year' : 'month')

	// Fonction pour gérer le changement de mode d'affichage
	const handleViewModeUpdate = (newMode: ViewMode) => {
		currentViewMode.value = newMode
	}

	// Fonction pour gérer la sélection de l'année quand isBirthDate est true
	const handleYearUpdate = () => {
		if (props.isBirthDate) {
			// Après la sélection de l'année, passer automatiquement à la sélection du mois
			currentViewMode.value = 'months'
		}
	}

	// Fonction pour gérer la sélection du mois quand isBirthDate est true
	const handleMonthUpdate = () => {
		if (props.isBirthDate) {
			// Après la sélection du mois, passer automatiquement à la sélection du jour
			currentViewMode.value = undefined
		}
	}

	watch(isDatePickerVisible, (isVisible) => {
		if (!isVisible && props.isBirthDate) {
			// Réinitialiser le mode d'affichage au type birthdate
			currentViewMode.value = 'year'
		}
	})

	const getIcon = () => {
		if (props.noCalendar || props.disableErrorHandling) {
			return
		}
		switch (true) {
		case errorMessages.value.length > 0:
			return 'error'
		case warningMessages.value.length > 0:
			return 'warning'
		case successMessages.value.length > 0:
			return 'success'
		default:
			return
		}
	}

	const syncFromModelValue = (newValue: DateInput | undefined) => {
		if (!newValue || newValue === '') {
			selectedDates.value = null
			textInputValue.value = ''
			displayFormattedDate.value = ''
			validateDates()
			return
		}

		selectedDates.value = initializeSelectedDates(newValue, props.format, props.dateFormatReturn)

		if (selectedDates.value) {
			const firstDate = Array.isArray(selectedDates.value)
				? selectedDates.value[0]
				: selectedDates.value

			textInputValue.value = formatDate(firstDate, props.format)
			displayFormattedDate.value = displayFormattedDateComputed.value || ''
		}

		validateDates()
	}

	watch(() => props.modelValue, (newValue) => {
		if (isUpdatingFromInternal.value) {
			if (props.displayRange) {
				if (Array.isArray(newValue) && newValue.length >= 2) {
					isDatePickerVisible.value = false
					emit('closed')
				}
			}
			else {
				isDatePickerVisible.value = false
				emit('closed')
			}
			return
		}

		try {
			isUpdatingFromInternal.value = true
			syncFromModelValue(newValue)
		}
		finally {
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}, { immediate: true })

	defineExpose({
		validateOnSubmit,
		isDatePickerVisible,
		selectedDates,
		errorMessages,
		handleClickOutside,
		initializeSelectedDates,
		updateAccessibility,
		openDatePicker,
	})
</script>

<template>
	<div
		class="date-picker-container"
		:style="inputStyle"
	>
		<template v-if="props.noCalendar">
			<DateTextInput
				ref="dateTextInputRef"
				v-model="textInputValue"
				:class="[getMessageClasses(), 'label-hidden-on-focus']"
				:date-format-return="props.dateFormatReturn"
				:format="props.format"
				:label="props.placeholder"
				:placeholder="props.placeholder"
				:required="props.required"
				:custom-rules="props.customRules"
				:custom-warning-rules="props.customWarningRules"
				:disabled="props.disabled"
				:read-only="props.readOnly"
				:is-outlined="props.isOutlined"
				:display-icon="props.displayIcon"
				:display-append-icon="props.displayAppendIcon"
				:display-prepend-icon="props.displayPrependIcon"
				:no-icon="props.noIcon"
				:disable-error-handling="props.disableErrorHandling"
				:show-success-messages="props.showSuccessMessages"
				:bg-color="props.bgColor"
				title="Date text input"
				@focus="emit('focus')"
				@blur="emit('blur')"
			/>
		</template>
		<template v-else>
			<SyTextField
				v-model="displayFormattedDate"
				:append-icon="displayIcon && displayAppendIcon ? 'calendar' : undefined"
				:append-inner-icon="getIcon()"
				:class="[getMessageClasses(), 'label-hidden-on-focus']"
				:error-messages="errorMessages"
				:warning-messages="warningMessages"
				:success-messages="props.showSuccessMessages ? successMessages : []"
				:disabled="props.disabled"
				:read-only="true"
				:label="props.placeholder"
				:no-icon="props.noIcon"
				:prepend-icon="displayIcon && !displayAppendIcon ? 'calendar' : undefined"
				:variant-style="props.isOutlined ? 'outlined' : 'underlined'"
				color="primary"
				:show-success-messages="props.showSuccessMessages"
				:bg-color="props.bgColor"
				is-clearable
				title="Date Picker"
				@focus="openDatePicker"
				@update:model-value="updateSelectedDates"
				@prepend-icon-click="openDatePicker"
				@append-icon-click="openDatePicker"
			/>
		</template>
		<div>
			<VMenu
				v-if="!props.noCalendar"
				v-model="isDatePickerVisible"
				activator="parent"
				:min-width="0"
				location="bottom"
				:close-on-content-click="false"
				:open-on-click="false"
				scroll-strategy="none"
				transition="fade-transition"
				attach="body"
				:offset="[-20, 5]"
			>
				<transition name="fade">
					<VDatePicker
						v-if="isDatePickerVisible && !props.noCalendar"
						ref="datePickerRef"
						v-model="selectedDates"
						color="primary"
						:first-day-of-week="1"
						:multiple="props.displayRange ? 'range' : false"
						:show-adjacent-months="true"
						:show-week="props.showWeekNumber"
						:view-mode="currentViewMode"
						@update:view-mode="handleViewModeUpdate"
						@update:year="handleYearUpdate"
						@update:month="handleMonthUpdate"
					>
						<template #title>
							Sélectionnez une date
						</template>
						<template #header>
							<h3 class="mx-auto my-auto ml-5 mb-4">
								{{ todayInString }}
							</h3>
						</template>
					</VDatePicker>
				</transition>
			</VMenu>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.label-hidden-on-focus:focus + label {
	display: none;
}

.dp-width {
	width: v-bind('props.width');
}

.v-messages__message--success {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: tokens.$colors-text-success !important;

		--v-medium-emphasis-opacity: 1;
	}

	.v-field--active & {
		color: tokens.$colors-border-success !important;
	}
}

.v-messages__message--error {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: tokens.$colors-text-error !important;
	}

	.v-field--active & {
		color: tokens.$colors-border-error !important;
	}
}

.v-messages__message--warning {
	:deep(.v-input__control) {
		color: tokens.$colors-text-warning !important;

		--v-medium-emphasis-opacity: 1;
	}

	:deep(.v-messages__message) {
		color: tokens.$colors-text-warning !important;
	}

	.v-field--active & {
		color: tokens.$colors-text-warning !important;
	}
}

:deep(.v-btn__content) {
	font-size: tokens.$font-size-body-text + 3;
	font-weight: bold;
}

:deep(.v-messages) {
	opacity: 1;
}

:deep(.v-field--dirty) {
	opacity: 1 !important;

	--v-medium-emphasis-opacity: 1;
}

:deep(.v-field--focused) {
	opacity: 1 !important;

	--v-medium-emphasis-opacity: 1;
}

.date-picker-container {
	max-width: 100%;
	position: relative;

	:deep(.v-date-picker) {
		max-width: 445px;
		position: absolute;
		top: 56px;
		left: 0;
		z-index: 2;
		box-shadow:
			0 5px 5px -3px rgb(0 0 0 / 20%),
			0 8px 10px 1px rgb(0 0 0 / 14%),
			0 3px 14px 2px rgb(0 0 0 / 12%) !important;
	}
}

:deep(.v-date-picker-month__day--selected, .v-date-picker-month__day--adjacent) {
	opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
