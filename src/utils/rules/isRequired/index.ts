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
		else if (typeof value === 'string') {
			valid = value.trim() !== ''
		}
		else {
			// Pour les nombres (y compris 0), null, undefined, etc.
			valid = value !== null && value !== undefined
		}

		return valid || ruleMessage(errorMessages, 'default')
	}
}

export const isRequired = isRequiredFn()

/**
 * @deprecated utiliser à la place Value depuis src/utils/rules/types.d.ts
 */
export type { Value } from '../types'
