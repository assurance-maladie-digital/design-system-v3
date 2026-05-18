import { computed, watch, type Ref } from 'vue'
import { useValidation, type ValidationResult, type ValidationRule } from '@/composables/validation/useValidation'
import { DATE_PICKER_MESSAGES } from '../constants/messages'
import { useDateValidation } from './useDateValidation'
import type { DateObjectValue } from '../types'

export type DatePickerValidationRule = {
	type: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DatePicker rules are still legacy-shaped during migration.
	options: any
}

export type DatePickerValidationBridgeOptions = {
	showSuccessMessages: boolean
	disableErrorHandling: boolean
	noCalendar: boolean
	required: boolean
	displayRange: boolean
	customRules: Ref<DatePickerValidationRule[]>
	customWarningRules: Ref<DatePickerValidationRule[]>
	selectedDates: Ref<DateObjectValue>
	isUpdatingFromInternal: Ref<boolean>
	currentRangeIsValid: Ref<boolean>
	getRangeValidationError: Ref<string>
	readonly?: Ref<boolean>
	skipValidationWhenReadonly?: boolean
	useCalendarModeRequiredFlow?: boolean
	isInitialValidation?: Ref<boolean>
	isValidateOnBlur?: Ref<boolean>
	onblur?: Ref<boolean>
	fieldIdentifier?: string
	revalidateOnCustomRulesChange?: boolean
}

const emptyValidationResult = (): ValidationResult => ({
	hasError: false,
	hasWarning: false,
	hasSuccess: false,
	state: {
		errors: [],
		warnings: [],
		successes: [],
	},
})

export function useDatePickerValidationBridge(options: DatePickerValidationBridgeOptions) {
	const validation = useValidation({
		showSuccessMessages: options.showSuccessMessages,
		fieldIdentifier: options.fieldIdentifier ?? 'Date',
		disableErrorHandling: options.disableErrorHandling,
	})

	const {
		errors,
		warnings,
		successes,
		validateField: baseValidateField,
		clearValidation: baseClearValidation,
	} = validation

	const clearValidation = () => baseClearValidation()

	if (options.skipValidationWhenReadonly && options.readonly) {
		watch(options.readonly, () => {
			errors.value = []
			warnings.value = []
			successes.value = []
		})
	}

	const validateField = (
		value: unknown,
		rules: ValidationRule[] = [],
		warningRules: ValidationRule[] = [],
		successRules: ValidationRule[] = [],
	): Promise<ValidationResult> | ValidationResult => {
		if (options.skipValidationWhenReadonly && options.readonly?.value) {
			return emptyValidationResult()
		}

		return baseValidateField(value, rules, warningRules, successRules)
	}

	const validateFieldForDateValidation = (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Compatibility signature for legacy useDateValidation.
		value: any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Compatibility signature for legacy useDateValidation.
		rules: any[] = [],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Compatibility signature for legacy useDateValidation.
		warningRules: any[] = [],
	): ValidationResult | Promise<ValidationResult> => {
		return validateField(value, rules, warningRules, [])
	}

	const { validateDates: coreValidateDates } = useDateValidation({
		noCalendar: options.noCalendar,
		required: options.useCalendarModeRequiredFlow ? false : options.required,
		displayRange: options.displayRange,
		disableErrorHandling: options.disableErrorHandling,
		customRules: computed(() => options.customRules.value),
		customWarningRules: computed(() => options.customWarningRules.value),
		selectedDates: options.selectedDates,
		isUpdatingFromInternal: options.isUpdatingFromInternal,
		currentRangeIsValid: options.currentRangeIsValid,
		getRangeValidationError: options.getRangeValidationError,
		clearValidation,
		validateField: validateFieldForDateValidation,
		errors,
		warnings,
		successes,
	})

	if (options.revalidateOnCustomRulesChange) {
		watch(options.customRules, () => {
			if (options.selectedDates.value === null) {
				return
			}

			queueMicrotask(async () => {
				clearValidation()

				const datesToValidate = Array.isArray(options.selectedDates.value)
					? options.selectedDates.value
					: [options.selectedDates.value]

				for (const date of datesToValidate) {
					await Promise.resolve(validateField(
						date,
						options.customRules.value,
						options.customWarningRules.value,
					))
				}
			})
		}, { deep: true })
	}

	const validateCalendarModeDates = async (forceValidation = false) => {
		if (!options.useCalendarModeRequiredFlow) {
			return await Promise.resolve(coreValidateDates(forceValidation))
		}

		if (options.noCalendar) {
			return
		}

		clearValidation()

		const shouldDisplayErrors = !options.disableErrorHandling
		const hasNoSelection = !options.selectedDates.value || (Array.isArray(options.selectedDates.value) && options.selectedDates.value.length === 0)

		if ((forceValidation || !options.isUpdatingFromInternal.value) && options.required && hasNoSelection) {
			if (options.readonly?.value) {
				return
			}
			if (options.onblur?.value && !options.isValidateOnBlur?.value) {
				return
			}
			if (shouldDisplayErrors && (!options.isInitialValidation?.value || forceValidation)) {
				errors.value.push(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
			}
			return
		}

		if (!options.selectedDates.value) {
			if (!options.customRules.value || options.customRules.value.length === 0) return

			if (shouldDisplayErrors && (!options.isInitialValidation?.value || forceValidation)) {
				await validateField(
					options.selectedDates.value,
					options.customRules.value,
					options.customWarningRules.value,
				)
				errors.value = [...new Set(errors.value)]
				warnings.value = [...new Set(warnings.value)]
				successes.value = [...new Set(successes.value)]
			}
			return
		}

		if (shouldDisplayErrors && (!options.isInitialValidation?.value || forceValidation)) {
			return await Promise.resolve(coreValidateDates(forceValidation))
		}
	}

	const validateDates = (forceValidation = false) => {
		if (!options.useCalendarModeRequiredFlow) {
			return coreValidateDates(forceValidation)
		}

		return validateCalendarModeDates(forceValidation)
	}

	return {
		validation,
		errors,
		warnings,
		successes,
		errorMessages: errors,
		warningMessages: warnings,
		successMessages: validation.displaySuccesses,
		clearValidation,
		validateField,
		validateDates,
	}
}
