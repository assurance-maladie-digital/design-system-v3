<script setup lang="ts">
	/**
	 * DateTextInput — Champ de saisie de date avec formatage masqué.
	 *
	 * ## Rôle
	 *
	 * Ce composant est le « moteur de saisie texte » du système DatePicker. Il gère :
	 * - Le **formatage masqué en temps réel** : l'utilisateur tape des chiffres, les séparateurs
	 *   (/, -, espace) sont insérés automatiquement. Le masque (ex: DD/MM/YYYY) est dérivé du
	 *   format d'affichage. Voir `useDateInputEditing` et les handlers overwrite ci-dessous.
	 * - La **validation texte** : format, required, custom rules, range. Déléguée à
	 *   `useDatePickerValidation` en mode `noCalendar: true` (bridge).
	 * - L'**auto-clamp** : si activé, corrige automatiquement les dates invalides (ex: 32/01 → 01/02).
	 * - La **saisie de plages (range)** : deux dates séparées par `locales.rangeSeparator`,
	 *   avec formatage et validation dédiés. Voir `useDateRangeInput`.
	 *
	 * ## Architecture interne
	 *
	 * Le composant utilise deux modes de saisie clavier :
	 * 1. **Mode insertion** (par défaut) : `useDateInputEditing` formate la valeur à chaque frappe
	 *    via un watcher sur `inputValue`. Le curseur est repositionné après formatage.
	 * 2. **Mode overwrite** : Quand le champ est vide ou contient uniquement le squelette (___/___/___),
	 *    les chiffres tapés remplacent les `_` un par un (style OTP/phone). Géré par
	 *    `handleSingleDateKeyboardInput` / `handleRangeDateKeyboardInput`.
	 *
	 * Le flag `isOverwriteEditing` empêche le watcher de re-formater pendant que le handler
	 * clavier gère la frappe en mode overwrite.
	 *
	 * ## Intégration
	 *
	 * DateTextInput est utilisé par :
	 * - `CalendarMode/DatePicker` en mode `noCalendar` (saisie texte seule)
	 * - `ComplexDatePicker` comme champ activateur du calendrier (saisie texte + ouverture calendrier)
	 * - `ComplexDatePicker` en mode `noCalendar` (saisie texte seule)
	 *
	 * ## Patterns clés
	 *
	 * - **Bridge de validation** : `useDatePickerValidation` est appelé avec `noCalendar: true`,
	 *   ce qui active le flow `validateTextInput`. `bridgeValidate({ textValue })` est le point
	 *   d'entrée pour valider la saisie texte. `pushError` permet d'injecter des erreurs locales
	 *   (ex: format invalide) sans passer par le flow complet.
	 *
	 * - **Déduplication des erreurs** : `errorMessages` fusionne les erreurs du bridge et les
	 *   `externalErrorMessages` du parent, avec déduplication via `Set` (évite les doublons
	 *   quand les mêmes customRules sont exécutées par le parent et l'enfant).
	 *
	 * - **Squelette de format** : `skeletonFromFormat` remplace les lettres du format (D,M,Y...)
	 *   par `_`, conservant les séparateurs. Ex: `DD/MM/YYYY` → `__/__/____`.
	 *   Le `skeletonPattern` (RegExp) détecte si la valeur est « visuellement vide » (que des `_`).
	 *
	 * - **Lock de formatage** : `isFormatting` et `withFormattingLock` empêchent le watcher
	 *   `inputValue` de se redéclencher pendant que le composant applique un formatage.
	 */
	import {
		useDateRangeInput,
		useDateInputEditing,
		useDateAutoClamp,
		useDateTextInputController,
		useDatePickerValidation,
		validateDateFormat,
		isDateComplete,
	} from '../composables'
	import { ref, computed, watch, nextTick, readonly as readonlyState, toRefs, useId } from 'vue'
	import SyTextField from '../../Customs/SyTextField/SyTextField.vue'
	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import { buildDateTextInputTextFieldProps } from './props/buildDateTextInputTextFieldProps'
	import { locales } from '../locales'
	import type { DateInput, DateModelValue } from '@/composables/date/useDateInitializationDayjs'
	import type { DateObjectValue, DateTextInputProps, DateTextInputPublicApi } from '../types'
	import DatePickerLiveRegion from '../DatePickerLiveRegion.vue'
	import { resolveDatePickerStateFromModelValue, getRangeValidationError } from '../utils/dateFormattingUtils'

	dayjs.extend(customParseFormat)

	const props = withDefaults(defineProps<DateTextInputProps>(), {
		autoClamp: false,
		bgColor: 'white',
		customSuccessRules: () => [],
		customRules: () => [],
		customWarningRules: () => [],
		dateFormatReturn: undefined,
		density: 'default',
		disableErrorHandling: false,
		disabled: false,
		errorMessages: null,
		hasError: false,
		hasSuccess: false,
		hasWarning: false,
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
		maxErrors: 1,
		modelValue: undefined,
		noIcon: false,
		persistentHint: false,
		placeholder: undefined,
		readonly: false,
		required: false,
		showSuccessMessages: false,
		successMessages: null,
		title: false,
		warningMessages: null,
	})

	const emit = defineEmits<{
		(e: 'update:model-value', value: DateModelValue): void
		(e: 'focus'): void
		(e: 'blur'): void
		(e: 'input', value: string): void
		(e: 'date-selected', value: DateModelValue): void
		(e: 'prepend-icon-click', event: MouseEvent): void
		(e: 'append-icon-click', event: MouseEvent): void
		(e: 'mousedown', event: MouseEvent): void
		(e: 'keydown', event: KeyboardEvent): void
	}>()

	// ─── Flags dérivés & utilitaires de format ────────────────────────
	const { displayRange, format: displayFormat, dateFormatReturn, required, readonly } = toRefs(props)
	const isRange = computed(() => !!displayRange.value)
	const returnFormat = computed(() => dateFormatReturn.value || displayFormat.value)

	const { parseDate, formatDate } = useDateFormat()
	const { autoClampDate } = useDateAutoClamp()

	// ─── Validation bridge (flow texte noCalendar) ───────────────────
	// DateTextInput utilise useDatePickerValidation en mode noCalendar.
	// `bridgeValidate` route vers le flow texte (validateTextInput).
	// `pushError` permet d'injecter des erreurs locales sans le flow complet.
	const selectedDates = ref<DateObjectValue>(null)
	const isUpdatingFromInternal = ref(false)
	const hasInteracted = ref(false)

	// --- Validation bridge ---
	// DateTextInput utilise useDatePickerValidation en mode noCalendar (pas de calendrier).
	// `bridgeValidate` est le point d'entrée unifié qui route vers le flow texte.
	// `pushError` est conservé pour failWithDisplayedError() qui a besoin d'un accès direct
	// pour afficher des erreurs locales (ex: format invalide) sans passer par le flow complet.
	const {
		hasError: bridgeHasError,
		hasWarning: bridgeHasWarning,
		hasSuccess: bridgeHasSuccess,
		errorMessages: bridgedErrorMessages,
		warningMessages: bridgedWarningMessages,
		successMessages: bridgedSuccessMessages,
		clearValidation,
		pushError,
		validate: bridgeValidate,
	} = useDatePickerValidation({
		showSuccessMessages: computed(() => props.showSuccessMessages),
		disableErrorHandling: computed(() => props.disableErrorHandling),
		noCalendar: true,
		required: computed(() => props.required),
		displayRange: computed(() => props.displayRange),
		customRules: computed(() => props.customRules ?? []),
		customSuccessRules: computed(() => props.customSuccessRules ?? []),
		customWarningRules: computed(() => props.customWarningRules ?? []),
		useVuetifyValidation: computed(() => props.useVuetifyValidation ?? false),
		rules: computed(() => props.rules),
		modelValue: computed(() => props.modelValue),
		errorMessages: computed(() => props.errorMessages ?? null),
		hasErrorProp: computed(() => props.hasError),
		hasSuccessProp: computed(() => props.hasSuccess),
		hasWarningProp: computed(() => props.hasWarning),
		warningMessages: computed(() => props.warningMessages ?? null),
		successMessages: computed(() => props.successMessages ?? null),
		maxErrors: computed(() => props.maxErrors),
		selectedDates,
		isUpdatingFromInternal,
		skipValidationWhenReadonly: true,
		readonly: readonly,
		fieldIdentifier: computed(() => props.label || props.placeholder || 'Date'),
		displayFormat: computed(() => displayFormat.value),
		parseDate,
		hasInteracted,
		formRegistration: {
			validateOnSubmit: validateOnSubmitForForm,
			clearValidation: clearValidationForForm,
			reset: resetForForm,
		},
	})

	const warningMessages = computed(() => bridgedWarningMessages.value)
	const successMessages = computed((): string[] =>
		bridgedSuccessMessages.value ?? [],
	)

	// Agrégation des erreurs internes et externes avec déduplication
	// Évite les doublons quand les mêmes customRules sont exécutées par le parent et l'enfant
	const errorMessages = computed(() => {
		const allErrors = [...bridgedErrorMessages.value, ...(props.externalErrorMessages ?? [])]
		return [...new Set(allErrors)] // Déduplication avec Set
	})

	// ─── Saisie de plages (range) ────────────────────────────────────
	// useDateRangeInput gère le parsing, le formatage et la validation des plages.
	// handleRangeInput compare la valeur précédente avec la nouvelle pour déterminer
	// si l'utilisateur édite la date de début ou de fin.
	const {
		handleRangeInput,
		formatRangeForDisplay,
		parseRangeInput,
		handlePaste: handlePasteRange,
	} = useDateRangeInput(displayFormat.value, isRange.value, parseDate, formatDate)

	// ─── Formatage masqué & validation manuelle ──────────────────────
	// isFocused suit l'état de focus pour différencier validation live vs validation blur.
	// isFormatting verrouille le watcher inputValue pendant le formatage automatique.
	// isOverwriteEditing bascule en mode overwrite (remplacement des `_` du squelette).
	const isFocused = ref(false)
	const ariaLabel = ref(props.label || props.placeholder || locales.label)

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
	const pendingSyncedInputValue = ref<string | null>(null)
	// Force re-render of SyTextField when needed (e.g., after reset)
	const fieldKey = ref(0)
	const isValidating = ref(false)
	const formatDescriptionId = `date-format-desc-${useId()}`
	const formatDescription = computed(() => `${locales.formatHint} ${displayFormat.value}`)

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

	// Garde-fou : empêche le watcher inputValue de re-formater pendant que le handler
	// clavier gère la frappe en mode overwrite (remplacement des `_` du squelette).
	const isOverwriteEditing = ref(false)

	// ─── Helpers overwrite : manipulation du squelette de format ──────
	// Ces fonctions gèrent le remplacement caractère par caractère dans le squelette.
	// isSeparator détecte les séparateurs (/, -, espace) à ne pas remplacer.
	// nextEditableIndex / prevEditableIndex trouvent la prochaine position `_` éditable.
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

	// ─── Bootstrap du curseur à la première position éditable ────────
	// À l'obtention du focus, si le champ est vide, on injecte le squelette
	// (___/___/___) et on place le curseur sur le premier `_`. Le double rAF
	// laisse Vuetify terminer ses mises à jour DOM avant de positionner le curseur.
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

	// ─── Handlers clavier overwrite (mode single) ────────────────────
	// Gère la frappe chiffre par chiffre en remplaçant les `_` du squelette.
	// Backspace remet `_` à la position précédente. Les touches non-digit sont bloquées.
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

	// ─── Handlers clavier overwrite (mode range) ─────────────────────
	// Similaire au mode single mais gère deux squelettes séparés par rangeSeparator.
	// Détermine si le curseur est sur la date de début ou de fin, puis applique
	// l'overwrite sur la bonne partie.
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

	// ─── Contrôleur texte (auto-clamp, submit, reset) ───────────────
	// useDateTextInputController centralise :
	// - clampIfNeeded : auto-correction des dates invalides (ex: 32/01 → 01/02)
	// - validateOnSubmit : validation forcée pour la soumission de formulaire
	// - reset : réinitialisation complète du champ (valeur, validation, état)
	const { clampIfNeeded, validateOnSubmit, reset } = useDateTextInputController({
		autoClamp: computed(() => props.autoClamp),
		isRange,
		displayFormat,
		autoClampDate,
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
			emitModel,
		},
	})

	function toReturnFormat(date: Date): string {
		return formatDate(date, returnFormat.value)
	}

	function toModelDateText(date: Date, fallbackDisplayText?: string): string {
		if (returnFormat.value !== displayFormat.value) {
			return toReturnFormat(date)
		}

		return fallbackDisplayText ?? formatDate(date, displayFormat.value)
	}

	function emitSingleModelDate(date: Date, fallbackDisplayText?: string): string {
		const modelDateText = toModelDateText(date, fallbackDisplayText)
		emitModel(modelDateText)
		return modelDateText
	}

	function emitRangeModelDates(
		startDate: Date,
		endDate: Date,
		fallbackDisplayRange?: readonly [string, string],
	): [string, string] {
		const modelDateRange: [string, string] = [
			toModelDateText(startDate, fallbackDisplayRange?.[0]),
			toModelDateText(endDate, fallbackDisplayRange?.[1]),
		]

		emitModel(modelDateRange)
		return modelDateRange
	}

	function emitModel(val: DateModelValue) {
		emit('update:model-value', val)
	}

	function syncFromModelValue(modelValue: DateInput | undefined): string {
		const nextState = resolveDatePickerStateFromModelValue({
			modelValue,
			displayRange: isRange.value,
			displayFormat: displayFormat.value,
			returnFormat: returnFormat.value,
			parseDate,
			formatDate,
			preserveInvalidValue: true,
		})

		if (inputValue.value !== nextState.displayValue) {
			pendingSyncedInputValue.value = nextState.displayValue
		}

		selectedDates.value = nextState.selectedDates
		inputValue.value = nextState.displayValue

		if (isRange.value && Array.isArray(nextState.selectedDates) && nextState.selectedDates.length >= 2) {
			syncSelectedRangeValidation()
		}

		return nextState.displayValue
	}

	function getSkeletonPattern(format: string): RegExp {
		const formatSeparators = format.replace(/[A-Za-z]/g, '')
		const allowedChars = ['_', ' ', ...new Set(formatSeparators.split(''))]
			.map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
			.join('')

		return new RegExp(`^[${allowedChars}]+$`)
	}

	const skeletonPattern = computed(() => getSkeletonPattern(displayFormat.value))

	function failWithDisplayedError(message?: string, options: { replace?: boolean } = {}): false {
		if (!message || props.disableErrorHandling) {
			return false
		}

		if (options.replace) {
			clearValidation()
		}

		pushError(message)
		return false
	}

	async function runRules(value: string): Promise<boolean> {
		// Skeleton input (placeholders like __/__/____) is treated as empty by the bridge
		if (skeletonPattern.value.test(value)) {
			value = ''
		}

		// Délègue au flow texte de validate() via le bridge.
		// Les skeleton inputs (__/__/____) sont traités comme champs vides.
		return await (bridgeValidate({ textValue: value }) as Promise<boolean>)
	}

	function isVisuallyEmptyInput(value: string): boolean {
		return !value || value.trim() === '' || !value.replace(/[_\s/-]/g, '')
	}

	async function withFormattingLock<T>(
		callback: () => Promise<T> | T,
		releaseOnNextTick = false,
	): Promise<T> {
		isFormatting.value = true

		try {
			return await callback()
		}
		finally {
			if (releaseOnNextTick) {
				await nextTick()
			}
			isFormatting.value = false
		}
	}

	function emitBlurRangeModel(value: string): void {
		if (!value.includes(locales.rangeSeparator)) {
			emitModel(value)
			return
		}

		const dateRangeParts = value.split(locales.rangeSeparator)
		if (dateRangeParts.length !== 2) {
			emitModel(value)
			return
		}

		const [startDateText, endDateText] = dateRangeParts
		const startDate = dayjs(startDateText!, displayFormat.value, true)
		const endDate = dayjs(endDateText!, displayFormat.value, true)

		if (startDate.isValid() && endDate.isValid()) {
			emitRangeModelDates(startDate.toDate(), endDate.toDate(), [startDateText!, endDateText!])
			return
		}

		emitModel([startDateText!, endDateText!])
	}

	function emitBlurModel(value: string): void {
		if (isRange.value) {
			emitBlurRangeModel(value)
			return
		}

		const parsedDate = dayjs(value, displayFormat.value, true).toDate()
		emitSingleModelDate(parsedDate, value)
	}

	function isMaskedEmptyInput(value: string): boolean {
		return !value || value.trim() === '' || /^[_/\-.\s]+$/.test(value)
	}

	async function restoreDisabledInputValue(): Promise<void> {
		const modelValue = props.modelValue
		if (!modelValue) return

		await withFormattingLock(async () => {
			if (isRange.value && Array.isArray(modelValue) && modelValue.length === 2) {
				const [startDateText, endDateText] = modelValue
				const startDate = parseDate(startDateText, returnFormat.value)
				const endDate = parseDate(endDateText, returnFormat.value)

				if (startDate && endDate) {
					selectedDates.value = [startDate, endDate]
					inputValue.value = formatRangeForDisplay(startDate, endDate)
					await runRules(inputValue.value)
				}

				return
			}

			const rawValue = typeof modelValue === 'string' ? modelValue : ''
			const parsedDate = dayjs(rawValue, displayFormat.value, true)
			inputValue.value = parsedDate.isValid()
				? parsedDate.format(displayFormat.value)
				: rawValue

			await runRules(inputValue.value)
		})
	}

	async function clearWatchedInputValue(): Promise<boolean> {
		if (!isMaskedEmptyInput(inputValue.value)) {
			return false
		}

		emitModel(null)
		await runRules('')

		if (isRange.value) {
			selectedDates.value = null
		}

		return true
	}

	function applyTypingAutoClamp(value: string): string {
		if (!props.autoClamp || isOverwriteEditing.value) {
			return value
		}

		const clampedValue = clampIfNeeded(value)
		if (clampedValue === value) {
			return value
		}

		inputValue.value = clampedValue

		if (isRange.value) {
			const [startDate, endDate] = parseRangeInput(clampedValue)
			if (startDate && endDate) emitRangeModelDates(startDate, endDate)
			else if (startDate) emitModel(toReturnFormat(startDate))
		}
		else {
			const parsedDate = parseDate(clampedValue, displayFormat.value)
			if (parsedDate) emitSingleModelDate(parsedDate)
		}

		return clampedValue
	}

	async function emitCompletedSingleInput(formattedValue: string, fallbackDisplayText = formattedValue): Promise<void> {
		const formatValidationResult = validateDateFormatForSingleOrRange(formattedValue)
		if (!formatValidationResult.isValid) {
			return
		}

		const parsedDate = parseDate(formattedValue, displayFormat.value)
		if (!parsedDate) {
			return
		}

		const formattedDateOutput = toModelDateText(parsedDate, fallbackDisplayText)
		await nextTick()
		emitModel(formattedDateOutput)
		emit('date-selected', formattedDateOutput)
	}

	async function handleRangeOverwriteInput(): Promise<void> {
		const [startDate, endDate] = parseRangeInput(inputValue.value)

		if (startDate && endDate) {
			const rangeError = getRangeValidationError(startDate, endDate)
			if (rangeError) {
				failWithDisplayedError(rangeError, { replace: true })
			}
			else {
				emitRangeModelDates(startDate, endDate)
				await runRules(inputValue.value)
			}
			return
		}

		if (startDate) {
			emit('date-selected', formatDate(startDate, returnFormat.value))
			clearValidation()
			return
		}

		clearValidation()
	}

	async function handleSingleOverwriteInput(): Promise<void> {
		const formattedValue = inputValue.value
		const isComplete = !!formattedValue && !formattedValue.includes('_')

		if (!isComplete) {
			clearValidation()
			return
		}

		await emitCompletedSingleInput(formattedValue)
		await runRules(formattedValue)
	}

	function formatRangeTypingValue(value: string): string {
		if (value.includes(locales.rangeSeparator)) {
			const [startDateText, endDateText = ''] = value.split(locales.rangeSeparator)
			const formattedStartDate = startDateText ? formatDateInput(startDateText).formatted : ''
			const formattedEndDate = endDateText ? formatDateInput(endDateText).formatted : ''
			return `${formattedStartDate}${locales.rangeSeparator}${formattedEndDate}`
		}

		return formatDateInput(value).formatted
	}

	function syncSelectedRangeValidation(): void {
		try {
			isUpdatingFromInternal.value = true
			bridgeValidate()
		}
		finally {
			queueMicrotask(() => (isUpdatingFromInternal.value = false))
		}
	}

	function applyRangeCursorPosition(inputElement: HTMLInputElement | null, cursorPosition?: number): void {
		if (cursorPosition === undefined || isHandlingBackspace.value) {
			return
		}

		queueMicrotask(() => setInputSelectionRange(inputElement, cursorPosition))
	}

	function handleCompletedRangeSelection(dates: [Date | null, Date | null]): void {
		if (!(dates[0] && dates[1])) {
			return
		}

		const rangeError = getRangeValidationError(dates[0], dates[1])
		if (rangeError) {
			failWithDisplayedError(rangeError)
		}
	}

	function handlePartialRangeSelection(dates: [Date | null, Date | null], justCompletedFirstDate?: boolean): void {
		if (justCompletedFirstDate && dates[0]) {
			emit('date-selected', toReturnFormat(dates[0]))
		}
	}

	function clearRangeSelection(): void {
		selectedDates.value = null

		if (props.modelValue !== null) {
			emitModel(null)
		}
	}

	function applyRangeInputResult(
		result: ReturnType<typeof handleRangeInput>,
		inputElement: HTMLInputElement | null,
	): void {
		inputValue.value = result.formattedValue

		if (result.dates[0]) {
			selectedDates.value = result.dates
			syncSelectedRangeValidation()

			if (result.isComplete) {
				handleCompletedRangeSelection(result.dates)
			}
			else {
				handlePartialRangeSelection(result.dates, result.justCompletedFirstDate)
			}
		}
		else {
			clearRangeSelection()
		}

		emit('input', result.formattedValue)
		applyRangeCursorPosition(inputElement, result.cursorPosition)
	}

	function handleRangeTypingInput(
		value: string,
		previousValue: string | undefined,
		cursor: number,
		inputElement: HTMLInputElement | null,
	): void {
		const formattedValue = formatRangeTypingValue(value)
		const result = previousValue
			? handleRangeInput(previousValue, formattedValue, cursor)
			: handleRangeInput('', formattedValue)

		applyRangeInputResult(result, inputElement)
	}

	async function applySingleCursorPosition(
		inputElement: HTMLInputElement | null,
		cursorPosition: number,
		shouldMoveCursor: boolean,
	): Promise<void> {
		if (!shouldMoveCursor || isHandlingBackspace.value) {
			return
		}

		await nextTick()
		setInputSelectionRange(inputElement, cursorPosition)
	}

	function isCompleteSingleDate(value: string): boolean {
		return !value.includes('_')
	}

	async function handleSingleTypingInput(
		value: string,
		cursor: number,
		inputElement: HTMLInputElement | null,
	): Promise<void> {
		const { formatted, cursorPos } = formatDateInput(value, cursor)
		const hasFormattingChange = formatted !== value

		if (hasFormattingChange) {
			inputValue.value = formatted
			await applySingleCursorPosition(inputElement, cursorPos, true)
		}

		if (isCompleteSingleDate(formatted)) {
			await emitCompletedSingleInput(formatted, formatted)
			await runRules(formatted)
			return
		}

		// For incomplete dates, clear validation but don't emit model value
		clearValidation()
	}

	async function handleDisabledInputChange(newValue: string, oldValue: string | undefined): Promise<boolean> {
		if (!props.disabled) {
			return false
		}

		if (isMaskedEmptyInput(newValue) && oldValue && props.modelValue) {
			await restoreDisabledInputValue()
		}

		return true
	}

	function shouldSkipWatchedInputChange(newValue: string, oldValue: string | undefined): boolean {
		if (pendingSyncedInputValue.value !== null && newValue === pendingSyncedInputValue.value) {
			pendingSyncedInputValue.value = null
			return true
		}

		return isFormatting.value
			|| newValue === oldValue
			|| isHandlingBackspace.value
			|| isBootstrapping.value
	}

	async function resolveWatchedInputValue(newValue: string): Promise<string | null> {
		if (await clearWatchedInputValue()) {
			return null
		}

		return applyTypingAutoClamp(newValue)
	}

	async function processOverwriteInput(): Promise<void> {
		if (isRange.value) {
			await handleRangeOverwriteInput()
			return
		}

		await handleSingleOverwriteInput()
	}

	type WatchedInputContext = {
		value: string
		previousValue: string | undefined
		cursor: number
		inputElement: HTMLInputElement | null
	}

	function createWatchedInputContext(
		value: string,
		previousValue: string | undefined,
	): WatchedInputContext {
		const inputElement = getNativeInputElement()
		return {
			value,
			previousValue,
			inputElement,
			cursor: inputElement?.selectionStart ?? 0,
		}
	}

	async function processTypedInput(
		context: WatchedInputContext,
	): Promise<void> {
		if (isRange.value) {
			handleRangeTypingInput(context.value, context.previousValue, context.cursor, context.inputElement)
			return
		}

		await handleSingleTypingInput(context.value, context.cursor, context.inputElement)
	}

	async function processWatchedInputChange(
		newValue: string,
		oldValue: string | undefined,
	): Promise<void> {
		const value = await resolveWatchedInputValue(newValue)
		if (value === null) {
			return
		}

		if (isOverwriteEditing.value) {
			await processOverwriteInput()
			return
		}

		await processTypedInput(createWatchedInputContext(value, oldValue))
	}

	async function handleWatchedInputChange(newValue: string, oldValue: string | undefined): Promise<void> {
		if (await handleDisabledInputChange(newValue, oldValue)) {
			return
		}

		if (shouldSkipWatchedInputChange(newValue, oldValue)) return

		try {
			isFormatting.value = true
			await processWatchedInputChange(newValue, oldValue)
		}
		finally {
			await nextTick()
			isFormatting.value = false
		}
	}

	// ─── Handlers routeurs (délèguent selon le mode single/range) ────
	function handleKeydown(evt: KeyboardEvent) {
		if (props.readonly) return
		if (!getEventInputElement(evt)) return

		emit('keydown', evt)

		if (evt.defaultPrevented) return

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
			if (startDate && endDate) emitRangeModelDates(startDate, endDate)
			else if (startDate) emit('date-selected', toReturnFormat(startDate))
		}
		else {
			const parsedDate = parseDate(inputValue.value, displayFormat.value)
			if (parsedDate) emitSingleModelDate(parsedDate)
		}

		return true
	}

	async function handleEmptyBlurValue(): Promise<void> {
		emitModel(null)
		await runRules('')
	}

	async function applyBlurAutoClamp(): Promise<void> {
		// Le mode overwrite désactive le clamp pendant la frappe pour préserver le curseur.
		// On l'applique donc avant la validation au blur, sinon une date comme 31/04
		// sort en erreur avant d'atteindre la logique d'autoClamp.
		// isFormatting bloque le watcher inputValue pour éviter une double émission du modèle.
		await withFormattingLock(() => {
			applyAutoClampOnCurrentInput(false)
		})
	}

	async function emitValidatedBlurValue(): Promise<void> {
		// On garde le verrou jusqu'au nextTick pour bloquer le watcher modelValue déclenché par emitModel.
		await withFormattingLock(async () => {
			emitBlurModel(inputValue.value)
		}, true)
	}

	async function processBlurValue(): Promise<void> {
		if (isVisuallyEmptyInput(inputValue.value)) {
			await handleEmptyBlurValue()
			return
		}

		// Incomplete date at blur → error, don't emit model.
		// validateEmptyOrIncompleteDate treats incomplete dates as valid (for typing),
		// but at blur the user is done: an incomplete date must be an error.
		// Skip this check for range mode (handled separately by range validation).
		if (!isRange.value && !isDateComplete(inputValue.value, displayFormat.value)) {
			failWithDisplayedError(locales.invalidDateFormatWithFormat(displayFormat.value), { replace: true })
			return
		}

		await applyBlurAutoClamp()

		if (!inputValue.value) {
			return
		}

		// Format invalide ou règles custom en erreur : runRules pousse déjà les messages attendus.
		// On garde la valeur visible pour permettre la correction sans nettoyer le champ.
		if (!(await runRules(inputValue.value))) {
			return
		}

		await emitValidatedBlurValue()
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

		await processBlurValue()
	}
	watch(inputValue, handleWatchedInputChange)

	watch(() => props.modelValue, (nv) => {
		if (isFormatting.value) return
		const syncedDisplayValue = syncFromModelValue(nv)
		void runRules(syncedDisplayValue)
	})

	function validateOnSubmitForForm() {
		return validateOnSubmit()
	}

	function clearValidationForForm() {
		clearValidation()
	}

	function resetForForm() {
		reset()
	}

	const publicApi: DateTextInputPublicApi = {
		validateOnSubmit,
		validate: bridgeValidate,
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
	}

	/** expose */
	defineExpose(publicApi)

	syncFromModelValue(props.modelValue)

	/**
	 * =====================
	 * UI state helpers
	 * =====================
	 */
	const isOnError = computed(() => bridgeHasError.value)
	const isOnWarning = computed(() =>
		bridgeHasWarning.value && !bridgeHasError.value,
	)
	const isOnSuccess = computed(() =>
		bridgeHasSuccess.value
		&& !bridgeHasError.value
		&& !bridgeHasWarning.value,
	)

	// Props du SyTextField rendu par DateTextInput
	const textFieldProps = computed(() => buildDateTextInputTextFieldProps(
		props,
		errorMessages,
		warningMessages,
		successMessages,
		isOnError,
		isOnWarning,
		isOnSuccess,
		ariaLabel.value,
	))

	function onMouseDown(event: MouseEvent) {
		emit('mousedown', event)
	}
</script>

<template>
	<div class="date-text-input">
		<SyTextField
			ref="inputRef"
			v-model="inputValue"
			:aria-describedby="formatDescriptionId"
			:class="{
				'error-field': isOnError,
				'warning-field': isOnWarning,
				'success-field': isOnSuccess,
			}"
			color="primary"
			v-bind="textFieldProps"
			@focus="onFocus"
			@blur="onBlur"
			@mousedown="onMouseDown"
			@keydown="handleKeydown"
			@paste="handlePaste"
			@prepend-icon-click="emit('prepend-icon-click', $event)"
			@append-icon-click="emit('append-icon-click', $event)"
		/>
		<DatePickerLiveRegion
			:id="formatDescriptionId"
			:text="formatDescription"
		/>
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
		color: rgb(var(--v-theme-on-success-variant)) !important;

		.v-field__outline {
			color: rgb(var(--v-theme-on-success-variant)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-on-success-variant)) !important;
		}
	}
}
</style>
