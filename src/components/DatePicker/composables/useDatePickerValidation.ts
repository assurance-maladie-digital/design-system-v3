import { watch, unref, type Ref, type MaybeRef } from 'vue'
import { useValidation, type ValidationResult, type ValidationRule } from '@/composables/validation/useValidation'
import { locales } from '../locales'
import type { DateObjectValue, DatePickerRule } from '../types'

export type DatePickerValidationRule = DatePickerRule

export type DatePickerValidationOptions = {
	showSuccessMessages: MaybeRef<boolean>
	disableErrorHandling: MaybeRef<boolean>
	noCalendar: MaybeRef<boolean>
	required: MaybeRef<boolean>
	displayRange: MaybeRef<boolean>
	customRules: Ref<DatePickerRule[]>
	customWarningRules: Ref<DatePickerRule[]>
	selectedDates: Ref<DateObjectValue>
	isUpdatingFromInternal: Ref<boolean>
	currentRangeIsValid: Ref<boolean>
	getRangeValidationError: Ref<string>
	readonly?: MaybeRef<boolean>
	skipValidationWhenReadonly?: boolean
	useCalendarModeRequiredFlow?: boolean
	isInitialValidation?: Ref<boolean>
	isValidateOnBlur?: Ref<boolean>
	onblur?: Ref<boolean>
	fieldIdentifier?: string
	revalidateOnCustomRulesChange?: boolean
}

type DateSelectionValue = DateObjectValue

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

const successValidationResult = (): ValidationResult => ({
	hasError: false,
	hasWarning: false,
	hasSuccess: true,
	state: {
		errors: [],
		warnings: [],
		successes: [],
	},
})

const dedupeMessages = (messages: string[]) => [...new Set(messages)]

const isSelectionEmpty = (value: DateSelectionValue): boolean =>
	value === null || (Array.isArray(value) && value.length === 0)

const isIncompleteRangeSelection = (
	value: DateSelectionValue,
	displayRange: boolean,
	forceValidation: boolean,
): boolean =>
	displayRange
	&& Array.isArray(value)
	&& value.length === 2
	&& !!value[0]
	&& !value[1]
	&& !forceValidation

const getDatesToValidate = (value: DateSelectionValue): Date[] =>
	(Array.isArray(value) ? value.filter(Boolean) : [value]).filter((date): date is Date => date instanceof Date)

const addUniqueMessage = (messages: Ref<string[]>, message: string) => {
	if (!messages.value.includes(message)) {
		messages.value.push(message)
	}
}

const syncValidationCollections = (
	errors: Ref<string[]>,
	warnings: Ref<string[]>,
	successes: Ref<string[]>,
) => {
	errors.value = dedupeMessages(errors.value)
	warnings.value = dedupeMessages(warnings.value)
	successes.value = dedupeMessages(successes.value)
}

const createRequiredValidationResult = (shouldDisplayErrors: boolean): ValidationResult => ({
	hasError: true,
	hasWarning: false,
	hasSuccess: false,
	state: {
		errors: shouldDisplayErrors ? [locales.required] : [],
		warnings: [],
		successes: [],
	},
})

