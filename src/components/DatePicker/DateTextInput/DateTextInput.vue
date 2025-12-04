<script setup lang="ts">
	import {
		useDateRangeInput,
		useDateRangeValidation,
		useDateFormatValidation,
		useDateValidation,
		useDateInputEditing,
		useManualDateValidation,
		useDateAutoClamp,
	} from '../composables'
	import { ref, computed, watch, nextTick, onMounted, toRefs } from 'vue'
	import SyTextField from '../../Customs/SyTextField/SyTextField.vue'
	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import { useValidation, type ValidationRule, type ValidationResult } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import { DATE_PICKER_MESSAGES } from '../constants/messages'
	import type { DateValue } from '@/composables/date/useDateInitializationDayjs'
	import type { DateObjectValue } from '../types'

	dayjs.extend(customParseFormat)

	/**
	 * =====================
	 * Props / Emits
	 * =====================
	 */
	const props = withDefaults(defineProps<{
		modelValue?: DateValue
		placeholder?: string
		format?: string
		dateFormatReturn?: string
		label?: string
		required?: boolean
		disabled?: boolean
		readonly?: boolean
		title?: string | false
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
		isValidateOnBlur?: boolean
		density?: 'default' | 'comfortable' | 'compact'
		hint?: string
		persistentHint?: boolean
		externalErrorMessages?: string[]
	}>(), {
		modelValue: undefined,
		placeholder: DATE_PICKER_MESSAGES.PLACEHOLDER_DEFAULT,
		format: DATE_PICKER_MESSAGES.FORMAT_DEFAULT,
		dateFormatReturn: undefined,
		label: undefined,
		required: false,
		disabled: false,
		readonly: false,
		title: false,
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
		isValidateOnBlur: true,
		density: 'default',
		hint: undefined,
		persistentHint: false,
		externalErrorMessages: () => [],
	})

	const emit = defineEmits<{
		(e: 'update:model-value', value: DateValue): void
		(e: 'focus'): void
		(e: 'blur'): void
		(e: 'input', value: string): void
		(e: 'date-selected', value: DateValue): void
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
	 * Validation setup (safe wrapper for readonly)
	 * =====================
	 */
	const validationApi = !readonly.value
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
			validateField: () => ({
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: { errors: [], warnings: [], successes: [] },
			} as ValidationResult),
		}

	const { errors, warnings, successes, hasError, clearValidation, validateField } = validationApi

	// Agrégation des erreurs internes et externes
	const errorMessages = computed(() => [...errors.value, ...props.externalErrorMessages])
	const warningMessages = warnings
	const successMessages = successes

	/**
	 * Safe validate utility
	 */
	const safeValidateField = (
		value: unknown,
		rules?: ValidationRule[],
		warningRules?: ValidationRule[],
	): ValidationResult => {
		if (readonly.value) {
			return { hasError: false, hasWarning: false, hasSuccess: false, state: { errors: [], warnings: [], successes: [] } }
		}
		return validateField(value, rules, warningRules) ?? { hasError: false, hasWarning: false, hasSuccess: false, state: { errors: [], warnings: [], successes: [] } }
	}

	/**
	 * =====================
	 * Range input + validations
	 * =====================
	 */
	const selectedDates = ref<DateObjectValue>(null)
	const {
		handleRangeInput,
		resetState,
		isValidRange,
		initializeWithDates,
		formatRangeForDisplay,
		parseRangeInput,
		handlePaste: handlePasteRange,
	} = useDateRangeInput(displayFormat.value, isRange.value, parseDate, formatDate)

	const { currentRangeIsValid, getRangeValidationError } = useDateRangeValidation(selectedDates, isRange.value)

	/**
	 * =====================
	 * Format + manual validation
	 * =====================
	 */
	const isUpdatingFromInternal = ref(false)
	const isFocused = ref(false)
	const hasInteracted = ref(false)
	const ariaLabel = ref('')

	const { validateDateFormat: _validateDateFormat } = useDateFormatValidation({
		format: displayFormat.value,
		dateFormatReturn: dateFormatReturn.value,
		required: required.value,
		hasInteracted,
		disableErrorHandling: props.disableErrorHandling,
	})

	function validateDateFormatForSingleOrRange(input: string): { isValid: boolean, message: string } {
		if (readonly.value) return { isValid: true, message: '' }
		if (isRange.value && input.includes(' - ')) {
			const [start = '', end = ''] = input.split(' - ').map(s => s?.trim() ?? '')
			const startDateFormatValidation = _validateDateFormat(start)
			const endDateFormatValidation = end ? _validateDateFormat(end) : { isValid: true, message: '' }
			if (startDateFormatValidation.isValid && endDateFormatValidation.isValid) return { isValid: true, message: '' }
			if (!startDateFormatValidation.isValid) return { isValid: false, message: `${DATE_PICKER_MESSAGES.ERROR_INVALID_FORMAT_START} (${displayFormat.value})` }
			return { isValid: false, message: `${DATE_PICKER_MESSAGES.ERROR_INVALID_FORMAT_END} (${displayFormat.value})` }
		}
		return _validateDateFormat(input)
	}

	const inputValue = ref('')
	const inputRef = ref<InstanceType<typeof SyTextField> | null>(null)
	const isFormatting = ref(false)
	// Force re-render of SyTextField when needed (e.g., after reset)
	const fieldKey = ref(0)

	const updateDisplayValue = (dateDisplayText: string) => (inputValue.value = dateDisplayText)
	const updateAriaLabel = (ariaLabelText: string) => (ariaLabel.value = ariaLabelText)

	const { formatDateInput, handlePaste: handlePasteSingle, isHandlingBackspace } = useDateInputEditing({
		format: displayFormat.value,
		updateDisplayValue,
		updateAriaLabel,
		accessiblePlaceholders: true,
	})

	const { validateManualInput } = useManualDateValidation({
		format: displayFormat.value,
		required: required.value,
		disableErrorHandling: props.disableErrorHandling,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		customRules: props.customRules as any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		customWarningRules: props.customWarningRules as any,
		hasInteracted,
		errors,
		clearValidation,
		validateDateFormat: validateDateFormatForSingleOrRange,
		isDateComplete: (val: string) => val.length >= displayFormat.value.length,
		parseDate,
		validateField: safeValidateField,
	})

	/**
	 * =====================
	 * Overwrite editing (nouvelle logique)
	 * =====================
	 */
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

	/**
	 * =====================
	 * Bootstrapping caret (DEBUT DE L'INPUT)
	 * =====================
	 */
	const isBootstrapping = ref(false)

	async function initializeCursorAtFirstEditablePosition(options: { focus?: boolean } = {}) {
		const inputElement: HTMLInputElement | null | undefined
			= inputRef.value?.$el?.querySelector?.('input:not([type="hidden"])')
		if (!inputElement) return

		isBootstrapping.value = true

		// Only inject skeleton when focused, not on initial load
		if (!inputValue.value && options.focus) {
			inputValue.value = isRange.value
				? `${skeletonFromFormat(displayFormat.value)} - ${skeletonFromFormat(displayFormat.value)}`
				: skeletonFromFormat(displayFormat.value)
		}

		await nextTick()
		if (options.focus) inputElement.focus({ preventScroll: true })

		const cursorPosition = nextEditableIndex(displayFormat.value, 0)
		// double rAF pour laisser Vuetify finir ses mises à jour
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				inputElement.setSelectionRange(cursorPosition, cursorPosition)
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
				inputElement.setSelectionRange(nextCursorPosition, nextCursorPosition)
				isOverwriteEditing.value = false
			})
			return
		}

		// Bootstrap si vide (mais sans consommer un chiffre)
		if (!inputElement.value && keyboardEvent.key !== 'Backspace') {
			inputValue.value = skeletonFromFormat(displayFormat.value)
			requestAnimationFrame(() => {
				const startPosition = nextEditableIndex(displayFormat.value, 0)
				inputElement.setSelectionRange(startPosition, startPosition)
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
					inputElement.setSelectionRange(selectionStart, selectionStart)
					isOverwriteEditing.value = false
				})
				return
			}
			const newCursorPosition = prevEditableIndex(displayFormat.value, selectionStart)
			if (newCursorPosition >= 0) {
				const updatedInputValue = overwriteAt(inputElement.value, newCursorPosition, '_')
				inputValue.value = updatedInputValue
				requestAnimationFrame(() => {
					inputElement.setSelectionRange(newCursorPosition, newCursorPosition)
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
					inputElement.setSelectionRange(nextCursorPosition, nextCursorPosition)
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
					inputElement.setSelectionRange(nextCursorPosition, nextCursorPosition)
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
		const rangeSeparator = ' - '

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
				inputElement.setSelectionRange(nextCursorPosition, nextCursorPosition)
				isOverwriteEditing.value = false
			})
			return
		}

		if (!inputElement.value && keyboardEvent.key !== 'Backspace') {
			inputValue.value = `${skeletonFromFormat(dateFormat)}${rangeSeparator}${skeletonFromFormat(dateFormat)}`
			requestAnimationFrame(() => {
				const startPosition = nextEditableIndex(dateFormat, 0)
				inputElement.setSelectionRange(startPosition, startPosition)
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
				inputElement.setSelectionRange(absoluteCursorPosition, absoluteCursorPosition)
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
			return
		}

		if (keyboardEvent.key.length === 1) keyboardEvent.preventDefault()
	}

	/**
	 * =====================
	 * Small helpers to DRY (Don't Repeat Yourself 🥸) logic
	 * =====================
	 */
	function clampIfNeeded(raw: string): string {
		if (!props.autoClamp || !raw) return raw
		if (isRange.value && raw.includes(' - ')) {
			const [rawStartDate = '', rawEndDate = ''] = raw.split(' - ').map(dateText => dateText.trim())
			const startDateValidation = rawStartDate ? autoClampDate(rawStartDate, displayFormat.value) : { adjusted: false, clampedDate: rawStartDate }
			const endDateValidation = rawEndDate ? autoClampDate(rawEndDate, displayFormat.value) : { adjusted: false, clampedDate: rawEndDate }
			const formattedStartDate = startDateValidation.clampedDate || ''
			const formattedEndDate = endDateValidation.clampedDate || ''
			return formattedEndDate ? `${formattedStartDate} - ${formattedEndDate}` : formattedStartDate
		}
		const dateValidationResult = autoClampDate(raw, displayFormat.value)
		return dateValidationResult.clampedDate
	}

	function toReturnFormat(date: Date): string {
		return formatDate(date, returnFormat.value)
	}

	function emitModel(val: DateValue) {
		emit('update:model-value', val)
	}

	function runRules(value: string): boolean {
		clearValidation()
		if (!value) {
			if (required.value && hasInteracted.value && !readonly.value && !props.disableErrorHandling) {
				errors.value.push(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
				return false
			}
			// Permettre aux custom rules de s'exécuter même sur des champs vides
			// Mais seulement si l'utilisateur a interagi avec le champ
			if (props.customRules && props.customRules.length > 0 && hasInteracted.value) {
				// Exécuter les custom rules sur la valeur vide
				safeValidateField(null, computed(() => props.customRules).value, computed(() => props.customWarningRules).value)
				return !hasError.value
			}
			return true
		}

		if (isRange.value && value.includes(' - ')) {
			const [startDateText, endDateText] = value.split(' - ')
			if (startDateText && !endDateText) return !!validateManualInput(startDateText)

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
						errors.value.push(DATE_PICKER_MESSAGES.ERROR_END_BEFORE_START)
						return false
					}
					safeValidateField(startDate, computed(() => props.customRules).value, computed(() => props.customWarningRules).value)
					if (errors.value.length === 0) safeValidateField(endDate, computed(() => props.customRules).value, computed(() => props.customWarningRules).value)
				}
			}
			return !hasError.value
		}

		return !!validateManualInput(value)
	}

	/**
	 * =====================
	 * Handlers (routeurs)
	 * =====================
	 */
	function handleKeydown(evt: KeyboardEvent & { target: HTMLInputElement }) {
		if (props.readonly) return

		if (isRange.value) {
			handleRangeDateKeyboardInput(evt)
		}
		else {
			handleSingleDateKeyboardInput(evt)
		}
	}

	function handlePaste(evt: ClipboardEvent) {
		if (props.readonly) return

		if (isRange.value) handlePasteRange(evt)
		else handlePasteSingle(evt)
	}

	async function onFocus() {
		isFocused.value = true
		// Si aucun chiffre n'a été saisi (champ vide ou squelette), bootstrap et place le caret au début
		if (!/\d/.test(inputValue.value || '')) {
			await initializeCursorAtFirstEditablePosition({ focus: false })
		}
		emit('focus')
	}

	function onBlur() {
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

		if (inputValue.value) {
			const formatValidationResult = validateDateFormatForSingleOrRange(inputValue.value)
			const customRulesValidationResult = safeValidateField(inputValue.value, computed(() => props.customRules).value, computed(() => props.customWarningRules).value)

			if (formatValidationResult.isValid && !customRulesValidationResult.hasError && !isRange.value) {
				const parsedDate = dayjs(inputValue.value, displayFormat.value, true).toDate()
				emitModel(returnFormat.value !== displayFormat.value ? dayjs(parsedDate).format(returnFormat.value) : inputValue.value)
			}
			else if (formatValidationResult.isValid && !customRulesValidationResult.hasError && isRange.value) {
				if (typeof inputValue.value === 'string' && inputValue.value.includes(' - ')) {
					const dateRangeParts = inputValue.value.split(' - ')
					if (dateRangeParts.length === 2) emitModel([dateRangeParts[0], dateRangeParts[1]])
					else emitModel(inputValue.value)
				}
				else emitModel(inputValue.value)
			}
			else {
				runRules(inputValue.value)
				if (!props.disableErrorHandling && formatValidationResult.message) errors.value.push(formatValidationResult.message)
				// Only emit null for format errors, not for custom rule errors
				if (!formatValidationResult.isValid) {
					emitModel(null)
				}
				// For custom rule errors with valid format, keep the current value
			}
		}

		// autoClamp au blur
		if (props.autoClamp) inputValue.value = clampIfNeeded(inputValue.value)

		// Sync model après clamp
		if (isRange.value) {
			const [startDate, endDate] = parseRangeInput(inputValue.value)
			if (startDate && endDate) emitModel([toReturnFormat(startDate), toReturnFormat(endDate)])
			else if (startDate) emit('date-selected', toReturnFormat(startDate))
		}
		else {
			const parsedDate = parseDate(inputValue.value, displayFormat.value)
			if (parsedDate) emitModel(returnFormat.value !== displayFormat.value ? toReturnFormat(parsedDate) : formatDate(parsedDate, displayFormat.value))
		}

		runRules(inputValue.value)
	}

	/**
	 * =====================
	 * Watchers
	 * =====================
	 */
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

			const inputEl: HTMLInputElement | undefined = inputRef.value?.$el?.querySelector?.('input')
			const cursor = inputEl?.selectionStart ?? 0

			if (isRange.value) {
				// --- Branche RANGE ---
				if (isOverwriteEditing.value) {
					const [sd, ed] = parseRangeInput(inputValue.value)
					if (sd && ed) {
						if (!isValidRange(sd, ed)) {
							clearValidation()
							errors.value.push(DATE_PICKER_MESSAGES.ERROR_END_BEFORE_START)
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
				if (nv.includes(' - ')) {
					const [startDateText, endDateText = ''] = nv.split(' - ')
					const formattedStartDate = startDateText ? formatDateInput(startDateText).formatted : ''
					const formattedEndDate = endDateText ? formatDateInput(endDateText).formatted : ''
					formatted = `${formattedStartDate} - ${formattedEndDate}`
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
						;(useDateValidation({
							noCalendar: false,
							required: required.value,
							displayRange: isRange.value,
							disableErrorHandling: props.disableErrorHandling,
							customRules: props.customRules,
							customWarningRules: props.customWarningRules,
							selectedDates,
							isUpdatingFromInternal,
							currentRangeIsValid,
							getRangeValidationError,
							clearValidation,
							validateField: safeValidateField,
							errors,
							warnings,
							successes,
						})).validateDates()
					}
					finally {
						setTimeout(() => (isUpdatingFromInternal.value = false), 0)
					}

					if (result.isComplete && result.dates[1]) {
						const [sd, ed] = result.dates
						if (!isValidRange(sd, ed)) errors.value.push(DATE_PICKER_MESSAGES.ERROR_END_BEFORE_START)
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
					setTimeout(() => inputEl?.setSelectionRange(result.cursorPosition!, result.cursorPosition!), 0)
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
						inputEl?.setSelectionRange(cursorPos, cursorPos)
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
						;(useDateValidation({
							noCalendar: false,
							required: required.value,
							displayRange: isRange.value,
							disableErrorHandling: props.disableErrorHandling,
							customRules: props.customRules,
							customWarningRules: props.customWarningRules,
							selectedDates,
							isUpdatingFromInternal,
							currentRangeIsValid,
							getRangeValidationError,
							clearValidation,
							validateField: safeValidateField,
							errors,
							warnings,
							successes,
						})).validateDates()
					}
					finally { setTimeout(() => (isUpdatingFromInternal.value = false), 0) }
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
			const d = dayjs(s, displayFormat.value, true).isValid() ? dayjs(s, displayFormat.value).toDate() : null
			if (d) {
				if (returnFormat.value !== displayFormat.value) emitModel(dayjs(d).format(returnFormat.value))
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
	const isValidating = ref(false)
	function validateOnSubmit() {
		isValidating.value = true
		hasInteracted.value = true
		const ok = runRules(inputValue.value)
		isValidating.value = false
		return ok
	}

	// Reset hook utilisé par SyForm.reset() via useValidatable
	const reset = () => {
		// 1) Nettoyer l'état de validation et d'interaction
		clearValidation()
		isFocused.value = false
		hasInteracted.value = false

		if (props.disabled) {
			fieldKey.value++
			return
		}

		// 2) Réinitialiser la valeur sans déclencher de validation interactive
		isFormatting.value = true
		inputValue.value = ''
		selectedDates.value = null
		resetState()
		isFormatting.value = false

		// 3) Synchroniser le modèle externe
		emitModel(null)

		// 4) Forcer la recréation du champ pour réinitialiser l'état interne de Vuetify
		fieldKey.value++
	}

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit, clearValidation, reset)

	defineExpose({
		validateOnSubmit,
		reset,
		focus() {
			const el: HTMLInputElement | null | undefined = inputRef.value?.$el?.querySelector?.('input:not([type="hidden"])')
			el?.focus({ preventScroll: true })
		},
		blur() {
			const el: HTMLInputElement | null | undefined = inputRef.value?.$el?.querySelector?.('input:not([type="hidden"])')
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
					inputValue.value = `${formatDate(startDate, displayFormat.value)} - ${formatDate(endDate, displayFormat.value)}`
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
	const isOnSuccess = computed(() => errorMessages.value.length === 0 && warningMessages.value.length === 0 && successMessages.value.length > 0)
	const getIcon = computed(() => {
		if (errorMessages.value.length) return 'error'
		if (warningMessages.value.length) return 'warning'
		if (successMessages.value.length && !warningMessages.value.length) return 'success'
		return undefined
	})
</script>

<template>
	<SyTextField
		:key="fieldKey"
		ref="inputRef"
		v-model="inputValue"
		:append-icon="props.displayIcon && props.displayAppendIcon ? 'calendar' : undefined"
		:append-inner-icon="getIcon"
		:class="{
			'error-field': isOnError,
			'warning-field': isOnWarning,
			'success-field': isOnSuccess,
		}"
		:disabled="props.disabled"
		:error-messages="errorMessages"
		:label="props.label || ''"
		:placeholder="props.placeholder"
		:no-icon="props.noIcon"
		:prepend-icon="props.displayIcon && props.displayPrependIcon && !props.displayAppendIcon ? 'calendar' : undefined"
		:readonly="props.readonly"
		:variant-style="props.isOutlined ? 'outlined' : 'underlined'"
		:warning-messages="warningMessages"
		:success-messages="props.showSuccessMessages ? successMessages : []"
		:bg-color="props.bgColor"
		color="primary"
		:is-clearable="!props.readonly"
		:display-persistent-placeholder="true"
		:aria-label="ariaLabel || props.placeholder"
		:is-validate-on-blur="props.isValidateOnBlur"
		:density="props.density"
		:title="props.title || props.placeholder || undefined"
		:hint="props.hint"
		:persistent-hint="props.persistentHint"
		@focus="onFocus"
		@blur="onBlur"
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
