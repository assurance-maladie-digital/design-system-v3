import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useSyDatePickerNavigation } from '../useSyDatePickerNavigation'

describe('useSyDatePickerNavigation', () => {
	it('should sync the displayed month with the model value and navigate across months', () => {
		const modelValue = ref<Date | undefined>(new Date(2026, 8, 4))
		const view = ref<'days' | 'months' | 'years'>('days')
		const initialView = ref<'days' | 'months' | 'years'>('days')
		const {
			currentMonth,
			visibleMonthIndex,
			visibleYear,
			previousMonth,
			nextMonth,
			setMonth,
		} = useSyDatePickerNavigation({
			modelValue,
			view,
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

	it('should return to the days view after a year or a month selection', () => {
		const modelValue = ref<Date | undefined>(new Date(2026, 8, 4))
		const view = ref<'days' | 'months' | 'years'>('years')
		const initialView = ref<'days' | 'months' | 'years'>('days')
		const { setYear, setMonth } = useSyDatePickerNavigation({
			modelValue,
			view,
			initialView,
		})

		setYear(2030)
		expect(view.value).toBe('days')

		view.value = 'months'
		setMonth(9)
		expect(view.value).toBe('days')
	})

	it('should reset the view on open to the current initialView value and keep the calendar aligned with the selected value', () => {
		const modelValue = ref<Date | undefined>(new Date(2026, 8, 4))
		const view = ref<'days' | 'months' | 'years'>('days')
		const initialView = ref<'days' | 'months' | 'years'>('days')
		const { resetViewOnOpen } = useSyDatePickerNavigation({
			modelValue,
			view,
			initialView,
		})

		view.value = 'years'
		resetViewOnOpen()
		expect(view.value).toBe('days')

		// initialView stays reactive: a later change is honored on the next reopen
		initialView.value = 'years'
		resetViewOnOpen()
		expect(view.value).toBe('years')
	})
})
