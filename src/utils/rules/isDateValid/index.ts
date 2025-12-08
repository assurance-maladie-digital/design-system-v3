import { ruleMessage } from '@/utils/ruleMessage'
import type {
	ValidationRule,
	ValidationResult,
	ErrorMessages,
	Value,
} from '../types'

import { defaultErrorMessages } from './locales'

import { isDateValid as checkIfDateValid } from '@/utils/functions/validation/isDateValid'

/** Check that the value is a valid date (DD/MM/YYYY format) */
export function isDateValidFn(
	errorMessages: ErrorMessages = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		if (!value) {
			return true
		}

		const validationResult = typeof value === 'string' && checkIfDateValid(value)
		const errorMessage
			= typeof validationResult === 'string'
				? ruleMessage(errorMessages, validationResult)
				: true

		return errorMessage || ruleMessage(errorMessages, 'default')
	}
}

export const isDateValid = isDateValidFn()
