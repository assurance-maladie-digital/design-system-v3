<script lang="ts" setup>
	import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import DateTextInput from './DateTextInput.vue'
	import { VDatePicker } from 'vuetify/components'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import type { RuleOptions } from '@/composables/rules/useFieldValidation'

	type DateValue = string | [string, string]
	type DateInput = string | string[] | null | object

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
		customRules?: { type: string, options: RuleOptions }[]
		customWarningRules?: { type: string, options: RuleOptions }[]
		isDisabled?: boolean
		noIcon?: boolean
		noCalendar?: boolean
		isOutlined?: boolean
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
		customRules: () => [],
		customWarningRules: () => [],
		isDisabled: false,
		noIcon: false,
		noCalendar: false,
		isOutlined: true,
	})

	const emit = defineEmits<{
		(e: 'update:model-value', value: DateValue): void
		(e: 'closed'): void
	}>()

	// Fonction pour parser les dates selon le format spécifié
	const parseDate = (dateString: string): Date | null => {
		if (!dateString) return null

		// Créer un mapping des positions des éléments de date selon le format
		const format = props.format || 'DD/MM/YYYY'
		const separator = format.includes('/') ? '/' : format.includes('-') ? '-' : '.'
		const parts = format.split(separator)
		const dateParts = dateString.split(separator)

		if (parts.length !== dateParts.length) return null

		let day = '', month = '', year = ''

		// Extraire les valeurs selon leur position dans le format
		parts.forEach((part, index) => {
			const value = dateParts[index]
			if (part.includes('DD')) day = value
			else if (part.includes('MM')) month = value
			else if (part.includes('YYYY')) year = value
			else if (part.includes('YY')) year = '20' + value // Assumons que nous sommes au 21ème siècle
		})

		// Vérifier que nous avons toutes les parties nécessaires
		if (!day || !month || !year) return null

		const date = new Date(`${year}-${month}-${day}`)
		return isNaN(date.getTime()) ? null : date
	}

	function initializeSelectedDates(
		modelValue: DateInput | null,
	): Date | Date[] | null {
		if (!modelValue) return null

		if (Array.isArray(modelValue)) {
			if (modelValue.length >= 2) {
				const dates = [parseDate(modelValue[0]), parseDate(modelValue[1])]
				// Vérifie si l'une des dates est invalide
				if (dates.some(date => date === null)) {
					return []
				}
				// Vérifie si la première date est après la seconde
				if (dates[0] && dates[1] && dates[0] > dates[1]) {
					return []
				}
				// Filtrer les dates nulles et convertir en tableau de Date
				return dates.filter((date): date is Date => date !== null)
			}
			if (modelValue.length === 1) {
				const date = parseDate(modelValue[0])
				return date === null ? [] : [date]
			}
			return []
		}

		// Si modelValue est un objet, on le convertit en chaîne
		if (typeof modelValue === 'object') {
			return null
		}

		const date = parseDate(modelValue)
		return date === null ? null : date
	}

	// Utilisation de la fonction pour initialiser `selectedDates`
	const selectedDates = ref<Date | Date[] | null>(
		initializeSelectedDates(props.modelValue as DateInput | null),
	)

	const isDatePickerVisible = ref(false)
	const errorMessages = ref<string[]>([])
	const successMessages = ref<string[]>([])
	const warningMessages = ref<string[]>([])
	const displayFormattedDate = ref('')

	const getMessageClasses = () => ({
		'dp-width': true,
		'v-messages__message--success': successMessages.value.length > 0,
		'v-messages__message--error': errorMessages.value.length > 0,
		'v-messages__message--warning': warningMessages.value.length > 0 && errorMessages.value.length < 1,
	})

	// Formate une date unique au format spécifié
	const formatDate = (date: Date, format: string): string => {
		if (!date) return ''
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear().toString()
		const shortYear = year.slice(-2)
		return format.replace('YYYY', year).replace('YY', shortYear).replace('MM', month).replace('DD', day)
	}

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

	const validateDateValue = (value: string | string[]): DateValue => {
		if (Array.isArray(value)) {
			if (value.length >= 2) {
				return [value[0], value[1]] as [string, string]
			}
			return value[0] || ''
		}
		return value
	}

	watch(formattedDate, (newValue) => {
		const validValue = validateDateValue(newValue)
		emit('update:model-value', validValue)
	})

	watch(displayFormattedDateComputed, (newValue) => {
		if (!props.noCalendar && newValue) {
			displayFormattedDate.value = newValue
		}
	})

	const updateSelectedDates = (input: DateValue) => {
		if (Array.isArray(input)) {
			const dates = input
				.map(date => (date ? parseDate(date) : null))
				.filter((date): date is Date => date !== null)

			if (dates.length === 0) {
				selectedDates.value = null
				return
			}

			selectedDates.value = dates
			return
		}

		const date = input ? parseDate(input) : null
		selectedDates.value = date === null ? null : date
	}

	watch(selectedDates, (newValue) => {
		validateDates()
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
	})

	// Gestionnaire de clic en dehors
	const handleClickOutside = (event: MouseEvent) => {
		if (!isDatePickerVisible.value) return

		const target = event.target as HTMLElement
		const container = target.closest('.date-picker-container')

		// Si on clique dans le conteneur du DatePicker, on ne fait rien
		if (container) return

		isDatePickerVisible.value = false
		emit('closed')
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
		if (selectedDates.value !== null) {
			validateDates()
			// Force format application on mount
			emit('update:model-value', formattedDate.value)
		}
		if (displayFormattedDateComputed.value) {
			displayFormattedDate.value = displayFormattedDateComputed.value
		}
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleClickOutside)
	})

	const dateTextInputRef = ref()

	const validateOnSubmit = () => {
		if (props.noCalendar) {
			return dateTextInputRef.value?.validateOnSubmit()
		}
		validateDates()
		return errorMessages.value.length === 0
	}

	defineExpose({
		validateOnSubmit,
		isDatePickerVisible,
		selectedDates,
		errorMessages,
		handleClickOutside,
		initializeSelectedDates,
	})

	// les btns du date picker ne sont pas accessibles, on les rend accessibles
	watch(isDatePickerVisible, async (newValue) => {
		if (newValue) {
			await nextTick()
			const arrowDown = document.querySelector('.v-btn.v-btn--icon.v-theme--light.v-btn--density-comfortable.v-btn--size-default.v-btn--variant-text.v-date-picker-controls__mode-btn')
			const arrowLeftButtons = document.querySelectorAll('.v-btn.v-btn--icon.v-theme--light.v-btn--density-default.v-btn--size-default.v-btn--variant-text')

			if (arrowDown) {
				arrowDown.setAttribute('aria-label', 'Fleche vers le bas')
			}

			arrowLeftButtons.forEach((button, index) => {
				if (index === 0) {
					button.setAttribute('aria-label', 'Fleche vers la gauche')
				}
				else if (index === 1) {
					button.setAttribute('aria-label', 'Fleche vers la droite')
				}
			})
		}
	})

	const handlePrependIconClick = () => {
		isDatePickerVisible.value = true
	}

	const handleAppendIconClick = () => {
		isDatePickerVisible.value = true
	}

	type Rule = { type: string, options: RuleOptions }

	const customRules = ref<Rule[]>(props.customRules || [])
	const customWarningRules = ref<Rule[]>(props.customWarningRules || [])

	const { generateRules } = useFieldValidation()
	const validationRules = generateRules(customRules.value)
	const warningValidationRules = generateRules(customWarningRules.value)

	const validateDates = () => {
		errorMessages.value = []
		successMessages.value = []
		warningMessages.value = []

		const addMessages = (dates, rules) => {
			dates.forEach((date) => {
				rules.forEach((rule) => {
					const result = rule(date)
					if (result?.error) {
						errorMessages.value.push(result.error)
						errorMessages.value = [...new Set(errorMessages.value)]
					}
					else if (result?.warning) {
						warningMessages.value.push(result.warning)
						warningMessages.value = [...new Set(warningMessages.value)]
					}
					else if (result?.success) {
						successMessages.value.push(result.success)
						successMessages.value = [...new Set(successMessages.value)]
					}
				})
			})
		}

		const handleValidation = (dates) => {
			if (Array.isArray(dates) && dates.length > 1) {
				// Pour une plage, on ne vérifie que le premier et le dernier jour
				const [firstDate, ...rest] = dates
				const lastDate = rest[rest.length - 1]
				const datesToValidate = [firstDate, lastDate]

				// Validation des règles
				addMessages(datesToValidate, validationRules)
				addMessages(datesToValidate, warningValidationRules)
			}
			else {
				// Pour une date unique, on valide normalement
				const datesToValidate = Array.isArray(dates) ? dates : [dates]
				addMessages(datesToValidate, validationRules)
				addMessages(datesToValidate, warningValidationRules)
			}
		}

		if (
			props.required
			&& (!selectedDates.value || (Array.isArray(selectedDates.value) && selectedDates.value.length === 0))
		) {
			errorMessages.value.push('La date est requise.')
		}
		else if (selectedDates.value) {
			handleValidation(Array.isArray(selectedDates.value) ? selectedDates.value : [selectedDates.value])
		}
	}

	const getIcon = () => {
		if (props.noCalendar) {
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
</script>

<template>
	<div class="date-picker-container">
		<template v-if="props.noCalendar">
			<DateTextInput
				ref="dateTextInputRef"
				v-model="displayFormattedDate"
				:class="[getMessageClasses(), 'label-hidden-on-focus']"
				:date-format-return="props.dateFormatReturn"
				:format="props.format"
				:label="props.placeholder"
				:placeholder="props.placeholder"
				:range="props.displayRange"
				:required="props.required"
				:rules="props.customRules"
				:warning-rules="props.customWarningRules"
				title="Date text input"
				@update:model-value="updateSelectedDates"
			/>
		</template>
		<template v-else>
			<SyTextField
				v-model="displayFormattedDate"
				:append-icon="displayIcon && displayAppendIcon ? 'calendar' : undefined"
				:append-inner-icon="getIcon()"
				:class="[getMessageClasses(), 'label-hidden-on-focus']"
				:error-messages="errorMessages"
				:is-disabled="props.isDisabled"
				:is-read-only="true"
				:label="props.placeholder"
				:messages="warningMessages.length > 0 ? [...warningMessages] : [ ...successMessages]"
				:no-icon="props.noIcon"
				:prepend-icon="displayIcon && !displayAppendIcon ? 'calendar' : undefined"
				:variant-style="props.isOutlined ? 'outlined' : 'underlined'"
				color="primary"
				is-clearable
				title="Date Picker"
				@focus="isDatePickerVisible = true"
				@update:model-value="updateSelectedDates"
				@prepend-icon-click="handlePrependIconClick"
				@append-icon-click="handleAppendIconClick"
			/>
		</template>
		<transition name="fade">
			<v-locale-provider locale="fr">
				<VDatePicker
					v-if="isDatePickerVisible && !props.noCalendar"
					v-model="selectedDates"
					:first-day-of-week="1"
					:multiple="props.displayRange ? 'range' : false"
					:show-adjacent-months="true"
					:show-week="props.showWeekNumber"
					:view-mode="props.isBirthDate ? 'year' : 'month'"
					color="primary"
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
			</v-locale-provider>
		</transition>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.label-hidden-on-focus:focus + label {
	display: none;
}

.dp-width {
	min-width: 345px;
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
	max-width: 345px;
	position: relative;

	:deep(.v-date-picker) {
		width: 345px;
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
