import { ruleMessage } from '@/utils/ruleMessage'
import { formatDate } from '@/utils/formatDate'
import dayjs from 'dayjs'
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
		let validationResult: string | true | false
		if (value instanceof Date) {
			const formatted = formatDate(dayjs(value))
			validationResult = checkIfDateValid(formatted)
		}
		else if (typeof value === 'string') {
			validationResult = checkIfDateValid(value)
		}
		else {
			return ruleMessage(errorMessages, 'default')
		}
		if (validationResult === true) {
			return true
		}
		if (typeof validationResult === 'string') {
			if (Object.prototype.hasOwnProperty.call(errorMessages, validationResult)) {
				return ruleMessage(errorMessages, validationResult)
			}
			return ruleMessage(errorMessages, 'default')
		}
		return ruleMessage(errorMessages, 'default')
	}
}

export const isDateValid = isDateValidFn()
