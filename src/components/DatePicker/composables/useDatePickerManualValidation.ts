import { type MaybeRef, toValue, unref } from 'vue'
import type { ValidationResult, ValidationRule } from '@/composables/unifyValidation/useValidation'
import { validateDateFormat, isDateComplete } from './useDateFormatUtils'
import { adaptCustomRules, validateEmptyOrIncompleteDate } from '../utils/validationUtils'
import { locales } from '../locales'
import type { DatePickerRule } from '../types'

export interface DatePickerManualValidationOptions {
	displayFormat: MaybeRef<string>
	required: MaybeRef<boolean>
	disableErrorHandling: MaybeRef<boolean>
	customRules: MaybeRef<DatePickerRule[]>
	customSuccessRules: MaybeRef<DatePickerRule[]>
	customWarningRules: MaybeRef<DatePickerRule[]>
	hasInteracted: { value: boolean }
	hasError: () => boolean
	clearValidation: () => void
	pushError: (message?: string) => void
	parseDate: (dateStr: string, format: string) => Date | null
	validateField: (
		value: unknown,
		rules?: ValidationRule[],
		warningRules?: ValidationRule[],
		successRules?: ValidationRule[],
	) => Promise<ValidationResult> | ValidationResult
}

export const useDatePickerManualValidation = (options: DatePickerManualValidationOptions) => {
	const isErrorHandlingDisabled = (): boolean => unref(options.disableErrorHandling)

	const pushValidationError = (message?: string): void => {
		if (!isErrorHandlingDisabled() && message) {
			options.pushError(message)
		}
	}

	const getReadyCustomRules = (): DatePickerRule[] | null => {
		const currentCustomRules = toValue(options.customRules)
		const readyRules = currentCustomRules.filter((rule) => {
			if (rule.type === 'notBeforeDate' || rule.type === 'notAfterDate' || rule.type === 'exactDate') {
				return rule.options && rule.options.date !== undefined
			}

			return true
		})

		if (readyRules.length === 0 && currentCustomRules.length > 0) {
			return null
		}

		return readyRules
	}

	const validateCustomRulesForDate = (date: Date): boolean | Promise<boolean> => {
		if (isErrorHandlingDisabled()) {
			return !options.hasError()
		}

		const readyRules = getReadyCustomRules()
		if (readyRules === null) {
			return true
		}

		const format = unref(options.displayFormat)
		const safeCustomRules = adaptCustomRules(readyRules, format) as ValidationRule[]
		const safeWarningRules = adaptCustomRules(toValue(options.customWarningRules), format) as ValidationRule[]
		const safeSuccessRules = adaptCustomRules(toValue(options.customSuccessRules), format) as ValidationRule[]
		const result = options.validateField(date, safeCustomRules, safeWarningRules, safeSuccessRules)

		if (result instanceof Promise) {
			return result.then(resolvedResult => !resolvedResult.hasError)
		}

		return !result.hasError
	}

	const validateManualInput = (value: string): boolean | Promise<boolean> => {
		options.clearValidation()

		const format = unref(options.displayFormat)
		const emptyCheck = validateEmptyOrIncompleteDate(
			value,
			unref(options.required),
			(dateValue: string) => isDateComplete(dateValue, format),
			options.hasInteracted.value,
		)

		if (!emptyCheck.isValid && emptyCheck.errorMessage) {
			pushValidationError(locales.required)
		}

		if (!emptyCheck.shouldContinue) {
			return emptyCheck.isValid
		}

		const formatValidation = validateDateFormat(
			value,
			format,
			format,
			unref(options.required),
			options.hasInteracted.value,
			isErrorHandlingDisabled(),
		)
		if (!formatValidation.isValid) {
			pushValidationError(formatValidation.message)
			return false
		}

		const date = options.parseDate(value, format)
		if (!date) {
			pushValidationError(locales.invalidDateFormatWithFormat(format))
			return false
		}

		return validateCustomRulesForDate(date)
	}

	return {
		validateManualInput,
		validateCustomRulesForDate,
	}
}
