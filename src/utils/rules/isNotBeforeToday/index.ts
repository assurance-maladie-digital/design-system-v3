import { formatDate } from '@/utils/formatDate'
import { ruleMessage } from '@/utils/ruleMessage'
import dayjs from 'dayjs'
import { isDateBefore } from '../../functions/validation/isDateBefore'
import type {
	ErrorMessages,
	ValidationResult,
	ValidationRule,
	Value,
} from '../types'
import { defaultErrorMessages } from './locales'

/** Check that the value is not before today (DD/MM/YYYY format) */
export function isNotBeforeTodayFn(
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
				!isDateBefore(today, formattedValue)
				|| ruleMessage(errorMessages, 'default')
			)
		}

		if (typeof value === 'string') {
			return (
				!isDateBefore(today, value)
				|| ruleMessage(errorMessages, 'default')
			)
		}

		return ruleMessage(errorMessages, 'default')
	}
}

export const isNotBeforeToday = isNotBeforeTodayFn()
