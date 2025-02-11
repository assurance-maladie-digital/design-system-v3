<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import type { RuleOptions } from '@/composables/rules/useFieldValidation'

	type DateValue = string | null

	const props = withDefaults(defineProps<{
		modelValue?: DateValue
		placeholder?: string
		format?: string
		minDate?: string
		maxDate?: string
		label?: string
		required?: boolean
		isDisabled?: boolean
		isOutlined?: boolean
		displayIcon?: boolean
		displayAppendIcon?: boolean
		noIcon?: boolean
		customRules?: { type: string, options: RuleOptions }[]
		customWarningRules?: { type: string, options: RuleOptions }[]
		errorMessages?: {
			required?: string
			format?: string
			min?: string
			max?: string
			invalid?: string
		}
		successMessages?: string[]
		warningMessages?: string[]
	}>(), {
		modelValue: null,
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		minDate: undefined,
		maxDate: undefined,
		label: undefined,
		required: false,
		isDisabled: false,
		isOutlined: true,
		displayIcon: true,
		displayAppendIcon: false,
		noIcon: false,
		customRules: () => [],
		customWarningRules: () => [],
		errorMessages: () => ({
			required: 'La date est requise',
			format: 'Format invalide (JJ/MM/AAAA)',
			min: 'La date doit être après le',
			max: 'La date doit être avant le',
			invalid: 'Date invalide',
		}),
		successMessages: () => [],
		warningMessages: () => [],
	})

	const emit = defineEmits<{
		(e: 'update:model-value', value: DateValue): void
		(e: 'focus'): void
		(e: 'blur'): void
	}>()

	const inputValue = ref<string>('')
	const isFocused = ref(false)
	const currentErrorMessage = ref<string>('')
	const hasInteracted = ref(false)

	// Fonction pour convertir une date au format DD/MM/YYYY en objet Date
	const parseDate = (dateStr: string): Date | null => {
		const parts = dateStr.split('/')
		if (parts.length !== 3) return null

		// Utiliser parseInt pour ignorer les zéros en début
		const day = parseInt(parts[0], 10)
		const month = parseInt(parts[1], 10) - 1 // Les mois commencent à 0 en JS
		const year = parseInt(parts[2], 10)

		if (isNaN(day) || isNaN(month) || isNaN(year)) return null

		const date = new Date(year, month, day)
		// Vérifier que la date est valide (pas de débordement)
		if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
			return null
		}
		return date
	}

	// Fonction pour formater la date pendant la saisie
	const formatDateInput = (input: string): string => {
		// On garde les 0 en début de chaîne
		if (input === '0') return '0'
		if (input === '00') return '00'

		const numbers = input.replace(/\D/g, '')
		const separator = props.format.includes('/') ? '/' : props.format.includes('-') ? '-' : '.'

		if (numbers.length <= 2) return numbers
		if (numbers.length <= 4) return `${numbers.slice(0, 2)}${separator}${numbers.slice(2)}`
		return `${numbers.slice(0, 2)}${separator}${numbers.slice(2, 4)}${separator}${numbers.slice(4)}`
	}

	// Fonction pour valider le format de la date
	const validateDateFormat = (dateStr: string): { isValid: boolean, message: string } => {
		if (!dateStr) {
			return {
				isValid: !props.required || !hasInteracted.value,
				message: (props.required && hasInteracted.value) ? props.errorMessages.required : '',
			}
		}

		const parts = dateStr.split('/')
		if (parts.length !== 3) {
			return {
				isValid: false,
				message: props.errorMessages.format,
			}
		}

		// Vérifier le format de chaque partie (2 chiffres pour jour/mois, 4 pour année)
		if (!/^\d{1,2}$/.test(parts[0]) || !/^\d{1,2}$/.test(parts[1]) || !/^\d{4}$/.test(parts[2])) {
			return {
				isValid: false,
				message: props.errorMessages.format,
			}
		}

		const day = parseInt(parts[0], 10)
		const month = parseInt(parts[1], 10)
		const year = parseInt(parts[2], 10)

		if (day < 1 || day > 31) {
			return {
				isValid: false,
				message: 'Le jour doit être entre 1 et 31',
			}
		}
		if (month < 1 || month > 12) {
			return {
				isValid: false,
				message: 'Le mois doit être entre 1 et 12',
			}
		}
		if (year < 1000 || year > 9999) {
			return {
				isValid: false,
				message: 'L\'année doit être sur 4 chiffres',
			}
		}

		const date = parseDate(dateStr)
		if (!date) {
			return {
				isValid: false,
				message: props.errorMessages.invalid,
			}
		}

		// Vérification des dates min/max
		if (props.minDate) {
			const minDate = parseDate(props.minDate)
			if (minDate && date < minDate) {
				return {
					isValid: false,
					message: `${props.errorMessages.min} ${props.minDate}`,
				}
			}
		}

		if (props.maxDate) {
			const maxDate = parseDate(props.maxDate)
			if (maxDate && date > maxDate) {
				return {
					isValid: false,
					message: `${props.errorMessages.max} ${props.maxDate}`,
				}
			}
		}

		return { isValid: true, message: '' }
	}

	// Règles de validation
	const dateRules = computed(() => [
		...(props.required && hasInteracted.value
			? [{
				type: 'required',
				options: {
					message: props.errorMessages.required,
					successMessage: '',
					fieldIdentifier: 'date',
				},
			}]
			: []),
		{
			type: 'custom',
			options: {
				validate: (value: string) => {
					if (!value) return !props.required || !hasInteracted.value
					const validation = validateDateFormat(value)
					currentErrorMessage.value = validation.message
					return validation.isValid
				},
				message: computed(() => currentErrorMessage.value),
				successMessage: '',
				fieldIdentifier: 'date',
			},
		},
		...props.customRules,
	])

	// Gestionnaire de changement de valeur
	const handleInput = (event: Event) => {
		hasInteracted.value = true
		const target = event.target as HTMLInputElement
		const formatted = formatDateInput(target.value)
		inputValue.value = formatted

		const validation = validateDateFormat(formatted)
		currentErrorMessage.value = validation.message
		if (validation.isValid) {
			emit('update:model-value', formatted)
		}
		else {
			emit('update:model-value', null)
		}
	}

	// Gestionnaire de focus
	const handleFocus = () => {
		isFocused.value = true
		emit('focus')
	}

	// Gestionnaire de blur
	const handleBlur = () => {
		hasInteracted.value = true
		isFocused.value = false
		const validation = validateDateFormat(inputValue.value)
		currentErrorMessage.value = validation.message
		if (!validation.isValid) {
			emit('update:model-value', null)
		}
		emit('blur')
	}

	// Watch pour mettre à jour l'input quand modelValue change
	watch(() => props.modelValue, (newValue) => {
		if (newValue) {
			const validation = validateDateFormat(newValue)
			if (validation.isValid) {
				inputValue.value = newValue
				currentErrorMessage.value = ''
			}
			else {
				inputValue.value = ''
				// Ne pas afficher de message d'erreur au chargement
				currentErrorMessage.value = hasInteracted.value ? validation.message : ''
			}
		}
		else {
			inputValue.value = ''
			// Ne pas afficher de message d'erreur au chargement
			currentErrorMessage.value = hasInteracted.value && props.required ? props.errorMessages.required : ''
		}
	}, { immediate: true })

	// Exposer les méthodes et propriétés nécessaires
	defineExpose({
		focus: () => {
			const input = document.querySelector('input')
			if (input) {
				input.focus()
			}
		},
		blur: () => {
			const input = document.querySelector('input')
			if (input) {
				input.blur()
			}
		},
	})
</script>

<template>
	<SyTextField
		v-model="inputValue"
		:placeholder="placeholder"
		:label="label"
		:disabled="isDisabled"
		:outlined="isOutlined"
		:rules="dateRules"
		:error-messages="currentErrorMessage ? [currentErrorMessage] : []"
		:success-messages="successMessages"
		:warning-messages="warningMessages"
		:display-icon="displayIcon"
		:display-append-icon="displayAppendIcon"
		:no-icon="noIcon"
		@input="handleInput"
		@focus="handleFocus"
		@blur="handleBlur"
	/>
</template>
