import type { DatePickerLiteMode } from '../types'

export type DatePickerLiteVisualProps = {
	minYear: number
	maxYear: number
	yearsOrder: 'asc' | 'desc'
	/** View restored each time the picker reopens */
	initialView: 'days' | 'months' | 'years'
	mode?: DatePickerLiteMode
	/** Returns true when a date must not be selectable in the visual picker. */
	isDateDisabled?: (date: Date) => boolean
}

export const defaultDatePickerLiteVisualProps = {
	minYear: 1900,
	maxYear: 2100,
	yearsOrder: 'asc',
	initialView: 'days',
	mode: 'single',
} as const satisfies Partial<DatePickerLiteVisualProps>
