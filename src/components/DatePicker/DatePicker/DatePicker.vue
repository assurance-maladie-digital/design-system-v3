<script lang="ts" setup>
	import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, type ComponentPublicInstance } from 'vue'
	import SyTextField from '../../Customs/SyTextField/SyTextField.vue'
	import DateTextInput from '../DateTextInput/DateTextInput.vue'
	import ComplexDatePicker from '../ComplexDatePicker/ComplexDatePicker.vue'
	import { VDatePicker } from 'vuetify/components'
	import { useValidation } from '@/composables/validation/useValidation'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import { useDateInitialization, type DateValue, type DateInput } from '@/composables/date/useDateInitializationDayjs'
	import { useDatePickerAccessibility } from '@/composables/date/useDatePickerAccessibility'
	import { useWeekendDays, useTodayButton, useDatePickerViewMode, useDateSelection, useMonthButtonCustomization, useDisplayedDateString } from '../composables'
	import { DATE_PICKER_MESSAGES } from '../constants/messages'
	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import { mdiCalendar } from '@mdi/js'

	// Initialiser les plugins dayjs
	dayjs.extend(customParseFormat)

	const { parseDate, formatDate } = useDateFormat()
	const { initializeSelectedDates } = useDateInitialization()
	const { updateAccessibility } = useDatePickerAccessibility()

	const props = withDefaults(defineProps<{
		modelValue?: DateInput
		label?: string
		placeholder?: string
		format?: string
		dateFormatReturn?: string
		isBirthDate?: boolean
		birthDate?: boolean // Alias pour isBirthDate pour compatibilité avec l'attribut kebab-case birth-date
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
		readonly?: boolean
		width?: string
		disableErrorHandling?: boolean
		showSuccessMessages?: boolean
		bgColor?: string
		displayWeekendDays?: boolean
		displayTodayButton?: boolean
		useCombinedMode?: boolean
		textFieldActivator?: boolean
		period?: {
			min?: string
			max?: string
		}
	}>(), {
		modelValue: undefined,
		label: DATE_PICKER_MESSAGES.LABEL_DEFAULT,
		placeholder: DATE_PICKER_MESSAGES.PLACEHOLDER_DEFAULT,
		format: DATE_PICKER_MESSAGES.FORMAT_DEFAULT,
		dateFormatReturn: '',
		isBirthDate: false,
		birthDate: false,
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
		readonly: false,
		width: '100%',
		disableErrorHandling: false,
		showSuccessMessages: true,
		bgColor: undefined,
		displayWeekendDays: true,
		displayTodayButton: true,
		useCombinedMode: false,
		textFieldActivator: false,
		period: () => ({
			min: '',
			max: '',
		}),
	})

	// La compatibilité entre isBirthDate et birthDate est gérée directement dans l'appel au composable

	// Utilisation des composables pour les fonctionnalités du DatePicker
	const { displayWeekendDays } = useWeekendDays(props)
	const { todayInString } = useTodayButton(props)

	const selectedDates = ref<Date | Date[] | null>(
		initializeSelectedDates(props.modelValue as DateInput | null, props.format, props.dateFormatReturn),
	)

	// Utilisation du composable pour l'affichage formaté des dates
	const { displayedDateString } = useDisplayedDateString({
		selectedDates,
		todayInString,
	})

	// Fonction pour sélectionner la date du jour
	const handleSelectToday = () => {
		// Créer une seule instance de la date du jour
		const today = new Date()

		// Si c'est une plage de dates, on définit le même jour pour début et fin
		if (props.displayRange) {
			selectedDates.value = [today, today]
			// Formater les dates pour le modèle (format de retour)
			const formattedToday = formatDate(today, props.dateFormatReturn || props.format)
			updateModel([formattedToday, formattedToday])
		}
		else {
			// Sinon, on sélectionne simplement aujourd'hui
			selectedDates.value = today
			// Formater la date pour le modèle (format de retour)
			const formattedToday = formatDate(today, props.dateFormatReturn || props.format)
			updateModel(formattedToday)
		}

		// Mettre à jour l'affichage formaté
		updateDisplayFormattedDate()
	}

	const emit = defineEmits<{
		(e: 'update:modelValue', value: DateValue): void
		(e: 'closed'): void
		(e: 'focus'): void
		(e: 'blur'): void
	}>()

	const isDatePickerVisible = ref(false)
	const validation = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: 'Date',
		customRules: props.customRules,
		warningRules: props.customWarningRules,
		disableErrorHandling: props.disableErrorHandling,
	})
	const { errors, warnings, successes, validateField, clearValidation } = !props.readonly
		? validation
		: {
			errors: ref<string[]>([]),
			warnings: ref<string[]>([]),
			successes: ref<string[]>([]),
			validateField: () => {},
			clearValidation: () => {},
		}

	const errorMessages = errors
	const warningMessages = warnings
	const successMessages = successes
	const displayFormattedDate = ref('')

	const textInputValue = ref<string>('')

	// Variable pour éviter les mises à jour récursives
	const isUpdatingFromInternal = ref(false)
	const isInitialValidation = ref(true)

	// Fonction pour valider les dates
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
			if (props.readonly) {
				return
			}
			// Ne pas afficher d'erreur si on est dans le contexte du mounted initial
			if (shouldDisplayErrors && (!isInitialValidation.value || forceValidation)) {
				errors.value.push(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
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
			isDatePickerVisible.value = false
			emit('closed')
			validateDates()
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

	// Utilisation du composable pour gérer la sélection de dates
	const { updateSelectedDates, rangeBoundaryDates } = useDateSelection(
		parseDate,
		selectedDates,
		props.format,
		props.displayRange,
	)

	// Date(s) formatée(s) en chaîne de caractères pour la valeur de retour
	const formattedDate = computed<DateValue>(() => {
		if (!selectedDates.value) return ''

		const returnFormat = props.dateFormatReturn || props.format

		// Pour les plages de dates, utiliser rangeBoundaryDates s'il est disponible
		if (props.displayRange && rangeBoundaryDates.value) {
			return [
				formatDate(rangeBoundaryDates.value[0], returnFormat),
				formatDate(rangeBoundaryDates.value[1], returnFormat),
			] as [string, string]
		}
		else if (Array.isArray(selectedDates.value)) {
			if (selectedDates.value.length >= 2) {
				return [
					formatDate(selectedDates.value[0], returnFormat),
					formatDate(selectedDates.value[selectedDates.value.length - 1], returnFormat),
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

	// Gestionnaire pour les mises à jour du DateTextInput en mode no-calendar
	const handleDateTextInputUpdate = (value: DateValue) => {
		if (isUpdatingFromInternal.value) return

		try {
			isUpdatingFromInternal.value = true

			// Mettre à jour le modèle avec la valeur reçue du DateTextInput
			updateModel(value)

			// Mettre à jour selectedDates en fonction de la valeur reçue
			if (!value) {
				selectedDates.value = null
				displayFormattedDate.value = ''
			}
			else if (Array.isArray(value) && props.displayRange) {
				// Pour les plages de dates
				const [startDateStr, endDateStr] = value
				const startDate = parseDate(startDateStr, props.dateFormatReturn || props.format)
				const endDate = parseDate(endDateStr, props.dateFormatReturn || props.format)

				if (startDate && endDate) {
					selectedDates.value = [startDate, endDate]
					displayFormattedDate.value = `${formatDate(startDate, props.format)} - ${formatDate(endDate, props.format)}`
				}
			}
			else if (typeof value === 'string') {
				// Pour une date unique
				const date = parseDate(value, props.dateFormatReturn || props.format)
				if (date) {
					selectedDates.value = date
					displayFormattedDate.value = formatDate(date, props.format)
				}
			}
		}
		finally {
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}

	// Gestionnaire pour les événements date-selected du DateTextInput
	const handleDateTextInputSelection = (value: DateValue) => {
		if (isUpdatingFromInternal.value) return

		// Mettre à jour le modèle avec la valeur sélectionnée
		updateModel(value)
	}

	watch(textInputValue, (newValue) => {
		// Éviter les mises à jour récursives
		if (isUpdatingFromInternal.value || props.noCalendar) return

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

	// Fonction pour mettre à jour displayFormattedDate quand le VDatePicker change
	const updateDisplayFormattedDate = () => {
		if (displayFormattedDateComputed.value) {
			displayFormattedDate.value = displayFormattedDateComputed.value
		}
	}

	// Le composable useDateSelection est déjà initialisé plus haut dans le code

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

	// todayInString est maintenant fourni par le composable useTodayButton

	// Utilisation du composable pour personnaliser le bouton du mois
	const { customizeMonthButton, setupMonthButtonObserver } = useMonthButtonCustomization(
		() => isDatePickerVisible.value,
	)

	onMounted(() => {
		document.addEventListener('click', handleClickOutside)

		// Configurer l'observateur pour le bouton du mois
		setupMonthButtonObserver()

		// Initialiser l'affichage formaté
		if (displayFormattedDateComputed.value) {
			displayFormattedDate.value = displayFormattedDateComputed.value
		}

		// Valider les dates au montage, mais sans afficher d'erreur pour le required
		validateDates()

		// Après la validation initiale, désactiver le flag
		nextTick(() => {
			isInitialValidation.value = false
		})
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleClickOutside)
	})

	const dateTextInputRef = ref<null | ComponentPublicInstance<typeof DateTextInput>>()
	const dateCalendarTextInputRef = ref<null | ComponentPublicInstance<typeof SyTextField>>()
	const datePickerRef = ref<null | ComponentPublicInstance<typeof VDatePicker>>()

	const validateOnSubmit = () => {
		if (props.noCalendar) {
			return dateTextInputRef.value?.validateOnSubmit()
		}
		// Forcer la validation pour ignorer les conditions de validation interactive
		validateDates(true)
		// Retourner directement un booléen pour maintenir la compatibilité avec les tests existants
		return errors.value.length === 0
	}

	const openDatePicker = () => {
		if (!isDatePickerVisible.value) {
			toggleDatePicker()
		}
	}

	// Utilisation du composable pour gérer le mode d'affichage du DatePicker
	const { currentViewMode, handleViewModeUpdate, handleYearUpdate, handleMonthUpdate, resetViewMode } = useDatePickerViewMode(
		// Fonction qui retourne la valeur actuelle de isBirthDate (combinaison de isBirthDate et birthDate)
		() => props.isBirthDate || props.birthDate,
	)

	const handleInputBlur = () => {
		emit('blur')
		validateDates(true)
	}

	watch(isDatePickerVisible, async (isVisible) => {
		if (!isVisible && props.isBirthDate) {
			// Réinitialiser le mode d'affichage au type birthdate
			resetViewMode()
		}

		if (isVisible) {
			// set the focus on the date picker
			await nextTick()
			const firstButton = datePickerRef.value?.$el.querySelector('button')
			if (firstButton) {
				firstButton.focus()
			}
		}
		else {
			// set the focus on the text input
			// wait for VMenu to finish DOM updates & transition
			setTimeout(() => {
				requestAnimationFrame(() => {
					const inputElement = dateCalendarTextInputRef.value?.$el?.querySelector('input')
					if (inputElement) {
						inputElement.focus()
						isDatePickerVisible.value = false
					}
				})
			}, 0)
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
					// Synchroniser les dates de plage avec le modèle
					syncFromModelValue(newValue)
				}
			}
			return
		}

		// Synchroniser les dates sélectionnées avec le modèle
		syncFromModelValue(newValue)

		// Mettre à jour textInputValue pour le DateTextInput en mode no-calendar
		if (props.noCalendar) {
			try {
				isUpdatingFromInternal.value = true

				if (!newValue) {
					textInputValue.value = ''
				}
				else if (Array.isArray(newValue) && props.displayRange) {
					// Pour les plages de dates, on ne modifie pas directement textInputValue
					// car le DateTextInput gère son propre formatage
				}
				else if (typeof newValue === 'string') {
					// Pour une date unique
					const date = parseDate(newValue, props.dateFormatReturn || props.format)
					if (date) {
						textInputValue.value = formatDate(date, props.format)
					}
					else {
						textInputValue.value = newValue
					}
				}
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
	}, { immediate: true })

	const toggleDatePicker = () => {
		if (props.disabled || props.readonly) return

		isDatePickerVisible.value = !isDatePickerVisible.value

		if (isDatePickerVisible.value) {
			nextTick(() => {
				updateAccessibility()
			})
		}
		else {
			emit('closed')
			validateDates()
		}
	}

	const openDatePickerOnClick = () => {
		openDatePicker()
		customizeMonthButton()
	}

	const openDatePickerOnFocus = () => {
		openDatePicker()
		emit('focus')
	}

	const openDatePickerOnIconClick = () => {
		toggleDatePicker()
	}

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
				:readonly="props.readonly"
				:is-outlined="props.isOutlined"
				:display-icon="props.displayIcon"
				:display-append-icon="props.displayAppendIcon"
				:display-prepend-icon="props.displayPrependIcon"
				:no-icon="props.noIcon"
				:disable-error-handling="props.disableErrorHandling"
				:show-success-messages="props.showSuccessMessages"
				:bg-color="props.bgColor"
				:display-range="props.displayRange"
				title="Date text input"
				@focus="emit('focus')"
				@blur="emit('blur')"
				@date-selected="handleDateTextInputSelection"
				@update:model-value="handleDateTextInputUpdate"
			/>
		</template>
		<template v-else-if="props.useCombinedMode">
			<ComplexDatePicker
				:model-value="props.modelValue"
				:format="props.format"
				:date-format-return="props.dateFormatReturn"
				:required="props.required"
				:custom-rules="props.customRules"
				:custom-warning-rules="props.customWarningRules"
				:disabled="props.disabled"
				:readonly="props.readonly"
				:is-outlined="props.isOutlined"
				:display-icon="props.displayIcon"
				:display-append-icon="props.displayAppendIcon"
				:display-prepend-icon="props.displayPrependIcon"
				:no-icon="props.noIcon"
				:disable-error-handling="props.disableErrorHandling"
				:show-success-messages="props.showSuccessMessages"
				:bg-color="props.bgColor"
				:display-range="props.displayRange"
				:display-weekend-days="props.displayWeekendDays"
				:display-today-button="props.displayTodayButton"
				:show-week-number="props.showWeekNumber"
				:is-birth-date="props.isBirthDate || props.birthDate"
				:text-field-activator="props.textFieldActivator"
				:title="'Date text input'"
				:period="period"
				@update:model-value="emit('update:modelValue', $event)"
				@focus="emit('focus')"
				@blur="emit('blur')"
			/>
		</template>
		<template v-else>
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
				<template #activator="{ props: menuProps }">
					<SyTextField
						v-bind="menuProps"
						ref="dateCalendarTextInputRef"
						v-model="displayFormattedDate"
						:append-icon="displayIcon && displayAppendIcon ? 'calendar' : undefined"
						:append-inner-icon="getIcon()"
						:class="[getMessageClasses(), 'label-hidden-on-focus']"
						:error-messages="errorMessages"
						:warning-messages="warningMessages"
						:success-messages="props.showSuccessMessages ? successMessages : []"
						:disabled="props.disabled"
						:disable-click-button="false"
						:readonly="true"
						:label="props.placeholder"
						:no-icon="props.noIcon"
						:prepend-icon="displayIcon && !displayAppendIcon ? 'calendar' : undefined"
						:variant-style="props.isOutlined ? 'outlined' : 'underlined'"
						color="primary"
						:show-success-messages="props.showSuccessMessages"
						:bg-color="props.bgColor"
						is-clearable
						title="Date Picker"
						@click="openDatePickerOnClick"
						@focus="openDatePickerOnFocus"
						@blur="handleInputBlur"
						@update:model-value="updateSelectedDates"
						@prepend-icon-click="openDatePickerOnIconClick"
						@append-icon-click="openDatePickerOnIconClick"
					/>
				</template>
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
					:class="displayWeekendDays ? 'weekend' : ''"
					:max="props.period?.max"
					:min="props.period?.min"
					@update:view-mode="handleViewModeUpdate"
					@update:year="handleYearUpdate"
					@update:month="handleMonthUpdate"
					@update:model-value="updateDisplayFormattedDate"
				>
					<template #title>
						Sélectionnez une date
					</template>
					<template #header>
						<h3 class="mx-auto my-auto ml-5 mb-4">
							{{ displayedDateString }}
						</h3>
					</template>
					<template
						v-if="props.displayTodayButton"
						#actions
					>
						<div class="d-flex justify-center w-100">
							<v-btn
								v-if="props.displayTodayButton"
								size="x-small"
								color="primary"
								:title="DATE_PICKER_MESSAGES.BUTTON_TODAY"
								class="my-2 pa-2 mt-2"
								:ripple="false"
								@click="handleSelectToday"
							>
								<VIcon
									class="mr-1"
								>
									{{ mdiCalendar }}
								</VIcon>
								{{ DATE_PICKER_MESSAGES.BUTTON_TODAY }}
							</v-btn>
						</div>
					</template>
				</VDatePicker>
			</VMenu>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

/* Disable ripple effect on month and year buttons */
:deep(.v-date-picker-controls__month-btn),
:deep(.v-date-picker-controls__mode-btn) {
	.v-ripple__container,
	.v-ripple__animation {
		display: none !important;
		opacity: 0 !important;
		background-color: transparent !important;
		pointer-events: none !important;
	}
}

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

:deep(.weekend .v-date-picker-month__day--week-end .v-btn) {
	background-color: #afb1b1;
}

/* div avant la class .v-date-picker-month__day--week-end */
:deep(.weekend .v-date-picker-month__day:has(+ .v-date-picker-month__day--week-end) .v-btn) {
	background-color: #afb1b1;
}

:deep(.v-date-picker-controls__mode-btn) {
	transform: none !important;
}

:deep(.v-btn--variant-text .v-btn__overlay) {
	padding: 13px;
}
</style>
