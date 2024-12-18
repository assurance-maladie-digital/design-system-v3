import { ruleMessage } from './ruleMessageHelper'
import type { ValidationRule, ValidationResult, ErrorMessages } from '../types'

import { defaultErrorMessages } from './locales'

export type Value = string | string[] | null

export function requiredFn(
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

export const required = requiredFn()
