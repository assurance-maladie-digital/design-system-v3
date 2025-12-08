import { ruleMessage } from '@/utils/ruleMessage'
import type {
	ValidationRule,
	ValidationResult,
	ErrorMessages,
	Value,
} from '../types'

import { defaultErrorMessages } from './locales'

/** Check that the value does not exceeds the specified length */
export function isMaxLengthFn(
	max: number,
	ignoreSpaces = false,
	errorMessages: ErrorMessages<number> = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		if (!value) {
			return true
		}

		if (typeof value !== 'string') {
			return ruleMessage(errorMessages, 'default', [max])
		}

		if (ignoreSpaces) {
			value = value.replace(/\s/g, '')
		}

		return (
			value.length <= max || ruleMessage(errorMessages, 'default', [max])
		)
	}
}
