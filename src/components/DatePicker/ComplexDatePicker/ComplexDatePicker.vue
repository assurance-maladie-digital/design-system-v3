<script lang="ts" setup>
	import {
		ref,
		computed,
		watch,
		onMounted,
		onBeforeUnmount,
		nextTick,
		type ComponentPublicInstance,
		type Ref,
	} from 'vue'
	import {
		useDateInitialization,
		type DateInput,
		type DateValue,
	} from '@/composables/date/useDateInitializationDayjs'
	import {
		useAsteriskDisplay,
		useDateFormatValidation,
		useDatePickerState,
		useDatePickerViewMode,
		useDatePickerVisibility,
		useDateRangeValidation,
		useDateSelection,
		useDateValidation,
		useDisplayedDateString,
		useIconState,
		useInputBlurHandler,
		useManualDateValidation,
		useMonthButtonCustomization,
		useTodayButton,
		useHolidayHighlighting,
		useCalendarKeyboardNavigation,
	} from '../composables'
	import dayjs from 'dayjs'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import DateTextInput from '../DateTextInput/DateTextInput.vue'
	import { VDatePicker } from 'vuetify/components'
	import { useInputHandler } from '../composables/useInputHandler'
	import { useValidation } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import type { DateObjectValue } from '../types'
	import { useDatePickerAccessibility } from '@/composables/date/useDatePickerAccessibility'
	import { DATE_PICKER_MESSAGES } from '../constants/messages'
	import { mdiCalendar } from '@mdi/js'
	import { getDateDescription as getDateDescriptionUtil } from '../utils/dateFormattingUtils'
	import customParseFormat from 'dayjs/plugin/customParseFormat'

	dayjs.extend(customParseFormat)

	const { parseDate, formatDate } = useDateFormat()
	const { initializeSelectedDates } = useDateInitialization()
	const { updateAccessibility } = useDatePickerAccessibility()

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
			}
		})
	}

	/**
	 * Props / Emits
	 */
	const props = withDefaults(
		defineProps<{
			modelValue?: DateInput
			label?: string
			placeholder?: string
			format?: string
			dateFormatReturn?: string
			isBirthDate?: boolean
			birthDate?: boolean
			showWeekNumber?: boolean
			required?: boolean
			displayRange?: boolean
			displayIcon?: boolean
			displayAppendIcon?: boolean
			displayPrependIcon?: boolean
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- sorry
			customRules?: { type: string, options: any }[]
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- sorry
			customWarningRules?: { type: string, options: any }[]
			disabled?: boolean
			noIcon?: boolean
			noCalendar?: boolean
			isOutlined?: boolean
			readonly?: boolean
			title?: string | false
			width?: string
			disableErrorHandling?: boolean
			showSuccessMessages?: boolean
			bgColor?: string
			textFieldActivator?: boolean
			displayTodayButton?: boolean
			displayWeekendDays?: boolean
			displayHolidayDays?: boolean
			displayAsterisk?: boolean
			period?: {
				min?: string
				max?: string
			}
			autoClamp?: boolean
			isValidateOnBlur?: boolean
			density?: 'default' | 'comfortable' | 'compact'
			hint?: string
			persistentHint?: boolean
		}>(),
		{
			modelValue: undefined,
			placeholder: DATE_PICKER_MESSAGES.PLACEHOLDER_DEFAULT,
			format: DATE_PICKER_MESSAGES.FORMAT_DEFAULT,
			dateFormatReturn: '',
			isBirthDate: false,
			birthDate: false,
			showWeekNumber: false,
			required: false,
			displayRange: false,
			displayIcon: true,
			displayAppendIcon: false,
			displayPrependIcon: true,
			customRules: () => [],
			customWarningRules: () => [],
			disabled: false,
			noIcon: false,
			noCalendar: false,
			isOutlined: true,
			readonly: false,
			title: false,
			width: '100%',
			disableErrorHandling: false,
			showSuccessMessages: true,
			bgColor: 'white',
			textFieldActivator: false,
			displayTodayButton: true,
			displayWeekendDays: true,
			displayHolidayDays: true,
			displayAsterisk: false,
			period: () => ({ min: '', max: '' }),
			autoClamp: false,
			label: DATE_PICKER_MESSAGES.PLACEHOLDER_DEFAULT,
			isValidateOnBlur: true,
			density: 'default',
			hint: undefined,
			persistentHint: false,
		},
	)

	const emit = defineEmits<{
		(e: 'update:modelValue', value: DateValue): void
		(e: 'closed'): void
		(e: 'focus'): void
		(e: 'blur'): void
		(e: 'input', value: string): void
		(e: 'date-selected', value: DateValue): void
	}>()

	/**
	 * Derived values
	 */
	const returnFormat = computed(() => props.dateFormatReturn || props.format)
	const minDate = computed(() => props.period?.min || dayjs().subtract(200, 'year').format(props.format))
	const maxDate = computed(() => props.period?.max || dayjs().add(200, 'year').format(props.format))

	/**
	 * Validation + messages
	 */
	const isDatePickerVisible = ref(false)
	const validation = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: 'Date',
		customRules: props.customRules,
		warningRules: props.customWarningRules,
		disableErrorHandling: props.disableErrorHandling,
	})
	const { errors, warnings, successes, validateField, clearValidation } = validation
	const errorMessages = computed(() => errors.value)
	const warningMessages = computed(() => warnings.value)
	const successMessages = computed(() => successes.value)

	const getMessageClasses = () => ({
		'dp-width': true,
		'v-messages__message--error': errorMessages.value.length > 0,
		'v-messages__message--warning': warningMessages.value.length > 0 && errorMessages.value.length === 0,
		'v-messages__message--success': successMessages.value.length > 0 && errorMessages.value.length === 0 && warningMessages.value.length === 0,
	})

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

	const { validateDateFormat, isDateComplete } = useDateFormatValidation({
		format: props.format,
		dateFormatReturn: props.dateFormatReturn,
		required: props.required,
		hasInteracted,
		disableErrorHandling: props.disableErrorHandling,
	})

	const { validateDates } = useDateValidation({
		noCalendar: props.noCalendar,
		required: props.required,
		displayRange: props.displayRange,
		disableErrorHandling: props.disableErrorHandling,
		customRules: computed(() => props.customRules),
		customWarningRules: computed(() => props.customWarningRules),
		selectedDates,
		isUpdatingFromInternal,
		currentRangeIsValid,
		getRangeValidationError,
		clearValidation,
		validateField,
		errors,
		warnings,
		successes,
	})

	const {
		toggleDatePicker,
		openDatePicker,
		openDatePickerOnClick,
		openDatePickerOnFocus,
		openDatePickerOnIconClick,
		handleClickOutside,
		handleKeyboardNavigation,
	} = useDatePickerVisibility({
		disabled: props.disabled,
		readonly: props.readonly,
		textFieldActivator: props.textFieldActivator,
		isDatePickerVisible,
		isManualInputActive,
		hasInteracted,
		updateAccessibility,
		validateDates,
		emitClosed: () => emit('closed'),
		emitFocus: () => emit('focus'),
	})

	const updateModel = (value: DateValue) => {
		// Prevent redundant emits
		if (JSON.stringify(value) === JSON.stringify(props.modelValue)) return
		withInternalUpdate(() => emit('update:modelValue', value))
	}

	// Keep and expose this so consumers can listen to `date-selected`
	const handleDateSelected = (value: DateValue) => {
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
			selectedDates.value = dateObjects
		}
		else {
			const dateObject = parseDate(value, returnFormat.value)
			selectedDates.value = dateObject
		}

		// 3) Re-emit upward
		emit('date-selected', value)
	}
	// Watcher pour re-valider quand les customRules changent
	watch(() => props.customRules, () => {
		if (selectedDates.value !== null) {
			// Retarder légèrement pour s'assurer que les computed sont mis à jour
			setTimeout(() => {
				clearValidation()
				const datesToValidate = Array.isArray(selectedDates.value) ? selectedDates.value : [selectedDates.value]
				datesToValidate.forEach((date) => {
					validateField(
						date,
						props.customRules,
						props.customWarningRules,
					)
				})
			}, 5)
		}
	}, { deep: true })
	// Range handling
	const rangeBoundaryDates = ref<[Date | null, Date | null] | null>(null)
	const dateSelectionResult = useDateSelection(parseDate, selectedDates, props.format, props.displayRange)
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
		format: props.format,
		dateFormatReturn: props.dateFormatReturn,
		displayRange: props.displayRange,
		parseDate,
		formatDate,
		initializeSelectedDates,
		validateDates,
		updateModel,
	})

	// Display helpers (centralised in useDatePickerState)
	const displayFormattedDateComputed = displayFormattedFromSelectedDates

	watch(displayFormattedDateComputed, (newValue) => {
		if (!props.noCalendar && newValue) displayFormattedDate.value = newValue
	})

	const updateSelectedDates = (date: Date | null) => {
		if (date !== null) {
			const validationResult = validateField(date, props.customRules, props.customWarningRules)
			if (validationResult.hasError) {
				errors.value = validationResult.state.errors
				return
			}
		}
		dateSelectionResult.updateSelectedDates(date)
		// Validate immediately to surface messages
		queueMicrotask(() => validateDates(true))
	}

	watch(selectedDates, (newValue) => {
		validateDates()
		if (newValue !== null) {
			if (!preventCloseOnInternalUpdate.value) {
				updateModel(formattedDate.value)
			}
			withInternalUpdate(() => {
				syncTextInputFromSelection()
			})
		}
		else {
			updateModel(null)
			withInternalUpdate(() => {
				syncTextInputFromSelection()
			})
			// Reset month/year names when clearing the date
			const today = new Date()
			currentMonth.value = today.getMonth().toString()
			currentMonthName.value = dayjs(today).format('MMMM')
			currentYear.value = today.getFullYear().toString()
			currentYearName.value = today.getFullYear().toString()
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
			const formatChar = props.format[i].toUpperCase()
			if (['D', 'M', 'Y'].includes(formatChar)) {
				result += cleanedInput[digitIndex]
				digitIndex++
			}
			else {
				result += separator
			}
		}

		let newCursorPos = digitsBeforeCursor
		for (let i = 0, digitCount = 0; i < props.format.length && digitCount < digitsBeforeCursor; i++) {
			if (!['D', 'M', 'Y'].includes(props.format[i].toUpperCase())) newCursorPos++
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
		queueMicrotask(() => {
			let formattedValue = ''

			if (props.displayRange) {
				if (rangeBoundaryDates.value?.[0] && rangeBoundaryDates.value?.[1]) {
					const startDate = formatDate(rangeBoundaryDates.value[0], props.format)
					const endDate = formatDate(rangeBoundaryDates.value[1], props.format)
					formattedValue = `${startDate} - ${endDate}`
					displayFormattedDate.value = textInputValue.value = formattedValue
					const formattedDates = [
						formatDate(rangeBoundaryDates.value[0], returnFormat.value),
						formatDate(rangeBoundaryDates.value[1], returnFormat.value),
					] as [string, string]
					updateModel(formattedDates)
					emit('date-selected', formattedDates)
					isDatePickerVisible.value = false
					emit('closed')
				}
				else if (Array.isArray(selectedDates.value) && selectedDates.value.length >= 2) {
					const formattedDates = [
						formatDate(selectedDates.value[0], props.format),
						formatDate(selectedDates.value[selectedDates.value.length - 1], props.format),
					] as [string, string]
					formattedValue = `${formattedDates[0]} - ${formattedDates[1]}`
					displayFormattedDate.value = textInputValue.value = formattedValue
					updateModel(formattedDates)
					emit('date-selected', formattedDates)
					isDatePickerVisible.value = false
					emit('closed')
				}
				else {
					formattedValue = displayFormattedDateComputed.value || ''
					displayFormattedDate.value = textInputValue.value = formattedValue
				}
			}
			else {
				formattedValue = displayFormattedDateComputed.value || ''
				displayFormattedDate.value = textInputValue.value = formattedValue
				isDatePickerVisible.value = false
				emit('closed')
				emit('date-selected', formattedDate.value)
			}

			validateDates()
		})
	}

	/**
	 * Accessibility (live description during typing)
	 */
	const accessibilityDescription = ref(DATE_PICKER_MESSAGES.ARIA_DATE_INPUT)

	watch(displayFormattedDate, (newValue) => {
		if (newValue && typeof newValue === 'string') {
			accessibilityDescription.value = getDateDescriptionUtil(newValue.replace(/_/g, ' '), props.format)
		}
		else {
			accessibilityDescription.value = 'Aucune date saisie'
		}
	})

	/**
	 * Mount / unmount
	 */
	const dateTextInputRef = ref<null | ComponentPublicInstance<typeof DateTextInput>>()
	const dateCalendarTextInputRef = ref<null | ComponentPublicInstance<typeof SyTextField>>()
	const datePickerRef = ref<null | ComponentPublicInstance<typeof VDatePicker>>()

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

	onMounted(() => {
		setupMonthButtonObserver()
		document.addEventListener('click', handleClickOutside)
		if (displayFormattedDateComputed.value) displayFormattedDate.value = displayFormattedDateComputed.value
		validateDates()
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleClickOutside)
	})

	useCalendarKeyboardNavigation({
		isDatePickerVisible,
		datePickerRef: datePickerRef as unknown as Ref<ComponentPublicInstance | null>,
		getCurrentDate: () => {
			const value = selectedDates.value
			if (value) {
				const date = Array.isArray(value) ? value[0] ?? null : value
				if (date && currentMonth.value !== null && currentYear.value !== null) {
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
			preventCloseOnInternalUpdate.value = true
			updateSelectedDates(date)
			queueMicrotask(() => {
				preventCloseOnInternalUpdate.value = false
			})
			// Synchroniser le mois et l'année visibles lorsque l'on franchit une limite de mois
			const newMonth = String(date.getMonth())
			const newYear = String(date.getFullYear())
			if (currentMonth.value !== newMonth) {
				currentMonth.value = newMonth
				currentMonthName.value = dayjs().month(date.getMonth()).format('MMMM')
			}
			if (currentYear.value !== newYear) {
				currentYear.value = newYear
				currentYearName.value = newYear
			}
		},
	})

	/**
	 * Input handling (text field)
	 */
	const inputHandler = useInputHandler({
		format: props.format,
		displayRange: props.displayRange,
		dateFormatReturn: props.dateFormatReturn,
		disableErrorHandling: props.disableErrorHandling,
		parseDate,
		formatDate,
		generateDateRange: dateSelectionResult.generateDateRange,
		isDateComplete: isDateComplete.value,
		displayFormattedDate,
		selectedDates,
		isFormatting,
		isManualInputActive,
		isUpdatingFromInternal,
		clearValidation,
		validateField: (value, rules, warningRules) =>
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- sorry
			validateField(value, rules as any[], warningRules as any[]),
		updateModel: value => updateModel(value as DateValue),
		emitInput: value => emit('input', value),
		inputRef: dateCalendarTextInputRef as Ref<ComponentPublicInstance | null>,
	})

	const handleKeydown = (event: KeyboardEvent & { target: HTMLInputElement }) => {
		if (props.readonly) return

		if (!props.noCalendar && handleKeyboardNavigation(event)) return

		if (event.key === 'Backspace') {
			const input = event.target
			if (!input.selectionStart || input.selectionStart !== input.selectionEnd) return
			const cursorPos = input.selectionStart
			const charBeforeCursor = input.value[cursorPos - 1]

			if (!/\d/.test(charBeforeCursor)) {
				event.preventDefault()
				const newValue = input.value.substring(0, cursorPos - 2) + input.value.substring(cursorPos)
				displayFormattedDate.value = newValue
				queueMicrotask(() => {
					const newCursorPos = cursorPos - 2
					input.setSelectionRange(newCursorPos, newCursorPos)
				})
			}
		}

		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			const input = event.target
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

	const handleInput = (eventOrValue: Event | string) => {
		if (props.readonly) return

		if (eventOrValue instanceof Event) {
			inputHandler.handleInput(eventOrValue)
			return
		}

		const inputElement = dateCalendarTextInputRef.value?.$el?.querySelector?.('input')
		if (!inputElement) return

		textInputValue.value = eventOrValue

		if (props.displayRange && typeof eventOrValue === 'string') {
			if (eventOrValue.includes(' - ')) {
				const [startDateStr = '', endDateStr = ''] = eventOrValue.split(' - ').map(s => s.trim())
				if (startDateStr && endDateStr && !endDateStr.includes('_')) {
					const startDate = parseDate(startDateStr, props.format)
					const endDate = parseDate(endDateStr, props.format)
					if (startDate && endDate) {
						selectedDates.value = [startDate, endDate]
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
	)

	/**
	 * View mode handling
	 */
	const { currentViewMode, handleViewModeUpdate, handleYearUpdate, handleMonthUpdate, resetViewMode }
		= useDatePickerViewMode(
			() => props.isBirthDate || props.birthDate,
			() => selectedDates.value,
		)

	/**
	 * Manual input validation on blur
	 */
	const { validateManualInput } = useManualDateValidation({
		format: props.format,
		required: props.required,
		disableErrorHandling: props.disableErrorHandling,
		customRules: computed(() => props.customRules),
		customWarningRules: computed(() => props.customWarningRules),
		hasInteracted,
		errors,
		clearValidation,
		validateDateFormat,
		isDateComplete: isDateComplete.value,
		parseDate,
		validateField,
	})

	const emitBlurEvent = () => emit('blur')

	const { handleInputBlur } = useInputBlurHandler({
		format: props.format,
		dateFormatReturn: props.dateFormatReturn,
		required: props.required,
		displayFormattedDate,
		hasInteracted,
		isManualInputActive,
		isUpdatingFromInternal,
		selectedDates,
		errors,
		validateDateFormat,
		parseDate,
		formatDate,
		updateModel,
		validateManualInput,
		emitBlur: emitBlurEvent,
	})

	/**
	 * Icon state
	 */
	const { getIcon } = useIconState({
		noCalendar: props.noCalendar,
		disableErrorHandling: props.disableErrorHandling,
		errorMessages,
		warningMessages,
		successMessages,
	})

	/**
	 * Gère les mises à jour de DateTextInput avec contrôle
	 */
	const handleDateTextInputUpdate = (value: DateValue) => {
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
					selectedDates.value = [startDate, endDate]
					displayFormattedDate.value
						= `${formatDate(startDate, props.format)} - ${formatDate(endDate, props.format)}`
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
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
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
				if (props.displayRange) {
					if (Array.isArray(newValue) && newValue.length >= 2) {
						isDatePickerVisible.value = false
						emit('closed')
					}
				}
				else {
					isDatePickerVisible.value = false
					emit('closed')
				}
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
			if (visible) {
				// Réinitialiser le view mode à l'ouverture pour éviter les problèmes de navigation
				resetViewMode()
				nextTick(() => {
					customizeMonthButton()
					markHolidayDays()
				})
			}
		},
	)

	/**
	 * Today button + labels
	 */
	const { todayInString, selectToday, headerDate } = useTodayButton(props)
	const { labelWithAsterisk } = useAsteriskDisplay(props)
	const { displayedDateString } = useDisplayedDateString({ selectedDates, rangeBoundaryDates, todayInString })

	const handleSelectToday = () => {
		selectToday(selectedDates)
		const today = new Date()
		const todayMonth = today.getMonth().toString()
		const todayYear = today.getFullYear().toString()
		currentMonth.value = todayMonth
		currentYear.value = todayYear
		currentMonthName.value = dayjs().month(parseInt(todayMonth, 10)).format('MMMM')
		currentYearName.value = todayYear
	}

	/**
	 * Public API
	 */
	const validateOnSubmit = (): boolean => {
		if (props.noCalendar) {
			return dateTextInputRef.value?.validateOnSubmit() || false
		}
		const textInputValid = dateCalendarTextInputRef.value?.validateOnSubmit() || false
		validateDates(true)
		return textInputValid && errors.value.length === 0
	}

	// Reset hook utilisé par SyForm.reset() via useValidatable
	const reset = () => {
		// 1) Nettoyer l'état de validation et d'interaction
		clearValidation()
		isDatePickerVisible.value = false
		hasInteracted.value = false
		isManualInputActive.value = false

		if (props.disabled) {
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
		validateDateFormat,
		displayFormattedDate,
		// Expose for consumers
		handleDateSelected,
		resetViewMode,
		reset,
	})
</script>

<template>
	<div class="date-picker-container">
		<!-- Hidden live region text holder (kept for potential a11y tooling) -->
		<span
			v-if="false"
			ref="accessibilityDescriptionRef"
		>{{ accessibilityDescription }}</span>

		<template v-if="props.noCalendar">
			<DateTextInput
				ref="dateTextInputRef"
				:key="fieldKey"
				v-model="textInputValue"
				:class="[getMessageClasses(), 'label-hidden-on-focus']"
				:date-format-return="props.dateFormatReturn"
				:format="props.format"
				:label="labelWithAsterisk || ''"
				:placeholder="props.placeholder"
				:required="props.required"
				:custom-rules="props.customRules"
				:custom-warning-rules="props.customWarningRules"
				:disabled="props.disabled"
				:readonly="props.readonly"
				:is-outlined="props.isOutlined"
				:display-icon="props.displayIcon"
				:display-append-icon="props.displayAppendIcon"
				:display-prepend-icon="props.displayPrependIcon"
				:no-icon="props.noIcon"
				:disable-error-handling="props.disableErrorHandling"
				:show-success-messages="props.showSuccessMessages"
				:bg-color="props.bgColor"
				:auto-clamp="props.autoClamp"
				:external-error-messages="errorMessages"
				:display-asterisk="props.displayAsterisk"
				:is-validate-on-blur="props.isValidateOnBlur"
				:title="props.title || props.placeholder || undefined"
				:hint="props.hint"
				:persistent-hint="props.persistentHint"
				@focus="emit('focus')"
				@blur="emit('blur')"
			/>
		</template>

		<template v-else>
			<VMenu
				v-model="isDatePickerVisible"
				activator="parent"
				:min-width="0"
				location="bottom"
				:close-on-content-click="false"
				:open-on-click="false"
				scroll-strategy="none"
				transition="fade-transition"
				:offset="[0, 10]"
			>
				<template #activator="{ props: menuProps }">
					<DateTextInput
						v-bind="menuProps"
						ref="dateCalendarTextInputRef"
						:key="fieldKey"
						:model-value="textInputValue"
						:label="labelWithAsterisk || ''"
						:placeholder="props.placeholder"
						:format="props.format"
						:date-format-return="props.dateFormatReturn"
						:required="props.required"
						:disabled="props.disabled"
						:readonly="props.readonly"
						:title="props.title || props.placeholder || undefined"
						:is-outlined="props.isOutlined"
						:display-icon="props.displayIcon"
						:display-append-icon="props.displayAppendIcon"
						:display-prepend-icon="props.displayPrependIcon"
						:no-icon="props.noIcon"
						:custom-rules="props.customRules"
						:custom-warning-rules="props.customWarningRules"
						:display-asterisk="props.displayAsterisk"
						:disable-error-handling="props.disableErrorHandling"
						:show-success-messages="props.showSuccessMessages"
						:bg-color="props.bgColor"
						:display-range="props.displayRange"
						:display-persistent-placeholder="true"
						:is-validate-on-blur="props.isValidateOnBlur"
						:external-error-messages="errorMessages"
						:class="[getMessageClasses(), 'label-hidden-on-focus']"
						:append-inner-icon="getIcon"
						:auto-clamp="props.autoClamp"
						:density="props.density"
						:hint="props.hint"
						:persistent-hint="props.persistentHint"
						@update:model-value="handleDateTextInputUpdate"
						@click="openDatePickerOnClick"
						@focus="openDatePickerOnFocus"
						@blur="handleInputBlur"
						@input="handleInput"
						@keydown="handleKeydown"
						@date-selected="handleDateSelected"
						@prepend-icon-click="openDatePickerOnIconClick"
						@append-icon-click="openDatePickerOnIconClick"
					/>
				</template>

				<VDatePicker
					v-if="isDatePickerVisible"
					ref="datePickerRef"
					v-model="selectedDates"
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
					@update:view-mode="handleViewModeUpdate"
					@update:month="onUpdateMonth"
					@update:year="onUpdateYear"
					@click:date="updateSelectedDates"
					@focus="props.displayHolidayDays ? markHolidayDays : undefined"
					@update:month-year="props.displayHolidayDays ? markHolidayDays : undefined"
				>
					<template #title>
						Sélectionnez une date
					</template>
					<template #header>
						<h3 class="mx-auto my-auto ml-5 mb-4">
							{{ selectedDates ? displayedDateString : headerDate }}
						</h3>
					</template>
					<template
						v-if="props.displayTodayButton"
						#actions
					>
						<div class="d-flex justify-center align-center w-100">
							<v-btn
								v-if="props.displayTodayButton"
								size="x-small"
								color="primary"
								:title="DATE_PICKER_MESSAGES.BUTTON_TODAY"
								class="my-2 pa-2 mt-2"
								:ripple="false"
								@click="handleSelectToday"
							>
								<VIcon class="mr-1">
									{{ mdiCalendar }}
								</VIcon>
								{{ DATE_PICKER_MESSAGES.BUTTON_TODAY }}
							</v-btn>
						</div>
					</template>
				</VDatePicker>
			</VMenu>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

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
	border: 2px dotted tokens.$neutral-black;
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
		color: tokens.$colors-text-success !important;

		--v-medium-emphasis-opacity: 1;
	}

	.v-field--active & {
		color: tokens.$colors-border-success !important;
	}
}

.v-messages__message--error {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: tokens.$colors-text-error !important;
	}

	.v-field--active & {
		color: tokens.$colors-border-error !important;
	}
}

.v-messages__message--warning {
	:deep(.v-input__control) {
		color: tokens.$colors-text-warning !important;

		--v-medium-emphasis-opacity: 1;
	}

	:deep(.v-messages__message) {
		color: tokens.$colors-text-warning !important;
	}

	.v-field--active & {
		color: tokens.$colors-text-warning !important;
	}
}

:deep(.v-btn__content) {
	font-size: tokens.$font-size-body-text + 3;
	font-weight: bold;
}

:deep(.v-messages) {
	opacity: 1;
}

:deep(.v-field--dirty),
:deep(.v-field--focused) {
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

:deep(.v-date-picker-month__day--selected, .v-date-picker-month__day--adjacent) {
	opacity: 1;
}

:deep(.weekend .v-date-picker-month__day--week-end .v-btn) {
	background-color: #afb1b1;
}

/* day before weekend */
:deep(.weekend .v-date-picker-month__day:has(+ .v-date-picker-month__day--week-end) .v-btn) {
	background-color: #afb1b1;
}

:deep(.v-date-picker-controls__mode-btn) {
	transform: none !important;
}

:deep(.v-btn--variant-text .v-btn__overlay) {
	padding: 13px;
}

/* Style de base du ::after */
:deep(.custom-year-btn::after) {
	background-color: #afb1b1;
	padding: 10px 40px;
	text-decoration: none;
	display: inline-block;
	margin-left: -22px !important;
	cursor: pointer;
	border-radius: 9999px;
}

:deep(.custom-month-btn::after) {
	background-color: #afb1b1;
	text-decoration: none;
	display: inline-block;
	cursor: pointer;
	border-radius: 9999px !important;
}
</style>
