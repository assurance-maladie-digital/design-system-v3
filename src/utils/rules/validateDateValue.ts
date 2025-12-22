import dayjs from 'dayjs'
import { formatDate } from '@/utils/formatDate'
import { ruleMessage } from '@/utils/ruleMessage'
import type { ErrorMessages, ValidationResult, Value } from './types'

interface ValidateDateOptions {
	errorMessages: ErrorMessages
	messageKey?: string
	messageArgs?: unknown[]
}

/**
 * Utility to validate date-like values (string | Date) in rules.
 * - returns true when the value is falsy
 * - supports string and Date inputs
 * - falls back to a rule message for unsupported types or invalid dates
 */
export function validateDateValue(
	value: Value,
	isValid: (formatted: string) => boolean,
	{ errorMessages, messageKey = 'default', messageArgs }: ValidateDateOptions,
): ValidationResult {
	if (!value) {
		return true
	}

	if (value instanceof Date) {
		const formatted = formatDate(dayjs(value))
		return isValid(formatted) || ruleMessage(errorMessages, messageKey, messageArgs)
	}

	if (typeof value === 'string') {
		return isValid(value) || ruleMessage(errorMessages, messageKey, messageArgs)
	}

	return ruleMessage(errorMessages, messageKey, messageArgs)
}
