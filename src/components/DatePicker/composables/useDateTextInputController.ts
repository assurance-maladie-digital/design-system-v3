import { type Ref, type MaybeRef, unref, toValue } from 'vue'
import type { ValidationResult, ValidationRule } from '@/composables/validation/useValidation'
import type { DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import { validateDateFormat, isDateComplete } from './useDateFormatUtils'
import { validateEmptyOrIncompleteDate, adaptCustomRules } from '../utils/validationUtils'
import { locales } from '../locales'
import type { DatePickerRule } from '../types'

export interface UseDateTextFieldManualValidationOptions {
	required: MaybeRef<boolean>
	disableErrorHandling: MaybeRef<boolean>
	customRules: MaybeRef<DatePickerRule[]>
	customSuccessRules: MaybeRef<DatePickerRule[]>
	customWarningRules: MaybeRef<DatePickerRule[]>
	hasInteracted: Ref<boolean>
	errors: Ref<string[]>
	clearValidation: () => void
	parseDate: (dateStr: string, format: string) => Date | null
	validateField: (
		value: unknown,
		rules?: ValidationRule[],
		warningRules?: ValidationRule[],
		successRules?: ValidationRule[],
	) => Promise<ValidationResult> | ValidationResult
}

export interface UseDateTextFieldSubmitOptions {
	isValidating: Ref<boolean>
	hasInteracted: Ref<boolean>
	inputValue: Ref<string>
	runRules: (value: string) => Promise<boolean>
}

export interface UseDateTextFieldResetOptions {
	clearValidation: () => void
	isFocused: Ref<boolean>
	hasInteracted: Ref<boolean>
	isDisabled: () => boolean
	fieldKey: Ref<number>
	isFormatting: Ref<boolean>
	inputValue: Ref<string>
	selectedDates: Ref<unknown>
	emitModel: (value: DateModelValue) => void
}

export interface UseDateTextInputControllerOptions {
	autoClamp: MaybeRef<boolean>
	isRange: Ref<boolean>
	displayFormat: Ref<string>
	autoClampDate: (dateStr: string, format: string) => { clampedDate: string, adjusted: boolean }
	manualValidation: UseDateTextFieldManualValidationOptions
	submit: UseDateTextFieldSubmitOptions
	reset: UseDateTextFieldResetOptions
}

/**
 * Contrôleur interne du flux DateTextInput.
 * Centralise l'auto-clamp, la validation manuelle, la soumission et le reset.
 */
export const useDateTextInputController = (options: UseDateTextInputControllerOptions) => {
	const { autoClamp, isRange, displayFormat, autoClampDate, manualValidation, submit, reset: resetOptions } = options
	const {
		required,
		disableErrorHandling,
		customRules,
		customSuccessRules,
		customWarningRules,
		hasInteracted,
		errors,
		clearValidation,
		parseDate,
		validateField,
	} = manualValidation

	const isErrorHandlingDisabled = () => unref(disableErrorHandling)

	const pushValidationError = (message?: string) => {
		if (!isErrorHandlingDisabled() && message) {
			errors.value.push(message)
		}
	}

	const getReadyCustomRules = (): DatePickerRule[] | null => {
		const currentCustomRules = toValue(customRules)
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
			return errors.value.length === 0
		}

		const readyRules = getReadyCustomRules()
		if (readyRules === null) {
			return true
		}

		const safeCustomRules = adaptCustomRules(readyRules, displayFormat.value) as ValidationRule[]
		const safeWarningRules = adaptCustomRules(toValue(customWarningRules), displayFormat.value) as ValidationRule[]
		const safeSuccessRules = adaptCustomRules(toValue(customSuccessRules), displayFormat.value) as ValidationRule[]
		const result = validateField(date, safeCustomRules, safeWarningRules, safeSuccessRules)

		if (result instanceof Promise) {
			return result.then(resolvedResult => !resolvedResult.hasError)
		}

		return !result.hasError
	}

	const validateManualInput = (value: string): boolean | Promise<boolean> => {
		clearValidation()

		const emptyCheck = validateEmptyOrIncompleteDate(
			value,
			unref(required),
			(val: string) => isDateComplete(val, displayFormat.value),
			hasInteracted.value,
		)

		if (!emptyCheck.isValid && emptyCheck.errorMessage) {
			pushValidationError(locales.required)
		}

		if (!emptyCheck.shouldContinue) {
			return emptyCheck.isValid
		}

		const formatValidation = validateDateFormat(
			value,
			displayFormat.value,
			displayFormat.value,
			unref(required),
			hasInteracted.value,
			isErrorHandlingDisabled(),
		)
		if (!formatValidation.isValid) {
			pushValidationError(formatValidation.message)
			return false
		}

		const date = parseDate(value, displayFormat.value)
		if (!date) {
			pushValidationError(locales.invalidDateFormatWithFormat(displayFormat.value))
			return false
		}

		return validateCustomRulesForDate(date)
	}

	const validateOnSubmit = async () => {
		const { isValidating, hasInteracted, inputValue, runRules } = submit
		isValidating.value = true
		hasInteracted.value = true

		try {
			return await runRules(inputValue.value)
		}
		finally {
			isValidating.value = false
		}
	}

	const clampDatePart = (value: string): string => {
		if (!value) return value

		return autoClampDate(value, displayFormat.value).clampedDate
	}

	const clampRangeInput = (raw: string): string => {
		const [rawStartDate = '', rawEndDate = ''] = raw.split(locales.rangeSeparator).map(dateText => dateText.trim())
		const clampedStartDate = clampDatePart(rawStartDate)
		const clampedEndDate = clampDatePart(rawEndDate)

		return clampedEndDate
			? `${clampedStartDate}${locales.rangeSeparator}${clampedEndDate}`
			: `${clampedStartDate}${locales.rangeSeparator}`
	}

	const clampIfNeeded = (raw: string): string => {
		if (!unref(autoClamp) || !raw) return raw

		if (isRange.value && raw.includes(locales.rangeSeparator)) {
			return clampRangeInput(raw)
		}

		return clampDatePart(raw)
	}

	const reset = () => {
		const {
			clearValidation,
			isFocused,
			hasInteracted,
			isDisabled,
			fieldKey,
			isFormatting,
			inputValue,
			selectedDates,
			emitModel,
		} = resetOptions

		// 1) Nettoyer l'état de validation et d'interaction
		clearValidation()
		isFocused.value = false
		hasInteracted.value = false

		if (isDisabled()) {
			fieldKey.value++
			return
		}

		// 2) Réinitialiser la valeur sans déclencher de validation interactive
		isFormatting.value = true
		inputValue.value = ''
		selectedDates.value = null
		isFormatting.value = false

		// 3) Synchroniser le modèle externe
		emitModel(null)

		// 4) Forcer la recréation du champ pour réinitialiser l'état interne de Vuetify
		fieldKey.value++
	}

	return {
		clampIfNeeded,
		validateManualInput,
		validateOnSubmit,
		reset,
	}
}
