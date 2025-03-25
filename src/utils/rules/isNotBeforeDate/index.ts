import type { ValidationRule, ValidationResult, Value } from '../types'
import { defaultErrorMessages } from './locales'
import { isDateBefore } from '../../functions/validation/isDateBefore'
import { formatDate } from '@/utils/formatDate'
import { parseDate } from '@/utils/parseDate'
import { ruleMessage } from '@/utils/ruleMessage'

/** Check that the value is not after the specified date (DD/MM/YYYY format) */
export function isNotBeforeDateFn(
	date: string,
	errorMessages = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		if (!value) {
			return true
		}

		const formattedValue = formatDate(parseDate(date))

		return (
			!isDateBefore(date, value)
			|| ruleMessage(errorMessages, 'default', [formattedValue])
		)
	}
}
