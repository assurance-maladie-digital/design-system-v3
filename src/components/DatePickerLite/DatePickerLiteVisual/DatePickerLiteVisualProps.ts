import type { DatePickerLiteMode } from '../types'

export type DatePickerLiteVisualProps = {
	minYear: number
	maxYear: number
	yearsOrder: 'asc' | 'desc'
	initialView: 'days' | 'months' | 'years'
	mode?: DatePickerLiteMode
}

export const defaultDatePickerLiteVisualProps = {
	minYear: 1900,
	maxYear: 2100,
	yearsOrder: 'asc',
	initialView: 'days',
	mode: 'single',
} as const satisfies Partial<DatePickerLiteVisualProps>
