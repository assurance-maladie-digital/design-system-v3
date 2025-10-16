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

		return (
			(typeof value === 'string' && !isDateAfter(formatDate(dayjs()), value)) || ruleMessage(errorMessages, 'default')
		)
	}
}

export const isNotAfterToday = isNotAfterTodayFn()
