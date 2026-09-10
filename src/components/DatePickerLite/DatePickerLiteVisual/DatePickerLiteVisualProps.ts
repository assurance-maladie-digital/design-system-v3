export type DatePickerLiteVisualProps = {
	minYear: number
	maxYear: number
	yearsOrder: 'asc' | 'desc'
	initialView: 'days' | 'months' | 'years'
	mode?: 'single' | 'range'
}

export const defaultDatePickerLiteVisualProps = {
	minYear: 1900,
	maxYear: 2100,
	yearsOrder: 'asc',
	initialView: 'days',
	mode: 'single',
} as const satisfies Partial<DatePickerLiteVisualProps>
