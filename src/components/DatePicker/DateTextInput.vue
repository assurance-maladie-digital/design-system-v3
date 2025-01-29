<script lang="ts" setup>
	import { computed, ref, watch, onMounted } from 'vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import type { RuleOptions } from '@/composables/rules/useFieldValidation'

	// Type pour les valeurs de date
	type DateValue = string | [string, string]

	const props = withDefaults(defineProps<{
		modelValue?: DateValue
		displayFormat?: string
		returnFormat?: string
		range?: boolean
		placeholder?: string
		rules?: { type: string, options: RuleOptions }[]
		warningRules?: { type: string, options: RuleOptions }[]
		required?: boolean
	}>(), {
		modelValue: undefined,
		displayFormat: 'DD/MM/YYYY',
		returnFormat: '',
		range: false,
		placeholder: '',
		rules: () => [],
		warningRules: () => [],
		required: false,
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', value: DateValue): void
	}>()

	const inputValue = ref('')

	const { generateRules } = useFieldValidation()

	// Règles de validation
	const validationRules = computed(() => generateRules(props.rules || []))
	const warningValidationRules = computed(() => generateRules(props.warningRules || []))

	// États de validation
	const hasError = ref(false)
	const hasWarning = ref(false)
	const hasSuccess = ref(false)
	const errorMessages = ref<string[]>([])
	const warningMessages = ref<string[]>([])
	const successMessages = ref<string[]>([])

	// Valider le champ
	const validateField = () => {
		// Réinitialiser les états
		errorMessages.value = []
		warningMessages.value = []
		successMessages.value = []

		if (props.required && !inputValue.value) {
			errorMessages.value.push('La date est requise.')
			hasError.value = true
			return
		}

		if (inputValue.value) {
			if (props.range) {
				// Pour une plage, valider chaque date séparément
				const [start, end] = inputValue.value.split('-').map(d => d.trim())
				if (start && isValidDate(start)) {
					// Validation des erreurs et succès pour la date de début
					addMessages(start, validationRules.value, 'error')
					addMessages(start, validationRules.value, 'success')
					// Validation des warnings pour la date de début
					addMessages(start, warningValidationRules.value, 'warning')
				}

				if (end && isValidDate(end)) {
					// Validation des erreurs et succès pour la date de fin
					addMessages(end, validationRules.value, 'error')
					addMessages(end, validationRules.value, 'success')
					// Validation des warnings pour la date de fin
					addMessages(end, warningValidationRules.value, 'warning')

					// Valider que la date de fin est après la date de début
					if (start && isValidDate(start)) {
						const startDate = parseDate(start, props.displayFormat)
						const endDate = parseDate(end, props.displayFormat)
						if (startDate && endDate && endDate < startDate) {
							errorMessages.value.push('La date de fin doit être après la date de début')
						}
					}
				}
			}
			else {
				// Validation pour une date simple
				addMessages(inputValue.value, validationRules.value, 'error')
				addMessages(inputValue.value, validationRules.value, 'success')
				addMessages(inputValue.value, warningValidationRules.value, 'warning')
			}
		}

		// Mettre à jour les états
		hasError.value = errorMessages.value.length > 0
		hasWarning.value = warningMessages.value.length > 0
		hasSuccess.value = successMessages.value.length > 0 && !hasError.value && !hasWarning.value
	}

	// Fonction pour ajouter les messages
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const addMessages = (value: string, rules: any[], messageType: 'error' | 'warning' | 'success') => {
		if (!value) return

		// Convertir la date au format YYYY-MM-DD pour la validation
		const validationValue = toValidationFormat(value)
		if (!validationValue) return

		rules.forEach((rule) => {
			const result = rule(validationValue)
			if (result) {
				const targetMessages = messageType === 'error'
					? errorMessages
					: messageType === 'warning'
						? warningMessages
						: successMessages
				if (result[messageType]) {
					targetMessages.value.push(result[messageType])
					targetMessages.value = [...new Set(targetMessages.value)]
				}
			}
		})
	}

	// Convert a date string to YYYY-MM-DD format for validation
	const toValidationFormat = (dateStr: string): string => {
		if (!dateStr) return ''
		const date = parseDate(dateStr, 'DD/MM/YYYY')
		if (!date) return dateStr

		// Formatter en YYYY-MM-DD
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
	}

	// Fonction pour parser les dates selon le format spécifié
	const parseDate = (dateStr: string, format: string): Date | null => {
		const formatParts = format.split(/[^A-Z]/)
		const dateParts = dateStr.split(/[^0-9]/)

		if (dateParts.length !== formatParts.length) return null

		let day = 1, month = 0, year = 2000

		for (let i = 0; i < formatParts.length; i++) {
			const value = parseInt(dateParts[i])
			if (isNaN(value)) return null

			switch (formatParts[i]) {
			case 'DD':
				day = value
				break
			case 'MM':
				month = value - 1 // JavaScript months are 0-based
				break
			case 'YYYY':
			case 'YY':
				year = value
				if (formatParts[i] === 'YY') {
					const currentYear = new Date().getFullYear()
					const currentCentury = Math.floor(currentYear / 100) * 100
					year = currentCentury + value
				}
				break
			}
		}

		const date = new Date(year, month, day)
		return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null
	}

	// Convert between different date formats
	const convertDateFormat = (dateStr: string, fromFormat: string, toFormat: string): string => {
		if (!dateStr) return ''

		const date = parseDate(dateStr, fromFormat)
		if (!date) return dateStr

		// Format the date according to the target format
		let result = toFormat
		result = result.replace('YYYY', String(date.getFullYear()))
		result = result.replace('YY', String(date.getFullYear()).slice(-2))
		result = result.replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
		result = result.replace('DD', String(date.getDate()).padStart(2, '0'))
		return result
	}

	// Format a date input string (add slashes)
	const formatDateInput = (value: string): string => {
		const numbers = value.replace(/\D/g, '')
		const chars = numbers.split('')

		if (chars.length <= 2) return numbers
		if (chars.length <= 4) return `${chars.slice(0, 2).join('')}/${chars.slice(2).join('')}`

		// Permettre les années à 4 chiffres
		const yearPart = chars.slice(4).join('')
		return `${chars.slice(0, 2).join('')}/${chars.slice(2, 4).join('')}/${yearPart}`
	}

	// Initialisation au montage
	onMounted(() => {
		if (props.modelValue) {
			if (Array.isArray(props.modelValue)) {
				// Si on reçoit un tableau de dates, on les formate pour l'affichage
				const [start, end] = props.modelValue
				const formattedStart = convertDateFormat(start, props.returnFormat || 'YYYY-MM-DD', props.displayFormat)
				const formattedEnd = convertDateFormat(end, props.returnFormat || 'YYYY-MM-DD', props.displayFormat)
				inputValue.value = `${formattedStart} - ${formattedEnd}`
			}
			else if (typeof props.modelValue === 'string') {
				// Si on reçoit une chaîne, on la convertit dans le format d'affichage
				inputValue.value = convertDateFormat(props.modelValue, props.returnFormat || 'YYYY-MM-DD', props.displayFormat)
			}
			validateField()
		}
	})

	// Mise à jour quand la valeur change
	watch(() => props.modelValue, (newValue) => {
		if (newValue) {
			if (Array.isArray(newValue)) {
				// Si on reçoit un tableau de dates, on les formate pour l'affichage
				const [start, end] = newValue
				const formattedStart = convertDateFormat(start, props.returnFormat || 'YYYY-MM-DD', props.displayFormat)
				const formattedEnd = convertDateFormat(end, props.returnFormat || 'YYYY-MM-DD', props.displayFormat)
				inputValue.value = `${formattedStart} - ${formattedEnd}`
			}
			else if (typeof newValue === 'string') {
				// Si on reçoit une chaîne, on la convertit dans le format d'affichage
				inputValue.value = convertDateFormat(newValue, props.returnFormat || 'YYYY-MM-DD', props.displayFormat)
			}
			validateField()
		}
		else {
			inputValue.value = ''
		}
	})

	// Émission de la valeur
	const emitValue = (value: string) => {
		if (!value) {
			emit('update:modelValue', '')
			return
		}

		const returnFormat = props.returnFormat || 'YYYY-MM-DD'

		if (props.range) {
			const [start, end] = value.split('-').map(d => d.trim())
			if (start && end) {
				// Pour les ranges, convertir les deux dates au format demandé
				const formattedStart = convertDateFormat(start, props.displayFormat, returnFormat)
				const formattedEnd = convertDateFormat(end, props.displayFormat, returnFormat)
				emit('update:modelValue', [formattedStart, formattedEnd])
			}
		}
		else {
			// Pour une date simple, convertir au format demandé
			const formattedValue = convertDateFormat(value, props.displayFormat, returnFormat)
			emit('update:modelValue', formattedValue)
		}
	}

	// Handle the input value formatting
	const maxLength = computed(() => props.range ? 23 : 10) // 10 pour "DD/MM/YYYY", 23 pour "DD/MM/YYYY - DD/MM/YYYY"
	const handleInput = (value: string) => {
		// Limiter la longueur du texte
		if (value.length > maxLength.value) {
			value = value.slice(0, maxLength.value)
		}

		if (!value) {
			inputValue.value = ''
			emitValue('')
			validateField()
			return
		}

		// Garder uniquement les chiffres et le séparateur de plage
		let formattedValue = value.replace(/[^\d-]/g, '')

		if (props.range) {
			const [start, end] = formattedValue.split('-').map(d => d.trim())
			let result = ''

			// Formater la première date
			if (start) {
				result = formatDateInput(start)

				// Si la première date est complète, ajouter automatiquement le séparateur
				const yearLength = props.displayFormat.includes('YYYY') ? 8 : 6
				if (start.length === yearLength && !formattedValue.includes('-')) {
					result += ' -'
				}
			}

			// Ajouter le séparateur et la deuxième date si présente
			if (formattedValue.includes('-')) {
				if (!result.includes(' -')) {
					result += ' -'
				}
				if (end) {
					result += ' ' + formatDateInput(end)
				}
			}

			formattedValue = result
		}
		else {
			formattedValue = formatDateInput(formattedValue)
		}

		inputValue.value = formattedValue
		emitValue(formattedValue)
	}

	// Handle blur event to format the final value
	const handleBlur = () => {
		if (!inputValue.value) {
			emitValue('')
			return
		}

		if (props.range) {
			const [start, end] = inputValue.value.split('-').map(d => d.trim())
			if (start && end) {
				// Nettoyer et formater les dates
				const cleanStart = start.replace(/\D/g, '')
				const cleanEnd = end.replace(/\D/g, '')

				// Extraire les parties des dates
				const startDay = cleanStart.slice(0, 2)
				const startMonth = cleanStart.slice(2, 4)
				const startYear = cleanStart.slice(4)

				const endDay = cleanEnd.slice(0, 2)
				const endMonth = cleanEnd.slice(2, 4)
				const endYear = cleanEnd.slice(4)

				// Formater pour l'affichage
				const formattedStart = `${startDay}/${startMonth}/${startYear}`
				const formattedEnd = `${endDay}/${endMonth}/${endYear}`
				inputValue.value = `${formattedStart} - ${formattedEnd}`

				// Émettre les dates si elles sont valides
				if (isValidDate(formattedStart) && isValidDate(formattedEnd)) {
					emitValue(`${formattedStart} - ${formattedEnd}`)
				}
			}
		}
		else {
			const cleanValue = inputValue.value.replace(/\D/g, '')

			// Extraire les parties de la date
			const day = cleanValue.slice(0, 2)
			const month = cleanValue.slice(2, 4)
			const year = cleanValue.slice(4)

			// Formater pour l'affichage
			const formattedValue = `${day}/${month}/${year}`
			inputValue.value = formattedValue

			if (isValidDate(formattedValue)) {
				emitValue(formattedValue)
			}
		}

		validateField()
	}

	// Validate single date
	const isValidDate = (dateString: string): boolean => {
		return parseDate(dateString, props.displayFormat) !== null
	}

	// Exposer la méthode de validation
	const validateOnSubmit = () => {
		validateField()
		return errorMessages.value.length === 0
	}

	defineExpose({
		validate: validateField,
		validateOnSubmit,
	})
</script>

<template>
	<SyTextField
		v-model="inputValue"
		:error="hasError"
		:error-messages="errorMessages"
		:messages="successMessages"
		:placeholder="placeholder"
		:success="hasSuccess"
		:warning="hasWarning"
		:warning-messages="warningMessages"
		:maxlength="maxLength"
		v-bind="$attrs"
		@blur="handleBlur"
		@update:model-value="handleInput"
	/>
</template>
