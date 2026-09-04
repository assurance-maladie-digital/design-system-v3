import type { ComputedRef, InjectionKey } from 'vue'

/**
 * Chaînes localisées consommées par les sous-composants du picker calendar
 * (MonthSelector, YearSelector, VisualPickerHeader, VisualPickerFooter).
 * Le composant hôte (ex. MonthPicker) doit fournir via `provide(calendarLocalesKey, …)`
 * un objet satisfaisant cette interface.
 */
export interface CalendarLocales {
	monthSelectorLabel: string
	yearSelectorLabel: string
	yearBtnLabelSelected: (selectedYear: string) => string
	yearBtnLabelUnselected: (selectedYear: string) => string
	monthBtnLabelSelected: (selectedMonth: string) => string
	monthBtnLabelUnselected: (selectedMonth: string) => string
}

export const calendarLocalesKey: InjectionKey<ComputedRef<CalendarLocales>> = Symbol('calendar-locales')
