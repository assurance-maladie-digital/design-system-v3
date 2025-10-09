import { ruleMessage } from '../../ruleMessage'
import type { ValidationRule, ValidationResult, ErrorMessages, Value } from '../types'

import { defaultErrorMessages } from './locales'

export function isRequiredFn(
	errorMessages: ErrorMessages = defaultErrorMessages,
): ValidationRule<Value> {
	return (value: Value): ValidationResult => {
		let valid: boolean

		if (Array.isArray(value)) {
			valid = value.length !== 0
		}
		else {
			valid = Boolean(typeof value === 'string' ? value.trim() : value)
		}

		return valid || ruleMessage(errorMessages, 'default')
	}
}

export const isRequired = isRequiredFn()
