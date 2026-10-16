import type { SyDatePickerMode } from '../types'

export type SyDatePickerVisualProps = {
	minYear: number
	maxYear: number
	yearsOrder: 'asc' | 'desc'
	/** View restored each time the picker reopens */
	initialView: 'days' | 'months' | 'years'
	mode?: SyDatePickerMode
	/** Returns true when a date must not be selectable in the visual picker. */
	isDateDisabled?: (date: Date) => boolean
}

export const defaultSyDatePickerVisualProps = {
	minYear: 1900,
	maxYear: 2100,
	yearsOrder: 'asc',
	initialView: 'days',
	mode: 'single',
} as const satisfies Partial<SyDatePickerVisualProps>
