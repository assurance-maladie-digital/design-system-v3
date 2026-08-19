import { computed, ref, watch, unref, type ComputedRef, type Ref, type MaybeRef } from 'vue'
import { type ValidationResult, type ValidationRule, type VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'
import { useCustomValidation } from '@/composables/unifyValidation/useCustomValidation'
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
	customSuccessRules?: Ref<DatePickerRule[]>
	customWarningRules: Ref<DatePickerRule[]>
	errorMessages?: Ref<string[] | null | undefined>
	hasErrorProp?: MaybeRef<boolean>
	hasSuccessProp?: MaybeRef<boolean>
	hasWarningProp?: MaybeRef<boolean>
	warningMessages?: Ref<string[] | null | undefined>
	successMessages?: Ref<string[] | null | undefined>
	maxErrors?: MaybeRef<number>
	selectedDates: Ref<DateObjectValue>
	isUpdatingFromInternal: Ref<boolean>
	currentRangeIsValid: Ref<boolean>
	getRangeValidationError: Ref<string>
	readonly?: MaybeRef<boolean>
	useVuetifyValidation?: MaybeRef<boolean>
	rules?: Ref<VuetifyValidationRule[] | undefined>
	skipValidationWhenReadonly?: boolean
	useCalendarModeRequiredFlow?: boolean
	isInitialValidation?: Ref<boolean>
	isValidateOnBlur?: Ref<boolean>
	onblur?: Ref<boolean>
	fieldIdentifier?: string
	revalidateOnCustomRulesChange?: boolean
	formRegistration?: {
		validateOnSubmit?: () => Promise<boolean> | boolean
		clearValidation?: () => void
		reset?: () => void
	}
}

export interface DatePickerValidationController {
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]>
	hasError: Ref<boolean> | ComputedRef<boolean>
	hasWarning: Ref<boolean> | ComputedRef<boolean>
	hasSuccess: Ref<boolean> | ComputedRef<boolean>
	errorMessages: Ref<string[]> | ComputedRef<string[]>
	warningMessages: Ref<string[]> | ComputedRef<string[]>
	successMessages: Ref<string[]> | ComputedRef<string[]>
	clearValidation: () => void
	pushError: (message?: string) => void
	replaceErrors: (messages: string[]) => void
	validateField: (
		value: unknown,
		rules?: ValidationRule[],
		warningRules?: ValidationRule[],
		successRules?: ValidationRule[],
	) => ValidationResult | Promise<ValidationResult>
	validateDates: (forceValidation?: boolean) => ValidationResult | Promise<ValidationResult>
	validateCalendarModeDates: (forceValidation?: boolean) => void | ValidationResult | Promise<ValidationResult | void>
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

const createInactiveValidationState = () => {
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
		pushError: () => {},
		replaceErrors: () => {},
		validate: () => emptyValidationResult(),
		validateSubmit: () => emptyValidationResult(),
		validateField: () => emptyValidationResult(),
	}
}

export const createInactiveDatePickerValidationController = (): Pick<
	DatePickerValidationController,
	| 'errors'
	| 'warnings'
	| 'successes'
	| 'hasError'
	| 'hasWarning'
	| 'hasSuccess'
	| 'errorMessages'
	| 'warningMessages'
	| 'successMessages'
	| 'clearValidation'
	| 'pushError'
	| 'replaceErrors'
	| 'validateField'
	| 'validateDates'
	| 'validateCalendarModeDates'
> => {
	const validationState = createInactiveValidationState()
	const hasError = computed(() => false)
	const hasWarning = computed(() => false)

	return {
		errors: validationState.errors,
		warnings: validationState.warnings,
		successes: validationState.successes,
		hasError,
		hasWarning,
		hasSuccess: validationState.hasSuccess,
		errorMessages: validationState.errors,
		warningMessages: validationState.warnings,
		successMessages: validationState.successes,
		clearValidation: validationState.clear,
		pushError: validationState.pushError,
		replaceErrors: validationState.replaceErrors,
		validateField: validationState.validateField,
		validateDates: validationState.validate,
		validateCalendarModeDates: validationState.validateSubmit,
	}
}

