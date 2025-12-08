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

		return (
			(typeof value === 'string' && !isDateBefore(formatDate(dayjs()), value)) || ruleMessage(errorMessages, 'default')
		)
	}
}

export const isNotBeforeToday = isNotBeforeTodayFn()
