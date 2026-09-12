import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useDatePickerLiteNavigation } from '../useDatePickerLiteNavigation'

describe('useDatePickerLiteNavigation', () => {
	it('should sync the displayed month with the model value and navigate across months', () => {
		const modelValue = ref<Date | undefined>(new Date(2026, 8, 4))
		const initialView = ref<'days' | 'months' | 'years'>('days')
		const {
			currentMonth,
			visibleMonthIndex,
			visibleYear,
			previousMonth,
			nextMonth,
			setMonth,
		} = useDatePickerLiteNavigation({
			modelValue,
			initialView,
		})

		expect(currentMonth.value).toEqual(new Date(2026, 8, 4))
		expect(visibleMonthIndex.value).toBe(9)
		expect(visibleYear.value).toBe(2026)

		previousMonth()
		expect(currentMonth.value.getMonth()).toBe(7)

		nextMonth()
		expect(currentMonth.value.getMonth()).toBe(8)

		setMonth(11)
		expect(currentMonth.value.getMonth()).toBe(10)
	})

	it('should reset the view on open and keep the calendar aligned with the selected value', () => {
		const modelValue = ref<Date | undefined>(new Date(2026, 8, 4))
		const initialView = ref<'days' | 'months' | 'years'>('months')
		const { view, resetViewOnOpen } = useDatePickerLiteNavigation({
			modelValue,
			initialView,
		})

		expect(view.value).toBe('months')

		resetViewOnOpen()
		expect(view.value).toBe('months')
	})
})
