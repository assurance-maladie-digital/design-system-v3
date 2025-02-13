<script lang="ts" setup>
	import { ref, computed, watch, onMounted } from 'vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import type { RuleOptions } from '@/composables/rules/useFieldValidation'

	type DateValue = string | null

	const props = withDefaults(defineProps<{
		modelValue?: DateValue
		placeholder?: string
		format?: string
		dateFormatReturn?: string
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
		displayPrependIcon?: boolean
	}>(), {
		modelValue: null,
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		dateFormatReturn: undefined,
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
		displayPrependIcon: true,
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
		const formatParts = format.split(/[-/.]/)

		if (parts.length !== formatParts.length) {
			return null
		}

		let day = 1, month = 0, year = 1970

		// Mapper les parties selon le format
		for (let i = 0; i < formatParts.length; i++) {
			const value = parseInt(parts[i], 10)
			if (isNaN(value)) {
				return null
			}

			switch (formatParts[i].toUpperCase()) {
			case 'DD':
				day = value
				break
			case 'MM':
				month = value - 1 // JavaScript months are 0-based
				break
			case 'YY':
				year = value + 2000 // Assuming 20xx for YY format
				break
			case 'YYYY':
				year = value
				break
			}
		}

		// Valider les limites
		if (month < 0 || month > 11) return null
		if (day < 1 || day > 31) return null
		if (year < 1900 || year > 2100) return null

		const date = new Date(year, month, day)

		// Vérifier si la date est valide (ex: 31/04 n'existe pas)
		if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
			return null
		}

		return date
	}

	// Fonction pour formater une date en chaîne selon le format spécifié
	const formatDateToString = (date: Date, format: string): string => {
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		const shortYear = (year % 100).toString().padStart(2, '0')

		const separator = format.includes('/') ? '/' : format.includes('-') ? '-' : '.'
		const parts: string[] = []

		format.split(/[-/.]/).forEach((part) => {
			switch (part.toUpperCase()) {
			case 'DD':
				parts.push(day)
				break
			case 'MM':
				parts.push(month)
				break
			case 'YY':
				parts.push(shortYear)
				break
			case 'YYYY':
				parts.push(year.toString())
				break
			}
		})

		return parts.join(separator)
	}

	// Fonction pour formater la date pendant la saisie
	const formatDateInput = (input: string): string => {
		// On garde les 0 en début de chaîne
		if (input === '0') return '0'
		if (input === '00') return '00'

		const numbers = input.replace(/\D/g, '')
		const separator = props.format.includes('/') ? '/' : props.format.includes('-') ? '-' : '.'
		const parts = props.format.split(/[-/.]/)

		if (numbers.length <= parts[0].length) return numbers
		if (numbers.length <= parts[0].length + parts[1].length) {
			return `${numbers.slice(0, parts[0].length)}${separator}${numbers.slice(parts[0].length)}`
		}
		return `${numbers.slice(0, parts[0].length)}${separator}${numbers.slice(parts[0].length, parts[0].length + parts[1].length)}${separator}${numbers.slice(parts[0].length + parts[1].length)}`
	}

	// Fonction pour valider le format de la date
	const validateDateFormat = (dateStr: string): { isValid: boolean, message: string } => {
		if (!dateStr) {
			return { isValid: !props.required || !hasInteracted.value, message: (props.required && hasInteracted.value) ? 'La date est requise' : '' }
		}

		// Vérifier que la chaîne ne contient que des chiffres et des séparateurs
		if (!/^[\d/.-]*$/.test(dateStr)) {
			return { isValid: false, message: 'Format de date invalide' }
		}

		// Essayer de parser avec le format d'entrée
		let date = parseDate(dateStr, props.format)

		// Si ça échoue et qu'on a un format de retour, essayer avec celui-ci
		if (!date && props.dateFormatReturn) {
			date = parseDate(dateStr, props.dateFormatReturn)
		}

		if (!date) {
			return { isValid: false, message: 'Format de date invalide' }
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
			let allValid = true
			const successMsgs: string[] = []

			rules.forEach((rule) => {
				const result = rule(value)
				if (result?.error) {
					errorMessages.value.push(result.error)
					allValid = false
				}
				else if (!result?.warning && !result?.error) {
					successMsgs.push(result?.success || 'Date valide')
				}
			})

			// N'ajouter les messages de succès que si toutes les règles sont validées
			if (allValid && successMsgs.length > 0) {
				successMessages.value.push(...successMsgs)
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const validateWarningRules = (rules: any[]) => {
			let allValid = true
			const successMsgs: string[] = []

			rules.forEach((rule) => {
				const result = rule(value)
				if (result?.warning) {
					warningMessages.value.push(result.warning)
					allValid = false
				}
				else if (result?.success) {
					successMsgs.push(result.success)
				}
			})

			// N'ajouter les messages de succès que si toutes les règles sont validées
			if (allValid && successMsgs.length > 0) {
				successMessages.value.push(...successMsgs)
			}
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

					if (typeof validate !== 'function') {
						return true
					}

					const isValid = validate(value)

					if (isWarning) {
						// Pour les règles de warning, on inverse la logique :
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

	// Watch sur inputValue pour formater la valeur
	watch(inputValue, (newValue) => {
		if (newValue) {
			const formatted = formatDateInput(newValue)
			if (formatted !== newValue) {
				inputValue.value = formatted
			}
		}
	})

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
		if (!newValue) {
			inputValue.value = ''
			validateRules('')
			return
		}

		// Si la valeur est dans le format de retour, la convertir au format d'affichage
		if (props.dateFormatReturn && props.dateFormatReturn !== props.format) {
			const date = parseDate(newValue, props.dateFormatReturn)
			if (date) {
				const formatted = formatDateToString(date, props.format)
				inputValue.value = formatted
				validateRules(formatted)
				return
			}
		}

		inputValue.value = newValue
		validateRules(newValue)
	}, { immediate: true })

	onMounted(() => {
		if (!props.modelValue) {
			return
		}

		// Parser la date avec le format d'entrée
		const date = parseDate(props.modelValue, props.format)
		if (date) {
			// Si un format de retour est spécifié, l'utiliser pour la valeur émise
			if (props.dateFormatReturn && props.dateFormatReturn !== props.format) {
				const formattedForReturn = formatDateToString(date, props.dateFormatReturn)
				emit('update:model-value', formattedForReturn)
			}

			// Toujours afficher dans le format d'entrée
			inputValue.value = formatDateToString(date, props.format)
			validateRules(inputValue.value)
		}
		else {
			inputValue.value = props.modelValue
			validateRules(props.modelValue)
		}
	})

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
		:error-messages="errorMessages"
		:messages="warningMessages.length > 0 ? warningMessages :successMessages"
		:is-on-error="isOnError"
		:is-disabled="isDisabled"
		:is-read-only="isReadOnly"
		:display-icon="displayIcon"
		:display-append-icon="displayAppendIcon"
		:no-icon="noIcon"
		:prepend-icon="props.displayPrependIcon ? 'calendar' : undefined"
		:append-icon="props.displayAppendIcon ? 'calendar' : undefined"
		:append-inner-icon="getIcon"
		:variant-style="isOutlined ? 'outlined' : 'filled'"
		:class="{
			'warning-field': isOnWarning,
			'success-field': isOnSuccess
		}"
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
