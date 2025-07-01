<script lang="ts" setup>
	import { ref, computed, watch, onMounted } from 'vue'
	import { nextTick } from 'vue'
	import SyTextField from '../../Customs/SyTextField/SyTextField.vue'
	import { useValidation, type ValidationRule, type ValidationResult } from '@/composables/validation/useValidation'
	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import { useDateRangeInput, useDateRangeValidation, useDateFormatValidation, useDateValidation, useDateInputEditing, useManualDateValidation, useDateAutoClamp } from '../composables'
	import { type DateObjectValue } from '../types'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import { type DateValue } from '@/composables/date/useDateInitializationDayjs'
	import { DATE_PICKER_MESSAGES } from '../constants/messages'

	// Initialiser les plugins dayjs
	dayjs.extend(customParseFormat)

	const props = withDefaults(defineProps<{
		modelValue?: DateValue
		placeholder?: string
		format?: string
		dateFormatReturn?: string
		label?: string
		required?: boolean
		disabled?: boolean
		readonly?: boolean
		isOutlined?: boolean
		displayIcon?: boolean
		displayAppendIcon?: boolean
		noIcon?: boolean
		customRules?: ValidationRule[]
		customWarningRules?: ValidationRule[]
		displayPrependIcon?: boolean
		disableErrorHandling?: boolean
		showSuccessMessages?: boolean
		bgColor?: string
		displayRange?: boolean
		autoClamp?: boolean
	}>(), {
		modelValue: null,
		placeholder: DATE_PICKER_MESSAGES.PLACEHOLDER_DEFAULT,
		format: DATE_PICKER_MESSAGES.FORMAT_DEFAULT,
		dateFormatReturn: undefined,
		label: undefined,
		required: false,
		disabled: false,
		readonly: false,
		isOutlined: true,
		displayIcon: true,
		displayAppendIcon: false,
		noIcon: false,
		customRules: () => [],
		customWarningRules: () => [],
		displayPrependIcon: true,
		disableErrorHandling: false,
		showSuccessMessages: true,
		bgColor: 'white',
		displayRange: false,
		autoClamp: true,
	})

	const emit = defineEmits<{
		(e: 'update:model-value', value: DateValue): void
		(e: 'focus'): void
		(e: 'blur'): void
		(e: 'input', value: string): void
		(e: 'date-selected', value: DateValue): void
	}>()

	const {
		errors,
		warnings,
		successes,
		hasError,
		clearValidation,
		validateField,
	} = !props.readonly
		? useValidation({
			showSuccessMessages: props.showSuccessMessages,
			fieldIdentifier: props.label || props.placeholder,
			disableErrorHandling: props.disableErrorHandling,
		})
		: {
			errors: ref<string[]>([]),
			warnings: ref<string[]>([]),
			successes: ref<string[]>([]),
			hasError: ref(false),
			clearValidation: () => {},
			validateField: () => ({ hasError: false, hasWarning: false, hasSuccess: false, state: { errors: [], warnings: [], successes: [] } }),
		}

	const errorMessages = errors
	const warningMessages = warnings
	const successMessages = successes

	// Fonction intermédiaire pour adapter validateField à la signature attendue par useDateValidation
	const validateFieldAdapter = (value: unknown, rules?: ValidationRule[], warningRules?: ValidationRule[]): ValidationResult => {
		// Si validateField est une fonction vide (cas readonly), retourner un résultat par défaut
		if (typeof validateField === 'function' && validateField.toString().includes('() => {}')) {
			return {
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: {
					errors: [],
					warnings: [],
					successes: [],
				},
			}
		}

		const result = validateField(value, rules, warningRules)
		if (!result) {
			return {
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: {
					errors: [],
					warnings: [],
					successes: [],
				},
			}
		}
		return result
	}

	const inputValue = ref('')

	// Utilisation des composables pour la gestion des plages de dates
	const { parseDate, formatDate } = useDateFormat()

	// Utilisation du composable pour l'auto-clamping des dates invalides
	const { autoClampDate } = useDateAutoClamp()

	// Référence pour stocker les dates sélectionnées (pour le mode plage)
	const selectedDates = ref<DateObjectValue>(null)

	// Utilisation du composable pour la saisie des plages de dates
	const {
		handleRangeInput,
		resetState,
		isValidRange,
		initializeWithDates,
		formatRangeForDisplay,
		parseRangeInput,
		handleKeydown: handleKeydownRangeDate,
		handlePaste: handlePasteRangeDate,
	} = useDateRangeInput(
		props.format,
		props.displayRange,
		parseDate,
		formatDate,
	)

	// Utilisation du composable pour la validation des plages de dates
	const { currentRangeIsValid, getRangeValidationError } = useDateRangeValidation(selectedDates, props.displayRange)

	// Variable pour éviter les mises à jour récursives
	const isUpdatingFromInternal = ref(false)

	const isFocused = ref(false)
	const hasInteracted = ref(false)

	// Utilisation du composable pour la validation du format des dates
	const { validateDateFormat: validateDateFormatFn } = useDateFormatValidation({
		format: props.format,
		dateFormatReturn: props.dateFormatReturn,
		required: props.required,
		hasInteracted,
		disableErrorHandling: props.disableErrorHandling,
	})

	// Utilisation du composable pour la validation des dates
	const { validateDates } = useDateValidation({
		noCalendar: false,
		required: props.required,
		displayRange: props.displayRange,
		disableErrorHandling: props.disableErrorHandling,
		customRules: props.customRules,
		customWarningRules: props.customWarningRules,
		selectedDates,
		isUpdatingFromInternal,
		currentRangeIsValid,
		getRangeValidationError,
		clearValidation,
		validateField: validateFieldAdapter,
		errors,
		warnings,
		successes,
	})

	// Utilisation du composable pour gérer l'édition manuelle des dates
	const ariaLabel = ref('')

	const updateDisplayValue = (value: string) => {
		inputValue.value = value
	}

	const updateAriaLabel = (value: string) => {
		ariaLabel.value = value
	}

	const { formatDateInput, handleKeydown: handleKeydownSingleDate, handlePaste: handlePasteSingleDate } = useDateInputEditing({
		format: props.format,
		updateDisplayValue,
		updateAriaLabel,
		accessiblePlaceholders: true,
	})

	const validateDateFormat = (dateStr: string): { isValid: boolean, message: string } => {
		if (props.readonly) return { isValid: true, message: '' }

		// Si nous sommes en mode plage de dates et que la chaîne contient un séparateur de plage
		if (props.displayRange && dateStr.includes(' - ')) {
			// Diviser la chaîne en deux parties
			const parts = dateStr.split(' - ')
			const startDateStr = parts[0]?.trim() || ''
			const endDateStr = parts[1]?.trim() || ''

			// Valider chaque partie séparément
			const startValidation = validateDateFormatFn(startDateStr)
			const endValidation = endDateStr ? validateDateFormatFn(endDateStr) : { isValid: true, message: '' }

			// Si les deux parties sont valides ou si la première est valide et la seconde est vide
			if (startValidation.isValid && endValidation.isValid) {
				return { isValid: true, message: '' }
			}

			// Si la première partie est invalide
			if (!startValidation.isValid) {
				return {
					isValid: false,
					message: `${DATE_PICKER_MESSAGES.ERROR_INVALID_FORMAT_START} (${props.format})`,
				}
			}

			// Si la seconde partie est invalide
			if (!endValidation.isValid) {
				return {
					isValid: false,
					message: `${DATE_PICKER_MESSAGES.ERROR_INVALID_FORMAT_END} (${props.format})`,
				}
			}
		}

		// Utiliser le composable pour la validation standard
		return validateDateFormatFn(dateStr)
	}

	// Initialiser le composable pour la validation manuelle des dates
	const { validateManualInput } = useManualDateValidation({
		format: props.format,
		required: props.required,
		disableErrorHandling: props.disableErrorHandling,
		customRules: props.customRules,
		customWarningRules: props.customWarningRules,
		hasInteracted,
		errors,
		clearValidation,
		validateDateFormat,
		isDateComplete: (value: string) => value.length >= props.format.length,
		parseDate,
		validateField,
	})

	const validateRules = (value: string) => {
		clearValidation()

		// Cas spécial : champ vide
		if (!value && props.required && hasInteracted.value) {
			if (props.readonly) return true
			if (!props.disableErrorHandling) {
				errors.value.push(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
			}
			return false
		}

		if (!value && !props.required) {
			return true
		}

		// Traitement spécifique pour les plages de dates
		if (props.displayRange && value.includes(' - ')) {
			// Extraire les deux dates de la plage
			const [startDateStr, endDateStr] = value.split(' - ')

			// Si la plage est incomplète (seulement la première date suivie du séparateur)
			if (startDateStr && !endDateStr) {
				// Utiliser le composable pour valider uniquement la première date
				return validateManualInput(startDateStr)
			}

			// Si nous avons les deux dates (plage complète)
			if (startDateStr && endDateStr) {
				// Valider le format des deux dates
				const formatValidation = validateDateFormat(value)
				if (!formatValidation.isValid) {
					if (!props.disableErrorHandling && formatValidation.message) {
						errors.value.push(formatValidation.message)
					}
					return false
				}

				// Valider chaque date séparément
				const startDate = parseDate(startDateStr, props.format)
				const endDate = parseDate(endDateStr, props.format)

				if (startDate && endDate) {
					// Appliquer les règles à chaque date individuellement
					validateField(
						startDate,
						props.customRules,
						props.customWarningRules,
					)

					// Si pas d'erreur sur la première date, valider la seconde
					if (errors.value.length === 0) {
						validateField(
							endDate,
							props.customRules,
							props.customWarningRules,
						)
					}
				}
			}
		}
		else {
			// Utiliser le composable pour la validation standard d'une date unique
			return validateManualInput(value)
		}

		return !hasError.value
	}

	const isOnError = computed(() => warningMessages.value.length === 0 && successMessages.value.length === 0 && errorMessages.value.length > 0)
	const isOnWarning = computed(() => errorMessages.value.length === 0 && successMessages.value.length === 0 && warningMessages.value.length > 0)
	const isOnSuccess = computed(() => errorMessages.value.length === 0 && warningMessages.value.length === 0 && successMessages.value.length > 0)

	// Raccourcis pour vérifier la présence d'erreurs, d'avertissements ou de succès
	const hasWarning = computed(() => warningMessages.value.length > 0)

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

	const handleKeydown = (event: KeyboardEvent & { target: HTMLInputElement }) => {
		// Utiliser l'implémentation du composable approprié en fonction du mode
		if (props.displayRange) {
			handleKeydownRangeDate(event)
		}
		else {
			handleKeydownSingleDate(event)
		}
	}

	const handlePaste = (event: ClipboardEvent) => {
		// Utiliser l'implémentation du composable approprié en fonction du mode
		if (props.displayRange) {
			handlePasteRangeDate(event)
		}
		else {
			handlePasteSingleDate(event)
		}
	}

	const inputRef = ref<InstanceType<typeof SyTextField> | null>(null)

	const isFormatting = ref(false)

	watch(inputValue, async (newValue, oldValue) => {
		if (isFormatting.value || newValue === oldValue) return

		try {
			isFormatting.value = true

			if (!newValue) {
				emit('update:model-value', null)
				validateRules('')
				// Réinitialiser l'état du composable pour les plages de dates
				if (props.displayRange) {
					resetState()
					selectedDates.value = null
				}
				return
			}

			// Appliquer l'auto-clamping si activé
			if (props.autoClamp) {
				// Pour les plages de dates, traiter chaque partie séparément
				if (props.displayRange && newValue.includes(' - ')) {
					const parts = newValue.split(' - ')
					const startDateStr = parts[0]?.trim() || ''
					const endDateStr = parts[1]?.trim() || ''

					// Appliquer l'auto-clamping à chaque partie si nécessaire
					let adjusted = false
					let clampedStart = startDateStr
					let clampedEnd = endDateStr

					if (startDateStr) {
						const startResult = autoClampDate(startDateStr, props.format)
						if (startResult.adjusted) {
							clampedStart = startResult.clampedDate
							adjusted = true
						}
					}

					if (endDateStr) {
						const endResult = autoClampDate(endDateStr, props.format)
						if (endResult.adjusted) {
							clampedEnd = endResult.clampedDate
							adjusted = true
						}
					}

					// Si un ajustement a été fait, mettre à jour la valeur
					if (adjusted) {
						const clampedValue = clampedEnd
							? `${clampedStart} - ${clampedEnd}`
							: clampedStart
						newValue = clampedValue
						inputValue.value = clampedValue

						// Mettre à jour le modèle avec les dates ajustées
						const startDate = clampedStart ? parseDate(clampedStart, props.format) : null
						const endDate = clampedEnd ? parseDate(clampedEnd, props.format) : null

						if (startDate) {
							// Mettre à jour les dates sélectionnées
							if (endDate) {
								selectedDates.value = [startDate, endDate]

								// Formater les dates pour le modèle
								const format = props.dateFormatReturn || props.format
								const formattedStartDate = formatDate(startDate, format)
								const formattedEndDate = formatDate(endDate, format)

								// Émettre la plage de dates mise à jour
								emit('update:model-value', [formattedStartDate, formattedEndDate])
							}
							else {
								selectedDates.value = [startDate]

								// Émettre la date de début mise à jour
								const format = props.dateFormatReturn || props.format
								const formattedStartDate = formatDate(startDate, format)
								emit('update:model-value', formattedStartDate)
							}
						}
					}
				}
				else {
					// Pour une date unique
					const result = autoClampDate(newValue, props.format)
					if (result.adjusted) {
						newValue = result.clampedDate
						inputValue.value = result.clampedDate

						// Mettre à jour le modèle avec la date ajustée
						const date = parseDate(result.clampedDate, props.format)
						if (date) {
							const formattedDate = props.dateFormatReturn && props.dateFormatReturn !== props.format
								? formatDate(date, props.dateFormatReturn)
								: formatDate(date, props.format)
							emit('update:model-value', formattedDate)
						}
					}
				}
			}

			const input = inputRef.value?.$el.querySelector('input')
			const cursorPos = input?.selectionStart || 0

			// Utiliser le composable de plage de dates si le mode plage est activé
			if (props.displayRange) {
				// S'assurer que newValue est une chaîne de caractères
				if (typeof newValue !== 'string') {
					// Si newValue n'est pas une chaîne, on ne peut pas appliquer le formatage
					return
				}

				// Appliquer le formatage automatique aux dates saisies
				const cleanedInput = newValue.replace(/[^\d]/g, '')
				let formattedInput = ''

				// Si l'entrée contient un séparateur de plage, traiter chaque partie séparément
				if (newValue.includes(' - ')) {
					const parts = newValue.split(' - ')
					const firstPart = parts[0]
					const secondPart = parts[1] || ''

					// Formater la première partie
					const formattedFirst = firstPart.length > 0 ? formatDateInput(firstPart).formatted : ''

					// Formater la seconde partie
					const formattedSecond = secondPart.length > 0 ? formatDateInput(secondPart).formatted : ''

					// Combiner les deux parties
					formattedInput = `${formattedFirst} - ${formattedSecond}`

					newValue = formattedInput
				}
				else if (cleanedInput.length > 0) {
					// Appliquer le formatage automatique à une date unique
					const { formatted } = formatDateInput(newValue)
					formattedInput = formatted
					newValue = formattedInput
				}

				// Gérer la saisie de plage de dates avec le newValue formaté
				// Lors de la première saisie (oldValue vide), ne pas envoyer la position du curseur
				// car cela peut causer des problèmes avec le formatage initial
				const result = !oldValue
					? handleRangeInput('', newValue)
					: handleRangeInput(oldValue, newValue, cursorPos)

				// Mettre à jour la valeur affichée
				inputValue.value = result.formattedValue

				// Mettre à jour les dates sélectionnées
				if (result.dates[0]) {
					// Si nous avons au moins une date
					selectedDates.value = result.dates

					// Valider les dates après la mise à jour
					try {
						isUpdatingFromInternal.value = true
						validateDates()
					}
					finally {
						setTimeout(() => {
							isUpdatingFromInternal.value = false
						}, 0)
					}

					// Si la plage est complète (deux dates)
					if (result.isComplete && result.dates[1]) {
						const [startDate, endDate] = result.dates

						// Vérifier si la plage est valide
						if (isValidRange(startDate, endDate)) {
							// Formater les dates pour le modèle
							const returnFormat = props.dateFormatReturn || props.format
							const modelValue: [string, string] = [
								formatDate(startDate, returnFormat),
								formatDate(endDate, returnFormat),
							]

							// Émettre les événements
							emit('update:model-value', modelValue)
							emit('date-selected', modelValue)
						}
						else {
							errors.value.push(DATE_PICKER_MESSAGES.ERROR_END_BEFORE_START)
						}
					}
					// Si nous venons juste de compléter la première date
					else if (result.justCompletedFirstDate) {
						// Émettre un événement pour la première date
						const returnFormat = props.dateFormatReturn || props.format
						const formattedDate = formatDate(result.dates[0], returnFormat)

						// Émettre l'événement date-selected pour la première date
						emit('date-selected', formattedDate)

						// Note: Nous n'émettons pas update:model-value avec un tableau contenant null
						// car le type DateValue n'accepte que [string, string] pour les plages
					}
				}
				else {
					// Aucune date sélectionnée
					selectedDates.value = null

					// Réinitialiser le modèle si nécessaire
					if (props.modelValue !== null) {
						emit('update:model-value', null)
					}
				}

				// Émettre l'événement input
				emit('input', result.formattedValue)

				// Mettre à jour la position du curseur si nécessaire
				if (result.cursorPosition !== undefined) {
					setTimeout(() => {
						if (input) {
							input.setSelectionRange(result.cursorPosition, result.cursorPosition)
						}
					}, 0)
				}
			}
			else {
				// Mode date unique (comportement existant)
				const { formatted, cursorPos: newPos } = formatDateInput(newValue, cursorPos)

				if (formatted !== newValue) {
					inputValue.value = formatted
					await nextTick()
					input?.setSelectionRange(newPos, newPos)
				}

				const isDateComplete = !formatted.includes('_')

				if (isDateComplete) {
					const validation = validateDateFormat(formatted)
					if (validation.isValid) {
						const date = dayjs(formatted, props.format, true).isValid()
							? dayjs(formatted, props.format).toDate()
							: null

						if (date) {
							const formattedDate = props.dateFormatReturn
								? dayjs(date).format(props.dateFormatReturn)
								: formatted
							await nextTick()
							emit('update:model-value', formattedDate)
							emit('date-selected', formattedDate)
						}
					}
					validateRules(formatted)
				}
				else {
					clearValidation()
				}
			}
		}
		finally {
			await nextTick()
			isFormatting.value = false
		}
	})

	watch(() => props.modelValue, (newValue: DateValue) => {
		if (isFormatting.value) return

		if (!newValue) {
			inputValue.value = ''
			return
		}

		// Gérer les plages de dates
		if (props.displayRange && Array.isArray(newValue)) {
			// Conversion explicite du type pour aider TypeScript
			const dateArray = newValue as string[]

			// Si nous avons une plage de dates complète
			if (dateArray.length === 2) {
				const [startDateStr, endDateStr] = newValue
				const startDate = parseDate(startDateStr, props.dateFormatReturn || props.format)
				const endDate = parseDate(endDateStr, props.dateFormatReturn || props.format)

				if (startDate && endDate) {
					// Initialiser les dates sélectionnées avec le composable
					initializeWithDates(startDate, endDate)
					selectedDates.value = [startDate, endDate]

					// Valider les dates après la mise à jour
					try {
						isUpdatingFromInternal.value = true
						validateDates()
					}
					finally {
						setTimeout(() => {
							isUpdatingFromInternal.value = false
						}, 0)
					}

					// Utiliser le composable pour formater la plage
					inputValue.value = formatRangeForDisplay(startDate, endDate)
					validateRules(inputValue.value)
				}
			}
			else if (dateArray.length === 1 && dateArray[0]) {
				// Si nous avons seulement la première date
				const startDate = parseDate(dateArray[0], props.dateFormatReturn || props.format)
				if (startDate) {
					// Initialiser avec seulement la date de début
					initializeWithDates(startDate, null)
					selectedDates.value = [startDate]

					// Formater pour l'affichage
					inputValue.value = formatRangeForDisplay(startDate, null)
				}
			}
		}
		// Gérer une date unique (comportement existant)
		else {
			const modelValueStr = typeof newValue === 'string' ? newValue : ''
			const date = dayjs(modelValueStr, props.format, true).isValid()
				? dayjs(modelValueStr, props.format).toDate()
				: null

			if (date) {
				if (props.dateFormatReturn && props.dateFormatReturn !== props.format) {
					const formattedForReturn = dayjs(date).format(props.dateFormatReturn)
					emit('update:model-value', formattedForReturn)
				}

				inputValue.value = dayjs(date).format(props.format)
				validateRules(inputValue.value)
			}
			else {
				inputValue.value = modelValueStr
				validateRules(modelValueStr)
			}
		}
	})

	const handleFocus = () => {
		isFocused.value = true
		emit('focus')
	}

	const handleBlur = () => {
		isFocused.value = false
		hasInteracted.value = true

		// Vérifier si la valeur est vide
		if (!inputValue.value) {
			emit('update:model-value', null)
			validateRules('')
			emit('blur')
			return
		}

		// Appliquer l'auto-clamping au moment du blur si activé
		if (props.autoClamp) {
			// Pour les plages de dates, traiter chaque partie séparément
			if (props.displayRange && inputValue.value.includes(' - ')) {
				const parts = inputValue.value.split(' - ')
				const startDateStr = parts[0]?.trim() || ''
				const endDateStr = parts[1]?.trim() || ''

				// Appliquer l'auto-clamping à chaque partie si nécessaire
				let adjusted = false
				let clampedStart = startDateStr
				let clampedEnd = endDateStr

				if (startDateStr) {
					const startResult = autoClampDate(startDateStr, props.format)
					if (startResult.adjusted) {
						clampedStart = startResult.clampedDate
						adjusted = true
					}
				}

				if (endDateStr) {
					const endResult = autoClampDate(endDateStr, props.format)
					if (endResult.adjusted) {
						clampedEnd = endResult.clampedDate
						adjusted = true
					}
				}

				// Si un ajustement a été fait, mettre à jour la valeur
				if (adjusted) {
					const clampedValue = clampedEnd
						? `${clampedStart} - ${clampedEnd}`
						: clampedStart
					inputValue.value = clampedValue
				}
			}
			else {
				// Pour une date unique
				const result = autoClampDate(inputValue.value, props.format)
				if (result.adjusted) {
					inputValue.value = result.clampedDate
				}
			}

			// Après avoir appliqué l'autoClamp, mettre à jour le modèle
			if (props.displayRange) {
				// Utiliser directement parseRangeInput pour analyser la plage de dates
				// sans passer par handleRangeInput qui peut causer des erreurs
				const [startDate, endDate] = parseRangeInput(inputValue.value)

				// Mettre à jour le modèle avec les dates analysées si la plage est complète
				if (startDate) {
					const returnFormat = props.dateFormatReturn || props.format
					if (endDate) {
						// Plage complète avec deux dates
						const modelValue: [string, string] = [
							formatDate(startDate, returnFormat),
							formatDate(endDate, returnFormat),
						]
						emit('update:model-value', modelValue)
					}
					// Sinon, on ne met pas à jour le modèle car on n'a qu'une date partielle
				}
			}
			else {
				// Traiter une date unique
				const date = parseDate(inputValue.value, props.format)
				if (date) {
					const formattedDate = props.dateFormatReturn && props.dateFormatReturn !== props.format
						? formatDate(date, props.dateFormatReturn)
						: formatDate(date, props.format)
					emit('update:model-value', formattedDate)
				}
			}

			// Valider les règles avec la valeur ajustée
			validateRules(inputValue.value)
		}

		// Traitement spécifique pour les plages de dates
		if (props.displayRange && inputValue.value) {
			// Utiliser le composable pour analyser la plage de dates
			const [startDate, endDate] = parseRangeInput(inputValue.value)

			// Si nous avons une plage complète (deux dates)
			if (startDate && endDate) {
				// Vérifier si la plage est valide (date de fin >= date de début)
				if (!isValidRange(startDate, endDate)) {
					// Plage invalide, conserver l'erreur et ne pas mettre à jour le modèle
					clearValidation()
					errors.value.push(DATE_PICKER_MESSAGES.ERROR_END_BEFORE_START)
					emit('update:model-value', props.modelValue)
					return
				}

				// Mettre à jour les dates sélectionnées
				selectedDates.value = [startDate, endDate]

				// Formater correctement l'affichage
				inputValue.value = formatRangeForDisplay(startDate, endDate)

				// Plage valide, mettre à jour le modèle
				const returnFormat = props.dateFormatReturn || props.format
				const modelValue: [string, string] = [
					formatDate(startDate, returnFormat),
					formatDate(endDate, returnFormat),
				]
				emit('update:model-value', modelValue)
				validateRules(inputValue.value)
				return
			}
			// Si nous avons seulement la première date
			else if (startDate) {
				// Mettre à jour les dates sélectionnées
				selectedDates.value = [startDate]

				// Valider les dates après la mise à jour
				try {
					isUpdatingFromInternal.value = true
					validateDates()
				}
				finally {
					setTimeout(() => {
						isUpdatingFromInternal.value = false
					}, 0)
				}

				// Formater correctement l'affichage
				inputValue.value = formatRangeForDisplay(startDate, null)

				// Mettre à jour l'affichage avec seulement la première date
				const returnFormat = props.dateFormatReturn || props.format
				const formattedDate = formatDate(startDate, returnFormat)

				// Émettre l'événement date-selected pour la première date
				emit('date-selected', formattedDate)

				// Note: Nous n'émettons pas update:model-value avec un tableau contenant null
				// car le type DateValue n'accepte que [string, string] pour les plages
				validateRules(inputValue.value)
				return
			}
		}

		// Traitement standard pour les dates uniques ou les cas non couverts ci-dessus
		if (inputValue.value) {
			const validation = validateDateFormat(inputValue.value)
			if (validation.isValid) {
				const date = dayjs(inputValue.value, props.format, true).isValid()
					? dayjs(inputValue.value, props.format).toDate()
					: null

				if (date) {
					const formattedDate = props.dateFormatReturn
						? dayjs(date).format(props.dateFormatReturn)
						: inputValue.value
					emit('update:model-value', formattedDate)
				}
			}
			else {
				emit('update:model-value', props.modelValue)
			}
		}
		else if (props.required) {
			emit('update:model-value', props.modelValue)
		}
		else {
			emit('update:model-value', null)
		}

		// Appliquer la validation standard si elle n'a pas déjà été appliquée
		if (errors.value.length === 0) {
			validateRules(inputValue.value || '')
		}
	}

	const isValidating = ref(false)

	const validateOnSubmit = async (): Promise<boolean> => {
		isValidating.value = true
		hasInteracted.value = true

		try {
			// Valider le format de la date
			const isFormatValid = validateRules(inputValue.value)

			if (!isFormatValid) {
				return false
			}

			// Vérifier si nous avons des erreurs après la validation du format
			if (hasError.value) {
				return false
			}

			// Ajouter des messages de succès si nécessaire
			if (props.showSuccessMessages && inputValue.value && !hasError.value && !hasWarning.value) {
				successMessages.value.push(DATE_PICKER_MESSAGES.SUCCESS_VALID_DATE)
			}

			return !hasError.value
		}
		finally {
			isValidating.value = false
		}
	}

	defineExpose({
		validateOnSubmit,
		focus() {
			// Utiliser un sélecteur plus spécifique pour cibler l'input principal
			// SyTextField peut contenir plusieurs inputs, donc on cible le premier qui n'est pas caché
			const input = inputRef.value?.$el.querySelector('input:not([type="hidden"])')
			if (input) {
				input.focus()
			}
		},
		blur() {
			// Utiliser un sélecteur plus spécifique pour cibler l'input principal
			const input = inputRef.value?.$el.querySelector('input:not([type="hidden"])')
			if (input) {
				input.blur()
			}
		},
	})

	onMounted(() => {
		if (!props.modelValue) {
			return
		}

		// Gérer les plages de dates
		if (props.displayRange && Array.isArray(props.modelValue)) {
			// Si nous avons une plage de dates complète
			if (props.modelValue.length === 2) {
				const [startDateStr, endDateStr] = props.modelValue
				const startDate = parseDate(startDateStr, props.dateFormatReturn || props.format)
				const endDate = parseDate(endDateStr, props.dateFormatReturn || props.format)

				if (startDate && endDate) {
					// Initialiser les dates sélectionnées
					selectedDates.value = [startDate, endDate]

					// Formater la plage pour l'affichage
					const formattedStart = formatDate(startDate, props.format)
					const formattedEnd = formatDate(endDate, props.format)
					inputValue.value = `${formattedStart} - ${formattedEnd}`
				}
			}
		}
		// Gérer une date unique (comportement existant)
		else {
			const modelValueStr = typeof props.modelValue === 'string' ? props.modelValue : ''
			const date = dayjs(modelValueStr, props.format, true).isValid()
				? dayjs(modelValueStr, props.format).toDate()
				: null

			if (date) {
				inputValue.value = dayjs(date).format(props.format)
			}
			else {
				inputValue.value = modelValueStr
			}
		}
		
		// Fix ARIA attributes to prevent validation errors
		nextTick(() => {
			fixAriaAttributes()
		})
	})
	
	// Function to fix ARIA attributes that cause validation errors
	function fixAriaAttributes() {
		try {
			// Get the root element of the component
			const rootElement = inputRef.value?.$el
			if (!rootElement) return
			
			// Find the parent container with invalid ARIA attributes
			const containerDiv = rootElement.closest('[aria-haspopup="menu"]')
			if (containerDiv) {
				containerDiv.removeAttribute('aria-haspopup')
				containerDiv.removeAttribute('aria-expanded')
				containerDiv.removeAttribute('aria-controls')
			}
			
			// Find input elements with invalid ARIA attributes
			const inputElements = rootElement.querySelectorAll('input')
			inputElements.forEach((input) => {
				// Remove invalid ARIA attributes
				input.removeAttribute('aria-haspopup')
				input.removeAttribute('aria-expanded')
				input.removeAttribute('aria-controls')
				
				// Remove invalid period attribute
				input.removeAttribute('period')
				
				// Set proper aria-label that matches the visible label
				if (props.label) {
					input.setAttribute('aria-label', props.label)
				} else if (props.placeholder) {
					input.setAttribute('aria-label', props.placeholder)
				}
			})
		}
		catch (error) {
			console.error('Error fixing ARIA attributes:', error)
		}
	}
</script>

<template>
	<SyTextField
		ref="inputRef"
		v-model="inputValue"
		:append-icon="displayIcon && displayAppendIcon ? 'calendar' : undefined"
		:append-inner-icon="getIcon"
		:class="{
			'error-field': isOnError,
			'warning-field': isOnWarning,
			'success-field': isOnSuccess
		}"
		:disabled="props.disabled"
		:error-messages="errorMessages"
		:label="props.label || props.placeholder"
		:no-icon="props.noIcon"
		:prepend-icon="displayIcon && displayPrependIcon && !displayAppendIcon ? 'calendar' : undefined"
		:readonly="props.readonly"
		:variant-style="props.isOutlined ? 'outlined' : 'underlined'"
		:warning-messages="warningMessages"
		:success-messages="props.showSuccessMessages ? successMessages : []"
		:bg-color="props.bgColor"
		color="primary"
		is-clearable

		title="Date text input"
		@focus="handleFocus"
		@blur="handleBlur"
		@keydown="handleKeydown"
		@paste="handlePaste"
	/>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

:deep(.v-icon__svg) { cursor: default; }

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
