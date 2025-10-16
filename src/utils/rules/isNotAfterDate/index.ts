import { formatDate } from '@/utils/formatDate'
import { parseDate } from '@/utils/parseDate'
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

		if (typeof value !== 'string') {
			return ruleMessage(errorMessages, 'default')
		}

		const formattedValue = formatDate(parseDate(date))

		return (
			!isDateAfter(date, value)
			|| ruleMessage(errorMessages, 'default', [formattedValue])
		)
	}
}
