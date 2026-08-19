import { computed, ref, unref, watch, type Ref, type ComputedRef, type MaybeRef } from 'vue'
import type { DateInput, DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import { locales } from '../locales'
import { formatDateRangeDisplay, resolveDatePickerStateFromModelValue } from '../utils/dateFormattingUtils'

export interface UseDatePickerStateOptions {
	selectedDates: Ref<Date | (Date | null)[] | null>
	rangeBoundaryDates?: Ref<[Date | null, Date | null] | null>
	format: MaybeRef<string>
	dateFormatReturn?: string
	displayRange?: MaybeRef<boolean>
	parseDate: (value: string, format: string) => Date | null
	formatDate: (date: Date | null, format: string) => string
	validateDates: (forceValidation?: boolean) => void
	updateModel: (value: DateModelValue) => void
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

export const useDatePickerState = (options: UseDatePickerStateOptions): UseDatePickerStateResult => {
	const {
		selectedDates,
		rangeBoundaryDates,
		format,
		dateFormatReturn,
		displayRange = false,
		parseDate,
		formatDate,
		validateDates,
		// updateModel,
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
			if (!newValue || newValue === '') {
				textInputValue.value = ''
				return
			}
			if (Array.isArray(newValue) && newValue.length === 2) {
				// Mode plage : afficher "startDate - endDate" dans l'input
				const startStr = dateFormatReturn
					? formatDate(parseDate(newValue[0]!, dateFormatReturn), unref(format))
					: newValue[0]!
				const endStr = dateFormatReturn
					? formatDate(parseDate(newValue[1]!, dateFormatReturn), unref(format))
					: newValue[1]!
				textInputValue.value = `${startStr}${locales.rangeSeparator}${endStr}`
			}
			else if (typeof newValue === 'string') {
				if (dateFormatReturn) {
					const date = parseDate(newValue, dateFormatReturn)
					if (date) {
						const formattedForDisplay = formatDate(date, unref(format))
						textInputValue.value = formattedForDisplay
					}
				}
				else {
					textInputValue.value = newValue
				}
			}
		},
		{ immediate: true },
	)

	const syncFromModelValue = (newValue: DateInput | undefined) => {
		if (!newValue || newValue === '') {
			selectedDates.value = null
			textInputValue.value = ''
			displayFormattedDate.value = ''
			validateDates()
			return
		}

		const nextState = resolveDatePickerStateFromModelValue({
			modelValue: newValue as DateModelValue,
			displayRange: unref(displayRange),
			displayFormat: unref(format),
			returnFormat: dateFormatReturn || unref(format),
			parseDate,
			formatDate,
			generateDateRange,
			preserveInvalidValue: true,
		})

		selectedDates.value = nextState.selectedDates
		textInputValue.value = nextState.displayValue
		displayFormattedDate.value = nextState.displayValue
		validateDates()
	}

	const syncTextInputFromSelection = () => {
		const value = selectedDates.value
		if (!value) {
			textInputValue.value = ''
			return
		}

		if (unref(displayRange) && Array.isArray(value) && value.length >= 2) {
			const startDate = value[0]
			const endDate = value[value.length - 1]
			if (startDate && endDate) {
				const formattedForInput = formatDateRangeDisplay(startDate, endDate, unref(format), formatDate)
				if (textInputValue.value !== formattedForInput) {
					textInputValue.value = formattedForInput
				}
				return
			}
		}

		const firstDate = Array.isArray(value) ? (value[0] ?? null) : value
		if (!firstDate) return

		const formattedForInput = formatDate(firstDate, unref(format))
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