export function useDatePickerValidation(options: DatePickerValidationOptions) {
	// Utiliser useValidation pour la validation de base
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

	const clearValidation = baseClearValidation
	const isReadonlyValidationSkipped = () => options.skipValidationWhenReadonly && unref(options.readonly)
	const shouldDisplayErrors = () => !unref(options.disableErrorHandling)
	const isRequiredSelectionMissing = (forceValidation: boolean) =>
		(forceValidation || !options.isUpdatingFromInternal.value)
		&& unref(options.required)
		&& isSelectionEmpty(options.selectedDates.value)

	if (options.skipValidationWhenReadonly) {
		watch(() => unref(options.readonly), (newValue) => {
			if (newValue) {
				errors.value = []
				warnings.value = []
				successes.value = []
			}
		})
	}

	const validateField = (
		value: unknown,
		rules: ValidationRule[] = [],
		warningRules: ValidationRule[] = [],
		successRules: ValidationRule[] = [],
	): Promise<ValidationResult> | ValidationResult => {
		if (isReadonlyValidationSkipped()) {
			return emptyValidationResult()
		}

		return baseValidateField(value, rules, warningRules, successRules)
	}

	const applyRangeValidation = (initialIsValid: boolean): ValidationResult => {
		let finalIsValid = initialIsValid

		if (unref(options.displayRange) && Array.isArray(options.selectedDates.value) && options.selectedDates.value.length >= 2) {
			const startDate = options.selectedDates.value[0]
			const endDate = options.selectedDates.value[options.selectedDates.value.length - 1]

			if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
				addUniqueMessage(errors, locales.endBeforeStart)
				finalIsValid = false
			}
			else if (!options.currentRangeIsValid.value) {
				const rangeError = options.getRangeValidationError.value
				if (rangeError) {
					addUniqueMessage(errors, rangeError)
					finalIsValid = false
				}
			}
		}

		syncValidationCollections(errors, warnings, successes)

		return {
			hasError: !finalIsValid,
			hasWarning: warnings.value.length > 0,
			hasSuccess: successes.value.length > 0 && finalIsValid && warnings.value.length === 0,
			state: {
				errors: errors.value,
				warnings: warnings.value,
				successes: successes.value,
			},
		}
	}

	const validateCurrentSelectionRules = (
		customRules: DatePickerRule[],
		customWarningRules: DatePickerRule[],
	): ValidationResult | Promise<ValidationResult> => {
		const datesToValidate = getDatesToValidate(options.selectedDates.value)

		if (!shouldDisplayErrors()) {
			return applyRangeValidation(true)
		}

		const validationResults = datesToValidate.map(date => validateField(date, customRules, customWarningRules))

		if (validationResults.some(result => result instanceof Promise)) {
			return Promise
				.all(validationResults.map(result => Promise.resolve(result)))
				.then((resolvedResults) => {
					const hasError = resolvedResults.some(result => result.hasError)
					return applyRangeValidation(!hasError)
				})
		}

		const hasError = (validationResults as ValidationResult[]).some(result => result.hasError)
		return applyRangeValidation(!hasError)
	}

	const validateRequiredSelection = (forceValidation: boolean): ValidationResult | null => {
		if (!isRequiredSelectionMissing(forceValidation)) {
			return null
		}

		if (options.isInitialValidation?.value && !forceValidation) {
			return emptyValidationResult()
		}

		if (shouldDisplayErrors()) {
			addUniqueMessage(errors, locales.required)
		}

		return createRequiredValidationResult(shouldDisplayErrors())
	}

	const validateCalendarSelection = (
		customRules: DatePickerRule[],
		customWarningRules: DatePickerRule[],
		forceValidation: boolean,
	): ValidationResult | Promise<ValidationResult> => {
		const requiredResult = validateRequiredSelection(forceValidation)
		if (requiredResult) {
			return requiredResult
		}

		if (!options.selectedDates.value) {
			return successValidationResult()
		}

		if (isIncompleteRangeSelection(options.selectedDates.value, unref(options.displayRange), forceValidation)) {
			return emptyValidationResult()
		}

		return validateCurrentSelectionRules(customRules, customWarningRules)
	}

	const shouldSkipCalendarModeRequiredValidation = (forceValidation: boolean, hasNoSelection: boolean) => {
		if (!(forceValidation || !options.isUpdatingFromInternal.value) || !unref(options.required) || !hasNoSelection) {
			return false
		}

		if (unref(options.readonly)) {
			return true
		}

		if (options.onblur?.value && !options.isValidateOnBlur?.value) {
			return true
		}

		if (options.isInitialValidation?.value) {
			return true
		}

		return false
	}

	const validateCalendarModeRequiredSelection = (forceValidation: boolean, hasNoSelection: boolean) => {
		if (!(forceValidation || !options.isUpdatingFromInternal.value) || !unref(options.required) || !hasNoSelection) {
			return false
		}

		if (shouldSkipCalendarModeRequiredValidation(forceValidation, hasNoSelection)) {
			return true
		}

		if (shouldDisplayErrors()) {
			addUniqueMessage(errors, locales.required)
		}

		return true
	}

	const shouldRunCalendarModeSelectionValidation = (forceValidation: boolean) =>
		shouldDisplayErrors() && (!options.isInitialValidation?.value || forceValidation)

	const validateCalendarModeEmptySelection = async (forceValidation: boolean) => {
		if (!options.customRules.value || options.customRules.value.length === 0) return

		if (shouldRunCalendarModeSelectionValidation(forceValidation)) {
			await validateField(
				options.selectedDates.value,
				options.customRules.value,
				options.customWarningRules.value,
			)
			syncValidationCollections(errors, warnings, successes)
		}
	}

	// Validation des dates (fusionnée de useDateValidation)
	const validateDates = (forceValidation = false): ValidationResult | Promise<ValidationResult> => {
		const customRules = options.customRules.value
		const customWarningRules = options.customWarningRules.value

		if (unref(options.noCalendar)) {
			// En mode no-calendar, on délègue la validation au DateTextInput
			return emptyValidationResult()
		}

		clearValidation()
		return validateCalendarSelection(customRules, customWarningRules, forceValidation)
	}

	// Validation CalendarMode required flow
	const validateCalendarModeDates = async (forceValidation = false) => {
		if (!options.useCalendarModeRequiredFlow) {
			return await Promise.resolve(validateDates(forceValidation))
		}

		if (unref(options.noCalendar)) {
			return
		}

		clearValidation()
		const hasNoSelection = isSelectionEmpty(options.selectedDates.value)

		if (validateCalendarModeRequiredSelection(forceValidation, hasNoSelection)) {
			return
		}

		if (!options.selectedDates.value) {
			await validateCalendarModeEmptySelection(forceValidation)
			return
		}

		if (shouldRunCalendarModeSelectionValidation(forceValidation)) {
			return await Promise.resolve(validateDates(forceValidation))
		}
	}

	// Revalidation sur changement des customRules
	if (options.revalidateOnCustomRulesChange) {
		watch(options.customRules, () => {
			if (options.selectedDates.value === null) {
				return
			}

			queueMicrotask(async () => {
				clearValidation()

				const datesToValidate = getDatesToValidate(options.selectedDates.value)

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

	// Watcher sur selectedDates pour la validation automatique (seulement si pas de mode CalendarMode spécifique)
	if (!options.useCalendarModeRequiredFlow) {
		watch(options.selectedDates, (newDates) => {
			if (newDates === null || (Array.isArray(newDates) && newDates.length === 0)) {
				clearValidation()
			}
		})
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
		validateCalendarModeDates,
	}
}
