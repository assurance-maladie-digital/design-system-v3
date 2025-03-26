import { ruleMessage } from '@/utils/ruleMessage'
import type {
	ValidationRule,
	ValidationResult,
	ErrorMessages,
	Value,
} from '../types'

import { defaultErrorMessages } from './locales'

/** Check that the value is not shorter than the specified length */
export function isMinLengthFn(
	min: number,
	ignoreSpaces = false,
	errorMessages: ErrorMessages<number> = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		if (!value) {
			return true
		}

		if (ignoreSpaces) {
			value = value.replace(/\s/g, '')
		}

		return (
			value.length >= min || ruleMessage(errorMessages, 'default', [min])
		)
	}
}
