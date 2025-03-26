import { ruleMessage } from '@/utils/ruleMessage'
import type {
	ValidationRule,
	ValidationResult,
	ErrorMessages,
	Value,
} from '@/utils/rules/types'
import { defaultErrorMessages } from './locales'
import { isEmailValid } from '@/utils/functions/validation/isEmailValid'

/** Check that the value is a valid email */
export function isValidEmailFn(
	errorMessages: ErrorMessages = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		if (!value) {
			return true
		}

		return isEmailValid(value) || ruleMessage(errorMessages, 'default')
	}
}

export const isValidEmail = isValidEmailFn()
