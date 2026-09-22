import { type Ref } from 'vue'
import type { DateObjectValue } from '../types'

export interface UseDatePickerFocusTargetOptions {
	keyboardNavigatedDate: Ref<Date | null>
	selectedDates: Ref<DateObjectValue>
	currentMonth: Ref<string | null>
	currentYear: Ref<string | null>
}

export interface UseDatePickerFocusTargetReturn {
	getInitialFocusDate: () => Date
	getCurrentDate: () => Date | null
}

export const useDatePickerFocusTarget = (options: UseDatePickerFocusTargetOptions): UseDatePickerFocusTargetReturn => {
	const { keyboardNavigatedDate, selectedDates, currentMonth, currentYear } = options

	const resolveBaseDate = (): Date | null => {
		return keyboardNavigatedDate.value
			?? (Array.isArray(selectedDates.value) ? selectedDates.value[0] ?? null : selectedDates.value)
			?? null
	}

	const isDateInDisplayedMonth = (date: Date): boolean => {
		if (currentMonth.value === null || currentYear.value === null) return false
		return date.getMonth() === Number(currentMonth.value)
			&& date.getFullYear() === Number(currentYear.value)
	}

	const getFirstOfDisplayedMonth = (): Date | null => {
		if (currentMonth.value === null || currentYear.value === null) return null
		return new Date(Number(currentYear.value), Number(currentMonth.value), 1)
	}

	const getInitialFocusDate = (): Date => {
		const selected = resolveBaseDate()
		const target = selected ?? new Date()

		if (isDateInDisplayedMonth(target)) {
			return target
		}

		return getFirstOfDisplayedMonth() ?? target
	}

	const getCurrentDate = (): Date | null => {
		const value = resolveBaseDate()
		if (value && isDateInDisplayedMonth(value)) {
			return value
		}

		return getFirstOfDisplayedMonth()
	}

	return { getInitialFocusDate, getCurrentDate }
}
