import { computed, type Ref } from 'vue'
import type { DatePickerLiteRange } from '../types'
import { useDatePickerLiteNavigation } from './useDatePickerLiteNavigation'
import { useDatePickerLiteSelection } from './useDatePickerLiteSelection'

export interface UseDatePickerLiteVisualParams {
	modelValue: Ref<Date | DatePickerLiteRange | undefined>
	mode: Ref<'single' | 'range'>
	initialView: Ref<'days' | 'months' | 'years'>
}

export function useDatePickerLiteVisual({
	modelValue,
	mode,
	initialView,
}: UseDatePickerLiteVisualParams) {
	const selection = useDatePickerLiteSelection({ modelValue, mode })
	const navigation = useDatePickerLiteNavigation({
		modelValue: computed(() => selection.selectedDate.value),
		initialView,
	})

	return {
		view: navigation.view,
		visibleMonth: navigation.visibleMonth,
		selectedDate: selection.selectedDate,
		selectedRange: selection.selectedDateRange,
		selectedDays: selection.selectedDates,
		currentDisplayedMonth: navigation.currentMonth,
		currentMonthIndex: navigation.visibleMonthIndex,
		currentYearValue: navigation.visibleYear,
		headerDate: selection.headerDate,
		selectedDateRange: selection.selectedDateRange,
		selectedDates: selection.selectedDates,
		currentMonth: navigation.currentMonth,
		visibleMonthIndex: navigation.visibleMonthIndex,
		visibleYear: navigation.visibleYear,
		resetViewOnOpen: navigation.resetViewOnOpen,
		previousMonth: navigation.previousMonth,
		nextMonth: navigation.nextMonth,
		setYear: navigation.setYear,
		setMonth: navigation.setMonth,
	}
}
