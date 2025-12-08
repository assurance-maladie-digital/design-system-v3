import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'
import type { DateInput, DateValue } from '@/composables/date/useDateInitializationDayjs'

export interface UseDatePickerStateOptions {
	selectedDates: Ref<Date | (Date | null)[] | null>
	rangeBoundaryDates?: Ref<[Date | null, Date | null] | null>
	format: string
	dateFormatReturn?: string
	displayRange?: boolean
	parseDate: (value: string, format: string) => Date | null
	formatDate: (date: Date | null, format: string) => string
	initializeSelectedDates: (value: DateInput | null, format: string, dateFormatReturn?: string) => Date | (Date | null)[] | null
	validateDates: (forceValidation?: boolean) => void
	updateModel: (value: DateValue) => void
}

export interface UseDatePickerStateResult {
	selectedDates: Ref<Date | (Date | null)[] | null>
	rangeBoundaryDates?: Ref<[Date | null, Date | null] | null>
	textInputValue: Ref<string>
	displayFormattedDate: Ref<string>
	formattedDate: Ref<DateValue>
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
		initializeSelectedDates,
		validateDates,
		// updateModel,
	} = options

	const textInputValue = ref('')
	const displayFormattedDate = ref('')

	const formattedDate = computed<DateValue>(() => {
		if (!selectedDates.value) return ''
		const rf = dateFormatReturn || format

		if (displayRange && rangeBoundaryDates?.value) {
			return [
				formatDate(rangeBoundaryDates.value[0], rf),
				formatDate(rangeBoundaryDates.value[1], rf),
			] as [string, string]
		}

		if (Array.isArray(selectedDates.value)) {
			if (selectedDates.value.length >= 2) {
				return [
					formatDate(selectedDates.value[0], rf),
					formatDate(selectedDates.value[selectedDates.value.length - 1], rf),
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
				return `${formatDate(selectedDates.value[0], format)} - ${formatDate(
					selectedDates.value[selectedDates.value.length - 1],
					format,
				)}`
			}
			return formatDate(selectedDates.value[0], format)
		}

		return formatDate(selectedDates.value, format)
	})

	watch(
		formattedDate,
		(newValue) => {
			if (!newValue || newValue === '') {
				textInputValue.value = ''
				return
			}
			if (typeof newValue === 'string') {
				if (dateFormatReturn) {
					const date = parseDate(newValue, dateFormatReturn)
					if (date) {
						const formattedForDisplay = formatDate(date, format)
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

		selectedDates.value = initializeSelectedDates(newValue ?? null, format, dateFormatReturn)
		if (selectedDates.value) {
			const firstDate = Array.isArray(selectedDates.value)
				? selectedDates.value[0]
				: selectedDates.value
			if (firstDate) {
				const formattedForInput = formatDate(firstDate, format)
				textInputValue.value = formattedForInput
			}
			if (Array.isArray(formattedDate.value)) {
				// Pour les plages, formater avec le séparateur standard " - "
				displayFormattedDate.value = formattedDate.value.join(' - ')
			}
			else {
				displayFormattedDate.value = (formattedDate.value as string) || ''
			}
		}
		validateDates()
	}

	const syncTextInputFromSelection = () => {
		const value = selectedDates.value
		if (!value) {
			textInputValue.value = ''
			return
		}

		const firstDate = Array.isArray(value) ? (value[0] ?? null) : value
		if (!firstDate) return

		const formattedForInput = formatDate(firstDate, format)
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
