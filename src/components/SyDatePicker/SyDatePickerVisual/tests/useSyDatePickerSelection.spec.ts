import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import type { SyDatePickerValue } from '../../types'
import { useSyDatePickerSelection } from '../useSyDatePickerSelection'

describe('useSyDatePickerSelection', () => {
	it('should expose the selected date and the selected range in the right format', () => {
		const range: [Date, Date] = [new Date(2026, 8, 4), new Date(2026, 8, 10)]
		const modelValue = ref<SyDatePickerValue>(range)
		const mode = ref<'single' | 'range'>('range')
		const { selectedDate, selectedDateRange, selectedDates } = useSyDatePickerSelection({
			modelValue,
			mode,
		})

		expect(selectedDate.value).toEqual(new Date(2026, 8, 4))
		expect(selectedDateRange.value).toEqual(range)
		expect(selectedDates.value).toEqual(range)
	})
})
