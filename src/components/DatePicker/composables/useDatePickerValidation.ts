import { computed, ref, watch, unref, type ComputedRef, type Ref, type MaybeRef } from 'vue'
import { useValidation, type ValidationResult, type ValidationRule } from '@/composables/validation/useValidation'
import { locales } from '../locales'
import type { DateObjectValue, DatePickerRule } from '../types'
import { useDateRangeValidation } from './useDateRangeValidation'

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

export interface DatePickerValidationStateController {
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: ComputedRef<string[]>
	hasSuccess: Ref<boolean> | ComputedRef<boolean>
	clear: () => void
	validate: (forceValidation?: boolean) => ValidationResult | Promise<ValidationResult>
	validateSubmit: (forceValidation?: boolean) => void | ValidationResult | Promise<ValidationResult | void>
	validateField: (
		value: unknown,
		rules?: ValidationRule[],
		warningRules?: ValidationRule[],
		successRules?: ValidationRule[],
	) => ValidationResult | Promise<ValidationResult>
}

export interface DatePickerValidationMessagesController {
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]> | ComputedRef<string[]>
	hasSuccess: Ref<boolean> | ComputedRef<boolean>
}

export interface DatePickerValidationController {
	validation: ReturnType<typeof useValidation>
	validationState: DatePickerValidationStateController
	messages: DatePickerValidationMessagesController
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]>
	errorMessages: Ref<string[]>
	warningMessages: Ref<string[]>
	successMessages: ComputedRef<string[]>
	clearValidation: () => void
	validateField: DatePickerValidationStateController['validateField']
	validateDates: DatePickerValidationStateController['validate']
	validateCalendarModeDates: DatePickerValidationStateController['validateSubmit']
	isRangeValid: ReturnType<typeof useDateRangeValidation>['isRangeValid']
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

const requiredValidationResult = (shouldDisplayErrors: boolean): ValidationResult => ({
	hasError: true,
	hasWarning: false,
	hasSuccess: false,
	state: {
		errors: shouldDisplayErrors ? [locales.required] : [],
		warnings: [],
		successes: [],
	},
})

const createInactiveValidationState = (): DatePickerValidationStateController => {
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = computed(() => [] as string[])
	const hasSuccess = computed(() => false)

	return {
		errors,
		warnings,
		successes,
		hasSuccess,
		clear: () => {},
		validate: () => emptyValidationResult(),
		validateSubmit: () => emptyValidationResult(),
		validateField: () => emptyValidationResult(),
	}
}

export const createInactiveDatePickerValidationController = (): Pick<
	DatePickerValidationController,
	| 'validation'
	| 'validationState'
	| 'messages'
	| 'errors'
	| 'warnings'
	| 'successes'
	| 'errorMessages'
	| 'warningMessages'
	| 'successMessages'
	| 'clearValidation'
	| 'validateField'
	| 'validateDates'
	| 'validateCalendarModeDates'
> => {
	const validationState = createInactiveValidationState()
	const messages = {
		errors: validationState.errors,
		warnings: validationState.warnings,
		successes: validationState.successes,
		hasSuccess: validationState.hasSuccess,
	}

	return {
		validation: {
			displaySuccesses: validationState.successes,
			hasSuccess: validationState.hasSuccess,
		} as ReturnType<typeof useValidation>,
		validationState,
		messages,
		errors: validationState.errors,
		warnings: validationState.warnings,
		successes: validationState.successes,
		errorMessages: validationState.errors,
		warningMessages: validationState.warnings,
		successMessages: validationState.successes,
		clearValidation: validationState.clear,
		validateField: validationState.validateField,
		validateDates: validationState.validate,
		validateCalendarModeDates: validationState.validateSubmit,
	}
}