export function useDatePickerValidation(options: DatePickerValidationOptions): DatePickerValidationController {
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = ref<string[]>([])
	const validation = useCustomValidation(
		computed(() => options.selectedDates.value),
		options.customRules as Ref<ValidationRule[]>,
		options.customWarningRules as Ref<ValidationRule[]>,
		(options.customSuccessRules as Ref<ValidationRule[]>) ?? ref<ValidationRule[]>([]),
		errors,
		warnings,
		successes,
		computed(() => unref(options.showSuccessMessages)),
		computed(() => options.fieldIdentifier ?? 'Date'),
		ref(false),
		computed(() => options.isValidateOnBlur?.value ?? true),
		computed(() => unref(options.disableErrorHandling)),
		computed(() => Boolean(unref(options.readonly))),
		ref(false),
		{
			registerWithForm: Boolean(options.formRegistration),
			reactiveValidation: false,
			formRegistration: options.formRegistration,
			useVuetifyValidation: computed(() => Boolean(unref(options.useVuetifyValidation))),
			rules: options.rules,
		},
	)

	const clearValidation = () => validation.clearValidation()

	const limitMessages = (messages: string[]): string[] => {
		const max = options.maxErrors ? unref(options.maxErrors) : undefined
		return max && max > 0 ? messages.slice(0, max) : messages
	}

	const normalizeMessages = (messages: string[]): string[] => limitMessages(
		[...new Set(messages.filter(Boolean))],
	)

	const replaceErrors = (messages: string[]): void => {
		errors.value = normalizeMessages(messages)
	}

	const pushError = (message?: string): void => {
		if (!message) {
			return
		}

		replaceErrors([...errors.value, message])
	}

	const mergeMessages = (
		externalMessages: string[] | null | undefined,
		internalMessages: string[],
	): string[] => limitMessages([
		...new Set([
			...(externalMessages ?? []),
			...internalMessages,
		]),
	])

	const displayErrors = computed(() => mergeMessages(options.errorMessages?.value, errors.value))
	const displayWarnings = computed(() => mergeMessages(options.warningMessages?.value, warnings.value))
	const displaySuccesses = computed(() => mergeMessages(options.successMessages?.value, successes.value))
	const displayHasError = computed(() =>
		displayErrors.value.length > 0 || Boolean(unref(options.hasErrorProp)),
	)
	const displayHasWarning = computed(() =>
		displayWarnings.value.length > 0 || Boolean(unref(options.hasWarningProp)),
	)
	const displayHasSuccess = computed(() => (
		(
			validation.hasSuccess.value
			|| (options.successMessages?.value?.length ?? 0) > 0
		)
		&& !displayHasError.value
		&& !displayHasWarning.value
	) || Boolean(unref(options.hasSuccessProp)))

	// Utiliser useDateRangeValidation pour centraliser la validation des plages
	const { isRangeValid: isDateRangeValid } = useDateRangeValidation(
		options.selectedDates,
		unref(options.displayRange),
	)

	if (options.skipValidationWhenReadonly) {
		watch(() => unref(options.readonly), (newValue) => {
			if (newValue) {
				replaceErrors([])
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

		return validation.validateValue(value, rules, warningRules, successRules)
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

	const validateSelectedDates = (
		dates = getDatesToValidate(),
		rules = options.customRules.value,
		warningRules = options.customWarningRules.value,
		successRules = options.customSuccessRules?.value ?? [],
	): ValidationResult[] | Promise<ValidationResult[]> => {
		const results = dates.map(date => validateField(date, rules, warningRules, successRules))

		if (results.some(result => result instanceof Promise)) {
			return Promise.all(results.map(result => Promise.resolve(result)))
		}

		return results as ValidationResult[]
	}

	const revalidateSelectedDates = (): void => {
		queueMicrotask(async () => {
			clearValidation()

			for (const date of getDatesToValidate()) {
				await Promise.resolve(validateField(
					date,
					options.customRules.value,
					options.customWarningRules.value,
					options.customSuccessRules?.value ?? [],
				))
			}
		})
	}

	const dedupeValidationState = (): void => {
		replaceErrors(errors.value)
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
				pushError(locales.endBeforeStart)
				isValid = false
			}
			else if (!options.currentRangeIsValid.value) {
				const rangeError = options.getRangeValidationError.value
				if (rangeError) {
					pushError(rangeError)
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
			pushError(locales.required)
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
			pushError(locales.required)
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

		const validationResults = validateSelectedDates(
			getDatesToValidate(),
			customRules,
			customWarningRules,
			options.customSuccessRules?.value ?? [],
		)

		if (validationResults instanceof Promise) {
			return Promise
				.resolve(validationResults)
				.then((resolvedResults) => {
					const hasError = resolvedResults.some(result => result.hasError)
					return applyRangeValidationErrors(!hasError)
				})
		}

		const hasError = validationResults.some(result => result.hasError)
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

			revalidateSelectedDates()
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
		errors,
		warnings,
		successes,
		hasError: displayHasError,
		hasWarning: displayHasWarning,
		hasSuccess: displayHasSuccess,
		errorMessages: displayErrors,
		warningMessages: displayWarnings,
		successMessages: displaySuccesses,
		clearValidation,
		pushError,
		replaceErrors,
		validateField,
		validateDates,
		validateCalendarModeDates,
		isRangeValid: isDateRangeValid,
	}
}
