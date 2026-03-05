export type MonthPickerVisualProps = {
	minYear: number
	maxYear: number
	yearsOrder: 'asc' | 'desc'
	initialView: 'months' | 'years'
}

export const defaultMonthPickerVisualProps = {
	minYear: 1900,
	maxYear: 2100,
	yearsOrder: 'asc',
	initialView: 'months',
} as const satisfies Partial<MonthPickerVisualProps>