export function useDatePickerValidation(options: DatePickerValidationOptions): DatePickerValidationController {
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

	const clearValidation = () => baseClearValidation()

	// Utiliser useDateRangeValidation pour centraliser la validation des plages
	const { isRangeValid: isDateRangeValid } = useDateRangeValidation(
		options.selectedDates,
		unref(options.displayRange),
	)

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
		if (options.skipValidationWhenReadonly && unref(options.readonly)) {
			return emptyValidationResult()
		}

		return baseValidateField(value, rules, warningRules, successRules)
	}

	const shouldDisplayErrors = (): boolean => !unref(options.disableErrorHandling)

	const hasNoSelection = (): boolean => !options.selectedDates.value
		|| (Array.isArray(options.selectedDates.value) && options.selectedDates.value.length === 0)

	const isIncompleteRangeSelection = (forceValidation: boolean): boolean => (
		unref(options.displayRange)
		&& Array.isArray(options.selectedDates.value)
		&& options.selectedDates.value.length === 2
		&& !!options.selectedDates.value[0]
		&& !options.selectedDates.value[1]
		&& !forceValidation
	)

	const getDatesToValidate = (): Date[] => {
		if (!options.selectedDates.value) {
			return []
		}

		return Array.isArray(options.selectedDates.value)
			? options.selectedDates.value.filter((date): date is Date => !!date)
			: [options.selectedDates.value]
	}

	const pushUniqueError = (message: string): void => {
		if (!errors.value.includes(message)) {
			errors.value.push(message)
		}
	}

	const dedupeValidationState = (): void => {
		errors.value = [...new Set(errors.value)]
		warnings.value = [...new Set(warnings.value)]
		successes.value = [...new Set(successes.value)]
	}

	const buildValidationResult = (isValid: boolean): ValidationResult => {
		dedupeValidationState()

		return {
			hasError: !isValid,
			hasWarning: warnings.value.length > 0,
			hasSuccess: successes.value.length > 0 && isValid && warnings.value.length === 0,
			state: {
				errors: errors.value,
				warnings: warnings.value,
				successes: successes.value,
			},
		}
	}

	const applyRangeValidationErrors = (initialIsValid: boolean): ValidationResult => {
		let isValid = initialIsValid

		if (unref(options.displayRange) && Array.isArray(options.selectedDates.value) && options.selectedDates.value.length >= 2) {
			const startDate = options.selectedDates.value[0]
			const endDate = options.selectedDates.value[options.selectedDates.value.length - 1]

			if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
				pushUniqueError(locales.endBeforeStart)
				isValid = false
			}
			else if (!options.currentRangeIsValid.value) {
				const rangeError = options.getRangeValidationError.value
				if (rangeError) {
					pushUniqueError(rangeError)
					isValid = false
				}
			}
		}

		return buildValidationResult(isValid)
	}

	const shouldValidateRequired = (forceValidation: boolean): boolean => (
		(forceValidation || !options.isUpdatingFromInternal.value)
		&& unref(options.required)
		&& hasNoSelection()
	)

	const validateRequiredSelection = (forceValidation: boolean): null | ValidationResult => {
		if (!shouldValidateRequired(forceValidation)) {
			return null
		}

		if (options.isInitialValidation?.value && !forceValidation) {
			return emptyValidationResult()
		}

		if (shouldDisplayErrors()) {
			errors.value.push(locales.required)
		}

		return requiredValidationResult(shouldDisplayErrors())
	}

	const shouldRunDisplayedValidation = (forceValidation: boolean): boolean => (
		shouldDisplayErrors() && (!options.isInitialValidation?.value || forceValidation)
	)

	const shouldSkipCalendarModeRequiredError = (forceValidation: boolean): boolean => {
		if (!shouldValidateRequired(forceValidation)) {
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

		if (shouldDisplayErrors()) {
			errors.value.push(locales.required)
		}

		return true
	}

	// Validation des dates (fusionnée de useDateValidation)
	const validateDates = (forceValidation = false): ValidationResult | Promise<ValidationResult> => {
		const customRules = options.customRules.value
		const customWarningRules = options.customWarningRules.value

		if (unref(options.noCalendar)) {
			return emptyValidationResult()
		}

		// Réinitialiser la validation
		clearValidation()

		const requiredResult = validateRequiredSelection(forceValidation)
		if (requiredResult) {
			return requiredResult
		}

		if (hasNoSelection()) {
			return successValidationResult()
		}

		if (isIncompleteRangeSelection(forceValidation)) {
			return emptyValidationResult()
		}

		if (!shouldDisplayErrors()) {
			return applyRangeValidationErrors(true)
		}

		const validationResults = getDatesToValidate()
			.map(date => validateField(date, customRules, customWarningRules))

		if (validationResults.some(result => result instanceof Promise)) {
			return Promise
				.all(validationResults.map(result => Promise.resolve(result)))
				.then((resolvedResults) => {
					const hasError = resolvedResults.some(result => result.hasError)
					return applyRangeValidationErrors(!hasError)
				})
		}

		const hasError = (validationResults as ValidationResult[]).some(result => result.hasError)
		return applyRangeValidationErrors(!hasError)
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

		if (shouldSkipCalendarModeRequiredError(forceValidation)) {
			return
		}

		if (hasNoSelection()) {
			if (!options.customRules.value || options.customRules.value.length === 0) return

			if (shouldRunDisplayedValidation(forceValidation)) {
				await validateField(
					options.selectedDates.value,
					options.customRules.value,
					options.customWarningRules.value,
				)
				dedupeValidationState()
			}
			return
		}

		if (shouldRunDisplayedValidation(forceValidation)) {
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

	// Watcher sur selectedDates pour la validation automatique (seulement si pas de mode CalendarMode spécifique)
	if (!options.useCalendarModeRequiredFlow) {
		watch(options.selectedDates, (newDates) => {
			if (newDates === null || (Array.isArray(newDates) && newDates.length === 0)) {
				clearValidation()
			}
		})
	}

	const validationState = {
		errors,
		warnings,
		successes: validation.displaySuccesses,
		hasSuccess: validation.hasSuccess,
		clear: clearValidation,
		validate: validateDates,
		validateSubmit: validateCalendarModeDates,
		validateField,
	}
	const messages = {
		errors,
		warnings,
		successes: validation.displaySuccesses,
		hasSuccess: validation.hasSuccess,
	}

	return {
		validation,
		validationState,
		messages,
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
		isRangeValid: isDateRangeValid,
	}
}
