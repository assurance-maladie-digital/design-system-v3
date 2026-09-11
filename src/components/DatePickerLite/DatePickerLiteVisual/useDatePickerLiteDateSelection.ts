import type { Ref } from 'vue'
import type { DatePickerLiteMode, DatePickerLiteMultiple, DatePickerLiteRange } from '../types'

type DatePickerLiteValue = Date | DatePickerLiteRange | DatePickerLiteMultiple | undefined

export interface UseDatePickerLiteDateSelectionParams {
	mode: Ref<DatePickerLiteMode>
	modelValue: Ref<DatePickerLiteValue>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	onUpdateModelValue: (value: DatePickerLiteValue) => void
	close: () => void
}

export function useDatePickerLiteDateSelection({
	mode,
	modelValue,
	readonly,
	disabled,
	onUpdateModelValue,
	close,
}: UseDatePickerLiteDateSelectionParams) {
	function setDay(value: Date) {
		if (mode.value === 'range') return
		if (!readonly.value && !disabled.value) {
			if (mode.value === 'multiple') {
				const selectedDates = Array.isArray(modelValue.value) ? modelValue.value : []
				const existingDateIndex = selectedDates.findIndex(date => date.getTime() === value.getTime())
				onUpdateModelValue(existingDateIndex === -1
					? [...selectedDates, value]
					: selectedDates.filter((_, index) => index !== existingDateIndex))
				return
			}
			onUpdateModelValue(value)
		}
		close()
	}

	function handleRangeSelected(value: DatePickerLiteRange) {
		if (!readonly.value && !disabled.value) {
			onUpdateModelValue(value)
		}
		close()
	}

	function setDayFromFooter(value: string | Date) {
		if (value instanceof Date) {
			setDay(value)
		}
	}

	return {
		setDay,
		handleRangeSelected,
		setDayFromFooter,
	}
}
