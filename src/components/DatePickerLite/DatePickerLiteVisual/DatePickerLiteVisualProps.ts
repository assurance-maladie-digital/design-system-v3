export type DatePickerLiteVisualProps = {
	minYear: number
	maxYear: number
	yearsOrder: 'asc' | 'desc'
	initialView: 'days' | 'months' | 'years'
}

export const defaultDatePickerLiteVisualProps = {
	minYear: 1900,
	maxYear: 2100,
	yearsOrder: 'asc',
	initialView: 'days',
} as const satisfies Partial<DatePickerLiteVisualProps>
