import { formatDate } from '@/utils/formatDate'
import { parseDate } from '@/utils/parseDate'
import dayjs from 'dayjs'
import { ruleMessage } from '@/utils/ruleMessage'
import { isDateAfter } from '../../functions/validation/isDateAfter'
import type { ValidationResult, ValidationRule, Value } from '../types'
import { defaultErrorMessages } from './locales'

/** Check that the value is not after the specified date (DD/MM/YYYY format) */
export function isNotAfterDateFn(
	date: string,
	errorMessages = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		if (!value) {
			return true
		}

		const formattedValue = formatDate(parseDate(date))

		if (value instanceof Date) {
			const formattedInput = formatDate(dayjs(value))

			return (
				!isDateAfter(date, formattedInput)
				|| ruleMessage(errorMessages, 'default', [formattedValue])
			)
		}

		if (typeof value !== 'string') {
			return ruleMessage(errorMessages, 'default')
		}

		return (
			!isDateAfter(date, value)
			|| ruleMessage(errorMessages, 'default', [formattedValue])
		)
	}
}
