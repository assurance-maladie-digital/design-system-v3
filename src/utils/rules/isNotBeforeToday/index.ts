import { formatDate } from '@/utils/formatDate'
import dayjs from 'dayjs'
import { isDateBefore } from '../../functions/validation/isDateBefore'
import type {
	ErrorMessages,
	ValidationResult,
	ValidationRule,
	Value,
} from '../types'
import { defaultErrorMessages } from './locales'
import { validateDateValue } from '../validateDateValue'

/** Check that the value is not before today (DD/MM/YYYY format) */
export function isNotBeforeTodayFn(
	errorMessages: ErrorMessages = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		const today = formatDate(dayjs())

		return validateDateValue(
			value,
			formatted => !isDateBefore(today, formatted),
			{ errorMessages },
		)
	}
}

export const isNotBeforeToday = isNotBeforeTodayFn()
