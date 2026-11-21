import type { Ref } from 'vue'
import type { SyDatePickerMode, SyDatePickerRange, SyDatePickerValue } from '../types'

export interface UseSyDatePickerDateSelectionParams {
	mode: Ref<SyDatePickerMode>
	modelValue: Ref<SyDatePickerValue>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	onUpdateModelValue: (value: SyDatePickerValue) => void
	close: () => void
}

export function useSyDatePickerDateSelection({
	mode,
	modelValue,
	readonly,
	disabled,
	onUpdateModelValue,
	close,
}: UseSyDatePickerDateSelectionParams) {
	function setDay(value: Date) {
		if (mode.value === 'range') return
		if (mode.value === 'multiple') {
			if (!readonly.value && !disabled.value) {
				const selectedDates = Array.isArray(modelValue.value) ? modelValue.value : []
				const existingDateIndex = selectedDates.findIndex(date => date.toDateString() === value.toDateString())
				onUpdateModelValue(existingDateIndex === -1
					? [...selectedDates, value]
					: selectedDates.filter((_, index) => index !== existingDateIndex))
			}
			// The picker stays open so the user can select several dates
			return
		}
		if (!readonly.value && !disabled.value) {
			onUpdateModelValue(value)
		}
		close()
	}

	function handleRangeSelected(value: SyDatePickerRange) {
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
