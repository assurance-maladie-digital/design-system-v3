<script lang="ts" setup>
	import { computed, ref, watch } from 'vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import type { RuleOptions } from '@/composables/rules/useFieldValidation'

	// Types
	type DateValue = string | [string, string]

	interface Props {
		modelValue?: DateValue
		placeholder?: string
		required?: boolean
		range?: boolean
		rules?: { type: string, options: RuleOptions }[]
		warningRules?: { type: string, options: RuleOptions }[]
		errorMessages?: string[]
		warningMessages?: string[]
		successMessages?: string[]
		hasError?: boolean
		hasWarning?: boolean
		hasSuccess?: boolean
		label?: string
		format?: string
		dateFormatReturn?: string
	}

	const props = withDefaults(defineProps<Props>(), {
		modelValue: undefined,
		placeholder: '',
		required: false,
		range: false,
		rules: () => [],
		warningRules: () => [],
		errorMessages: () => [],
		warningMessages: () => [],
		successMessages: () => [],
		hasError: false,
		hasWarning: false,
		hasSuccess: false,
		label: '',
		format: '',
		dateFormatReturn: '',
	})

	const emit = defineEmits<{
		(e: 'update:model-value', value: DateValue): void
	}>()

	// État local
	const inputValue = ref('')
	const localErrorMessages = ref<string[]>([])
	const localWarningMessages = ref<string[]>([])
	const localSuccessMessages = ref<string[]>([])
	const localHasError = ref(false)
	const localHasWarning = ref(false)
	const localHasSuccess = ref(false)

	// Synchroniser les messages externes avec l'état local
	watch(() => props.errorMessages, (newValue) => {
		localErrorMessages.value = newValue || []
		localHasError.value = props.hasError || false
	}, { immediate: true })

	watch(() => props.warningMessages, (newValue) => {
		localWarningMessages.value = newValue || []
		localHasWarning.value = props.hasWarning || false
	}, { immediate: true })

	watch(() => props.successMessages, (newValue) => {
		localSuccessMessages.value = newValue || []
		localHasSuccess.value = props.hasSuccess || false
	}, { immediate: true })

	// Validation setup
	const { generateRules } = useFieldValidation()

	// Règles de validation
	const defaultRules = computed(() => {
		// Règle de base selon le type (date simple ou range)
		const baseRule = {
			type: props.range ? 'dateRange' : 'dateFormat',
			options: {
				message: props.range ? 'Format invalide (JJ/MM/AAAA - JJ/MM/AAAA)' : 'Format invalide (JJ/MM/AAAA)',
			},
		}

		// Combiner avec les règles personnalisées
		return [baseRule, ...(props.rules || [])]
	})

	const validationRules = computed(() => generateRules(defaultRules.value))
	const warningValidationRules = computed(() => generateRules(props.warningRules))

	// Vérifier si une date est valide
	const isValidDate = (dateString: string): boolean => {
		if (!dateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false

		const [day, month, year] = dateString.split('/').map(Number)
		const date = new Date(year, month - 1, day)

		return date.getDate() === day
			&& date.getMonth() === month - 1
			&& date.getFullYear() === year
	}

	// Vérifier si une plage de dates est valide
	const isValidDateRange = (rangeString: string): boolean => {
		if (!rangeString || !/^\d{2}\/\d{2}\/\d{4}\s-\s\d{2}\/\d{2}\/\d{4}$/.test(rangeString)) return false

		const [startDate, endDate] = rangeString.split(' - ')
		return isValidDate(startDate) && isValidDate(endDate)
	}

	// Validation
	const validateField = () => {
		// Réinitialiser les messages et les états
		localErrorMessages.value = []
		localWarningMessages.value = []
		localSuccessMessages.value = []
		localHasError.value = false
		localHasWarning.value = false
		localHasSuccess.value = false

		// Si le champ est vide
		if (!inputValue.value) {
			if (props.required) {
				localErrorMessages.value = ['Ce champ est requis']
				localHasError.value = true
			}
			return
		}

		// Vérifier d'abord si la date ou la plage de dates est valide
		const isValid = props.range ? isValidDateRange(inputValue.value) : isValidDate(inputValue.value)
		if (!isValid) {
			localErrorMessages.value = [props.range ? 'Format invalide (JJ/MM/AAAA - JJ/MM/AAAA)' : 'Format invalide (JJ/MM/AAAA)']
			localHasError.value = true
			return
		}

		// Appliquer les règles de validation
		for (const rule of validationRules.value) {
			const result = rule(inputValue.value)
			if (typeof result === 'object') {
				if (result.error) {
					localErrorMessages.value.push(result.error)
					localHasError.value = true
					return
				}
				if (result.success) {
					localSuccessMessages.value.push(result.success)
					localHasSuccess.value = true
				}
			}
			else if (result !== true) {
				localErrorMessages.value.push(result)
				localHasError.value = true
				return
			}
		}

		// Si pas d'erreur, appliquer les règles d'avertissement
		if (!localHasError.value) {
			for (const rule of warningValidationRules.value) {
				const result = rule(inputValue.value)
				if (typeof result === 'object') {
					if (result.success) {
						localSuccessMessages.value.push(result.success)
						localHasSuccess.value = true
					}
					else if (result.warning) {
						localWarningMessages.value.push(result.warning)
						localHasWarning.value = true
					}
				}
				else if (result !== true) {
					localWarningMessages.value.push(result)
					localHasWarning.value = true
				}
			}
		}
	}

	// Formatage de la date pendant la saisie
	const formatDateInput = (value: string): string => {
		if (!value) return ''

		// Garder uniquement les chiffres
		const numbers = value.replace(/\D/g, '')

		// Format: DD/MM/YYYY
		if (numbers.length <= 2) return numbers
		if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
		if (numbers.length <= 8) return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
		return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
	}

	// Gestion de la saisie
	const handleInput = (value: string) => {
		if (!value) {
			inputValue.value = ''
			emit('update:model-value', props.range ? ['', ''] : '')
			validateField()
			return
		}

		if (props.range) {
			// Gestion du range
			let formattedValue = ''

			// Séparer les dates en utilisant le tiret comme séparateur
			const [firstPart = '', secondPart = ''] = value.includes(' - ')
				? value.split(' - ')
				: [value.slice(0, 10), value.slice(11)]

			// Formater la première date
			const formattedFirstDate = formatDateInput(firstPart)

			// Si la première date est complète, ajouter le séparateur et la deuxième date
			if (formattedFirstDate.length === 10) {
				formattedValue = `${formattedFirstDate} - ${formatDateInput(secondPart)}`
			}
			else {
				formattedValue = formattedFirstDate
			}

			inputValue.value = formattedValue

			// Valider et émettre si les deux dates sont complètes
			if (formattedValue.includes(' - ')) {
				const [startDate, endDate] = formattedValue.split(' - ')
				if (startDate.length === 10 && endDate.length === 10) {
					validateField()
					if (!localHasError.value) {
						emit('update:model-value', [startDate, endDate])
					}
				}
			}
		}
		else {
			// Gestion d'une date simple
			const formattedValue = formatDateInput(value)
			inputValue.value = formattedValue

			// Valider et émettre si la date est complète
			if (formattedValue.length === 10) {
				validateField()
				if (!localHasError.value) {
					emit('update:model-value', formattedValue)
				}
			}
		}
	}

	// Gestion du blur
	const handleBlur = () => {
		validateField()
	}

	// Initialisation et synchronisation avec modelValue
	watch(() => props.modelValue, (newValue) => {
		if (!newValue) {
			inputValue.value = ''
			return
		}

		if (Array.isArray(newValue)) {
			inputValue.value = newValue.map(d => d || '').join(' - ')
		}
		else {
			inputValue.value = newValue
		}
		validateField()
	}, { immediate: true })

	// Exposer la méthode de validation
	const validateOnSubmit = () => {
		validateField()
		return !localHasError.value
	}

	defineExpose({
		validateOnSubmit,
	})
</script>

<template>
	<SyTextField
		v-bind="{
			modelValue: inputValue,
			placeholder,
			errorMessages: localErrorMessages,
			warningMessages: localWarningMessages,
			successMessages: localSuccessMessages,
			hasError: localHasError,
			rules,
			hasWarning: localHasWarning,
			hasSuccess: localHasSuccess,
			required,
			label,
			format,
			dateFormatReturn,
		}"
		@update:model-value="handleInput"
		@blur="handleBlur"
	/>
</template>
