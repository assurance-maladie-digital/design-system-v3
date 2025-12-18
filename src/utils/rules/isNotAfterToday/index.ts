import { formatDate } from '@/utils/formatDate'
import dayjs from 'dayjs'
import { isDateAfter } from '../../functions/validation/isDateAfter'
import type {
	ErrorMessages,
	ValidationResult,
	ValidationRule,
	Value,
} from '../types'
import { defaultErrorMessages } from './locales'
import { validateDateValue } from '../validateDateValue'

/** Check that the value is not after today (DD/MM/YYYY format) */
export function isNotAfterTodayFn(
	errorMessages: ErrorMessages = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		const today = formatDate(dayjs())

		return validateDateValue(
			value,
			formatted => !isDateAfter(today, formatted),
			{ errorMessages },
		)
	}
}

export const isNotAfterToday = isNotAfterTodayFn()
