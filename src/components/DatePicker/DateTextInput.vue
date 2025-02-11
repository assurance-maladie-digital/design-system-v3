<script lang="ts" setup>
	import { ref, computed, watch, onMounted } from 'vue'
	import { nextTick } from 'vue'
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
		if (year < 1000 || year > 9999) return null // Accepter une plage d'années plus large

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
	const formatDateInput = (input: string, cursorPosition?: number): { formatted: string, cursorPos: number } => {
		const separator = props.format.includes('/') ? '/' : props.format.includes('-') ? '-' : '.'

		// Déterminer l'ordre des composants (jour, mois, année) en fonction du format
		const formatParts = props.format.split(/[/.-]/)
		const dayIndex = formatParts.findIndex(part => part.toUpperCase().includes('D'))
		const monthIndex = formatParts.findIndex(part => part.toUpperCase().includes('M'))
		const yearIndex = formatParts.findIndex(part => part.toUpperCase().includes('Y'))

		// Créer le masque en fonction du format
		const parts = Array(3).fill('__')
		parts[yearIndex] = '____' // L'année a toujours 4 caractères
		const mask = parts.join(separator)

		let result = mask
		let pos = cursorPosition || 0

		// Nettoyer l'entrée pour ne garder que les chiffres et les séparateurs
		let cleanInput = input

		// Si l'entrée contient déjà des séparateurs, on les garde pour préserver l'ordre
		if (input.includes(separator)) {
			const parts = input.split(separator)
			cleanInput = parts.map(part => part.replace(/\D/g, '')).join(separator)
		}
		else {
			cleanInput = input.replace(/\D/g, '')
		}

		// Si l'entrée contient des séparateurs, on traite chaque partie séparément
		if (cleanInput.includes(separator)) {
			const parts = cleanInput.split(separator)
			const formattedParts = Array(3).fill('__')
			formattedParts[yearIndex] = (parts[yearIndex] || '').padEnd(4, '_')
			formattedParts[monthIndex] = (parts[monthIndex] || '').padEnd(2, '_')
			formattedParts[dayIndex] = (parts[dayIndex] || '').padEnd(2, '_')

			result = formattedParts.join(separator)
		}
		else {
			// Distribution des chiffres selon le format
			const formatOrder = [dayIndex, monthIndex, yearIndex]
			let currentDigit = 0

			for (let partIndex = 0; currentDigit < Math.min(cleanInput.length, 8); partIndex++) {
				const formatPartIndex = formatOrder[partIndex % 3]
				const isYear = formatParts[formatPartIndex].toUpperCase().includes('Y')
				const partLength = isYear ? 4 : 2
				const targetStartPos = formatPartIndex * 3 // Chaque partie a 2 caractères + 1 séparateur

				// Insérer les chiffres pour cette partie
				for (let j = 0; j < partLength && currentDigit < cleanInput.length; j++) {
					const digit = cleanInput[currentDigit]
					const targetPos = targetStartPos + j
					result = result.substring(0, targetPos) + digit + result.substring(targetPos + 1)
					currentDigit++
				}
			}
		}

		// Calculer la nouvelle position du curseur
		if (cursorPosition !== undefined) {
			pos = cursorPosition
			// Si on est sur un séparateur, avancer d'une position
			if (mask[pos] === separator) {
				pos++
			}
		}

		return {
			formatted: result,
			cursorPos: pos,
		}
	}

	// Fonction pour nettoyer une chaîne de date
	const cleanDateString = (input: string): string => {
		// Conserver uniquement les chiffres et les séparateurs valides
		return input.replace(/[^\d/.-]/g, '')
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

	// Gestionnaire de touches pour permettre le copier-coller
	const handleKeydown = (event: KeyboardEvent) => {
		// Autoriser les touches de contrôle (Ctrl+C, Ctrl+V, etc.)
		if (event.ctrlKey || event.metaKey) {
			return
		}
	}

	// Gestionnaire de l'événement paste
	const handlePaste = (event: ClipboardEvent) => {
		event.preventDefault()
		const pastedText = event.clipboardData?.getData('text')

		if (!pastedText) {
			return
		}

		// Nettoyer et formater la valeur collée
		const cleanedText = cleanDateString(pastedText)
		const formattedText = formatDateInput(cleanedText).formatted

		// Mettre à jour la valeur
		inputValue.value = formattedText
	}

	// Référence vers l'élément input
	const inputRef = ref<InstanceType<typeof SyTextField> | null>(null)

	// Flag pour éviter le formatage récursif
	const isFormatting = ref(false)

	// Watch sur inputValue pour gérer le formatage et la validation
	watch(inputValue, async (newValue, oldValue) => {
		if (isFormatting.value || newValue === oldValue) return // Éviter la récursion pendant le formatage

		try {
			isFormatting.value = true

			if (!newValue) {
				emit('update:model-value', null)
				validateRules('')
				return
			}

			// Récupérer la position du curseur avant le formatage
			const input = inputRef.value?.$el.querySelector('input')
			const cursorPos = input?.selectionStart || 0

			// Formater la valeur
			const { formatted, cursorPos: newPos } = formatDateInput(newValue, cursorPos)

			// Mettre à jour la valeur si nécessaire
			if (formatted !== newValue) {
				inputValue.value = formatted
				// Rétablir la position du curseur après le formatage
				await nextTick()
				input?.setSelectionRange(newPos, newPos)
			}

			// Vérifier si la date est complète
			const isDateComplete = !formatted.includes('_')

			if (isDateComplete) {
				// Valider le format si la date est complète
				const validation = validateDateFormat(formatted)
				if (validation.isValid) {
					const date = parseDate(formatted)
					if (date) {
						const formattedDate = props.dateFormatReturn
							? formatDateToString(date, props.dateFormatReturn)
							: formatted
						await nextTick() // Attendre le prochain tick avant d'émettre
						emit('update:model-value', formattedDate)
					}
				}
				validateRules(formatted)
			}
			else {
				// Réinitialiser les messages d'erreur pendant la saisie
				errorMessages.value = []
				warningMessages.value = []
				successMessages.value = []
			}
		}
		finally {
			await nextTick() // Attendre le prochain tick avant de réinitialiser le flag
			isFormatting.value = false
		}
	})

	// Watch pour mettre à jour l'input quand modelValue change
	watch(() => props.modelValue, (newValue) => {
		if (isFormatting.value) return // Ne pas mettre à jour si on est en train de formater

		if (!newValue) {
			inputValue.value = ''
			return
		}

		// Formater la valeur selon le format d'affichage
		const date = parseDate(newValue, props.dateFormatReturn)
		if (date) {
			const formatted = formatDateToString(date, props.format)
			inputValue.value = formatted
		}
		else {
			inputValue.value = newValue
		}
	})

	// Gestionnaire de focus
	const handleFocus = () => {
		isFocused.value = true
		emit('focus')
	}

	// Gestionnaire de blur
	const handleBlur = () => {
		isFocused.value = false
		hasInteracted.value = true
		emit('blur')

		// Valider le format complet lors du blur
		if (inputValue.value) {
			const validation = validateDateFormat(inputValue.value)
			if (validation.isValid) {
				const date = parseDate(inputValue.value)
				if (date) {
					const formattedDate = props.dateFormatReturn
						? formatDateToString(date, props.dateFormatReturn)
						: inputValue.value
					emit('update:model-value', formattedDate)
				}
			}
		}
		// Toujours valider les règles, même si le champ est vide
		validateRules(inputValue.value || '')
	}

	// Fonction de validation lors de la soumission
	const isValidating = ref(false)

	const validateOnSubmit = (): boolean => {
		isValidating.value = true

		// Vérifier si le champ est requis et vide
		if (props.required && !inputValue.value) {
			errorMessages.value = ['Ce champ est requis']
			return false
		}

		// Si le champ n'est pas requis et est vide, c'est valide
		if (!inputValue.value) {
			return true
		}

		// Valider le format de la date
		const { isValid, message } = validateDateFormat(inputValue.value)
		if (!isValid) {
			errorMessages.value = [message]
			return false
		}

		// Valider les règles personnalisées
		validateRules(inputValue.value)

		// Retourner true seulement si pas d'erreurs
		return errorMessages.value.length === 0
	}

	// Exposer les méthodes et propriétés nécessaires
	defineExpose({
		validateOnSubmit,
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

</script>

<template>
	<SyTextField
		ref="inputRef"
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
		:prepend-icon="props.displayPrependIcon && !props.displayAppendIcon ? 'calendar' : undefined"
		:append-icon="props.displayAppendIcon ? 'calendar' : undefined"
		:append-inner-icon="getIcon"
		:variant-style="isOutlined ? 'outlined' : 'filled'"
		:class="{
			'error-field': isOnError,
			'warning-field': isOnWarning,
			'success-field': isOnSuccess
		}"
		@keydown="handleKeydown"
		@focus="handleFocus"
		@blur="handleBlur"
		@paste="handlePaste"
	/>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.warning-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

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

.error-field {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: tokens.$colors-text-error !important;
	}

	.v-field--active & {
		color: tokens.$colors-border-error !important;
	}
}

.success-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

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
