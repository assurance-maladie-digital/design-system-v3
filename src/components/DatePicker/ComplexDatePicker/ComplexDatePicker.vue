	<script lang="ts" setup>
	/**
	 * ComplexDatePicker — DatePicker combiné (champ texte + calendrier popup).
	 *
	 * ## Rôle
	 *
	 * Contrairement à `CalendarMode/DatePicker` qui n'offre qu'un calendrier (champ readonly),
	 * ComplexDatePicker permet à l'utilisateur de **taper une date manuellement** dans un champ
	 * texte ET de **la sélectionner via un calendrier popup**. Les deux modes sont synchronisés :
	 * - Saisie texte → parse → mise à jour de `selectedDates` → calendrier reflète la sélection
	 * - Sélection calendrier → formatage → mise à jour du champ texte → emit `update:modelValue`
	 *
	 * ## Architecture interne
	 *
	 * Le composant délègue à deux sous-composants selon `noCalendar` :
	 * - `noCalendar = true` → `DateTextInput` seul (saisie texte uniquement)
	 * - `noCalendar = false` → `DateTextInput` (activateur) + `VMenu` + `VDatePicker`
	 *
	 * ## Différences clés avec CalendarMode/DatePicker
	 *
	 * 1. **Saisie texte bidirectionnelle** : Le champ texte est éditable (pas readonly).
	 *    L'utilisateur peut taper, effacer, coller. La logique de formatage masqué (DD/MM/YYYY)
	 *    est gérée par `DateTextInput`.
	 *
	 * 2. **Sémantique combobox** : L'input a `role="combobox"` + `aria-haspopup="dialog"`
	 *    (pattern APG). Voir `syncComboboxInputSemantics`.
	 *
	 * 3. **Gestion du blur plus complexe** : Quand le calendrier s'ouvre, l'input perd le focus
	 *    (VMenu prend le focus). Le flag `ignoreNextInputBlur` empêche la validation prématurée.
	 *    Voir `handleCalendarInputBlur` et `useDatePickerInputBlurHandler`.
	 *
	 * 4. **Sélection progressive en mode range** : Le 1er clic définit le début, le 2e la fin.
	 *    Le calendrier ne se ferme qu'une fois la plage complète.
	 *
	 * 5. **`datePickerKey`** : Force le re-render du VDatePicker après un clear (fix bug production
	 *    où Vue optimise et ne détecte pas le passage de `selectedDates` à null).
	 *
	 * ## Patterns partagés avec CalendarMode
	 *
	 * - Sync guard (`useDatePickerSyncGuard`) : flags anti-boucle identiques
	 * - Validation (`useDatePickerValidation`) : même orchestrateur, mais sans `calendarMode: true`
	 *   (ComplexDatePicker utilise le flow standard `validateDates`)
	 * - Accessibilité : `useDatePickerFocusTrap`, `useCalendarKeyboardNavigation`, patchs ARIA
	 * - Mode birthDate : `useDatePickerViewMode` (année → mois → jour)
	 */
	import {
		type ComponentPublicInstance,
		computed,
		nextTick,
		onBeforeUnmount,
		onMounted,
		readonly,
		ref,
		type Ref,
		useId,
		watch,
	} from 'vue'
	import {
		type DateInput,
		type DateModelValue,
		useDateInitialization,
	} from '@/composables/date/useDateInitializationDayjs'
	import {
		buildTodaySelectionState,
		useCalendarKeyboardNavigation,
		useDatePickerInputBlurHandler,
		useDatePickerFocusTrap,
		useDatePickerState,
		useDatePickerValidation,
		useDatePickerViewMode,
		useDatePickerVisibility,
		useDateSelection,
		useDisplayedDateString,
		useSelectedDayAria,
		useTodayButton,
		validateDateFormat as validateDateFormatUtil,
		useDatePickerDerivedValues,
		useDatePickerSyncGuard,
		useDatePickerCalendar,
	} from '../composables'
	import dayjs from 'dayjs'
	import DateTextInput from '../DateTextInput/DateTextInput.vue'
	import { VDatePicker } from 'vuetify/components'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import type { DateObjectValue, DatePickerCommonProps } from '../types'
	import { DatePickerCommonDefaults } from '../types'
	import { useDatePickerAccessibility } from '@/composables/date/useDatePickerAccessibility'
	import { buildComplexDatePickerTextInputProps } from './props/buildComplexDatePickerTextInputProps'
	import { buildComplexDatePickerMenuTextInputProps } from './props/buildComplexDatePickerMenuTextInputProps'
	import { locales } from '../locales'
	import { mdiCalendarMonthOutline } from '@mdi/js'
	import {
		formatDateInput as formatDateInputUtil,
		formatDateRangeDisplay,
		getDateDescription as getDateDescriptionUtil,
		getDisplayedMonthYearState,
		resolveDatePickerStateFromModelValue,
	} from '../utils/dateFormattingUtils'
	import { isModelValueEqual } from '../utils/validationUtils'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'
	import DatePickerLiveRegion from '../DatePickerLiveRegion.vue'
	import DatePickerControls from '../datePickerSlots/components/DatePickerControls.vue'
	import DatePickerDay from '../datePickerSlots/components/DatePickerDay.vue'
	import DatePickerMonthOption from '../datePickerSlots/components/DatePickerMonthOption.vue'
	import DatePickerYearOption from '../datePickerSlots/components/DatePickerYearOption.vue'

	dayjs.extend(customParseFormat)

	const { parseDate, formatDate } = useDateFormat()
	const { initializeSelectedDates } = useDateInitialization()
	const { updateAccessibility, cleanupGridSemantics } = useDatePickerAccessibility()

	// ─── Sync guard : flags anti-boucle & état d'interaction ──────────
	// Ces flags coordonnent la réactivité entre les watchers de selectedDates,
	// textInputValue, modelValue, et les événements blur/input du calendrier.
	// - isUpdatingFromInternal : empêche les watchers de se redéclencher pendant une sync interne
	// - ignoreNextInputBlur : consommé une fois, empêche la validation au blur causé par l'ouverture du calendrier
	// - ignoreNextCalendarModelSync : empêche le setter de calendarSelectedDates de reboucler
	const {
		isUpdatingFromInternal,
		withInternalUpdate,
		ignoreNextInputBlur,
		ignoreNextCalendarModelSync,
		consumeIgnoreNextInputBlur,
		consumeIgnoreNextCalendarModelSync,
		hasInteracted,
		isManualInputActive,
		resetInteractionState,
	} = useDatePickerSyncGuard()

	// ─── Mois/année affichés dans le calendrier ───────────────────────
	// Synchronisés depuis selectedDates (watcher dédié) et depuis la navigation
	// VDatePicker (onUpdateMonth/onUpdateYear). Utilisés par syncDisplayedMonthYearFromDate.
	const currentMonth = ref<string | null>(null)
	const currentYear = ref<string | null>(null)
	const currentMonthName = ref<string | null>(null)
	const currentYearName = ref<string | null>(null)

	const props = withDefaults(defineProps<DatePickerCommonProps>(), DatePickerCommonDefaults)

	// Guard centralisé pour disabled/readonly
	const isInteractionDisabled = computed(() => props.disabled || props.readonly)

	const isSelectableInput = (value: unknown): value is HTMLInputElement =>
		value instanceof HTMLInputElement && typeof value.setSelectionRange === 'function'

	// Helpers pour le focus sur l'input
	const getCalendarInputElement = () => {
		const element = dateCalendarTextInputRef.value?.$el?.querySelector?.('input:not([type="hidden"])')
		return element instanceof HTMLInputElement ? element : null
	}

	const focusCalendarInput = () => {
		const input = getCalendarInputElement()
		if (input) {
			input.focus()
			const caretPosition = input.value.length
			if (typeof input.setSelectionRange === 'function') {
				input.setSelectionRange(caretPosition, caretPosition)
			}
			return
		}

		if (typeof dateCalendarTextInputRef.value?.focus === 'function') {
			dateCalendarTextInputRef.value.focus()
		}
	}

	// ─── Gestion fine du focus (spécifique ComplexDatePicker) ─────────
	// Le focus est plus complexe ici car l'input est éditable : il faut distinguer
	// le blur causé par l'ouverture du calendrier (à ignorer) du blur réel (à valider).
	// - shouldRestoreFocusToInput : après fermeture du calendrier, redonne le focus à l'input
	// - shouldFocusDialogOnOpen : à l'ouverture, place le focus sur le jour initial du calendrier
	// - dialogInitialFocusToken : annule les timeouts de focus obsolètes (ex: si l'utilisateur
	//   ferme/reouvre rapidement)
	const shouldRestoreFocusToInput = ref(false)
	const shouldFocusDialogOnOpen = ref(false)
	const keyboardNavigatedDate = ref<Date | null>(null)
	let dialogInitialFocusToken = 0
	let dialogInitialFocusTimeouts: ReturnType<typeof setTimeout>[] = []

	const clearDialogInitialFocusTimeouts = () => {
		dialogInitialFocusTimeouts.forEach(clearTimeout)
		dialogInitialFocusTimeouts = []
	}

	const scheduleCalendarInputFocusRestore = () => {
		shouldRestoreFocusToInput.value = true
	}

	const scheduleDialogInitialFocus = () => {
		shouldFocusDialogOnOpen.value = true
	}

	const restoreCalendarInputFocus = (attempt = 0) => {
		nextTick(() => {
			requestAnimationFrame(() => {
				focusCalendarInput()

				const input = getCalendarInputElement()
				if (!input) return

				if (document.activeElement === input) return
				if (attempt >= 8) return

				setTimeout(() => {
					restoreCalendarInputFocus(attempt + 1)
				}, attempt < 3 ? 16 : 50)
			})
		})
	}

	const scheduleDialogInitialDayFocus = () => {
		dialogInitialFocusToken += 1
		const token = dialogInitialFocusToken

		clearDialogInitialFocusTimeouts()

		const runFocus = () => {
			if (!isDatePickerVisible.value || token !== dialogInitialFocusToken) return
			focusInitialDay()
		}

		runFocus()
		dialogInitialFocusTimeouts.push(setTimeout(runFocus, 120))
	}

	// Fermeture du calendrier. Contrairement à CalendarMode, pas de flag
	// isHandlingProgrammaticClose car le watcher isDatePickerVisible gère
	// directement le restoreFocus via shouldRestoreFocusToInput.
	const closeDatePicker = async (options: { restoreFocus?: boolean } = {}) => {
		if (!isDatePickerVisible.value) return

		isDatePickerVisible.value = false
		emit('closed')

		if (options.restoreFocus) {
			scheduleCalendarInputFocusRestore()
		}

		await validate()
	}

	const closeAndRestoreFocus = () => closeDatePicker({ restoreFocus: true })

	// Applique les attributs ARIA combobox sur l'input (pattern APG date picker).
	// Re-appliqué à chaque changement de visibilité/disabled/readonly via watcher.
	const syncComboboxInputSemantics = () => {
		const input = getCalendarInputElement()
		if (!input) return

		input.setAttribute('role', 'combobox')
		input.setAttribute('aria-haspopup', 'dialog')
		input.setAttribute('aria-expanded', String(isDatePickerVisible.value))
		input.setAttribute('aria-autocomplete', 'none')

		if (isDatePickerVisible.value) {
			input.setAttribute('aria-controls', datePickerDialogId)
		}
		else {
			input.removeAttribute('aria-controls')
		}

		if (props.disabled) {
			input.setAttribute('aria-disabled', 'true')
		}
		else {
			input.removeAttribute('aria-disabled')
		}

		if (props.readonly) {
			input.setAttribute('aria-readonly', 'true')
		}
		else {
			input.removeAttribute('aria-readonly')
		}
	}

	// À la fermeture (ex. après sélection d'une date), le VMenu rend le focus à son
	// activateur (ce conteneur, non focusable au clavier → tabindex -1). On redirige ce
	// focus vers l'input pour ne pas afficher le ring du conteneur et garder le focus sur
	// le champ. Gardé sur `!isDatePickerVisible` pour ne pas interférer quand le calendrier
	// est ouvert.
	const redirectActivatorFocus = () => {
		if (!isDatePickerVisible.value) {
			focusCalendarInput()
		}
	}

	const emit = defineEmits<{
		(e: 'update:modelValue', value: DateModelValue): void
		(e: 'closed'): void
		(e: 'focus'): void
		(e: 'blur'): void
		(e: 'input', value: string): void
		(e: 'date-selected', value: DateModelValue): void
	}>()

	/**
	 * Derived values
	 */
	const { returnFormat, minDate, maxDate } = useDatePickerDerivedValues(props)

	/**
	 * Validation + messages
	 */
	const isDatePickerVisible = ref(false)

	// ─── État central : dates sélectionnées ───────────────────────────
	// Source de vérité pour la sélection courante (null | Date | Date[]).
	// Le watcher sur cette ref (syncFromSelectedDatesChange) orchestre :
	// - la sync de l'affichage (syncSelectionDisplay)
	// - la mise à jour du modèle (updateModel)
	// - la fermeture du calendrier si la sélection est complète
	const selectedDates = ref<Date | (Date | null)[] | null>(
		initializeSelectedDates(props.modelValue as DateInput | null, props.format, props.dateFormatReturn),
	)
	// Force le re-render du DateTextInput/SyTextField (ex: après reset ou clear).
	// Aussi utilisé pour forcer le re-render du VDatePicker après clear (datePickerKey).
	const fieldKey = ref(0)

	// --- Validation setup ---
	// `validate` est le point d'entrée unifié (route vers validateDates / validateTextInput).
	// `validateField` et `replaceErrors` sont conservés pour validateCalendarSelection
	// et useDatePickerInputBlurHandler qui ont besoin d'un accès bas niveau.
	const {
		validate,
		validateField,
		clearValidation,
		replaceErrors,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		errorMessages,
		warningMessages,
		successMessages,
	} = useDatePickerValidation({
		showSuccessMessages: computed(() => props.showSuccessMessages),
		disableErrorHandling: computed(() => props.disableErrorHandling),
		noCalendar: computed(() => props.noCalendar),
		required: computed(() => props.required),
		displayRange: computed(() => props.displayRange),
		customRules: computed(() => props.customRules),
		customSuccessRules: computed(() => props.customSuccessRules ?? []),
		customWarningRules: computed(() => props.customWarningRules),
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
		revalidateOnCustomRulesChange: true,
		readonly: computed(() => props.readonly),
		skipValidationWhenReadonly: true,
		displayFormat: computed(() => props.format),
		parseDate,
		hasInteracted,
		formRegistration: {
			validateOnSubmit,
			clearValidation: clearValidationForForm,
			reset,
		},
	})

	const messageClasses = computed(() => ({
		'dp-width': true,
		'v-messages__message--error': hasError.value,
		'v-messages__message--warning': hasWarning.value && !hasError.value,
		'v-messages__message--success': hasSuccess.value && !hasError.value && !hasWarning.value,
	}))

	// Props du champ texte utilisé dans le flux noCalendar
	const noCalendarTextInputProps = computed(() => buildComplexDatePickerTextInputProps(
		props,
		labelWithAsterisk,
		errorMessages,
		warningMessages,
		successMessages,
	))

	// Props du champ texte utilisé comme activateur du menu calendrier
	const menuTextInputProps = computed(() => buildComplexDatePickerMenuTextInputProps(
		props,
		labelWithAsterisk,
		errorMessages,
		warningMessages,
		successMessages,
	))

	const {
		toggleDatePicker,
		openDatePicker,
		openDatePickerOnFocus,
		openDatePickerOnIconClick: openDatePickerOnIconClickFromVisibility,
		handleClickOutside,
		handleKeyboardNavigation,
	} = useDatePickerVisibility({
		disabled: isInteractionDisabled,
		readonly: computed(() => props.readonly),
		textFieldActivator: computed(() => props.textFieldActivator),
		isDatePickerVisible,
		isManualInputActive,
		hasInteracted,
		updateAccessibility,
		// Alias de compatibilité : le composable appelle validateDates() après fermeture,
		// ce qui déclenche validate() (flow standard) dans ce composant.
		validateDates: () => validate(),
		emitClosed: () => emit('closed'),
		emitFocus: () => emit('focus'),
	})

	const refreshVisibleCalendarUi = (options: { focusDay?: boolean } = {}) => {
		if (!isDatePickerVisible.value) return

		updateSelectedDayAria()

		if (options.focusDay) {
			nextTick(focusInitialDay)
		}
	}

	const prepareCalendarInteraction = (options: {
		ignoreBlur?: boolean
		focusDialog?: boolean
		ignoreCalendarModelSync?: boolean
	} = {}) => {
		if (options.ignoreBlur) {
			ignoreNextInputBlur.value = true
		}

		if (options.focusDialog) {
			scheduleDialogInitialFocus()
		}

		if (options.ignoreCalendarModelSync) {
			ignoreNextCalendarModelSync.value = true
		}
	}

	const requestDatePickerOpen = (options: {
		ignoreBlur?: boolean
		focusDialog?: boolean
		ignoreCalendarModelSync?: boolean
	} = {}): boolean => {
		if (isInteractionDisabled.value) return false

		prepareCalendarInteraction(options)
		openDatePicker()
		return true
	}

	const openDatePickerOnIconClick = () => {
		if (isInteractionDisabled.value) return
		prepareCalendarInteraction({
			ignoreBlur: true,
			ignoreCalendarModelSync: true,
		})
		openDatePickerOnIconClickFromVisibility()
	}

	const openDatePickerFromInputClick = (event?: MouseEvent) => {
		const input = getCalendarInputElement()
		if (isInteractionDisabled.value || isDatePickerVisible.value || !input) return
		if (event && (event.target !== input || document.activeElement !== input)) return
		// Ne pas ouvrir le calendrier si le clic vient du bouton clear
		if (event && (event.target as HTMLElement)?.closest('.sy-text-field__clear')) return

		requestDatePickerOpen()
	}

	const updateModel = (value: DateModelValue) => {
		// Prevent redundant emits
		if (isModelValueEqual(value, props.modelValue)) return
		withInternalUpdate(() => emit('update:modelValue', value))
	}

	// Proxy computed pour VDatePicker v-model : permet d'intercepter les mises à jour
	// du calendrier et de les ignorer si nécessaire (ignoreNextCalendarModelSync).
	// Sans cela, VDatePicker rebouclerait sur selectedDates à chaque ouverture/fermeture.
	const calendarSelectedDates = computed<DateObjectValue>({
		get: () => selectedDates.value,
		set: (value) => {
			if (consumeIgnoreNextCalendarModelSync()) {
				return
			}

			selectedDates.value = value
		},
	})

	// Keep and expose this so consumers can listen to `date-selected`
	const handleDateSelected = (value: DateModelValue) => {
		if (props.readonly) return

		// 1) Update v-model
		updateModel(value)

		// 2) Sync internal selection
		if (value === null) {
			selectedDates.value = null
		}
		else if (Array.isArray(value)) {
			const dateObjects = value
				.map(dateStr => parseDate(dateStr, returnFormat.value))
				.filter(Boolean) as Date[]
			if (props.displayRange && dateObjects.length >= 2) {
				selectedDates.value = dateSelectionResult.generateDateRange(dateObjects[0]!, dateObjects[dateObjects.length - 1]!)
			}
			else {
				selectedDates.value = dateObjects
			}
		}
		else {
			selectedDates.value = parseDate(value, returnFormat.value)
		}

		// 3) Re-emit upward
		emit('date-selected', value)
	}
	// Range handling
	const rangeBoundaryDates = ref<[Date | null, Date | null] | null>(null)
	const dateSelectionResult = useDateSelection(parseDate, selectedDates, computed(() => props.format), computed(() => props.displayRange))
	watch(
		() => dateSelectionResult.rangeBoundaryDates.value,
		(newValue) => {
			rangeBoundaryDates.value = newValue
		},
		{ immediate: true },
	)

	const {
		textInputValue,
		displayFormattedDate,
		formattedDate,
		displayFormattedFromSelectedDates,
		syncFromModelValue,
		syncTextInputFromSelection,
	} = useDatePickerState({
		selectedDates,
		rangeBoundaryDates,
		format: computed(() => props.format),
		dateFormatReturn: props.dateFormatReturn,
		displayRange: computed(() => props.displayRange),
		parseDate,
		formatDate,
		// Alias de compatibilité : le composable appelle validateDates() après
		// mise à jour des dates, ce qui déclenche validate() (flow standard).
		validateDates: () => validate(),
		clearValidation,
		generateDateRange: dateSelectionResult.generateDateRange,
	})

	const syncSelectionDisplay = () => {
		withInternalUpdate(() => {
			syncTextInputFromSelection()
			displayFormattedDate.value = displayFormattedFromSelectedDates.value || ''
		})
	}

	const syncManualInputState = (displayValue: string, selectedDate?: Date | null) => {
		withInternalUpdate(() => {
			displayFormattedDate.value = displayValue
			if (selectedDate !== undefined) {
				selectedDates.value = selectedDate
			}
		})
	}

	const resolveTextInputState = (modelValue: DateModelValue) => resolveDatePickerStateFromModelValue({
		modelValue,
		displayRange: props.displayRange,
		displayFormat: props.format,
		returnFormat: returnFormat.value,
		parseDate,
		formatDate,
		generateDateRange: dateSelectionResult.generateDateRange,
	})

	const applyResolvedTextInputState = (modelValue: DateModelValue): void => {
		const nextState = resolveTextInputState(modelValue)
		selectedDates.value = nextState.selectedDates
		displayFormattedDate.value = nextState.displayValue
	}

	const getSingleTextInputModelValue = (value: string): DateModelValue => {
		const date = parseDate(value, props.format)
		if (date) {
			return props.dateFormatReturn
				? formatDate(date, returnFormat.value)
				: formatDate(date, props.format)
		}

		return value || null
	}

	const syncSingleTextInputFlow = (value: string): void => {
		const nextModelValue = getSingleTextInputModelValue(value)
		updateModel(nextModelValue)

		if (nextModelValue === null) {
			syncManualInputState('', null)
			return
		}

		if (typeof nextModelValue === 'string') {
			const parsedDate = parseDate(value, props.format)
			if (parsedDate) {
				syncManualInputState(formatDate(parsedDate, props.format), parsedDate)
				return
			}

			syncManualInputState(value)
		}
	}

	const formatDateInput = (input: string, cursorPosition?: number) => {
		const result = formatDateInputUtil(input, props.format, { cursorPosition })

		// Extrait le séparateur du format (ex: DD/MM/YYYY → '/', DD-MM-YYYY → '-').
		// [^DMY] = tout caractère qui n'est pas D, M ou Y (insensible à la casse via le flag "i").
		// ?. [0] = premier caractère non-lettre trouvé, ou '/' par défaut si aucun séparateur.
		const separator = props.format.match(/[^DMY]/i)?.[0] || '/'

		// Échappe les caractères spéciaux de regex dans le séparateur (ex: '.' → '\.', '/' → '/').
		// [.*+?^${}()|[\]\\] = liste des métacaractères regex à échapper avec '\\$&'.
		// Nécessaire car le séparateur est injecté dans une RegExp ci-dessous.
		const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

		// Supprime les séparateurs et placeholders ('_') en fin de chaîne (ex: "01/__/___" → "01").
		// [escapedSeparator_]+$ = un ou plusieurs caractères parmi le séparateur et '_' à la fin ($).
		// Cela évite d'afficher des séparateurs orphelins quand la saisie est partielle.
		const formatted = result.formatted.replace(new RegExp(`[${escapedSeparator}_]+$`), '')

		return {
			formatted,
			cursorPos: Math.min(result.cursorPos, formatted.length),
		}
	}

	const getSelectedBaseDate = (value: DateObjectValue = selectedDates.value): Date | null => {
		if (!value) return null

		return Array.isArray(value)
			? (value.find(date => date instanceof Date) as Date | null) ?? null
			: value
	}

	const hasCompletedRangeSelection = (value: DateObjectValue = selectedDates.value): boolean => {
		if (!props.displayRange) return false

		const hasRangeBoundarySelection = Boolean(
			rangeBoundaryDates.value?.[0] && rangeBoundaryDates.value?.[1],
		)
		const hasArrayRangeSelection = Boolean(
			Array.isArray(value) && value.length >= 2 && value[0] && value[value.length - 1],
		)

		return hasRangeBoundarySelection || hasArrayRangeSelection
	}

	const buildCalendarSelectionCommit = (): { displayValue: string, modelValue: DateModelValue } | null => {
		if (props.displayRange) {
			if (rangeBoundaryDates.value?.[0] && rangeBoundaryDates.value?.[1]) {
				return {
					displayValue: formatDateRangeDisplay(
						rangeBoundaryDates.value[0],
						rangeBoundaryDates.value[1],
						props.format,
						formatDate,
					),
					modelValue: [
						formatDate(rangeBoundaryDates.value[0], returnFormat.value),
						formatDate(rangeBoundaryDates.value[1], returnFormat.value),
					] as [string, string],
				}
			}

			if (Array.isArray(selectedDates.value) && selectedDates.value.length >= 2) {
				return {
					displayValue: formatDateRangeDisplay(
						selectedDates.value[0]!,
						selectedDates.value[selectedDates.value.length - 1]!,
						props.format,
						formatDate,
					),
					modelValue: [
						formatDate(selectedDates.value[0]!, returnFormat.value),
						formatDate(selectedDates.value[selectedDates.value.length - 1]!, returnFormat.value),
					] as [string, string],
				}
			}

			return null
		}

		const displayValue = displayFormattedFromSelectedDates.value || ''
		if (!displayValue || !formattedDate.value) return null

		return {
			displayValue,
			modelValue: formattedDate.value,
		}
	}

	const validateCalendarSelection = async (date: Date): Promise<boolean> => {
		const validationResult = await Promise.resolve(validateField(
			date,
			props.customRules,
			props.customWarningRules,
			props.customSuccessRules,
		))

		if (!validationResult.hasError) {
			return true
		}

		replaceErrors(validationResult.state.errors)
		return false
	}

	const commitSingleCalendarSelection = (date: Date): void => {
		syncSelectionDisplay()
		updateModel(formatDate(date, returnFormat.value))
		closeAndRestoreFocus()
	}

	const updateSelectedDates = async (date: Date | null) => {
		ignoreNextCalendarModelSync.value = false

		if (date !== null && !(await validateCalendarSelection(date))) {
			return
		}

		dateSelectionResult.updateSelectedDates(date)

		if (date !== null && isDatePickerVisible.value && !props.displayRange) {
			commitSingleCalendarSelection(date)
		}

		// Validate immediately to surface messages
		queueMicrotask(() => validate({ force: true }))
	}

	const consumeIgnoredCalendarModelSync = (): boolean => {
		if (!ignoreNextCalendarModelSync.value) {
			return false
		}

		ignoreNextCalendarModelSync.value = false
		return true
	}

	const syncVisibleCalendarState = (baseDate: Date | null): void => {
		keyboardNavigatedDate.value = baseDate
		syncDisplayedMonthYearFromDate(baseDate ?? new Date())

		if (isDatePickerVisible.value) {
			nextTick(() => refreshVisibleCalendarUi())
		}
	}

	const syncSelectionState = (baseDate: Date | null): void => {
		syncSelectionDisplay()
		syncVisibleCalendarState(baseDate)
	}

	const shouldCloseAfterSelection = (value: DateObjectValue): boolean => (
		isDatePickerVisible.value
		&& (!props.displayRange || hasCompletedRangeSelection(value))
	)

	const shouldEmitSelectionModel = (isCompletedRangeSelection: boolean): boolean => (
		!props.displayRange || isCompletedRangeSelection
	)

	const applyCalendarSelectionCommit = (selectionCommit: { displayValue: string, modelValue: DateModelValue }): void => {
		displayFormattedDate.value = textInputValue.value = selectionCommit.displayValue
		updateModel(selectionCommit.modelValue)
		emit('date-selected', selectionCommit.modelValue)
		closeAndRestoreFocus()
		validate()
	}

	const handleSelectedDatesChange = (value: Exclude<DateObjectValue, null>): void => {
		const baseDate = getSelectedBaseDate(value)
		const isCompletedRangeSelection = props.displayRange && hasCompletedRangeSelection(value)

		if (consumeIgnoredCalendarModelSync()) {
			keyboardNavigatedDate.value = baseDate
			syncSelectionDisplay()
			return
		}

		syncSelectionState(baseDate)

		if (shouldEmitSelectionModel(isCompletedRangeSelection)) {
			updateModel(formattedDate.value)
		}

		if (shouldCloseAfterSelection(value)) {
			closeAndRestoreFocus()
		}
	}

	const handleClearedSelectedDates = (): void => {
		updateModel(null)
		syncSelectionDisplay()
		displayFormattedDate.value = ''
		syncVisibleCalendarState(null)
	}

	const syncFromSelectedDatesChange = (newValue: DateObjectValue): void => {
		if (newValue !== null) {
			handleSelectedDatesChange(newValue)
		}
		else {
			handleClearedSelectedDates()
		}
	}

	// ─── Watchers de synchronisation ──────────────────────────────────
	// Watcher 1 : selectedDates → sync affichage + modèle + fermeture calendrier
	// Watcher 2 : textInputValue → sync modèle depuis saisie texte (mode simple uniquement)
	// Watcher 3 : displayFormattedDate → mise à jour de la description accessibilité (live region)
	watch(selectedDates, syncFromSelectedDatesChange)

	// Handle manual typing sync → model/selection
	watch(textInputValue, (newValue) => {
		// En mode plage, on laisse DateTextInput + handleDateTextInputUpdate
		// piloter la mise à jour du modèle et de selectedDates
		if (props.displayRange) return
		if (isUpdatingFromInternal.value) return
		syncSingleTextInputFlow(newValue)
	})

	const updateDisplayFormattedDate = () => {
		if (consumeIgnoredCalendarModelSync()) {
			return
		}

		queueMicrotask(() => {
			const selectionCommit = buildCalendarSelectionCommit()
			if (!selectionCommit) {
				syncSelectionDisplay()
				return
			}

			applyCalendarSelectionCommit(selectionCommit)
		})
	}

	/**
	 * Accessibility (live description during typing)
	 */
	const accessibilityDescription = ref<string>(locales.dateInputDescription)

	watch(displayFormattedDate, (newValue) => {
		if (newValue && typeof newValue === 'string') {
			accessibilityDescription.value = getDateDescriptionUtil(newValue.replace(/_/g, ' '), props.format)
		}
		else {
			accessibilityDescription.value = locales.noDateEntered
		}
	})

	/**
	 * Mount / unmount
	 */
	const dateTextInputRef = ref<null | ComponentPublicInstance<typeof DateTextInput>>()
	const dateCalendarTextInputRef = ref<null | ComponentPublicInstance<typeof DateTextInput>>()
	const menuActivatorRef = ref<HTMLElement | undefined>(undefined)
	const datePickerRef = ref<null | ComponentPublicInstance<typeof VDatePicker>>()
	const datePickerMenuRef = ref<HTMLElement | null>(null)
	const datePickerContentId = `date-picker-${useId()}`
	const datePickerDialogId = `${datePickerContentId}-dialog`
	const datePickerTitleId = `${datePickerContentId}-title`
	const datePickerHeadingId = `${datePickerContentId}-heading`

	const { handleMenuKeydown } = useDatePickerFocusTrap({
		isDatePickerVisible,
		datePickerRef: datePickerRef as unknown as Ref<ComponentPublicInstance | null>,
		onClose: () => closeAndRestoreFocus(),
		restoreFocus: () => scheduleCalendarInputFocusRestore(),
		getInitialFocusDate: () => {
			const value = keyboardNavigatedDate.value
				?? (Array.isArray(selectedDates.value) ? selectedDates.value[0] ?? null : selectedDates.value)
			const selected = value
			return selected ?? new Date()
		},
	})

	const syncDialogKeydownListener = () => {
		datePickerMenuRef.value?.removeEventListener('keydown', handleMenuKeydown, true)

		if (isDatePickerVisible.value && datePickerMenuRef.value) {
			datePickerMenuRef.value.addEventListener('keydown', handleMenuKeydown, true)
		}
	}

	const { updateSelectedDayAria } = useSelectedDayAria({
		rootElement: computed(
			() => datePickerRef.value?.$el as HTMLElement | null,
		),
	})

	onMounted(() => {
		displayFormattedDate.value = displayFormattedFromSelectedDates.value || ''
		validate()
		nextTick(syncComboboxInputSemantics)
		nextTick(syncDialogKeydownListener)
	})

	onBeforeUnmount(() => {
		clearDialogInitialFocusTimeouts()
		datePickerMenuRef.value?.removeEventListener('keydown', handleMenuKeydown, true)
	})

	watch(
		() => [
			isDatePickerVisible.value,
			props.disabled,
			props.readonly,
			props.label,
			props.placeholder,
			fieldKey.value,
			datePickerMenuRef.value,
		],
		() => {
			nextTick(syncComboboxInputSemantics)
			nextTick(syncDialogKeydownListener)
		},
		{ flush: 'post' },
	)

	const handleDatePickerClosed = () => {
		dialogInitialFocusToken += 1
		clearDialogInitialFocusTimeouts()
		ignoreNextInputBlur.value = false
		shouldFocusDialogOnOpen.value = false
		ignoreNextCalendarModelSync.value = false
		keyboardNavigatedDate.value = null
	}

	const handleDatePickerOpened = () => {
		resetViewMode()
		const baseDate = getSelectedBaseDate()
		keyboardNavigatedDate.value = baseDate

		if (baseDate) {
			syncDisplayedMonthYearFromDate(baseDate)
		}

		nextTick(() => {
			refreshVisibleCalendarUi({ focusDay: shouldFocusDialogOnOpen.value })

			if (shouldFocusDialogOnOpen.value) {
				shouldFocusDialogOnOpen.value = false
				scheduleDialogInitialDayFocus()
			}

			ignoreNextCalendarModelSync.value = false
		})
	}

	watch(isDatePickerVisible, (visible) => {
		if (visible) return

		if (!shouldRestoreFocusToInput.value) return

		shouldRestoreFocusToInput.value = false
		restoreCalendarInputFocus()
		setTimeout(() => restoreCalendarInputFocus(), 150)
		setTimeout(() => restoreCalendarInputFocus(), 300)
	}, { flush: 'post' })

	const { focusInitialDay } = useCalendarKeyboardNavigation({
		isDatePickerVisible,
		datePickerRef: datePickerRef as unknown as Ref<ComponentPublicInstance | null>,
		getInitialFocusDate: () => {
			const selected = keyboardNavigatedDate.value
				?? (Array.isArray(selectedDates.value) ? selectedDates.value[0] ?? null : selectedDates.value)
			const target = selected ?? new Date()

			// Si la date cible est dans le mois affiché, l'utiliser
			if (currentMonth.value !== null && currentYear.value !== null) {
				const sameMonth = target.getMonth() === Number(currentMonth.value)
				const sameYear = target.getFullYear() === Number(currentYear.value)
				if (sameMonth && sameYear) {
					return target
				}
			}

			// Fallback: 1er du mois actuellement affiché
			if (currentMonth.value !== null && currentYear.value !== null) {
				return new Date(Number(currentYear.value), Number(currentMonth.value), 1)
			}

			return target
		},
		getCurrentDate: () => {
			const value = keyboardNavigatedDate.value
				?? (Array.isArray(selectedDates.value) ? selectedDates.value[0] ?? null : selectedDates.value)
			if (value) {
				const date = value
				if (currentMonth.value !== null && currentYear.value !== null) {
					const sameMonth = date.getMonth() === Number(currentMonth.value)
					const sameYear = date.getFullYear() === Number(currentYear.value)
					if (sameMonth && sameYear) {
						return date
					}
				}
			}

			if (currentMonth.value !== null && currentYear.value !== null) {
				return new Date(Number(currentYear.value), Number(currentMonth.value), 1)
			}

			return null
		},
		setCurrentDate: (date: Date) => {
			keyboardNavigatedDate.value = date

			// S'assurer que le VDatePicker affiche le bon mois après navigation clavier
			nextTick(() => {
				if (datePickerRef.value) {
					const displayedState = getDisplayedMonthYearState(date)
					if (currentMonth.value !== displayedState.month || currentYear.value !== displayedState.year) {
						syncDisplayedMonthYearFromDate(date)
						nextTick(() => refreshVisibleCalendarUi({ focusDay: true }))
					}
				}
			})
		},
		onSelectDate: (date: Date) => {
			void updateSelectedDates(date)
		},
	})

	// ─── Gestion clavier spécifique au champ texte du calendrier ──────
	// Gère : Enter/ArrowDown (ouvrir calendrier + focus dialog),
	// Backspace (effacer en sautant les séparateurs de date),
	// ArrowLeft/ArrowRight (naviguer en sautant les séparateurs).
	const handleKeydown = (event: KeyboardEvent) => {
		if (props.readonly) return

		const input = isSelectableInput(event.target) ? event.target : null
		if (!input) return

		if (!props.noCalendar && (event.key === 'Enter' || event.key === 'ArrowDown') && !isInteractionDisabled.value) {
			event.preventDefault()
			requestDatePickerOpen({
				ignoreBlur: true,
				focusDialog: true,
				ignoreCalendarModelSync: true,
			})
			return
		}

		if (!props.noCalendar && handleKeyboardNavigation(event)) {
			prepareCalendarInteraction({
				ignoreBlur: true,
				focusDialog: true,
			})
			return
		}

		if (event.key === 'Backspace') {
			if (!input.selectionStart || input.selectionStart !== input.selectionEnd) return
			const cursorPos = input.selectionStart
			const charBeforeCursor = input.value[cursorPos - 1]

			if (!charBeforeCursor || !/\d/.test(charBeforeCursor)) {
				event.preventDefault()
				displayFormattedDate.value = input.value.substring(0, cursorPos - 2) + input.value.substring(cursorPos)
				queueMicrotask(() => {
					const newCursorPos = cursorPos - 2
					input.setSelectionRange(newCursorPos, newCursorPos)
				})
			}
		}

		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			const cursorPos = input.selectionStart || 0
			const separator = props.format.match(/[^DMY]/)?.[0] || '/'

			if (event.key === 'ArrowLeft' && cursorPos > 0) {
				const charBeforeCursor = input.value[cursorPos - 1]
				if (charBeforeCursor === separator) {
					event.preventDefault()
					input.setSelectionRange(cursorPos - 2, cursorPos - 2)
				}
			}
			else if (event.key === 'ArrowRight' && cursorPos < input.value.length) {
				const charAtCursor = input.value[cursorPos]
				if (charAtCursor === separator) {
					event.preventDefault()
					input.setSelectionRange(cursorPos + 2, cursorPos + 2)
				}
			}
		}
	}

	// Gestionnaire de blur pour le champ texte du calendrier.
	// Si le blur est causé par l'ouverture du calendrier (ignoreNextInputBlur),
	// on l'ignore et on émet juste l'événement blur sans valider.
	// Sinon, on synchronise la valeur saisie et on délègue à handleInputBlur
	// (useDatePickerInputBlurHandler) qui valide et met à jour le modèle.
	const handleCalendarInputBlur = async () => {
		if (consumeIgnoreNextInputBlur() && isDatePickerVisible.value) {
			emitBlurEvent()
			return
		}

		const input = getCalendarInputElement()
		if (input) {
			withInternalUpdate(() => {
				displayFormattedDate.value = input.value
				textInputValue.value = input.value
			})
		}

		if (!props.isValidateOnBlur) {
			clearValidation()
			return
		}

		await handleInputBlur()
	}

	// Gestionnaire d'input live (pendant la frappe).
	// En mode simple : valide immédiatement (pour afficher les erreurs de format en temps réel).
	// En mode range : attend que la plage soit complète (séparateur présent + 2 dates valides)
	// avant de mettre à jour selectedDates et de valider.
	const handleInput = (value: string) => {
		if (props.readonly) return

		textInputValue.value = value

		if (!props.displayRange) {
			validate()
			return
		}

		if (!value.includes(locales.rangeSeparator)) {
			return
		}

		const [startDateStr = '', endDateStr = ''] = value.split(locales.rangeSeparator).map(s => s.trim())
		if (!(startDateStr && endDateStr) || endDateStr.includes('_')) {
			return
		}

		const startDate = parseDate(startDateStr, props.format)
		const endDate = parseDate(endDateStr, props.format)
		if (!(startDate && endDate)) {
			return
		}

		dateSelectionResult.updateSelectedDates([startDate, endDate])
		validate()
	}

	/**
	 * View mode handling
	 */
	const { currentViewMode, handleViewModeUpdate, handleYearUpdate, handleMonthUpdate, resetViewMode }
		= useDatePickerViewMode(
			() => props.isBirthDate || props.birthDate,
			() => selectedDates.value,
		)

	const {
		handleViewModeUpdateWrapper,
		syncDisplayedMonthYearFromDate,
		onUpdateMonth,
		onUpdateYear,
	} = useDatePickerCalendar({
		getRootEl: () => datePickerRef.value?.$el as HTMLElement | undefined,
		isDatePickerVisible,
		currentViewMode,
		handleViewModeUpdate,
		handleMonthUpdate,
		handleYearUpdate,
		currentMonth,
		currentMonthName,
		currentYear,
		currentYearName,
		updateAccessibility,
		cleanupGridSemantics,
		focusInitialDay,
		refreshCalendarUi: refreshVisibleCalendarUi,
		onYearViewOpen: () => {
			const baseDate = getSelectedBaseDate() ?? new Date()
			syncDisplayedMonthYearFromDate(baseDate)
		},
		onYearViewFocus: (rootEl) => {
			const selectedYear = String(getSelectedBaseDate()?.getFullYear() ?? Number(currentYear.value ?? new Date().getFullYear()))
			syncOptionProxySelection('year', selectedYear)
			const yearButtons = Array.from(rootEl.querySelectorAll<HTMLElement>('.v-date-picker-years [data-sy-date-picker-option="year"], .v-date-picker-years .v-btn'))
			const selectedYearButton = yearButtons.find(button =>
				(button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '') === selectedYear,
			)
			if (selectedYearButton) {
				selectedYearButton.focus({ preventScroll: true })
				return true
			}
			return false
		},
		onYearChangeBridge: (newYearStr, oldYearStr) => {
			const curMonth = parseInt(currentMonth.value ?? '0', 10)
			const newYear = parseInt(newYearStr, 10)
			const prevYear = parseInt(oldYearStr ?? '0', 10)
			if (newYear > prevYear && curMonth === 11) {
				currentMonth.value = '0'
				currentMonthName.value = dayjs().month(0).format('MMMM')
			}
			else if (newYear < prevYear && curMonth === 0) {
				currentMonth.value = '11'
				currentMonthName.value = dayjs().month(11).format('MMMM')
			}
		},
	})

	const syncOptionProxySelection = (kind: 'month' | 'year', selectedLabel: string | null | undefined) => {
		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
		const normalizedLabel = selectedLabel?.trim()
		if (!rootEl || !normalizedLabel) return

		const selector = kind === 'month'
			? '.v-date-picker-months [data-sy-date-picker-option="month"]'
			: '.v-date-picker-years [data-sy-date-picker-option="year"]'
		const options = Array.from(rootEl.querySelectorAll<HTMLElement>(selector))

		options.forEach((option) => {
			const optionLabel = option.getAttribute('aria-label')?.trim()
				?? option.textContent?.trim()
				?? ''
			const isSelected = optionLabel === normalizedLabel
			option.setAttribute('aria-pressed', String(isSelected))
			option.setAttribute('aria-selected', String(isSelected))
			option.tabIndex = isSelected ? 0 : -1

			const button = option.querySelector<HTMLElement>('button')
			if (!button) return

			button.setAttribute('aria-pressed', String(isSelected))
			button.tabIndex = -1
		})
	}

	const emitBlurEvent = () => emit('blur')

	// --- Blur handler ---
	// useDatePickerInputBlurHandler reçoit des wrappers qui délèuent à validate() :
	// - validateTextInput → validate({ textValue }) pour la validation texte au blur
	// - replaceErrors → accès direct pour les erreurs de plage locales
	const { handleInputBlur } = useDatePickerInputBlurHandler({
		format: computed(() => props.format),
		dateFormatReturn: props.dateFormatReturn,
		required: computed(() => props.required),
		displayFormattedDate,
		hasInteracted,
		isManualInputActive,
		isUpdatingFromInternal,
		withInternalUpdate,
		selectedDates,
		replaceErrors,
		validateDateFormat: (value: string) => validateDateFormatUtil(value, props.format, props.dateFormatReturn, props.required, hasInteracted.value, props.disableErrorHandling),
		parseDate,
		formatDate,
		updateModel,
		// Wrapper : délègue au flow texte de validate()
		validateTextInput: (value: string) => validate({ textValue: value }) as Promise<boolean>,
		emitBlur: emitBlurEvent,
	})

	/**
	 * Gère les mises à jour de DateTextInput avec contrôle
	 */
	const handleDateTextInputUpdate = (value: DateModelValue) => {
		// Ne pas traiter les mises à jour internes pour éviter les boucles
		if (isUpdatingFromInternal.value) return

		withInternalUpdate(() => {
			updateModel(value)
			applyResolvedTextInputState(value)
		})
	}

	// Sync from external v-model
	watch(
		() => props.modelValue,
		(newValue) => {
			if (isUpdatingFromInternal.value) return
			withInternalUpdate(() => syncFromModelValue(newValue))
		},
		{ immediate: true },
	)

	// Observer pour personnaliser les boutons dès que le DatePicker devient visible
	watch(
		isDatePickerVisible,
		(visible) => {
			if (!visible) {
				handleDatePickerClosed()
			}

			if (visible) {
				handleDatePickerOpened()
			}
		},
	)

	/**
	 * Today button + labels
	 */
	const { todayInString, headerDate } = useTodayButton(props)
	const todayButtonLabel = computed(() => {
		return locales.selectTodayCapitalized(todayInString.value?.trim())
	})

	// Inlined from useAsteriskDisplay
	const isShouldDisplayAsterisk = computed(() => props.displayAsterisk && props.required)
	const labelWithAsterisk = computed(() => {
		const label = props.label
		return isShouldDisplayAsterisk.value && label
			? `${label} *`
			: label
	})
	const { displayedDateString } = useDisplayedDateString({ selectedDates, rangeBoundaryDates, todayInString })

	const applyTodaySelection = (todaySelection: ReturnType<typeof buildTodaySelectionState>): void => {
		selectedDates.value = todaySelection.selectedDates
		withInternalUpdate(() => {
			textInputValue.value = todaySelection.displayValue
			displayFormattedDate.value = todaySelection.displayValue
		})
		updateModel(todaySelection.modelValue)
		emit('date-selected', todaySelection.modelValue)
	}

	const handleSelectToday = () => {
		const todaySelection = buildTodaySelectionState({
			displayRange: props.displayRange,
			format: props.format,
			dateFormatReturn: props.dateFormatReturn,
			formatDate,
		})

		ignoreNextCalendarModelSync.value = false

		applyTodaySelection(todaySelection)

		syncDisplayedMonthYearFromDate(new Date())

		if (isDatePickerVisible.value) {
			closeAndRestoreFocus()
		}
	}

	// ─── API publique exposée au parent ──────────────────────────────
	// Le parent (ex: CalendarMode en useCombinedMode, SyForm, PeriodField) utilise
	// ces méthodes pour valider, réinitialiser, ouvrir/fermer le calendrier, etc.
	async function validateOnSubmit(): Promise<boolean> {
		if (props.noCalendar) {
			return await Promise.resolve(dateTextInputRef.value?.validateOnSubmit() || false)
		}
		const textInputValid = await Promise.resolve(dateCalendarTextInputRef.value?.validateOnSubmit() || false)
		await Promise.resolve(validate({ force: true }))
		return textInputValid && errorMessages.value.length === 0
	}

	function clearValidationForForm() {
		clearValidation()
	}

	// Reset hook utilisé par SyForm.reset() via useValidatable
	function reset() {
		// 1) Nettoyer l'état de validation et d'interaction
		clearValidation()
		isDatePickerVisible.value = false
		resetInteractionState()

		if (isInteractionDisabled.value) {
			fieldKey.value++
			return
		}

		// 2) Réinitialiser la valeur et la sélection SANS déclencher
		// de validation "required" interactive
		withInternalUpdate(() => {
			selectedDates.value = null
			textInputValue.value = ''
			displayFormattedDate.value = ''
			// Synchroniser le modèle externe
			emit('update:modelValue', null)
		})

		// 3) Forcer la recréation du champ pour réinitialiser l'état interne de Vuetify
		fieldKey.value++
	}

	defineExpose({
		validateOnSubmit,
		isDatePickerVisible,
		selectedDates,
		errorMessages,
		errors: readonly(errors),
		warnings: readonly(warnings),
		successes: readonly(successes),
		handleClickOutside,
		initializeSelectedDates,
		handleSelectToday,
		updateAccessibility,
		openDatePicker,
		updateDisplayFormattedDate,
		currentMonth,
		currentMonthName,
		toggleDatePicker,
		validate,
		clearValidation,
		formatDateInput,
		emitBlur: emitBlurEvent,
		validateDateFormat: (value: string) => validateDateFormatUtil(value, props.format, props.dateFormatReturn, props.required, hasInteracted.value, props.disableErrorHandling),
		displayFormattedDate,
		// Expose for consumers
		handleDateSelected,
		updateSelectedDates,
		resetViewMode,
		reset,
	})
