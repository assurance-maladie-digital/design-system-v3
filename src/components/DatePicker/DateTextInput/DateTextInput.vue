<script setup lang="ts">
	import {
		useDateRangeInput,
		useDateRangeValidation,
		useDateInputEditing,
		useDateAutoClamp,
		useDateTextField,
		useDatePickerValidation,
		validateDateFormat,
		isDateComplete,
	} from '../composables'
	import { ref, computed, watch, nextTick, onMounted, readonly as readonlyState, toRefs, useId } from 'vue'
	import SyTextField from '../../Customs/SyTextField/SyTextField.vue'
	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import type { ValidationRule, ValidationResult } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import { useSyTextFieldProps } from './props/syTextFieldProps'
	import { locales } from '../locales'
	import type { DateModelValue } from '@/composables/date/useDateInitializationDayjs'
	import type { DateObjectValue, DateTextInputProps } from '../types'

	dayjs.extend(customParseFormat)

	const props = withDefaults(defineProps<DateTextInputProps>(), {
		autoClamp: false,
		bgColor: 'white',
		customRules: () => [],
		customWarningRules: () => [],
		dateFormatReturn: undefined,
		density: 'default',
		disableErrorHandling: false,
		disabled: false,
		disableClickButton: false,
		displayAppendIcon: false,
		displayIcon: true,
		displayPrependIcon: true,
		displayRange: false,
		externalErrorMessages: () => [],
		format: locales.formatDefault,
		hint: undefined,
		isOutlined: true,
		isValidateOnBlur: true,
		modelValue: undefined,
		noIcon: false,
		persistentHint: false,
		placeholder: undefined,
		readonly: false,
		required: false,
		showSuccessMessages: false,
		title: false,
	})

	const emit = defineEmits<{
		(e: 'update:model-value', value: DateModelValue): void
		(e: 'focus'): void
		(e: 'blur'): void
		(e: 'input', value: string): void
		(e: 'date-selected', value: DateModelValue): void
		(e: 'prepend-icon-click', event: MouseEvent): void
		(e: 'append-icon-click', event: MouseEvent): void
	}>()

	/**
	 * =====================
	 * Derived flags / utils
	 * =====================
	 */
	const { displayRange, format: displayFormat, dateFormatReturn, required, readonly } = toRefs(props)
	const isRange = computed(() => !!displayRange.value)
	const returnFormat = computed(() => dateFormatReturn.value || displayFormat.value)

	const { parseDate, formatDate } = useDateFormat()
	const { autoClampDate } = useDateAutoClamp()

	/**
	 * =====================
	 * Validation setup (using DatePickerValidationBridge)
	 * =====================
	 */
	const selectedDates = ref<DateObjectValue>(null)
	const isUpdatingFromInternal = ref(false)

	const { currentRangeIsValid, getRangeValidationError } = useDateRangeValidation(
		selectedDates,
		props.displayRange,
	)

	const bridgeValidation = useDatePickerValidation({
		showSuccessMessages: computed(() => props.showSuccessMessages),
		disableErrorHandling: computed(() => props.disableErrorHandling),
		noCalendar: true,
		required: computed(() => props.required),
		displayRange: computed(() => props.displayRange),
		customRules: computed(() => props.customRules ?? []),
		customWarningRules: computed(() => props.customWarningRules ?? []),
		selectedDates,
		isUpdatingFromInternal,
		currentRangeIsValid,
		getRangeValidationError,
		skipValidationWhenReadonly: true,
		readonly: readonly,
		fieldIdentifier: props.label || props.placeholder || 'Date',
	})

	const readonlyValidation = {
		errors: ref<string[]>([]),
		warnings: ref<string[]>([]),
		successes: ref<string[]>([]),
		displaySuccesses: computed(() => []),
		hasError: ref(false),
		clearValidation: () => {},
		validateField: () => ({
			hasError: false,
			hasWarning: false,
			hasSuccess: false,
			state: { errors: [], warnings: [], successes: [] },
		} as ValidationResult),
	}

	const errors = computed({
		get: () => readonly.value ? readonlyValidation.errors.value : bridgeValidation.errors.value,
		set: (value) => {
			if (!readonly.value) bridgeValidation.errors.value = value
		},
	})
	const warnings = computed({
		get: () => readonly.value ? readonlyValidation.warnings.value : bridgeValidation.warnings.value,
		set: (value) => {
			if (!readonly.value) bridgeValidation.warnings.value = value
		},
	})
	const hasError = computed(() => {
		if (readonly.value) return false
		return bridgeValidation.errors.value.length > 0
	})

	const clearValidation = () => {
		if (readonly.value) {
			readonlyValidation.clearValidation()
		}
		else {
			bridgeValidation.clearValidation()
		}
	}

	const validateField = async (
		value: unknown,
		rules?: ValidationRule[],
		warningRules?: ValidationRule[],
	): Promise<ValidationResult> => {
		if (readonly.value) {
			return readonlyValidation.validateField()
		}
		return await bridgeValidation.validateField(value, rules, warningRules)
	}

	// Agrégation des erreurs internes et externes avec déduplication
	// Évite les doublons quand les mêmes customRules sont exécutées par le parent et l'enfant
	const errorMessages = computed(() => {
		const allErrors = [...errors.value, ...props.externalErrorMessages]
		return [...new Set(allErrors)] // Déduplication avec Set
	})
	const warningMessages = warnings
	const successMessages = computed((): string[] =>
		readonly.value ? [] : (bridgeValidation.validation.displaySuccesses.value ?? []),
	)

	/**
	 * Safe validate utility
	 */
	const safeValidateField = async (
		value: unknown,
		rules?: ValidationRule[],
		warningRules?: ValidationRule[],
	): Promise<ValidationResult> => {
		if (readonly.value) {
			return { hasError: false, hasWarning: false, hasSuccess: false, state: { errors: [], warnings: [], successes: [] } }
		}
		return await validateField(value, rules, warningRules) ?? { hasError: false, hasWarning: false, hasSuccess: false, state: { errors: [], warnings: [], successes: [] } }
	}

	/**
	 * =====================
	 * Range input + validations
	 * =====================
	 */
	const {
		handleRangeInput,
		resetState,
		isValidRange,
		initializeWithDates,
		formatRangeForDisplay,
		parseRangeInput,
		handlePaste: handlePasteRange,
	} = useDateRangeInput(displayFormat.value, isRange.value, parseDate, formatDate)

	/**
	 * =====================
	 * Format + manual validation
	 * =====================
	 */
	// isUpdatingFromInternal est déjà déclaré plus haut pour le Bridge
	const isFocused = ref(false)
	const hasInteracted = ref(false)
	const ariaLabel = ref(props.label || props.placeholder || locales.label)
	const formatDescriptionId = `date-format-desc-${useId()}`

	function validateDateFormatForSingleOrRange(input: string): { isValid: boolean, message: string } {
		if (readonly.value) return { isValid: true, message: '' }
		if (isRange.value && input.includes(locales.rangeSeparator)) {
			const [start = '', end = ''] = input.split(locales.rangeSeparator).map(s => s?.trim() ?? '')
			const startDateFormatValidation = validateDateFormat(start, displayFormat.value, dateFormatReturn.value, required.value, hasInteracted.value, props.disableErrorHandling)
			const endDateFormatValidation = end ? validateDateFormat(end, displayFormat.value, dateFormatReturn.value, required.value, hasInteracted.value, props.disableErrorHandling) : { isValid: true, message: '' }
			if (startDateFormatValidation.isValid && endDateFormatValidation.isValid) return { isValid: true, message: '' }
			if (!startDateFormatValidation.isValid) return { isValid: false, message: `${locales.invalidStartDateFormat} (${displayFormat.value})` }
			return { isValid: false, message: `${locales.invalidEndDateFormat} (${displayFormat.value})` }
		}
		return validateDateFormat(input, displayFormat.value, dateFormatReturn.value, required.value, hasInteracted.value, props.disableErrorHandling)
	}

	const inputValue = ref('')
	const inputRef = ref<InstanceType<typeof SyTextField> | null>(null)
	const isFormatting = ref(false)
	// Force re-render of SyTextField when needed (e.g., after reset)
	const fieldKey = ref(0)
	const isValidating = ref(false)

	const updateDisplayValue = (dateDisplayText: string) => (inputValue.value = dateDisplayText)
	const updateAriaLabel = (ariaLabelText: string) => {
		ariaLabel.value = ariaLabelText || props.label || props.placeholder || locales.label
	}

	const { formatDateInput, handlePaste: handlePasteSingle, isHandlingBackspace } = useDateInputEditing({
		format: displayFormat.value,
		updateDisplayValue,
		updateAriaLabel,
		accessiblePlaceholders: true,
	})

	const isOverwriteEditing = ref(false) // garde-fou pour ne pas re-formater au watch pendant qu'on gère le clavier

	// Helpers overwrite
	const isDigitKey = (e: KeyboardEvent) =>
		e.key.length === 1 && e.key >= '0' && e.key <= '9'

	const isSeparator = (skeletonFromFormatChar: string | undefined) =>
		!!skeletonFromFormatChar && /[^A-Za-z_]/.test(skeletonFromFormatChar) // '/', ' ', '-'

	function nextEditableIndex(skeletonFromFormat: string, from: number) {
		let i = Math.min(from, skeletonFromFormat.length)
		while (i < skeletonFromFormat.length && isSeparator(skeletonFromFormat[i])) i++
		return i
	}

	function prevEditableIndex(skeletonFromFormat: string, from: number) {
		let i = Math.max(0, from)
		while (i > 0 && isSeparator(skeletonFromFormat[i - 1])) i--
		return i - 1
	}

	function overwriteAt(inputText: string, idx: number, replacementChar: string) {
		if (idx < 0 || idx >= inputText.length) return inputText
		return inputText.slice(0, idx) + replacementChar + inputText.slice(idx + 1)
	}

	function overwriteSelection(inputText: string, skeletonFromFormat: string, start: number, end: number, filler: (i: number) => string) {
		let out = inputText
		for (let i = start; i < end; i++) {
			if (isSeparator(skeletonFromFormat[i])) continue
			out = overwriteAt(out, i, filler(i))
		}
		return out
	}

	function skeletonFromFormat(dateFormat: string) {
		// remplace les lettres du masque (D,M,Y...) par '_', conserve les séparateurs (/,-, espace…)
		return dateFormat.replace(/[A-Za-z]/g, '_')
	}

	function isTextInputElement(element: unknown): element is HTMLInputElement {
		return element instanceof HTMLInputElement && typeof element.setSelectionRange === 'function'
	}

	function getNativeInputElement() {
		const element = inputRef.value?.$el?.querySelector?.('input:not([type="hidden"])')
		return isTextInputElement(element) ? element : null
	}

	function getEventInputElement(event: Event | undefined | null) {
		return isTextInputElement(event?.target) ? event.target : null
	}

	function setInputSelectionRange(inputElement: HTMLInputElement | null, start: number, end = start) {
		if (!inputElement) return
		inputElement.setSelectionRange(start, end)
	}

	/**
	 * =====================
	 * Bootstrapping caret (DEBUT DE L'INPUT)
	 * =====================
	 */
	const isBootstrapping = ref(false)

	async function initializeCursorAtFirstEditablePosition(options: { focus?: boolean } = {}) {
		const inputElement = getNativeInputElement()
		if (!inputElement) return

		isBootstrapping.value = true

		// Only inject skeleton when focused, not on initial load
		if (!inputValue.value && options.focus) {
			inputValue.value = isRange.value
				? `${skeletonFromFormat(displayFormat.value)}${locales.rangeSeparator}${skeletonFromFormat(displayFormat.value)}`
				: skeletonFromFormat(displayFormat.value)
		}

		await nextTick()
		if (options.focus) inputElement.focus({ preventScroll: true })

		const cursorPosition = nextEditableIndex(displayFormat.value, 0)
		// double rAF pour laisser Vuetify finir ses mises à jour
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setInputSelectionRange(inputElement, cursorPosition)
				isBootstrapping.value = false
			})
		})
	}

	// Handlers overwrite (single)
	function handleSingleDateKeyboardInput(keyboardEvent: KeyboardEvent & { target: HTMLInputElement }) {
		const inputElement = keyboardEvent.target
		if (keyboardEvent.ctrlKey || keyboardEvent.metaKey || keyboardEvent.altKey) return
		if (['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Delete'].includes(keyboardEvent.key)) return

		if (!inputElement.value && isDigitKey(keyboardEvent)) {
			keyboardEvent.preventDefault()
			isOverwriteEditing.value = true
			const dateFormat = displayFormat.value
			const formatSkeleton = skeletonFromFormat(dateFormat)
			const startPosition = nextEditableIndex(dateFormat, 0)
			const updatedInputValue = overwriteAt(formatSkeleton, startPosition, keyboardEvent.key)
			inputValue.value = updatedInputValue
			requestAnimationFrame(() => {
				const nextCursorPosition = nextEditableIndex(dateFormat, startPosition + 1)
				setInputSelectionRange(inputElement, nextCursorPosition)
				isOverwriteEditing.value = false
			})
			return
		}

		// Bootstrap si vide (mais sans consommer un chiffre)
		if (!inputElement.value && keyboardEvent.key !== 'Backspace') {
			inputValue.value = skeletonFromFormat(displayFormat.value)
			requestAnimationFrame(() => {
				const startPosition = nextEditableIndex(displayFormat.value, 0)
				setInputSelectionRange(inputElement, startPosition)
			})
		}

		if (keyboardEvent.key === 'Backspace') {
			keyboardEvent.preventDefault()
			isOverwriteEditing.value = true
			const selectionStart = inputElement.selectionStart ?? 0
			const selectionEnd = inputElement.selectionEnd ?? selectionStart
			if (selectionStart !== selectionEnd) {
				const updatedInputValue = overwriteSelection(inputElement.value, displayFormat.value, selectionStart, selectionEnd, () => '_')
				inputValue.value = updatedInputValue
				requestAnimationFrame(() => {
					setInputSelectionRange(inputElement, selectionStart)
					isOverwriteEditing.value = false
				})
				return
			}
			const newCursorPosition = prevEditableIndex(displayFormat.value, selectionStart)
			if (newCursorPosition >= 0) {
				const updatedInputValue = overwriteAt(inputElement.value, newCursorPosition, '_')
				inputValue.value = updatedInputValue
				requestAnimationFrame(() => {
					setInputSelectionRange(inputElement, newCursorPosition)
					isOverwriteEditing.value = false
				})
			}
			else {
				isOverwriteEditing.value = false
			}
			return
		}

		if (isDigitKey(keyboardEvent)) {
			keyboardEvent.preventDefault()
			isOverwriteEditing.value = true
			let cursorPosition = inputElement.selectionStart ?? 0
			const selectionEnd = inputElement.selectionEnd ?? cursorPosition

			if (cursorPosition !== selectionEnd) {
				let updatedInputValue = overwriteSelection(inputElement.value, displayFormat.value, cursorPosition, selectionEnd, () => '_')
				if (!isSeparator(displayFormat.value[cursorPosition])) updatedInputValue = overwriteAt(updatedInputValue, cursorPosition, keyboardEvent.key)
				inputValue.value = updatedInputValue
				const nextCursorPosition = nextEditableIndex(displayFormat.value, cursorPosition + 1)
				requestAnimationFrame(() => {
					setInputSelectionRange(inputElement, nextCursorPosition)
					isOverwriteEditing.value = false
				})
				return
			}

			if (isSeparator(displayFormat.value[cursorPosition])) cursorPosition = nextEditableIndex(displayFormat.value, cursorPosition)
			if (cursorPosition < inputElement.value.length) {
				const updatedInputValue = overwriteAt(inputElement.value, cursorPosition, keyboardEvent.key)
				inputValue.value = updatedInputValue
				const nextCursorPosition = nextEditableIndex(displayFormat.value, cursorPosition + 1)
				requestAnimationFrame(() => {
					setInputSelectionRange(inputElement, nextCursorPosition)
					isOverwriteEditing.value = false
				})
			}
			else {
				isOverwriteEditing.value = false
			}
			return
		}

		if (keyboardEvent.key.length === 1) keyboardEvent.preventDefault()
	}

	// Handlers overwrite (range)
	function handleRangeDateKeyboardInput(keyboardEvent: KeyboardEvent & { target: HTMLInputElement }) {
		const inputElement = keyboardEvent.target
		if (keyboardEvent.ctrlKey || keyboardEvent.metaKey || keyboardEvent.altKey) return
		if (['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Delete'].includes(keyboardEvent.key)) return

		const dateFormat = displayFormat.value
		const rangeSeparator = locales.rangeSeparator

		if (!inputElement.value && isDigitKey(keyboardEvent)) {
			keyboardEvent.preventDefault()
			isOverwriteEditing.value = true
			const leftFormatSkeleton = skeletonFromFormat(dateFormat)
			const rightFormatSkeleton = skeletonFromFormat(dateFormat)
			const startPosition = nextEditableIndex(dateFormat, 0)
			const leftWithDigit = overwriteAt(leftFormatSkeleton, startPosition, keyboardEvent.key)
			inputValue.value = `${leftWithDigit}${rangeSeparator}${rightFormatSkeleton}`
			requestAnimationFrame(() => {
				const nextCursorPosition = nextEditableIndex(dateFormat, startPosition + 1)
				setInputSelectionRange(inputElement, nextCursorPosition)
				isOverwriteEditing.value = false
			})
			return
		}

		if (!inputElement.value && keyboardEvent.key !== 'Backspace') {
			inputValue.value = `${skeletonFromFormat(dateFormat)}${rangeSeparator}${skeletonFromFormat(dateFormat)}`
			requestAnimationFrame(() => {
				const startPosition = nextEditableIndex(dateFormat, 0)
				setInputSelectionRange(inputElement, startPosition)
			})
		}

		const inputText = inputElement.value || ''
		const separatorIndex = inputText.indexOf(rangeSeparator)
		const cursorPosition = inputElement.selectionStart ?? 0
		const selectionEndPosition = inputElement.selectionEnd ?? cursorPosition

		const leftDateText = separatorIndex === -1 ? inputText : inputText.slice(0, separatorIndex)
		const rightDateText = separatorIndex === -1 ? '' : inputText.slice(separatorIndex + rangeSeparator.length)
		const isEditingLeftDate = separatorIndex === -1 || cursorPosition <= separatorIndex

		const baseOffset = isEditingLeftDate ? 0 : (separatorIndex + rangeSeparator.length)
		const localCursorPosition = Math.max(0, cursorPosition - baseOffset)
		const localSelectionEndPosition = Math.max(0, selectionEndPosition - baseOffset)

		const currentDateText = isEditingLeftDate ? leftDateText : rightDateText
		const updateDateValue = (updatedDateText: string, newLocalCursorPosition: number) => {
			isOverwriteEditing.value = true
			const newInputText = isEditingLeftDate
				? `${updatedDateText}${rangeSeparator}${rightDateText}`
				: `${leftDateText}${rangeSeparator}${updatedDateText}`
			inputValue.value = newInputText
			const absoluteCursorPosition = baseOffset + newLocalCursorPosition
			requestAnimationFrame(() => {
				setInputSelectionRange(inputElement, absoluteCursorPosition)
				isOverwriteEditing.value = false
			})
		}

		if (keyboardEvent.key === 'Backspace') {
			keyboardEvent.preventDefault()
			if (localCursorPosition !== localSelectionEndPosition) {
				const updatedDateText = overwriteSelection(
					currentDateText,
					dateFormat,
					localCursorPosition,
					localSelectionEndPosition,
					() => '_',
				)
				updateDateValue(updatedDateText, localCursorPosition)
				return
			}
			const newCursorPosition = prevEditableIndex(dateFormat, localCursorPosition)
			if (newCursorPosition >= 0) {
				const updatedDateText = overwriteAt(currentDateText, newCursorPosition, '_')
				updateDateValue(updatedDateText, newCursorPosition)
			}
			return
		}

		if (isDigitKey(keyboardEvent)) {
			keyboardEvent.preventDefault()
			if (localCursorPosition !== localSelectionEndPosition) {
				let updatedDateText = overwriteSelection(
					currentDateText,
					dateFormat,
					localCursorPosition,
					localSelectionEndPosition,
					() => '_',
				)
				if (!isSeparator(dateFormat[localCursorPosition])) {
					updatedDateText = overwriteAt(updatedDateText, localCursorPosition, keyboardEvent.key)
				}
				const nextCursorPosition = nextEditableIndex(dateFormat, localCursorPosition + 1)
				updateDateValue(updatedDateText, nextCursorPosition)
				return
			}

			let editPosition = localCursorPosition
			if (isSeparator(dateFormat[editPosition])) {
				editPosition = nextEditableIndex(dateFormat, editPosition)
			}
			if (editPosition < currentDateText.length) {
				const updatedDateText = overwriteAt(currentDateText, editPosition, keyboardEvent.key)
				const nextCursorPosition = nextEditableIndex(dateFormat, editPosition + 1)
				updateDateValue(updatedDateText, nextCursorPosition)
			}
			else if (isEditingLeftDate && separatorIndex !== -1) {
				const rightStartPosition = nextEditableIndex(dateFormat, 0)
				const updatedRightDateText = overwriteAt(rightDateText, rightStartPosition, keyboardEvent.key)
				const nextCursorPosition = nextEditableIndex(dateFormat, rightStartPosition + 1)

				isOverwriteEditing.value = true
				inputValue.value = `${leftDateText}${rangeSeparator}${updatedRightDateText}`
				requestAnimationFrame(() => {
					const absoluteCursorPosition = separatorIndex + rangeSeparator.length + nextCursorPosition
					setInputSelectionRange(inputElement, absoluteCursorPosition)
					isOverwriteEditing.value = false
				})
			}
			return
		}

		if (keyboardEvent.key.length === 1) keyboardEvent.preventDefault()
	}

	/**
	 * =====================
	 * Small helpers to DRY (Don't Repeat Yourself 🥸) logic
	 * =====================
	 */
	const { clampIfNeeded, validateManualInput, validateOnSubmit, reset } = useDateTextField({
		autoClamp: computed(() => props.autoClamp),
		isRange,
		displayFormat,
		autoClampDate,
		manualValidation: {
			required: computed(() => props.required),
			disableErrorHandling: computed(() => props.disableErrorHandling),
			customRules: props.customRules ?? [],
			customWarningRules: props.customWarningRules ?? [],
			hasInteracted,
			errors,
			clearValidation,
			validateDateFormat: validateDateFormatForSingleOrRange,
			isDateComplete: (val: string) => isDateComplete(val, displayFormat.value),
			parseDate,
			validateField: safeValidateField,
		},
		submit: {
			isValidating,
			hasInteracted,
			inputValue,
			runRules,
		},
		reset: {
			clearValidation,
			isFocused,
			hasInteracted,
			isDisabled: () => props.disabled,
			fieldKey,
			isFormatting,
			inputValue,
			selectedDates,
			resetState,
			emitModel,
		},
	})

	function toReturnFormat(date: Date): string {
		return formatDate(date, returnFormat.value)
	}

	function emitModel(val: DateModelValue) {
		emit('update:model-value', val)
	}

	async function runRules(value: string): Promise<boolean> {
		clearValidation()

		// Vérifier si la valeur est vide ou est un squelette (ex: "__//____" pour DD/MM/YYYY)
		// Un squelette ne contient que des underscores, des espaces et les séparateurs du format
		const formatSeparators = props.format.replace(/[A-Za-z]/g, '')
		// Créer un pattern qui autorise uniquement underscores, espaces et séparateurs du format
		const allowedChars = ['_', ' ', ...new Set(formatSeparators.split(''))].map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')
		const skeletonPattern = new RegExp(`^[${allowedChars}]+$`)
		const isEmptyOrSkeleton = !value || value.trim() === '' || skeletonPattern.test(value)

		if (isEmptyOrSkeleton) {
			if (required.value && hasInteracted.value && !readonly.value && !props.disableErrorHandling) {
				errors.value.push(locales.required)
				return false
			}
			// Permettre aux custom rules de s'exécuter même sur des champs vides
			// Mais seulement si l'utilisateur a interagi avec le champ
			if (props.customRules && props.customRules.length > 0 && hasInteracted.value) {
				// Exécuter les custom rules sur la valeur vide
				await safeValidateField(null, computed(() => props.customRules).value, computed(() => props.customWarningRules).value)
				return !hasError.value
			}
			return true
		}

		if (isRange.value && value.includes(locales.rangeSeparator)) {
			const [startDateText, endDateText] = value.split(locales.rangeSeparator)
			if (startDateText && !endDateText) return !!(await validateManualInput(startDateText))

			if (startDateText && endDateText) {
				const formatValidationResult = validateDateFormatForSingleOrRange(value)
				if (!formatValidationResult.isValid) {
					if (!props.disableErrorHandling && formatValidationResult.message) errors.value.push(formatValidationResult.message)
					return false
				}
				const startDate = parseDate(startDateText, displayFormat.value)
				const endDate = parseDate(endDateText, displayFormat.value)
				if (startDate && endDate) {
					// Vérifier que la plage est valide avant d'appliquer les règles personnalisées
					if (!isValidRange(startDate, endDate) && !props.disableErrorHandling) {
						errors.value.push(locales.endBeforeStart)
						return false
					}
					await safeValidateField(startDate, computed(() => props.customRules).value, computed(() => props.customWarningRules).value)
					if (errors.value.length === 0) await safeValidateField(endDate, computed(() => props.customRules).value, computed(() => props.customWarningRules).value)
				}
			}
			return !hasError.value
		}

		return !!(await validateManualInput(value))
	}

	/**
	 * =====================
	 * Handlers (routeurs)
	 * =====================
	 */
	function handleKeydown(evt: KeyboardEvent) {
		if (props.readonly) return
		if (!getEventInputElement(evt)) return

		const inputEvent = evt as KeyboardEvent & { target: HTMLInputElement }

		if (isRange.value) {
			handleRangeDateKeyboardInput(inputEvent)
		}
		else {
			handleSingleDateKeyboardInput(inputEvent)
		}
	}

	function handlePaste(evt: ClipboardEvent) {
		if (props.readonly) return

		if (isRange.value) handlePasteRange(evt)
		else handlePasteSingle(evt)
	}

	function applyAutoClampOnCurrentInput(syncModel = true): boolean {
		if (!props.autoClamp || !inputValue.value) return false

		const clamped = clampIfNeeded(inputValue.value)
		if (clamped === inputValue.value) return false

		inputValue.value = clamped
		if (!syncModel) return true

		// Sync model après clamp uniquement si la valeur a changé.
		isFormatting.value = true
		if (isRange.value) {
			const [startDate, endDate] = parseRangeInput(inputValue.value)
			if (startDate && endDate) emitModel([toReturnFormat(startDate), toReturnFormat(endDate)])
			else if (startDate) emit('date-selected', toReturnFormat(startDate))
		}
		else {
			const parsedDate = parseDate(inputValue.value, displayFormat.value)
			if (parsedDate) emitModel(returnFormat.value !== displayFormat.value ? toReturnFormat(parsedDate) : formatDate(parsedDate, displayFormat.value))
		}

		return true
	}

	async function onFocus(event?: FocusEvent) {
		if (!getEventInputElement(event)) return

		isFocused.value = true
		// Si aucun chiffre n'a été saisi (champ vide ou squelette), bootstrap et place le caret au début
		if (!/\d/.test(inputValue.value || '')) {
			await initializeCursorAtFirstEditablePosition({ focus: false })
		}
		emit('focus')
	}

	async function onBlur(event?: FocusEvent) {
		if (!getEventInputElement(event)) return

		isFocused.value = false
		hasInteracted.value = true

		// Always emit blur event first
		emit('blur')

		if (!props.isValidateOnBlur) return

		// Handle empty input
		if (!inputValue.value || inputValue.value.trim() === '' || !inputValue.value.replace(/[_\s/-]/g, '')) {
			emitModel(null)
			runRules('')
			return
		}

		// Le mode overwrite désactive le clamp pendant la frappe pour préserver le curseur.
		// On l'applique donc avant la validation au blur, sinon une date comme 31/04
		// sort en erreur avant d'atteindre la logique d'autoClamp.
		// isFormatting bloque le watcher inputValue pour éviter une double émission du modèle.
		isFormatting.value = true
		applyAutoClampOnCurrentInput(false)
		isFormatting.value = false

		if (inputValue.value) {
			const formatValidationResult = validateDateFormatForSingleOrRange(inputValue.value)
			const customRulesValidationResult = await safeValidateField(inputValue.value, computed(() => props.customRules).value, computed(() => props.customWarningRules).value)

			if (formatValidationResult.isValid && !customRulesValidationResult.hasError && !isRange.value) {
				const parsedDate = dayjs(inputValue.value, displayFormat.value, true).toDate()
				// Guard isFormatting to prevent the modelValue watcher from
				// rewriting inputValue in reaction to our own emit.
				try {
					isFormatting.value = true
					emitModel(returnFormat.value !== displayFormat.value ? dayjs(parsedDate).format(returnFormat.value) : inputValue.value)
				}
				catch (error) {
					isFormatting.value = false
					throw error
				}
			}
			else if (formatValidationResult.isValid && !customRulesValidationResult.hasError && isRange.value) {
				if (typeof inputValue.value === 'string' && inputValue.value.includes(locales.rangeSeparator)) {
					const dateRangeParts = inputValue.value.split(locales.rangeSeparator)
					if (dateRangeParts.length === 2) {
						const sd = dayjs(dateRangeParts[0]!, displayFormat.value, true)
						const ed = dayjs(dateRangeParts[1]!, displayFormat.value, true)
						// Guard isFormatting to prevent the modelValue watcher from
						// rewriting inputValue in reaction to our own emit.
						try {
							isFormatting.value = true
							if (sd.isValid() && ed.isValid()) {
								const emittedRange: [string, string] = [
									returnFormat.value !== displayFormat.value ? sd.format(returnFormat.value) : dateRangeParts[0]!,
									returnFormat.value !== displayFormat.value ? ed.format(returnFormat.value) : dateRangeParts[1]!,
								]
								emitModel(emittedRange)
							}
							else {
								emitModel([dateRangeParts[0]!, dateRangeParts[1]!])
							}
						}
						catch (error) {
							isFormatting.value = false
							throw error
						}
					}
					else emitModel(inputValue.value)
				}
				else emitModel(inputValue.value)
			}
			else {
				// Format invalide ou règles custom en erreur : runRules appelle validateManualInput
				// qui pousse déjà le message de format — ne pas pousser formatValidationResult.message
				// en plus pour éviter les doublons dans errors.value.
				// Keep the invalid input visible so the user can correct it.
				// Do NOT emit null — that would trigger the modelValue watcher
				// which clears inputValue and hides the error message.
				runRules(inputValue.value)
				return
			}
		}

		runRules(inputValue.value)

		// Release isFormatting after the current microtask so that
		// the modelValue watcher (triggered synchronously by emitModel)
		// stays blocked, but future external changes are allowed.
		try {
			await nextTick()
		}
		finally {
			isFormatting.value = false
		}
	}
	watch(inputValue, async (nv, ov) => {
		if (props.disabled) {
			const isEmpty = !nv || nv.trim() === '' || /^[_/\-.\s]+$/.test(nv)

			if (isEmpty && ov && props.modelValue) {
				isFormatting.value = true

				const mv = props.modelValue

				// --- RANGE ---
				if (isRange.value && Array.isArray(mv) && mv.length === 2) {
					const [start, end] = mv
					const sd = parseDate(start, returnFormat.value)
					const ed = parseDate(end, returnFormat.value)

					if (sd && ed) {
						initializeWithDates(sd, ed)
						selectedDates.value = [sd, ed]
						inputValue.value = formatRangeForDisplay(sd, ed)
						runRules(inputValue.value)
					}
				}

				// --- SINGLE ---
				else {
					const raw = typeof mv === 'string' ? mv : ''
					const parsed = dayjs(raw, displayFormat.value, true)

					if (parsed.isValid()) {
						inputValue.value = parsed.format(displayFormat.value)
						runRules(inputValue.value)
					}
					else {
						inputValue.value = raw
						runRules(raw)
					}
				}

				isFormatting.value = false
			}

			return
		}

		// Prevent infinite loops but allow formatting
		if (isFormatting.value || nv === ov || isHandlingBackspace.value || isBootstrapping.value) return
		try {
			isFormatting.value = true

			if (!nv || nv.trim() === '' || nv.match(/^[_/\-.\s]+$/)) {
				emitModel(null)
				runRules('')
				if (isRange.value) {
					resetState()
					selectedDates.value = null
				}
				return
			}

			// clamp while typing → désactivé pendant overwrite pour éviter les sauts de curseur
			if (props.autoClamp && !isOverwriteEditing.value) {
				const clamped = clampIfNeeded(nv)
				if (clamped !== nv) {
					nv = clamped
					inputValue.value = clamped
					if (isRange.value) {
						const [startDate, endDate] = parseRangeInput(clamped)
						if (startDate && endDate) emitModel([toReturnFormat(startDate), toReturnFormat(endDate)])
						else if (startDate) emitModel(toReturnFormat(startDate))
					}
					else {
						const parsedDate = parseDate(clamped, displayFormat.value)
						if (parsedDate) emitModel(returnFormat.value !== displayFormat.value ? toReturnFormat(parsedDate) : formatDate(parsedDate, displayFormat.value))
					}
				}
			}

			const inputEl = getNativeInputElement()
			const cursor = inputEl?.selectionStart ?? 0

			if (isRange.value) {
				// --- Branche RANGE ---
				if (isOverwriteEditing.value) {
					const [sd, ed] = parseRangeInput(inputValue.value)
					if (sd && ed) {
						if (!isValidRange(sd, ed)) {
							clearValidation()
							errors.value.push(locales.endBeforeStart)
						}
						else {
							const rf = returnFormat.value
							emitModel([formatDate(sd, rf), formatDate(ed, rf)])
							runRules(inputValue.value)
						}
					}
					else if (sd) {
						emit('date-selected', formatDate(sd, returnFormat.value))
						clearValidation()
					}
					else {
						clearValidation()
					}
					return
				}

				if (typeof nv !== 'string') return
				let formatted = ''
				if (nv.includes(locales.rangeSeparator)) {
					const [startDateText, endDateText = ''] = nv.split(locales.rangeSeparator)
					const formattedStartDate = startDateText ? formatDateInput(startDateText).formatted : ''
					const formattedEndDate = endDateText ? formatDateInput(endDateText).formatted : ''
					formatted = `${formattedStartDate}${locales.rangeSeparator}${formattedEndDate}`
				}
				else {
					formatted = formatDateInput(nv).formatted
				}

				const result = !ov ? handleRangeInput('', formatted) : handleRangeInput(ov, formatted, cursor)
				inputValue.value = result.formattedValue

				if (result.dates[0]) {
					selectedDates.value = result.dates
					try {
						isUpdatingFromInternal.value = true
						;(bridgeValidation).validateDates()
					}
					finally {
						queueMicrotask(() => (isUpdatingFromInternal.value = false))
					}

					if (result.isComplete && result.dates[1]) {
						const [sd, ed] = result.dates
						if (!isValidRange(sd, ed)) errors.value.push(locales.endBeforeStart)
					}
					else if (result.justCompletedFirstDate) {
						emit('date-selected', toReturnFormat(result.dates[0]))
					}
				}
				else {
					selectedDates.value = null
					if (props.modelValue !== null) emitModel(null)
				}

				emit('input', result.formattedValue)
				if (result.cursorPosition !== undefined && !isHandlingBackspace.value) {
					queueMicrotask(() => setInputSelectionRange(inputEl, result.cursorPosition!))
				}
			}
			else {
				if (isOverwriteEditing.value) {
					const formatted = inputValue.value
					const complete = formatted && !formatted.includes('_')
					if (complete) {
						const formatValidationResult = validateDateFormatForSingleOrRange(formatted)
						if (formatValidationResult.isValid) {
							const parsedDate = parseDate(formatted, displayFormat.value)
							if (parsedDate) {
								const formattedDateOutput = returnFormat.value !== displayFormat.value
									? formatDate(parsedDate, returnFormat.value)
									: formatDate(parsedDate, displayFormat.value)
								await nextTick()
								emitModel(formattedDateOutput)
								emit('date-selected', formattedDateOutput)
							}
						}
						runRules(formatted)
					}
					else {
						clearValidation()
					}
					return
				}
				const { formatted, cursorPos } = formatDateInput(nv, cursor)
				if (formatted !== nv) {
					inputValue.value = formatted
					if (!isHandlingBackspace.value) {
						await nextTick()
						setInputSelectionRange(inputEl, cursorPos)
					}
				}

				// Only emit model value for complete dates
				const complete = !formatted.includes('_')
				if (complete) {
					const formatValidationResult = validateDateFormatForSingleOrRange(formatted)
					if (formatValidationResult.isValid) {
						const isDateValid = dayjs(formatted, displayFormat.value, true).isValid()
						if (isDateValid) {
							const parsedDate = dayjs(formatted, displayFormat.value).toDate()
							const formattedDateOutput = dateFormatReturn.value ? dayjs(parsedDate).format(returnFormat.value) : formatted
							await nextTick()
							emitModel(formattedDateOutput)
							emit('date-selected', formattedDateOutput)
						}
					}
					runRules(formatted)
				}
				else {
					// For incomplete dates, clear validation but don't emit model value
					clearValidation()
				}
			}
		}
		finally {
			await nextTick()
			isFormatting.value = false
		}
	})

	watch(() => props.modelValue, (nv) => {
		if (isFormatting.value) return
		if (!nv) {
			inputValue.value = ''
			return
		}

		if (isRange.value && Array.isArray(nv)) {
			const arr = nv as string[]
			if (arr.length === 2) {
				const [sa, ea] = arr
				const sd = parseDate(sa, returnFormat.value)
				const ed = parseDate(ea, returnFormat.value)
				if (sd && ed) {
					initializeWithDates(sd, ed)
					selectedDates.value = [sd, ed]
					try {
						isUpdatingFromInternal.value = true
						;(bridgeValidation).validateDates()
					}
					finally { queueMicrotask(() => (isUpdatingFromInternal.value = false)) }
					inputValue.value = formatRangeForDisplay(sd, ed)
					runRules(inputValue.value)
				}
			}
			else if (arr.length === 1 && arr[0]) {
				const sd = parseDate(arr[0], returnFormat.value)
				if (sd) {
					initializeWithDates(sd, null)
					selectedDates.value = [sd]
					inputValue.value = formatRangeForDisplay(sd, null)
				}
			}
		}
		else {
			const s = typeof nv === 'string' ? nv : ''
			// Try parsing with returnFormat first (as that's how we emit dates)
			// Then fallback to displayFormat for backward compatibility
			let d = dayjs(s, returnFormat.value, true).isValid() ? dayjs(s, returnFormat.value).toDate() : null
			if (!d && returnFormat.value !== displayFormat.value) {
				d = dayjs(s, displayFormat.value, true).isValid() ? dayjs(s, displayFormat.value).toDate() : null
			}
			if (d) {
				// Just update the display - don't emit here to avoid loops
				// The parent is responsible for providing the value in the correct format
				inputValue.value = dayjs(d).format(displayFormat.value)
				runRules(inputValue.value)
			}
			else {
				inputValue.value = s
				runRules(s)
			}
		}
	})

	/** expose */
	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit, clearValidation, reset)

	defineExpose({
		validateOnSubmit,
		reset,
		errors: readonlyState(errorMessages),
		warnings: readonlyState(warningMessages),
		successes: readonlyState(successMessages),
		focus() {
			const el = getNativeInputElement()
			el?.focus({ preventScroll: true })
		},
		blur() {
			const el = getNativeInputElement()
			el?.blur()
		},
	})

	onMounted(async () => {
		// Initialisation depuis le modelValue s'il existe
		if (props.modelValue) {
			if (isRange.value && Array.isArray(props.modelValue) && props.modelValue.length === 2) {
				const [startDateString, endDateString] = props.modelValue
				const startDate = parseDate(startDateString, returnFormat.value)
				const endDate = parseDate(endDateString, returnFormat.value)
				if (startDate && endDate) {
					selectedDates.value = [startDate, endDate]
					inputValue.value = `${formatDate(startDate, displayFormat.value)}${locales.rangeSeparator}${formatDate(endDate, displayFormat.value)}`
				}
			}
			else {
				const dateString = typeof props.modelValue === 'string' ? props.modelValue : ''
				const parsedDate = dayjs(dateString, displayFormat.value, true).isValid()
					? dayjs(dateString, displayFormat.value).toDate()
					: null
				inputValue.value = parsedDate ? dayjs(parsedDate).format(displayFormat.value) : dateString
			}
		}

		// Don't initialize skeleton on mount - let the native placeholder show
		// Only initialize cursor position when user focuses on the input
	})

	/**
	 * =====================
	 * UI state helpers
	 * =====================
	 */
	const isOnError = computed(() => warningMessages.value.length === 0 && successMessages.value.length === 0 && errorMessages.value.length > 0)
	const isOnWarning = computed(() => errorMessages.value.length === 0 && successMessages.value.length === 0 && warningMessages.value.length > 0)
	const isOnSuccess = bridgeValidation.validation.hasSuccess

	// Props regroupées pour SyTextField
	const syTextFieldProps = computed(() => useSyTextFieldProps(props, errorMessages, warningMessages, successMessages, isOnSuccess, ariaLabel.value))
</script>

<template>
	<div class="date-text-input">
		<SyTextField
			ref="inputRef"
			v-model="inputValue"
			:class="{
				'error-field': isOnError,
				'warning-field': isOnWarning,
				'success-field': isOnSuccess,
			}"
			color="primary"
			v-bind="syTextFieldProps"
			:aria-describedby="formatDescriptionId"
			@focus="onFocus"
			@blur="onBlur"
			@keydown="handleKeydown"
			@paste="handlePaste"
			@prepend-icon-click="emit('prepend-icon-click', $event)"
			@append-icon-click="emit('append-icon-click', $event)"
		/>
		<div
			:id="formatDescriptionId"
			class="d-sr-only"
		>
			{{ locales.formatHint }} {{ displayFormat }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
:deep(.v-icon__svg) { cursor: default; }

.warning-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-warning)) !important;

		.v-field__outline {
			color: rgb(var(--v-theme-warning)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-warning)) !important;
		}
	}
}

.error-field {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-error)) !important;
	}

	.v-field--active & {
		color: rgb(var(--v-theme-error)) !important;
	}
}

.success-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;

		.v-field__outline {
			color: rgb(var(--v-theme-onSuccessVariant)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-onSuccessVariant)) !important;
		}
	}
}
</style>
