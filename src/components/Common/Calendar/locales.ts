import type { ComputedRef, InjectionKey } from 'vue'

/** Possible views of a calendar picker: days grid, months list, years list */
export type PickerView = 'days' | 'months' | 'years'

/**
 * Localized strings consumed by the calendar picker sub-components
 * (MonthSelector, YearSelector, VisualPickerHeader, VisualPickerFooter).
 * The host component (e.g. MonthPicker) must provide via `provide(calendarLocalesKey, …)`
 * an object satisfying this interface.
 */
export interface CalendarLocales {
	monthSelectorLabel: string
	yearSelectorLabel: string
	yearBtnLabelSelected: (selectedYear: string) => string
	yearBtnLabelUnselected: (selectedYear: string) => string
	monthBtnLabelSelected: (selectedMonth: string) => string
	monthBtnLabelUnselected: (selectedMonth: string) => string
	headerSelectDay?: string
	previousMonthBtnLabel?: string
	nextMonthBtnLabel?: string
}

export const calendarLocalesKey: InjectionKey<ComputedRef<CalendarLocales>> = Symbol('calendar-locales')
