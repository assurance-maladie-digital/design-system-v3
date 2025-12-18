import { formatDate } from '@/utils/formatDate'
import { parseDate } from '@/utils/parseDate'
import { isDateAfter } from '../../functions/validation/isDateAfter'
import type { ValidationResult, ValidationRule, Value } from '../types'
import { defaultErrorMessages } from './locales'
import { validateDateValue } from '../validateDateValue'

/** Check that the value is not after the specified date (DD/MM/YYYY format) */
export function isNotAfterDateFn(
	date: string,
	errorMessages = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		const formattedValue = formatDate(parseDate(date))

		return validateDateValue(
			value,
			formatted => !isDateAfter(date, formatted),
			{ errorMessages, messageArgs: [formattedValue] },
		)
	}
}
