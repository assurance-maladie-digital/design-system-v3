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
	}

	const props = withDefaults(defineProps<Props>(), {
		modelValue: undefined,
		placeholder: '',
		required: false,
		range: false,
		rules: () => [],
		warningRules: () => [],
	})

	const emit = defineEmits<{
		(e: 'update:model-value', value: DateValue): void
	}>()

	// État local
	const inputValue = ref('')
	const errorMessages = ref<string[]>([])
	const warningMessages = ref<string[]>([])
	const successMessages = ref<string[]>([])
	const hasError = ref(false)
	const hasWarning = ref(false)
	const hasSuccess = ref(false)

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
		errorMessages.value = []
		warningMessages.value = []
		successMessages.value = []
		hasError.value = false
		hasWarning.value = false
		hasSuccess.value = false

		// Si le champ est vide
		if (!inputValue.value) {
			if (props.required) {
				errorMessages.value = ['Ce champ est requis']
				hasError.value = true
			}
			return
		}

		let hasAnyError = false
		let hasAnyWarning = false
		let hasAnySuccess = false

		const validateValue = (value: string) => {
			// Vérifier d'abord si la date ou la plage de dates est valide
			if (props.range) {
				if (!isValidDateRange(value)) {
					errorMessages.value.push(defaultRules.value[0]?.options?.message || 'Date range is invalid')
					hasAnyError = true
					return
				}
			}
			else {
				if (!isValidDate(value)) {
					errorMessages.value.push(defaultRules.value[0]?.options?.message || 'Date is invalid')
					hasAnyError = true
					return
				}
			}

			// Appliquer les règles de validation
			for (const rule of validationRules.value) {
				const result = rule(value)
				if (result.error) {
					errorMessages.value.push(result.error)
					hasAnyError = true
					break // Arrêter à la première erreur
				}
			}

			// Appliquer les règles d'avertissement seulement s'il n'y a pas d'erreur
			if (!hasAnyError) {
				let hasWarningRule = false
				
				// Vérifier d'abord s'il y a des règles d'avertissement
				for (const rule of warningValidationRules.value) {
					hasWarningRule = true
					const result = rule(value)
					if (result.warning) {
						warningMessages.value.push(result.warning)
						hasAnyWarning = true
					}
				}

				// Ajouter le message de succès seulement si :
				// 1. Il n'y a pas d'avertissement OU
				// 2. Il n'y avait pas de règle d'avertissement à vérifier
				if (!hasAnyWarning || !hasWarningRule) {
					successMessages.value = ['Le champ est valide']
					hasAnySuccess = true
				}
			}
		}

		if (inputValue.value) {
			validateValue(inputValue.value)
		}

		// Mettre à jour les états en respectant la priorité
		hasError.value = hasAnyError
		hasWarning.value = !hasAnyError && hasAnyWarning
		hasSuccess.value = !hasAnyError && !hasAnyWarning && hasAnySuccess
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
					if (!hasError.value) {
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
				if (!hasError.value) {
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
		return !hasError.value
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
			errorMessages,
			warningMessages,
			successMessages,
			hasError,
			rules,
			hasWarning,
			hasSuccess,
			required,
		}"
		@update:model-value="handleInput"
		@blur="handleBlur"
	/>
</template>
