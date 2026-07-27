import { computed, ref, unref, watch, type Ref, type ComputedRef, type MaybeRef } from 'vue'
import type { DateInput, DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import { locales } from '../locales'
import { formatDateRangeDisplay } from '../utils/dateFormattingUtils'

export interface UseDatePickerStateOptions {
	selectedDates: Ref<Date | (Date | null)[] | null>
	rangeBoundaryDates?: Ref<[Date | null, Date | null] | null>
	format: MaybeRef<string>
	dateFormatReturn?: string
	displayRange?: MaybeRef<boolean>
	parseDate: (value: string, format: string) => Date | null
	formatDate: (date: Date | null, format: string) => string
	initializeSelectedDates: (value: DateInput | null, format: string, dateFormatReturn?: string) => Date | (Date | null)[] | null
	validateDates: (forceValidation?: boolean) => void
	generateDateRange?: (start: Date, end: Date) => Date[]
}

export interface UseDatePickerStateResult {
	selectedDates: Ref<Date | (Date | null)[] | null>
	rangeBoundaryDates?: Ref<[Date | null, Date | null] | null>
	textInputValue: Ref<string>
	displayFormattedDate: Ref<string>
	formattedDate: Ref<DateModelValue>
	displayFormattedFromSelectedDates: ComputedRef<string | null>
	syncFromModelValue: (newValue: DateInput | undefined) => void
	syncTextInputFromSelection: () => void
}

interface ResolveDatePickerStateOptions {
	newValue: DateInput | undefined
	format: string
	dateFormatReturn?: string
	displayRange: boolean
	formatDate: (date: Date | null, format: string) => string
	initializeSelectedDates: (value: DateInput | null, format: string, dateFormatReturn?: string) => Date | (Date | null)[] | null
	generateDateRange?: (start: Date, end: Date) => Date[]
}

interface ResolvedDatePickerState {
	selectedDates: Date | (Date | null)[] | null
	textInputValue: string
	displayFormattedDate: string
}

const getFormattedModelValueFromSelection = (
	selectedDates: Date | (Date | null)[] | null,
	displayRange: boolean,
	dateFormatReturn: string | undefined,
	format: string,
	formatDate: (date: Date | null, format: string) => string,
): DateModelValue => {
	if (!selectedDates) return ''

	const returnFormat = dateFormatReturn || format

	if (displayRange && Array.isArray(selectedDates) && selectedDates.length >= 2) {
		return [
			formatDate(selectedDates[0]!, returnFormat),
			formatDate(selectedDates[selectedDates.length - 1]!, returnFormat),
		] as [string, string]
	}

	if (Array.isArray(selectedDates)) {
		return ''
	}

	return formatDate(selectedDates, returnFormat)
}

const getTextInputValueFromSelection = (
	selectedDates: Date | (Date | null)[] | null,
	displayRange: boolean,
	format: string,
	formatDate: (date: Date | null, format: string) => string,
): string => {
	if (!selectedDates) return ''

	if (displayRange && Array.isArray(selectedDates) && selectedDates.length >= 2) {
		const startDate = selectedDates[0]
		const endDate = selectedDates[selectedDates.length - 1]

		if (startDate && endDate) {
			return formatDateRangeDisplay(startDate, endDate, format, formatDate)
		}
	}

	const firstDate = Array.isArray(selectedDates)
		? selectedDates[0]
		: selectedDates

	return firstDate ? formatDate(firstDate, format) : ''
}

const getTextInputValueFromFormattedModelValue = (
	formattedModelValue: DateModelValue,
	dateFormatReturn: string | undefined,
	format: string,
	parseDate: (value: string, format: string) => Date | null,
	formatDate: (date: Date | null, format: string) => string,
): string => {
	if (!formattedModelValue || formattedModelValue === '') {
		return ''
	}

	if (Array.isArray(formattedModelValue) && formattedModelValue.length === 2) {
		const startStr = dateFormatReturn
			? formatDate(parseDate(formattedModelValue[0]!, dateFormatReturn), format)
			: formattedModelValue[0]!
		const endStr = dateFormatReturn
			? formatDate(parseDate(formattedModelValue[1]!, dateFormatReturn), format)
			: formattedModelValue[1]!

		return `${startStr}${locales.rangeSeparator}${endStr}`
	}

	if (typeof formattedModelValue === 'string' && dateFormatReturn) {
		const date = parseDate(formattedModelValue, dateFormatReturn)
		if (date) {
			return formatDate(date, format)
		}
	}

	return typeof formattedModelValue === 'string' ? formattedModelValue : ''
}

export const resolveDatePickerStateFromModelValue = ({
	newValue,
	format,
	dateFormatReturn,
	displayRange,
	formatDate,
	initializeSelectedDates,
	generateDateRange,
}: ResolveDatePickerStateOptions): ResolvedDatePickerState => {
	if (!newValue || newValue === '') {
		return {
			selectedDates: null,
			textInputValue: '',
			displayFormattedDate: '',
		}
	}

	let selectedDates = initializeSelectedDates(newValue ?? null, format, dateFormatReturn)

	if (displayRange && Array.isArray(selectedDates) && selectedDates.length === 2) {
		const startDate = selectedDates[0]
		const endDate = selectedDates[1]

		if (startDate && endDate && generateDateRange) {
			selectedDates = generateDateRange(startDate, endDate)
		}
	}

	const formattedModelValue = getFormattedModelValueFromSelection(
		selectedDates,
		displayRange,
		dateFormatReturn,
		format,
		formatDate,
	)

	const textInputValue = getTextInputValueFromSelection(
		selectedDates,
		displayRange,
		format,
		formatDate,
	)

	let displayFormattedDate = ''

	if (Array.isArray(formattedModelValue)) {
		const [startValue = '', endValue = ''] = formattedModelValue
		displayFormattedDate = `${startValue}${locales.rangeSeparator}${endValue}`
	}
	else if (typeof formattedModelValue === 'string') {
		displayFormattedDate = formattedModelValue
	}

	return {
		selectedDates,
		textInputValue,
		displayFormattedDate,
	}
}

export const useDatePickerState = (options: UseDatePickerStateOptions): UseDatePickerStateResult => {
	const {
		selectedDates,
		rangeBoundaryDates,
		format,
		dateFormatReturn,
		displayRange = false,
		parseDate,
		formatDate,
		initializeSelectedDates,
		validateDates,
		generateDateRange,
	} = options

	const textInputValue = ref('')
	const displayFormattedDate = ref('')

	const formattedDate = computed<DateModelValue>(() => {
		if (!selectedDates.value) return ''
		const rf = dateFormatReturn || unref(format)

		if (unref(displayRange) && rangeBoundaryDates?.value) {
			return [
				formatDate(rangeBoundaryDates.value[0], rf),
				formatDate(rangeBoundaryDates.value[1], rf),
			] as [string, string]
		}

		if (Array.isArray(selectedDates.value)) {
			if (selectedDates.value.length >= 2) {
				return [
					formatDate(selectedDates.value[0]!, rf),
					formatDate(selectedDates.value[selectedDates.value.length - 1]!, rf),
				] as [string, string]
			}
			return ''
		}

		return formatDate(selectedDates.value, rf)
	})

	const displayFormattedFromSelectedDates = computed<string | null>(() => {
		if (!selectedDates.value) return null

		if (Array.isArray(selectedDates.value)) {
			if (selectedDates.value.length >= 2) {
				return formatDateRangeDisplay(
					selectedDates.value[0]!,
					selectedDates.value[selectedDates.value.length - 1]!,
					unref(format),
					formatDate,
				)
			}
			return formatDate(selectedDates.value[0]!, unref(format))
		}

		return formatDate(selectedDates.value, unref(format))
	})

	watch(
		formattedDate,
		(newValue) => {
			textInputValue.value = getTextInputValueFromFormattedModelValue(
				newValue,
				dateFormatReturn,
				unref(format),
				parseDate,
				formatDate,
			)
		},
		{ immediate: true },
	)

	const syncFromModelValue = (newValue: DateInput | undefined) => {
		const resolvedState = resolveDatePickerStateFromModelValue({
			newValue,
			format: unref(format),
			dateFormatReturn,
			displayRange: unref(displayRange),
			formatDate,
			initializeSelectedDates,
			generateDateRange,
		})

		selectedDates.value = resolvedState.selectedDates
		textInputValue.value = resolvedState.textInputValue
		displayFormattedDate.value = resolvedState.displayFormattedDate
		validateDates()
	}

	const syncTextInputFromSelection = () => {
		const formattedForInput = getTextInputValueFromSelection(
			selectedDates.value,
			unref(displayRange),
			unref(format),
			formatDate,
		)

		if (textInputValue.value !== formattedForInput) {
			textInputValue.value = formattedForInput
		}
	}

	return {
		selectedDates,
		rangeBoundaryDates,
		textInputValue,
		displayFormattedDate,
		formattedDate,
		displayFormattedFromSelectedDates,
		syncFromModelValue,
		syncTextInputFromSelection,
	}
}
