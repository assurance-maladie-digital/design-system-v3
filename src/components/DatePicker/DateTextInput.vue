<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import type { RuleOptions } from '@/composables/rules/useFieldValidation'

	type DateValue = string | null

	const props = withDefaults(defineProps<{
		modelValue?: DateValue
		placeholder?: string
		format?: string
		dateFormatReturn?: string
		minDate?: string
		maxDate?: string
		label?: string
		required?: boolean
		isDisabled?: boolean
		isReadOnly?: boolean
		isOutlined?: boolean
		displayIcon?: boolean
		displayAppendIcon?: boolean
		noIcon?: boolean
		customRules?: { type: string, options: RuleOptions }[]
		customWarningRules?: { type: string, options: RuleOptions }[]
	}>(), {
		modelValue: null,
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		dateFormatReturn: undefined,
		minDate: undefined,
		maxDate: undefined,
		label: undefined,
		required: false,
		isDisabled: false,
		isReadOnly: false,
		isOutlined: true,
		displayIcon: true,
		displayAppendIcon: false,
		noIcon: false,
		customRules: () => [],
		customWarningRules: () => [],
	})

	const emit = defineEmits<{
		(e: 'update:model-value', value: DateValue): void
		(e: 'focus'): void
		(e: 'blur'): void
	}>()

	const inputValue = ref<string>('')
	const isFocused = ref(false)
	const hasInteracted = ref(false)
	const errorMessages = ref<string[]>([])
	const warningMessages = ref<string[]>([])
	const successMessages = ref<string[]>([])

	// Fonction pour parser une date selon le format spécifié
	const parseDate = (dateStr: string, format: string = props.format): Date | null => {
		const parts = dateStr.split(/[-/.]/)
		if (parts.length !== 3) return null

		let day: number, month: number, year: number

		// Extraire les positions du jour, mois et année selon le format
		const dayPos = format.indexOf('DD')
		const monthPos = format.indexOf('MM')
		const yearPos = format.indexOf('YYYY')

		if (dayPos === -1 || monthPos === -1 || yearPos === -1) return null

		// Déterminer l'ordre des composants
		const positions = [
			{ pos: dayPos, type: 'day' },
			{ pos: monthPos, type: 'month' },
			{ pos: yearPos, type: 'year' },
		].sort((a, b) => a.pos - b.pos)

		// Assigner les valeurs selon l'ordre du format
		for (let i = 0; i < 3; i++) {
			const value = parseInt(parts[i], 10)
			switch (positions[i].type) {
			case 'day':
				day = value
				break
			case 'month':
				month = value - 1 // Les mois commencent à 0 en JS
				break
			case 'year':
				year = value
				break
			}
		}

		if (isNaN(day) || isNaN(month) || isNaN(year)) return null

		const date = new Date(year, month, day)
		// Vérifier que la date est valide
		if (
			date.getFullYear() !== year
			|| date.getMonth() !== month
			|| date.getDate() !== day
		) {
			return null
		}

		return date
	}

	// Fonction pour formater une date selon un format spécifique
	const formatDateToString = (date: Date, format: string): string => {
		const year = date.getFullYear().toString()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')

		const separator = format.includes('/') ? '/' : format.includes('-') ? '-' : '.'
		const parts = format.split(/[-/.]/)
		const result = []

		for (const part of parts) {
			if (part.includes('DD')) result.push(day)
			else if (part.includes('MM')) result.push(month)
			else if (part.includes('YYYY')) result.push(year)
		}

		return result.join(separator)
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
				message: (props.required && hasInteracted.value) ? 'La date est requise' : '',
			}
		}

		// Vérifier que la chaîne ne contient que des chiffres et des séparateurs
		if (!/^[\d/.-]*$/.test(dateStr)) {
			return {
				isValid: false,
				message: 'Format invalide (JJ/MM/AAAA)',
			}
		}

		// Vérifier le format complet avec regex
		const formatRegex = /^(\d{2})[/.-](\d{2})[/.-](\d{4})$/
		if (!formatRegex.test(dateStr)) {
			return {
				isValid: false,
				message: 'Format invalide (JJ/MM/AAAA)',
			}
		}

		// Vérifier la validité de la date
		const [day, month, year] = dateStr.split(/[/.-]/).map(Number)
		const numMonth = parseInt(month, 10)
		const daysInMonth = new Date(year, numMonth, 0).getDate()

		if (numMonth < 1 || numMonth > 12) {
			return {
				isValid: false,
				message: 'Format invalide (JJ/MM/AAAA)',
			}
		}

		const numDay = parseInt(day, 10)
		if (numDay < 1 || numDay > daysInMonth) {
			return {
				isValid: false,
				message: 'Date invalide',
			}
		}

		// Vérifier la date minimale
		if (props.minDate) {
			const currentDate = new Date(year, numMonth - 1, numDay)
			const minDate = parseDate(props.minDate)
			if (minDate && currentDate && currentDate < minDate) {
				return {
					isValid: false,
					message: `La date doit être après le ${props.minDate}`,
				}
			}
		}

		// Vérifier la date maximale
		if (props.maxDate) {
			const currentDate = new Date(year, numMonth - 1, numDay)
			const maxDate = parseDate(props.maxDate)
			if (maxDate && currentDate && currentDate > maxDate) {
				return {
					isValid: false,
					message: `La date doit être avant le ${props.maxDate}`,
				}
			}
		}

		return { isValid: true, message: '' }
	}

	// Fonction pour valider les règles et mettre à jour les messages
	const validateRules = (value: string) => {
		errorMessages.value = []
		warningMessages.value = []
		successMessages.value = []

		if (!value) {
			if (props.required && hasInteracted.value) {
				errorMessages.value.push('La date est requise')
			}
			return
		}

		// Validation du format
		const validation = validateDateFormat(value)
		if (!validation.isValid) {
			errorMessages.value.push(validation.message)
			return
		}

		// Validation des règles
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const validateErrorRules = (rules: any[]) => {
			rules.forEach((rule) => {
				const result = rule(value)
				if (result?.error) {
					errorMessages.value.push(result.error)
				}
				else if (!result?.warning && !result?.error) {
					successMessages.value.push(result?.success || 'Date valide')
				}
			})
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const validateWarningRules = (rules: any[]) => {
			rules.forEach((rule) => {
				const result = rule(value)
				if (result?.warning) {
					warningMessages.value.push(result.warning)
				}
				else if (result?.success) {
					successMessages.value.push(result.success)
				}
			})
		}

		// Appliquer les règles
		validateErrorRules(validationRules)
		validateWarningRules(warningValidationRules)

		// Supprimer les doublons
		errorMessages.value = [...new Set(errorMessages.value)]
		warningMessages.value = [...new Set(warningMessages.value)]
		successMessages.value = [...new Set(successMessages.value)]
	}

	const { generateRules } = useFieldValidation()

	// Générer les règles de validation
	const generateCustomRules = (rules: { type: string, options: RuleOptions }[]) => {
		return rules.map((rule) => {
			return (value: string) => {
				if (rule.type === 'custom') {
					const { validate, message, warningMessage, successMessage, isWarning } = rule.options
					const isValid = validate(value)

					if (isWarning) {
						// Pour les règles de warning, on inverse la logique :
						// - Si la validation échoue (date en 2025) -> warning
						// - Si la validation réussit (date hors 2025) -> success
						return !isValid
							? { warning: warningMessage || message }
							: { success: successMessage }
					}

					// Pour les règles normales
					return !isValid
						? { error: message }
						: { success: successMessage }
				}
				return null
			}
		})
	}

	const validationRules = [
		...generateCustomRules(props.customRules?.filter(r => r.type === 'custom' && !r.options.isWarning) || []),
		...generateRules(props.customRules?.filter(r => r.type !== 'custom') || []),
	]
	const warningValidationRules = [
		...generateCustomRules(props.customWarningRules || []),
		...generateCustomRules(props.customRules?.filter(r => r.type === 'custom' && r.options.isWarning) || []),
	]

	// Déterminer si le champ est en erreur
	const isOnError = computed(() => errorMessages.value.length > 0)
	const isOnWarning = computed(() => warningMessages.value.length > 0)
	const isOnSuccess = computed(() => successMessages.value.length > 0)

	// Déterminer l'icône à afficher
	const getIcon = computed(() => {
		if (errorMessages.value.length > 0) {
			return 'error'
		}
		if (warningMessages.value.length > 0) {
			return 'warning'
		}
		if (successMessages.value.length > 0 && !warningMessages.value.length) {
			return 'success'
		}
		return undefined
	})

	// Gestionnaire de touches pour bloquer les caractères non numériques
	const handleKeydown = (event: KeyboardEvent) => {
		// Autoriser les touches de contrôle (backspace, delete, flèches, etc.)
		if (event.key.length > 1) {
			return
		}

		// Bloquer si on a déjà 10 caractères et qu'on n'est pas en train de sélectionner du texte
		const input = event.target as HTMLInputElement
		if (input.value.length === 10) {
			event.preventDefault()
			return
		}

		// N'autoriser que les chiffres
		if (!/^\d$/.test(event.key)) {
			event.preventDefault()
		}
	}

	// Gestionnaire de changement de valeur
	const handleInput = (event: Event) => {
		hasInteracted.value = true
		const inputElement = event.target as HTMLInputElement
		let value = inputElement.value

		// Formatage de la date pendant la saisie
		const formatted = formatDateInput(value)
		inputValue.value = formatted

		// Validation et mise à jour du modèle
		const validation = validateDateFormat(formatted)
		if (validation.isValid) {
			const date = parseDate(formatted)
			if (date) {
				const formattedDate = props.dateFormatReturn
					? formatDateToString(date, props.dateFormatReturn)
					: formatted
				emit('update:model-value', formattedDate)
				validateRules(formattedDate)
			}
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
		const formatted = inputValue.value

		// Validation et mise à jour du modèle
		const validation = validateDateFormat(formatted)
		if (validation.isValid) {
			const date = parseDate(formatted)
			if (date) {
				const formattedDate = props.dateFormatReturn
					? formatDateToString(date, props.dateFormatReturn)
					: formatted
				emit('update:model-value', formattedDate)
				validateRules(formattedDate)
			}
		}
		else {
			emit('update:model-value', null)
			validateRules(formatted)
		}
		emit('blur')
	}

	// Watch pour mettre à jour l'input quand modelValue change
	watch(() => props.modelValue, (newValue) => {
		if (newValue) {
			// Si on a un format de retour différent, convertir la valeur au format d'affichage
			if (props.dateFormatReturn && props.dateFormatReturn !== props.format) {
				const date = parseDate(newValue, props.dateFormatReturn)
				if (date) {
					inputValue.value = formatDateToString(date, props.format)
					return
				}
			}

			const validation = validateDateFormat(newValue)
			if (validation.isValid) {
				inputValue.value = newValue
			}
			else {
				inputValue.value = ''
			}
		}
		else {
			inputValue.value = ''
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
	{{ successMessages }}
	<SyTextField
		v-model="inputValue"
		:placeholder="placeholder"
		:label="label"
		:error-messages="errorMessages"
		:messages="warningMessages.length > 0 ? warningMessages :successMessages"
		:is-on-error="isOnError"
		:is-disabled="isDisabled"
		:is-read-only="isReadOnly"
		:display-icon="displayIcon"
		:display-append-icon="displayAppendIcon"
		:no-icon="noIcon"
		:append-inner-icon="getIcon"
		:variant-style="isOutlined ? 'outlined' : 'filled'"
		:class="{
			'warning-field': isOnWarning,
			'success-field': isOnSuccess
		}"
		@input="handleInput"
		@keydown="handleKeydown"
		@focus="handleFocus"
		@blur="handleBlur"
	/>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.warning-field {
	:deep(.v-field) {
		color: tokens.$colors-border-warning !important;

		.v-field__outline {
			color: tokens.$colors-border-warning !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: tokens.$colors-border-warning !important;
		}
	}
}

.success-field {
	:deep(.v-field) {
		color: tokens.$colors-border-success !important;

		.v-field__outline {
			color: tokens.$colors-border-success !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: tokens.$colors-border-success !important;
		}
	}
}
</style>
