export type MonthPickerVisualProps = {
	minYear: number
	maxYear: number
	yearsOrder: 'asc' | 'desc'
}

export const defaultMonthPickerVisualProps = {
	minYear: 1900,
	maxYear: 2100,
	yearsOrder: 'asc',
} as const satisfies Partial<MonthPickerVisualProps>
