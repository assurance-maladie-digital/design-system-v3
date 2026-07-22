	<script lang="ts" setup>
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
		useDatePickerFocusTrap,
		useDatePickerState,
		useDatePickerValidation,
		useDatePickerViewMode,
		useDatePickerVisibility,
		useDateRangeValidation,
		useDateSelection,
		useDisplayedDateString,
		useHolidayHighlighting,
		useInputBlurHandler,
		useMonthButtonCustomization,
		useSelectedDayAria,
		useTodayButton,
		validateDateFormat as validateDateFormatUtil,
		isDateComplete as isDateCompleteUtil,
		useDatePickerDerivedValues,
	} from '../composables'
	import type { ViewMode } from '../composables/useDatePickerViewMode'
	import dayjs from 'dayjs'
	import DateTextInput from '../DateTextInput/DateTextInput.vue'
	import { VDatePicker } from 'vuetify/components'
	import { useInputHandler } from '../composables/useInputHandler'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import type { DateObjectValue, DatePickerCommonProps } from '../types'
	import { DatePickerCommonDefaults } from '../types'
	import { useDatePickerAccessibility } from '@/composables/date/useDatePickerAccessibility'
	import { useDateTextInputProps } from './props/dateTextInputProps'
	import { useDateTextInputMenuProps } from './props/dateTextInputMenuProps'
	import { locales } from '../locales'
	import { mdiCalendarMonthOutline } from '@mdi/js'
	import {
		formatDateRangeDisplay,
		getDateDescription as getDateDescriptionUtil,
		getDisplayedMonthYearState,
	} from '../utils/dateFormattingUtils'
	import { validateEmptyOrIncompleteDate, adaptCustomRules } from '../utils/validationUtils'
	import type { ValidationRule } from '@/composables/validation/useValidation'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'

	dayjs.extend(customParseFormat)

	const { parseDate, formatDate } = useDateFormat()
	const { initializeSelectedDates } = useDateInitialization()
	const { updateAccessibility, cleanupGridSemantics } = useDatePickerAccessibility()

	/**
	 * Utils
	 */
	const withInternalUpdate = (fn: () => void) => {
		try {
			isUpdatingFromInternal.value = true
			fn()
		}
		finally {
			queueMicrotask(() => (isUpdatingFromInternal.value = false))
		}
	}

	// const unifyAfterCalendarUpdate = async () => {
	// 	if (!isDatePickerVisible.value) return
	// 	await nextTick()
	// 	customizeMonthButton()
	// 	markHolidayDays()
	// }

	/**
	 * Calendar current month / year
	 */
	const currentMonth = ref<string | null>(null)
	const currentYear = ref<string | null>(null)
	const currentMonthName = ref<string | null>(null)
	const currentYearName = ref<string | null>(null)

	// Fonction pour mettre à jour le mois quand on navigue via les flèches
	const onUpdateMonth = (month: string) => {
		if (currentMonth.value === month) return
		currentMonth.value = month
		currentMonthName.value = dayjs().month(parseInt(month, 10)).format('MMMM')
		handleMonthUpdate()
		nextTick(() => {
			if (isDatePickerVisible.value) {
				customizeMonthButton()
				markHolidayDays()
				updateSelectedDayAria()
				nextTick(focusInitialDay)
			}
		})
	}

	// Fonction pour mettre à jour l'année quand on navigue via les flèches
	const onUpdateYear = (year: string) => {
		const oldYear = currentYear.value
		currentYear.value = year
		currentYearName.value = year

		const curMonth = parseInt(currentMonth.value ?? '0', 10)
		const newYear = parseInt(year, 10)
		const prevYear = parseInt(oldYear ?? '0', 10)

		// Bridges Dec -> Jan and Jan -> Dec when navigating years
		if (newYear > prevYear && curMonth === 11) {
			currentMonth.value = '0'
			currentMonthName.value = dayjs().month(0).format('MMMM')
		}
		else if (newYear < prevYear && curMonth === 0) {
			currentMonth.value = '11'
			currentMonthName.value = dayjs().month(11).format('MMMM')
		}

		handleYearUpdate()
		nextTick(() => {
			if (isDatePickerVisible.value) {
				customizeMonthButton()
				markHolidayDays()
				updateSelectedDayAria()
				nextTick(focusInitialDay)
			}
		})
	}

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

	const shouldRestoreFocusToInput = ref(false)
	const shouldMoveFocusToDialogOnOpen = ref(false)
	const keyboardNavigatedDate = ref<Date | null>(null)

	const scheduleCalendarInputFocusRestore = () => {
		shouldRestoreFocusToInput.value = true
	}

	const scheduleDialogInitialFocus = () => {
		shouldMoveFocusToDialogOnOpen.value = true
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

	const closeDatePicker = async (options: { restoreFocus?: boolean } = {}) => {
		if (!isDatePickerVisible.value) return

		isDatePickerVisible.value = false
		emit('closed')

		if (options.restoreFocus) {
			scheduleCalendarInputFocusRestore()
		}

		await validateDates()
	}

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

	/**
	 * Selection state
	 */
	const selectedDates = ref<Date | (Date | null)[] | null>(
		initializeSelectedDates(props.modelValue as DateInput | null, props.format, props.dateFormatReturn),
	)
	const { currentRangeIsValid, getRangeValidationError } = useDateRangeValidation(
		selectedDates as Ref<DateObjectValue>,
		props.displayRange,
	)
	// Force re-render of DateTextInput/SyTextField when needed (e.g., after reset)
	const fieldKey = ref(0)
	const isManualInputActive = ref(false)
	const isFormatting = ref(false)
	const isUpdatingFromInternal = ref(false)
	const hasInteracted = ref(false)
	const preventCloseOnInternalUpdate = ref(false)
	const skipNextInputBlurProcessing = ref(false)
	const suppressNextCalendarModelValueUpdate = ref(false)

	const {
		validation,
		errors,
		warnings,
		validateField,
		clearValidation,
		validateDates,
	} = useDatePickerValidation({
		showSuccessMessages: computed(() => props.showSuccessMessages),
		disableErrorHandling: computed(() => props.disableErrorHandling),
		noCalendar: computed(() => props.noCalendar),
		required: computed(() => props.required),
		displayRange: computed(() => props.displayRange),
		customRules: computed(() => props.customRules),
		customWarningRules: computed(() => props.customWarningRules),
		selectedDates,
		isUpdatingFromInternal,
		currentRangeIsValid,
		getRangeValidationError,
		revalidateOnCustomRulesChange: true,
		readonly: computed(() => props.readonly),
		skipValidationWhenReadonly: true,
	})
	const errorMessages = computed(() => errors.value)
	const warningMessages = computed(() => warnings.value)

	const messageClasses = computed(() => ({
		'dp-width': true,
		'v-messages__message--error': errorMessages.value.length > 0,
		'v-messages__message--warning': warningMessages.value.length > 0 && errorMessages.value.length === 0,
		'v-messages__message--success': validation.hasSuccess.value,
	}))

	// Props regroupées pour DateTextInput (mode noCalendar)
	const dateTextInputProps = computed(() => useDateTextInputProps(props, labelWithAsterisk, errorMessages))

	// Props regroupées pour DateTextInput (mode VMenu)
	const dateTextInputMenuProps = computed(() => useDateTextInputMenuProps(props, labelWithAsterisk, errorMessages))

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
		validateDates,
		emitClosed: () => emit('closed'),
		emitFocus: () => emit('focus'),
	})

	const openDatePickerOnIconClick = () => {
		if (isInteractionDisabled.value) return
		skipNextInputBlurProcessing.value = true
		suppressNextCalendarModelValueUpdate.value = true
		openDatePickerOnIconClickFromVisibility()
	}

	const openDatePickerFromInputClick = (event?: MouseEvent) => {
		const input = getCalendarInputElement()
		if (isInteractionDisabled.value || isDatePickerVisible.value || !input) return
		if (event && (event.target !== input || document.activeElement !== input)) return
		// Ne pas ouvrir le calendrier si le clic vient du bouton clear
		if (event && (event.target as HTMLElement)?.closest('.sy-text-field__clear')) return

		openDatePicker()
	}

	const updateModel = (value: DateModelValue) => {
		// Prevent redundant emits
		if (JSON.stringify(value) === JSON.stringify(props.modelValue)) return
		withInternalUpdate(() => emit('update:modelValue', value))
	}

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
		initializeSelectedDates,
		validateDates,
		updateModel,
		generateDateRange: dateSelectionResult.generateDateRange,
	})

	// Display helpers (centralised in useDatePickerState)
	const displayFormattedDateComputed = displayFormattedFromSelectedDates

	watch(displayFormattedDateComputed, (newValue) => {
		if (!props.noCalendar && newValue) displayFormattedDate.value = newValue
	})

	const updateSelectedDates = async (date: Date | null) => {
		suppressNextCalendarModelValueUpdate.value = false

		if (date !== null) {
			const validationResult = await Promise.resolve(validateField(date, props.customRules, props.customWarningRules))
			if (validationResult.hasError) {
				errors.value = validationResult.state.errors
				return
			}
		}
		dateSelectionResult.updateSelectedDates(date)
		if (date !== null && isDatePickerVisible.value && !props.displayRange) {
			withInternalUpdate(() => {
				syncTextInputFromSelection()
			})
			updateModel(formatDate(date, returnFormat.value))
			displayFormattedDate.value = formatDate(date, props.format)
			closeDatePicker({ restoreFocus: true })
		}
		// Validate immediately to surface messages
		queueMicrotask(() => validateDates(true))
	}

	watch(selectedDates, (newValue) => {
		validateDates()
		if (newValue !== null) {
			keyboardNavigatedDate.value = Array.isArray(newValue)
				? (newValue.find(date => date instanceof Date) as Date | null) ?? null
				: newValue
			if (suppressNextCalendarModelValueUpdate.value && isDatePickerVisible.value) {
				suppressNextCalendarModelValueUpdate.value = false
				withInternalUpdate(() => {
					syncTextInputFromSelection()
				})
				return
			}

			if (!preventCloseOnInternalUpdate.value) {
				updateModel(formattedDate.value)
			}
			withInternalUpdate(() => {
				syncTextInputFromSelection()
			})

			let baseDate: Date | null = null
			if (Array.isArray(newValue)) {
				baseDate = (newValue.find(date => date instanceof Date) as Date | null) ?? null
			}
			else {
				baseDate = newValue
			}
			if (baseDate) {
				const displayedState = getDisplayedMonthYearState(baseDate)
				currentMonth.value = displayedState.month
				currentMonthName.value = displayedState.monthName
				currentYear.value = displayedState.year
				currentYearName.value = displayedState.yearName
			}
			if (isDatePickerVisible.value) {
				nextTick(() => {
					customizeMonthButton()
					markHolidayDays()
					updateSelectedDayAria()
				})
			}

			const hasCompletedRangeSelection = props.displayRange
				&& (
					(rangeBoundaryDates.value?.[0] && rangeBoundaryDates.value?.[1])
					|| (Array.isArray(newValue) && newValue.length >= 2 && newValue[0] && newValue[newValue.length - 1])
				)

			if (
				isDatePickerVisible.value
				&& !preventCloseOnInternalUpdate.value
				&& (!props.displayRange || hasCompletedRangeSelection)
			) {
				closeDatePicker({ restoreFocus: true })
			}
		}
		else {
			keyboardNavigatedDate.value = null
			updateModel(null)
			withInternalUpdate(() => {
				syncTextInputFromSelection()
			})
			// Reset month/year names when clearing the date
			const today = new Date()
			const displayedState = getDisplayedMonthYearState(today)
			currentMonth.value = displayedState.month
			currentMonthName.value = displayedState.monthName
			currentYear.value = displayedState.year
			currentYearName.value = displayedState.yearName
			if (isDatePickerVisible.value) {
				nextTick(() => {
					customizeMonthButton()
					markHolidayDays()
					updateSelectedDayAria()
				})
			}
		}
	})

	const formatDateInput = (input: string, cursorPosition?: number): { formatted: string, cursorPos: number } => {
		const cleanedInput = input.replace(/[^\d]/g, '')
		const separator = props.format.match(/[^DMY]/)?.[0] || '/'
		const inputBeforeCursor = input.substring(0, cursorPosition || 0)
		const digitsBeforeCursor = inputBeforeCursor.replace(/[^\d]/g, '').length

		let result = ''
		let digitIndex = 0
		for (let i = 0; i < props.format.length && digitIndex < cleanedInput.length; i++) {
			const formatChar = props.format[i]?.toUpperCase()
			if (formatChar && ['D', 'M', 'Y'].includes(formatChar)) {
				result += cleanedInput[digitIndex]
				digitIndex++
			}
			else {
				result += separator
			}
		}

		let newCursorPos = digitsBeforeCursor
		for (let i = 0, digitCount = 0; i < props.format.length && digitCount < digitsBeforeCursor; i++) {
			if (!['D', 'M', 'Y'].includes(props.format[i]!.toUpperCase())) newCursorPos++
			else digitCount++
		}

		return { formatted: result, cursorPos: Math.min(newCursorPos, result.length) }
	}

	// Handle manual typing sync → model/selection
	watch(textInputValue, (newValue) => {
		// En mode plage, on laisse DateTextInput + handleDateTextInputUpdate
		// piloter la mise à jour du modèle et de selectedDates
		if (props.displayRange) return
		if (isUpdatingFromInternal.value) return
		const date = parseDate(newValue, props.format)
		if (date) {
			const formattedValue = props.dateFormatReturn ? formatDate(date, returnFormat.value) : formatDate(date, props.format)
			updateModel(formattedValue)
			withInternalUpdate(() => {
				selectedDates.value = date
				displayFormattedDate.value = formatDate(date, props.format)
			})
		}
		else if (newValue) {
			updateModel(newValue)
			withInternalUpdate(() => (displayFormattedDate.value = newValue))
		}
		else {
			updateModel(null)
			withInternalUpdate(() => {
				displayFormattedDate.value = ''
				selectedDates.value = null
			})
		}
	})

	/**
	 * UI updates after picking
	 */
	const updateDisplayFormattedDate = () => {
		if (suppressNextCalendarModelValueUpdate.value) {
			suppressNextCalendarModelValueUpdate.value = false
			return
		}

		queueMicrotask(() => {
			let formattedValue = ''

			if (props.displayRange) {
				if (rangeBoundaryDates.value?.[0] && rangeBoundaryDates.value?.[1]) {
					formattedValue = formatDateRangeDisplay(
						rangeBoundaryDates.value[0],
						rangeBoundaryDates.value[1],
						props.format,
						formatDate,
					)
					displayFormattedDate.value = textInputValue.value = formattedValue
					const formattedDates = [
						formatDate(rangeBoundaryDates.value[0], returnFormat.value),
						formatDate(rangeBoundaryDates.value[1], returnFormat.value),
					] as [string, string]
					updateModel(formattedDates)
					emit('date-selected', formattedDates)
					closeDatePicker({ restoreFocus: true })
				}
				else if (Array.isArray(selectedDates.value) && selectedDates.value.length >= 2) {
					const formattedDates = [
						formatDate(selectedDates.value[0]!, props.format),
						formatDate(selectedDates.value[selectedDates.value.length - 1]!, props.format),
					] as [string, string]
					formattedValue = formatDateRangeDisplay(
						selectedDates.value[0]!,
						selectedDates.value[selectedDates.value.length - 1]!,
						props.format,
						formatDate,
					)
					displayFormattedDate.value = textInputValue.value = formattedValue
					updateModel(formattedDates)
					emit('date-selected', formattedDates)
					closeDatePicker({ restoreFocus: true })
				}
				else {
					formattedValue = displayFormattedDateComputed.value || ''
					displayFormattedDate.value = textInputValue.value = formattedValue
				}
			}
			else {
				formattedValue = displayFormattedDateComputed.value || ''
				displayFormattedDate.value = textInputValue.value = formattedValue
				closeDatePicker({ restoreFocus: true })
				emit('date-selected', formattedDate.value)
			}

			validateDates()
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
	const datePickerHeadingId = `${datePickerContentId}-heading`

	const { handleMenuKeydown } = useDatePickerFocusTrap({
		isDatePickerVisible,
		datePickerRef: datePickerRef as unknown as Ref<ComponentPublicInstance | null>,
		onClose: () => closeDatePicker({ restoreFocus: true }),
		restoreFocus: () => scheduleCalendarInputFocusRestore(),
		getInitialFocusDate: () => {
			const value = selectedDates.value
			const selected = Array.isArray(value) ? value[0] ?? null : value
			return selected ?? new Date()
		},
	})

	const syncDialogKeydownListener = () => {
		datePickerMenuRef.value?.removeEventListener('keydown', handleMenuKeydown, true)

		if (isDatePickerVisible.value && datePickerMenuRef.value) {
			datePickerMenuRef.value.addEventListener('keydown', handleMenuKeydown, true)
		}
	}

	/**
	 * Holiday marking (partagé via useHolidayHighlighting)
	 */
	const { markHolidayDays } = useHolidayHighlighting({
		currentMonth,
		currentYear,
		isDisplayHolidayDays: () => props.displayHolidayDays,
		rootElement: computed(
			() => datePickerRef.value?.$el as HTMLElement | null,
		),
	})

	const { updateSelectedDayAria } = useSelectedDayAria({
		rootElement: computed(
			() => datePickerRef.value?.$el as HTMLElement | null,
		),
	})

	onMounted(() => {
		setupMonthButtonObserver()
		if (displayFormattedDateComputed.value) displayFormattedDate.value = displayFormattedDateComputed.value
		validateDates()
		nextTick(syncComboboxInputSemantics)
		nextTick(syncDialogKeydownListener)
	})

	onBeforeUnmount(() => {
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
						currentMonth.value = displayedState.month
						currentYear.value = displayedState.year
						currentMonthName.value = displayedState.monthName
						currentYearName.value = displayedState.yearName
						nextTick(() => {
							customizeMonthButton()
							markHolidayDays()
							updateSelectedDayAria()
						})
					}
				}
			})
		},
		onSelectDate: (date: Date) => {
			void updateSelectedDates(date)
		},
	})

	/**
	 * Input handling (text field)
	 */
	const inputHandler = useInputHandler({
		format: computed(() => props.format),
		displayRange: computed(() => props.displayRange),
		dateFormatReturn: props.dateFormatReturn,
		disableErrorHandling: computed(() => props.disableErrorHandling),
		parseDate,
		formatDate,
		generateDateRange: dateSelectionResult.generateDateRange,
		isDateComplete: (val: string) => isDateCompleteUtil(val, props.format),
		displayFormattedDate,
		selectedDates,
		isFormatting,
		isManualInputActive,
		isUpdatingFromInternal,
		clearValidation,
		validateField: (value, rules, warningRules) => validateField(value, rules, warningRules),
		updateModel: value => updateModel(value as DateModelValue),
		emitInput: value => emit('input', value),
		inputRef: dateCalendarTextInputRef as Ref<ComponentPublicInstance | null>,
	})

	const handleKeydown = (event: KeyboardEvent) => {
		if (props.readonly) return

		const input = isSelectableInput(event.target) ? event.target : null
		if (!input) return

		if (!props.noCalendar && (event.key === 'Enter' || event.key === 'ArrowDown') && !isInteractionDisabled.value) {
			event.preventDefault()
			skipNextInputBlurProcessing.value = true
			scheduleDialogInitialFocus()
			suppressNextCalendarModelValueUpdate.value = true
			openDatePicker()
			return
		}

		if (!props.noCalendar && handleKeyboardNavigation(event)) {
			skipNextInputBlurProcessing.value = true
			scheduleDialogInitialFocus()
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

	const handleCalendarInputBlur = async () => {
		if (skipNextInputBlurProcessing.value && isDatePickerVisible.value) {
			skipNextInputBlurProcessing.value = false
			emitBlurEvent()
			return
		}

		skipNextInputBlurProcessing.value = false
		await handleInputBlur()
	}

	const handleInput = (eventOrValue: Event | string) => {
		if (props.readonly) return

		if (eventOrValue instanceof Event) {
			inputHandler.handleInput(eventOrValue)
			return
		}

		textInputValue.value = eventOrValue

		if (props.displayRange && typeof eventOrValue === 'string') {
			if (eventOrValue.includes(locales.rangeSeparator)) {
				const [startDateStr = '', endDateStr = ''] = eventOrValue.split(locales.rangeSeparator).map(s => s.trim())
				if (startDateStr && endDateStr && !endDateStr.includes('_')) {
					const startDate = parseDate(startDateStr, props.format)
					const endDate = parseDate(endDateStr, props.format)
					if (startDate && endDate) {
						selectedDates.value = dateSelectionResult.generateDateRange(startDate, endDate)
						validateDates()
					}
				}
			}
		}
		else {
			validateDates()
		}
	}

	/**
	 * Month/year controls customization
	 */
	const { customizeMonthButton, setupMonthButtonObserver } = useMonthButtonCustomization(
		() => isDatePickerVisible.value,
		currentMonthName,
		currentYearName,
		() => datePickerRef.value?.$el as HTMLElement | undefined,
	)

	/**
	 * View mode handling
	 */
	const { currentViewMode, handleViewModeUpdate, handleYearUpdate, handleMonthUpdate, resetViewMode }
		= useDatePickerViewMode(
			() => props.isBirthDate || props.birthDate,
			() => selectedDates.value,
		)

	const reapplyAccessibility = () => {
		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
		if (!rootEl) return

		const activeElement = document.activeElement instanceof HTMLElement
			? document.activeElement
			: null
		const activeDay = activeElement?.closest<HTMLElement>('.v-date-picker-month__day[data-v-date]')
		const activeMonthButton = activeElement?.closest<HTMLButtonElement>('.v-date-picker-months .v-btn')
		const activeYearButton = activeElement?.closest<HTMLButtonElement>('.v-date-picker-years .v-btn')
		const shouldRestoreButtonFocus = activeElement?.tagName === 'BUTTON'
		const dayDate = activeDay?.getAttribute('data-v-date')
		const monthLabel = activeMonthButton?.getAttribute('aria-label') ?? activeMonthButton?.textContent?.trim() ?? ''
		const yearLabel = activeYearButton?.getAttribute('aria-label') ?? activeYearButton?.textContent?.trim() ?? ''
		cleanupGridSemantics(rootEl)
		nextTick(() => {
			updateAccessibility(rootEl, currentViewMode.value)
			nextTick(() => {
				if (!activeElement || (!rootEl.contains(activeElement) && !dayDate && !monthLabel && !yearLabel)) return

				if (dayDate) {
					const dayCell = rootEl.querySelector<HTMLElement>(`.v-date-picker-month__day[data-v-date="${dayDate}"]`)
					const focusTarget = shouldRestoreButtonFocus
						? dayCell?.querySelector<HTMLElement>('button')
						: dayCell
					focusTarget?.focus({ preventScroll: true })
					return
				}

				if (monthLabel) {
					const monthButtons = Array.from(rootEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-months .v-btn'))
					const target = monthButtons.find(button =>
						(button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '') === monthLabel,
					)
					target?.focus({ preventScroll: true })
					return
				}

				if (yearLabel) {
					const yearButtons = Array.from(rootEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-years .v-btn'))
					const target = yearButtons.find(button =>
						(button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '') === yearLabel,
					)
					target?.focus({ preventScroll: true })
				}
			})
		})
	}

	const waitForTransitionEnd = (container: HTMLElement, callback: () => void) => {
		if (container.classList.contains('v-enter-active') || container.classList.contains('fade-transition-enter-active')) {
			let fired = false
			const handler = () => {
				if (fired) return
				fired = true
				clearTimeout(fallbackId)
				callback()
			}
			const fallbackId = setTimeout(handler, 400)
			container.addEventListener('transitionend', handler, { once: true })
		}
		else {
			callback()
		}
	}

	const handleViewModeUpdateWrapper = (mode: ViewMode) => {
		handleViewModeUpdate(mode)
		reapplyAccessibility()
		if (mode === 'month') {
			nextTick(() => {
				if (isDatePickerVisible.value) {
					const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
					if (!rootEl) return
					const monthContainer = rootEl.querySelector<HTMLElement>('.v-date-picker-month')
					if (!monthContainer) {
						focusInitialDay()
						return
					}

					waitForTransitionEnd(monthContainer, () => focusInitialDay())
				}
			})
		}
		if (mode === 'months') {
			nextTick(() => {
				const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
				if (!rootEl) return
				const monthsContainer = rootEl.querySelector<HTMLElement>('.v-date-picker-months')
				if (!monthsContainer) return

				const focusActiveMonth = () => {
					const active = rootEl.querySelector<HTMLElement>('.v-date-picker-months .v-btn--active')
					if (active) {
						active.focus({ preventScroll: true })
						return
					}
					const monthIndex = currentMonth.value !== null ? Number(currentMonth.value) : new Date().getMonth()
					const monthBtns = rootEl.querySelectorAll<HTMLElement>('.v-date-picker-months .v-btn')
					monthBtns[monthIndex]?.focus({ preventScroll: true })
				}

				waitForTransitionEnd(monthsContainer, focusActiveMonth)
			})
		}
		if (mode === 'year') {
			nextTick(() => {
				const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
				if (!rootEl) return
				const yearsContainer = rootEl.querySelector<HTMLElement>('.v-date-picker-years')
				if (!yearsContainer) return

				const focusActiveYear = () => {
					const active = rootEl.querySelector<HTMLElement>('.v-date-picker-years .v-btn--active')
					if (active) {
						active.focus({ preventScroll: true })
						return
					}
					const currentYearBtn = rootEl.querySelector<HTMLElement>('.v-date-picker-years .v-date-picker-years__year--current .v-btn')
					if (currentYearBtn) {
						currentYearBtn.focus({ preventScroll: true })
						return
					}
					const firstBtn = rootEl.querySelector<HTMLElement>('.v-date-picker-years .v-btn')
					firstBtn?.focus({ preventScroll: true })
				}

				waitForTransitionEnd(yearsContainer, focusActiveYear)
			})
		}
	}

	/**
	 * Manual input validation on blur
	 */
	const validateManualInput = (value: string): boolean | Promise<boolean> => {
		clearValidation()

		// Vérifier les cas de champ vide ou incomplet
		const emptyCheck = validateEmptyOrIncompleteDate(
			value,
			props.required,
			(val: string) => isDateCompleteUtil(val, props.format),
			hasInteracted.value,
		)

		// Gérer les erreurs pour champ vide requis
		if (!emptyCheck.isValid && !props.disableErrorHandling && emptyCheck.errorMessage) {
			errors.value.push(locales.required)
		}

		// Si on ne doit pas continuer la validation (champ vide/incomplet)
		if (!emptyCheck.shouldContinue) {
			return emptyCheck.isValid
		}

		// Valider le format de la date
		const formatValidation = validateDateFormatUtil(value, props.format, props.dateFormatReturn, props.required, hasInteracted.value, props.disableErrorHandling)
		if (!formatValidation.isValid) {
			if (!props.disableErrorHandling && formatValidation.message) {
				errors.value.push(formatValidation.message)
			}
			return false
		}

		// Si le format est valide, vérifier si la date peut être parsée
		const date = parseDate(value, props.format)
		if (!date) {
			// La date n'a pas pu être parsée
			if (!props.disableErrorHandling) {
				errors.value.push(locales.invalidDateFormatWithFormat(props.format))
			}
			return false
		}

		// Valider les règles personnalisées
		if (!props.disableErrorHandling) {
			const currentCustomRules = props.customRules
			const currentCustomWarningRules = props.customWarningRules

			// Filtrer les règles qui sont prêtes (ont une date définie)
			const readyRules = currentCustomRules.filter((rule) => {
				if (rule.type === 'notBeforeDate' || rule.type === 'notAfterDate' || rule.type === 'exactDate') {
					return rule.options && rule.options.date !== undefined
				}
				return true
			})

			// Si aucune règle n'est prête, skip la validation
			if (readyRules.length === 0 && currentCustomRules.length > 0) {
				return true
			}

			// Adapter les règles prêtes pour maintenir la compatibilité avec les tests existants
			const safeCustomRules = adaptCustomRules(readyRules, props.format)
			const safeWarningRules = adaptCustomRules(currentCustomWarningRules, props.format)

			// Appeler validateField pour évaluer les règles
			const result = validateField(
				date,
				safeCustomRules as ValidationRule[],
				safeWarningRules as ValidationRule[],
			)

			if (result instanceof Promise) {
				return result.then(resolvedResult => !resolvedResult.hasError)
			}

			return !result.hasError
		}

		return errors.value.length === 0
	}

	const emitBlurEvent = () => emit('blur')

	const { handleInputBlur } = useInputBlurHandler({
		format: computed(() => props.format),
		dateFormatReturn: props.dateFormatReturn,
		required: computed(() => props.required),
		displayFormattedDate,
		hasInteracted,
		isManualInputActive,
		isUpdatingFromInternal,
		selectedDates,
		errors,
		validateDateFormat: (value: string) => validateDateFormatUtil(value, props.format, props.dateFormatReturn, props.required, hasInteracted.value, props.disableErrorHandling),
		parseDate,
		formatDate,
		updateModel,
		validateManualInput,
		emitBlur: emitBlurEvent,
	})

	/**
	 * Gère les mises à jour de DateTextInput avec contrôle
	 */
	const handleDateTextInputUpdate = (value: DateModelValue) => {
		// Ne pas traiter les mises à jour internes pour éviter les boucles
		if (isUpdatingFromInternal.value) return

		try {
			isUpdatingFromInternal.value = true

			// 1) Propager la valeur brute vers le v-model externe
			updateModel(value)

			// 2) Mettre à jour selectedDates / displayFormattedDate pour refléter la saisie manuelle
			if (!value) {
				selectedDates.value = null
				displayFormattedDate.value = ''
				return
			}

			if (Array.isArray(value) && props.displayRange) {
				const [startStr, endStr] = value
				const rf = returnFormat.value
				const startDate = startStr ? parseDate(startStr, rf) || parseDate(startStr, props.format) : null
				const endDate = endStr ? parseDate(endStr, rf) || parseDate(endStr, props.format) : null

				if (startDate && endDate) {
					selectedDates.value = dateSelectionResult.generateDateRange(startDate, endDate)
					displayFormattedDate.value = formatDateRangeDisplay(startDate, endDate, props.format, formatDate)
				}
				else if (startDate) {
					// Première date saisie uniquement
					selectedDates.value = [startDate]
					displayFormattedDate.value = formatDate(startDate, props.format)
				}
				else {
					selectedDates.value = null
					displayFormattedDate.value = ''
				}
			}
			else if (typeof value === 'string') {
				const rf = returnFormat.value
				const date = parseDate(value, rf) || parseDate(value, props.format)
				if (date) {
					selectedDates.value = date
					displayFormattedDate.value = formatDate(date, props.format)
				}
				else {
					selectedDates.value = null
					displayFormattedDate.value = ''
				}
			}
		}
		finally {
			queueMicrotask(() => {
				isUpdatingFromInternal.value = false
			})
		}
	}

	// Sync from external v-model
	watch(
		() => props.modelValue,
		(newValue) => {
			if (isUpdatingFromInternal.value) {
				if (preventCloseOnInternalUpdate.value) {
					return
				}
				// Internal model sync is not a reliable dialog-close signal.
				// Actual user selections already close through selectedDates/updateDisplayFormattedDate.
				return
			}
			withInternalUpdate(() => syncFromModelValue(newValue))
		},
		{ immediate: true },
	)

	// Observer pour personnaliser les boutons dès que le DatePicker devient visible
	watch(
		isDatePickerVisible,
		(visible) => {
			if (!visible) {
				skipNextInputBlurProcessing.value = false
				shouldMoveFocusToDialogOnOpen.value = false
				suppressNextCalendarModelValueUpdate.value = false
				keyboardNavigatedDate.value = null
			}

			if (visible) {
				// Réinitialiser le view mode à l'ouverture pour éviter les problèmes de navigation
				resetViewMode()
				nextTick(() => {
					customizeMonthButton()
					markHolidayDays()
					updateSelectedDayAria()
					setTimeout(() => {
						if (isDatePickerVisible.value) {
							suppressNextCalendarModelValueUpdate.value = false
						}
					}, 0)

					if (shouldMoveFocusToDialogOnOpen.value) {
						shouldMoveFocusToDialogOnOpen.value = false
						focusInitialDay()
						setTimeout(() => focusInitialDay(), 75)
						setTimeout(() => focusInitialDay(), 200)
					}
				})
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

	const handleSelectToday = () => {
		const todaySelection = buildTodaySelectionState({
			displayRange: props.displayRange,
			format: props.format,
			dateFormatReturn: props.dateFormatReturn,
			formatDate,
		})

		suppressNextCalendarModelValueUpdate.value = false

		if (props.displayRange) {
			selectedDates.value = todaySelection.selectedDates
			withInternalUpdate(() => {
				textInputValue.value = todaySelection.displayValue
				displayFormattedDate.value = todaySelection.displayValue
			})
			updateModel(todaySelection.modelValue)
			emit('date-selected', todaySelection.modelValue)
		}
		else {
			selectedDates.value = todaySelection.selectedDates
			withInternalUpdate(() => {
				textInputValue.value = todaySelection.displayValue
				displayFormattedDate.value = todaySelection.displayValue
			})
			updateModel(todaySelection.modelValue)
			emit('date-selected', todaySelection.modelValue)
		}

		currentMonth.value = todaySelection.month
		currentYear.value = todaySelection.year
		currentMonthName.value = todaySelection.monthName
		currentYearName.value = todaySelection.yearName

		if (isDatePickerVisible.value) {
			closeDatePicker({ restoreFocus: true })
		}
	}

	/**
	 * Public API
	 */
	const validateOnSubmit = async (): Promise<boolean> => {
		if (props.noCalendar) {
			return await Promise.resolve(dateTextInputRef.value?.validateOnSubmit() || false)
		}
		const textInputValid = await Promise.resolve(dateCalendarTextInputRef.value?.validateOnSubmit() || false)
		await Promise.resolve(validateDates(true))
		return textInputValid && errors.value.length === 0
	}

	// Reset hook utilisé par SyForm.reset() via useValidatable
	const reset = () => {
		// 1) Nettoyer l'état de validation et d'interaction
		clearValidation()
		isDatePickerVisible.value = false
		hasInteracted.value = false
		isManualInputActive.value = false

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

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit, clearValidation, reset)

	defineExpose({
		validateOnSubmit,
		isDatePickerVisible,
		selectedDates,
		errorMessages,
		errors: readonly(errors),
		warnings: readonly(warnings),
		successes: readonly(validation.displaySuccesses),
		handleClickOutside,
		initializeSelectedDates,
		handleSelectToday,
		updateAccessibility,
		openDatePicker,
		updateDisplayFormattedDate,
		currentMonth,
		currentMonthName,
		toggleDatePicker,
		validateField,
		clearValidation,
		validateDates,
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
		<span
			class="sr-only"
			aria-live="polite"
			aria-atomic="true"
		>
			{{ accessibilityDescription }}
		</span>

		<template v-if="props.noCalendar">
			<DateTextInput
				ref="dateTextInputRef"
				:key="fieldKey"
				v-model="textInputValue"
				:class="[messageClasses, 'label-hidden-on-focus']"
				v-bind="dateTextInputProps"
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
							v-bind="dateTextInputMenuProps"
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
					:aria-labelledby="datePickerHeadingId"
				>
					<VDatePicker
						:id="datePickerContentId"
						ref="datePickerRef"
						v-model="selectedDates"
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
						@keydown.capture="handleMenuKeydown"
						@update:model-value="updateDisplayFormattedDate"
						@update:view-mode="handleViewModeUpdateWrapper"
						@update:month="onUpdateMonth"
						@update:year="onUpdateYear"
						@click:date="updateSelectedDates"
						@focus="props.displayHolidayDays ? markHolidayDays : undefined"
						@update:month-year="props.displayHolidayDays ? markHolidayDays : undefined"
					>
						<template #title>
							<span class="date-picker-title">
								{{ locales.calendarTitle }}
							</span>
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
								<v-btn
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
								</v-btn>
							</div>
						</template>
					</VDatePicker>
				</div>
			</VMenu>
		</template>
	</div>
</template>

<style lang="scss" scoped>
$ap-grey-mid: #d6d6d6;

.v-sheet {
	border-radius: var(--radius-md) !important;
}

.date-picker-title {
	display: block;
	text-transform: lowercase;
	font-size: 0.875rem;

	&::first-letter {
		text-transform: uppercase;
	}
}

/* Disable ripple effect on month and year buttons */
:deep(.v-date-picker-controls__month-btn),
:deep(.v-date-picker-controls__mode-btn) {
	.v-ripple__container,
	.v-ripple__animation {
		display: none !important;
		opacity: 0 !important;
		background-color: transparent !important;
		pointer-events: none !important;
	}
}

/* Style pour les jours fériés */
:deep(.holiday-day) {
	background-color: rgb(255 193 7 / 10%);
	border: 2px dotted rgb(var(--v-theme-grey-darken60));
	border-radius: 50%;
}

:deep(.v-date-picker-controls .v-btn:last-child) {
	margin-inline-start: 0;
}

.label-hidden-on-focus:focus + label {
	display: none;
}

.dp-width {
	width: v-bind('props.width');
}

.v-messages__message--success {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;

		--v-medium-emphasis-opacity: 1;
	}

	.v-field--active & {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;
	}
}

.v-messages__message--error {
	:deep(.v-input__control) {
		color: rgb(var(--v-theme-error)) !important;

		--v-medium-emphasis-opacity: 1;
	}

	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-error)) !important;
	}

	.v-field--active & {
		color: rgb(var(--v-theme-error)) !important;
	}
}

.v-messages__message--warning {
	:deep(.v-input__control) {
		color: rgb(var(--v-theme-onWarningVariant)) !important;

		--v-medium-emphasis-opacity: 1;
	}

	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-onWarningVariant)) !important;
	}

	.v-field--active & {
		color: rgb(var(--v-theme-onWarningVariant)) !important;
	}
}

:deep(.v-btn__content) {
	font-size: var(--v-fontSize-corpsDeTexte) + 3;
	font-weight: bold;
}

:deep(.v-messages) {
	opacity: 1;
}

:deep(.v-field--dirty) {
	--v-medium-emphasis-opacity: 1;
}

:deep(.v-field--focused) {
	opacity: 1 !important;

	--v-medium-emphasis-opacity: 1;
}

.date-picker-container {
	width: 100%;
	position: relative;

	:deep(.v-date-picker) {
		max-width: 445px;
		position: absolute;
		top: 56px;
		left: 0;
		z-index: 2;
		box-shadow:
			0 5px 5px -3px rgb(0 0 0 / 20%),
			0 8px 10px 1px rgb(0 0 0 / 14%),
			0 3px 14px 2px rgb(0 0 0 / 12%) !important;
	}
}

:deep(.v-date-picker-month__day .v-btn:hover) {
	background-color: rgb(var(--v-theme-background));
}

:deep(.v-date-picker-month__day--adjacent) {
	opacity: 0.7;
}

:deep(.v-date-picker-month__day--adjacent:has(.v-btn:focus-visible)) {
	opacity: 1;
}

:deep(.v-date-picker-month__day--adjacent .v-btn:focus-visible) {
	opacity: 1;
	background-color: transparent !important;

	.v-btn__content {
		opacity: 0.5;
	}
}

:deep(.v-date-picker-month__day--selected .v-btn:hover) {
	background-color: rgb(var(--v-theme-primaryVariant)) !important;
	opacity: 0.9;
}

:deep(.weekend .v-date-picker-month__day--week-end .v-btn) {
	background-color: $ap-grey-mid;
}

/* day before weekend */
:deep(.weekend .v-date-picker-month__day:has(+ .v-date-picker-month__day--week-end) .v-btn) {
	background-color: $ap-grey-mid;
}

:deep(.v-date-picker-controls__mode-btn) {
	transform: none !important;
}

:deep(.v-btn--variant-text .v-btn__overlay) {
	padding: 13px;
}

:deep(.custom-year-btn) {
	width: auto;
	height: 28px;
}

/* Style de base du ::after */
:deep(.custom-year-btn::after) {
	background-color: $ap-grey-mid;
	padding: 10px 40px;
	text-decoration: none;
	display: inline-block;
	margin-left: -22px !important;
	cursor: pointer;
	border-radius: 9999px;
}

:deep(.custom-month-btn::after) {
	background-color: $ap-grey-mid;
	text-decoration: none;
	display: inline-block;
	cursor: pointer;
	border-radius: 9999px !important;
}

:deep(.v-picker__body .v-btn:focus-visible) {
	// Ring du global `_btns.scss` (2px primary). Offset réduit à 1px pour la grille dense
	outline-offset: 1px;
}

:deep(.v-date-picker-months) {
	flex: 1;
}

:deep(.v-date-picker-months .v-btn__content) {
	font-size: 1rem;
}

.date-picker__today-button {
	height: auto;

	:deep(.v-btn__content) {
		font-size: 1rem;
		gap: 8px;
	}
}

:deep(.v-picker__body .v-btn--active .v-btn__overlay) {
	opacity: 0;
}

.date-picker-overlay-content .v-date-picker {
	box-shadow:
		0 5px 5px -3px rgb(0 0 0 / 20%),
		0 8px 10px 1px rgb(0 0 0 / 14%),
		0 3px 14px 2px rgb(0 0 0 / 12%) !important;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
</style>
