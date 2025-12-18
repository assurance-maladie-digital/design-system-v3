import { formatDate } from '@/utils/formatDate'
import { ruleMessage } from '@/utils/ruleMessage'
import dayjs from 'dayjs'
import { isDateAfter } from '../../functions/validation/isDateAfter'
import type {
	ErrorMessages,
	ValidationResult,
	ValidationRule,
	Value,
} from '../types'
import { defaultErrorMessages } from './locales'

/** Check that the value is not after today (DD/MM/YYYY format) */
export function isNotAfterTodayFn(
	errorMessages: ErrorMessages = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		if (!value) {
			return true
		}
		const today = formatDate(dayjs())

		if (value instanceof Date) {
			const formattedValue = formatDate(dayjs(value))

			return (
				!isDateAfter(today, formattedValue)
				|| ruleMessage(errorMessages, 'default')
			)
		}

		if (typeof value === 'string') {
			return (
				!isDateAfter(today, value)
				|| ruleMessage(errorMessages, 'default')
			)
		}

		return ruleMessage(errorMessages, 'default')
	}
}

export const isNotAfterToday = isNotAfterTodayFn()