</script>

<template>
	<div class="date-picker-container">
		<DatePickerLiveRegion :text="accessibilityDescription" />

		<template v-if="props.noCalendar">
			<DateTextInput
				ref="dateTextInputRef"
				:key="fieldKey"
				v-model="textInputValue"
				:class="[messageClasses, 'label-hidden-on-focus']"
				v-bind="noCalendarTextInputProps"
				@focus="emit('focus')"
				@blur="emit('blur')"
			/>
		</template>

		<template v-else>
			<VMenu
				v-model="isDatePickerVisible"
				:activator="menuActivatorRef"
				:min-width="0"
				location="bottom"
				:persistent="true"
				:close-on-content-click="false"
				:open-on-click="false"
				scroll-strategy="none"
				transition="fade-transition"
				:offset="[0, 10]"
				content-class="date-picker-overlay-content"
			>
				<template #activator="{ props: menuProps }">
					<div
						ref="menuActivatorRef"
						class="date-text-input-activator"
						:title="props.placeholder || locales.label"
						v-bind="{ ...menuProps, 'aria-expanded': undefined, 'aria-haspopup': undefined, 'aria-owns': undefined, 'aria-controls': isDatePickerVisible ? datePickerDialogId : undefined }"
						@focus="redirectActivatorFocus"
					>
						<DateTextInput
							ref="dateCalendarTextInputRef"
							:key="fieldKey"
							:model-value="textInputValue"
							:class="[messageClasses, 'label-hidden-on-focus']"
							v-bind="menuTextInputProps"
							@mousedown="openDatePickerFromInputClick"
							@update:model-value="handleDateTextInputUpdate"
							@focus="openDatePickerOnFocus"
							@blur="handleCalendarInputBlur"
							@input="handleInput"
							@keydown="handleKeydown"
							@date-selected="handleDateSelected"
							@prepend-icon-click="openDatePickerOnIconClick"
							@append-icon-click="openDatePickerOnIconClick"
						/>
					</div>
				</template>

				<div
					v-if="isDatePickerVisible && !props.noCalendar"
					:id="datePickerDialogId"
					ref="datePickerMenuRef"
					tabindex="-1"
					role="dialog"
					:aria-labelledby="datePickerTitleId"
				>
					<VDatePicker
						:id="datePickerContentId"
						ref="datePickerRef"
						v-model="calendarSelectedDates"
						control-variant="modal"
						color="primary"
						:class="props.displayWeekendDays ? 'weekend' : ''"
						:first-day-of-week="1"
						:multiple="props.displayRange ? 'range' : false"
						:show-adjacent-months="true"
						:show-week="props.showWeekNumber"
						:view-mode="currentViewMode"
						:month="currentMonth !== null ? Number(currentMonth) : undefined"
						:year="currentYear !== null ? Number(currentYear) : undefined"
						:max="maxDate"
						:min="minDate"
						:custom-rules="props.customRules"
						:custom-warning-rules="props.customWarningRules"
						:display-holiday-days="props.displayHolidayDays"
						:display-asterisk="props.displayAsterisk"
						:is-validate-on-blur="props.isValidateOnBlur"
						:error-messages="errorMessages"
						:density="props.density"
						:hint="props.hint"
						:persistent-hint="props.persistentHint"
						@update:model-value="updateDisplayFormattedDate"
						@update:view-mode="handleViewModeUpdateWrapper"
						@update:month="onUpdateMonth"
						@update:year="onUpdateYear"
						@click:date="updateSelectedDates"
					>
						<template #title>
							<span
								:id="datePickerTitleId"
								class="date-picker-title"
							>
								{{ locales.calendarTitle }}
							</span>
						</template>
						<template #day="{ props: dayProps, item }">
							<DatePickerDay
								:slot-props="{ props: dayProps, item, i: 0 }"
								:display-holiday-days="props.displayHolidayDays"
							/>
						</template>
						<template #month="{ month, i, props: monthProps }">
							<DatePickerMonthOption
								:slot-props="{ month, i, props: monthProps }"
							/>
						</template>
						<template #year="{ year, i, props: yearProps }">
							<DatePickerYearOption
								:slot-props="{ year, i, props: yearProps }"
							/>
						</template>
						<template #controls="{ viewMode, disabled, monthYearText, monthText, yearText, openMonths, openYears, prevMonth, nextMonth, prevYear, nextYear }">
							<DatePickerControls
								:slot-props="{ viewMode, disabled, monthYearText, monthText, yearText, openMonths, openYears, prevMonth, nextMonth, prevYear, nextYear }"
								:displayed-month="currentMonth !== null ? Number(currentMonth) : null"
								:displayed-year="currentYear !== null ? Number(currentYear) : null"
							/>
						</template>
						<template #header>
							<SyHeading
								:id="datePickerHeadingId"
								class="mx-auto my-auto ml-5 mb-4"
								:level="headingLevel"
							>
								{{ selectedDates ? displayedDateString : headerDate }}
							</SyHeading>
						</template>
						<template
							v-if="props.displayTodayButton"
							#actions
						>
							<div class="d-flex justify-center align-center w-100">
								<VBtn
									v-if="props.displayTodayButton"
									type="button"
									size="x-small"
									color="primary"
									:title="todayButtonLabel"
									:aria-label="todayButtonLabel"
									class="date-picker__today-button my-2 pa-2 mt-2"
									:ripple="false"
									@click="handleSelectToday"
									@keydown.enter.prevent.stop="handleSelectToday"
									@keydown.space.prevent.stop="handleSelectToday"
								>
									<SyIcon
										size="16px"
										decorative
										:icon="mdiCalendarMonthOutline"
									/>
									{{ locales.buttonToday }}
								</VBtn>
							</div>
						</template>
					</VDatePicker>
				</div>
			</VMenu>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@use '../styles/datePickerShared';

.dp-width {
	width: v-bind('props.width');
}
</style>
