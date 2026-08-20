import { computed, ref, watch, unref, type ComputedRef, type Ref, type MaybeRef } from 'vue'
import { type ValidationResult, type ValidationRule, type VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'
import { useCustomValidation } from '@/composables/unifyValidation/useCustomValidation'
import {
	normalizeMessages as normalizeMessagesUtil,
	useDisplayMessages,
} from '@/composables/unifyValidation/messageUtils'
import { locales } from '../locales'
import type { DateObjectValue, DatePickerRule } from '../types'
import { useDateRangeValidation } from './useDateRangeValidation'
import { validateDateFormat, isDateComplete } from './useDateFormatUtils'
import { adaptCustomRules, validateEmptyOrIncompleteDate } from '../utils/validationUtils'
import { isValidDateRange } from '../utils/dateFormattingUtils'

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
	readonly?: MaybeRef<boolean>
	useVuetifyValidation?: MaybeRef<boolean>
	rules?: Ref<VuetifyValidationRule[] | undefined>
	skipValidationWhenReadonly?: boolean
	useCalendarModeRequiredFlow?: boolean
	isInitialValidation?: Ref<boolean>
	isValidateOnBlur?: Ref<boolean>
	onblur?: Ref<boolean>
	fieldIdentifier?: MaybeRef<string>
	revalidateOnCustomRulesChange?: boolean
	displayFormat?: MaybeRef<string>
	parseDate?: (dateStr: string, format: string) => Date | null
	hasInteracted?: Ref<boolean>
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
	validateTextInput: (value: string) => Promise<boolean>
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
	| 'validateTextInput'
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
		validateTextInput: async () => true,
		validateCalendarModeDates: validationState.validateSubmit,
	}
}

export function useDatePickerValidation(options: DatePickerValidationOptions): DatePickerValidationController {
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = ref<string[]>([])
	let currentValidationToken = 0
	const validation = useCustomValidation(
		computed(() => options.selectedDates.value),
		options.customRules as Ref<ValidationRule[]>,
		options.customWarningRules as Ref<ValidationRule[]>,
		(options.customSuccessRules as Ref<ValidationRule[]>) ?? ref<ValidationRule[]>([]),
		errors,
		warnings,
		successes,
		computed(() => unref(options.showSuccessMessages)),
		computed(() => unref(options.fieldIdentifier) ?? 'Date'),
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

	const getMaxErrors = (): number | undefined => options.maxErrors ? unref(options.maxErrors) : undefined

	const replaceErrors = (messages: string[]): void => {
		errors.value = normalizeMessagesUtil(messages, getMaxErrors())
	}

	const pushError = (message?: string): void => {
		if (!message) {
			return
		}

		replaceErrors([...errors.value, message])
	}

	const {
		displayErrors,
		displayWarnings,
		displaySuccesses,
		displayHasError,
		displayHasWarning,
		displayHasSuccess,
	} = useDisplayMessages({
		errors,
		warnings,
		successes,
		externalErrors: () => options.errorMessages?.value,
		externalWarnings: () => options.warningMessages?.value,
		externalSuccesses: () => options.successMessages?.value,
		maxErrors: () => options.maxErrors ? unref(options.maxErrors) : undefined,
		hasErrorProp: () => Boolean(unref(options.hasErrorProp)),
		hasWarningProp: () => Boolean(unref(options.hasWarningProp)),
		hasSuccessProp: () => Boolean(unref(options.hasSuccessProp)),
		internalHasSuccess: validation.hasSuccess,
		disableErrorHandling: () => Boolean(unref(options.disableErrorHandling)),
	})

	// Utiliser useDateRangeValidation pour centraliser la validation des plages
	const { isRangeValid: isDateRangeValid } = useDateRangeValidation(
		options.selectedDates,
		options.displayRange,
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
		&& options.selectedDates.value.length >= 1
		&& !!options.selectedDates.value[0]
		&& (options.selectedDates.value.length < 2 || !options.selectedDates.value[options.selectedDates.value.length - 1])
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

	const accumulateValidationResults = (resolvedResults: ValidationResult[]): ValidationResult[] => {
		const allErrors: string[] = []
		const allWarnings: string[] = []
		const allSuccesses: string[] = []

		for (const result of resolvedResults) {
			allErrors.push(...result.state.errors)
			allWarnings.push(...result.state.warnings)
			allSuccesses.push(...result.state.successes)
		}

		replaceErrors(allErrors)
		warnings.value = [...new Set(allWarnings.filter(Boolean))]
		successes.value = [...new Set(allSuccesses.filter(Boolean))]

		return resolvedResults
	}

	const validateSelectedDates = (
		dates = getDatesToValidate(),
		rules = options.customRules.value,
		warningRules = options.customWarningRules.value,
		successRules = options.customSuccessRules?.value ?? [],
		token = currentValidationToken,
	): ValidationResult[] | Promise<ValidationResult[]> => {
		const syncResults: ValidationResult[] = []

		for (const date of dates) {
			const result = validateField(date, rules, warningRules, successRules)
			if (result instanceof Promise) {
				const startIndex = syncResults.length
				return (async () => {
					const results = [...syncResults, await result]
					if (token !== currentValidationToken) return results
					for (let i = startIndex + 1; i < dates.length; i++) {
						results.push(await Promise.resolve(validateField(dates[i], rules, warningRules, successRules)))
					}
					if (token !== currentValidationToken) return results
					return accumulateValidationResults(results)
				})()
			}
			syncResults.push(result)
		}

		return accumulateValidationResults(syncResults)
	}

	const revalidateSelectedDates = (): void => {
		const token = ++currentValidationToken
		queueMicrotask(async () => {
			if (token !== currentValidationToken) return
			const dates = getDatesToValidate()
			const results: ValidationResult[] = []

			for (const date of dates) {
				const result = await Promise.resolve(validateField(
					date,
					options.customRules.value,
					options.customWarningRules.value,
					options.customSuccessRules?.value ?? [],
				))
				if (token !== currentValidationToken) return
				results.push(result)
			}

			if (token !== currentValidationToken) return
			accumulateValidationResults(results)
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

			if (startDate && endDate && !isValidDateRange(startDate, endDate)) {
				pushError(locales.endBeforeStart)
				isValid = false
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
		const token = ++currentValidationToken
		const customRules = options.customRules.value
		const customWarningRules = options.customWarningRules.value

		if (unref(options.noCalendar)) {
			return emptyValidationResult()
		}

		// En mode Vuetify natif, déléguer entièrement la validation à useCustomValidation
		if (unref(options.useVuetifyValidation)) {
			clearValidation()
			const dates = getDatesToValidate()
			if (dates.length === 0) {
				return emptyValidationResult()
			}
			// Valider toutes les dates (important pour le mode range)
			const results = dates.map(date => validation.validateValue(date))
			if (results.some(r => r instanceof Promise)) {
				return Promise.all(results).then((resolved) => {
					if (token !== currentValidationToken) return emptyValidationResult()
					const allErrors: string[] = []
					for (const result of resolved) {
						allErrors.push(...result.state.errors)
					}
					replaceErrors(allErrors)
					return buildValidationResult(allErrors.length === 0)
				})
			}
			const allErrors: string[] = []
			for (const result of results) {
				allErrors.push(...result.state.errors)
			}
			replaceErrors(allErrors)
			return buildValidationResult(allErrors.length === 0)
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
			token,
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

		// En mode Vuetify natif, déléguer à validateDates qui gère le court-circuit
		if (unref(options.useVuetifyValidation)) {
			return await Promise.resolve(validateDates(forceValidation))
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

	// Validation automatique centralisée sur changement de selectedDates
	// Garantit que tout changement de dates déclenche la validation, même sans appel explicite
	watch(options.selectedDates, (newDates) => {
		// CalendarMode: respecter isUpdatingFromInternal et ne valider que pour le cas null
		if (options.useCalendarModeRequiredFlow) {
			if (options.isUpdatingFromInternal.value) return
			if (newDates === null || (Array.isArray(newDates) && newDates.length === 0)) {
				if (options.isValidateOnBlur?.value && !options.isInitialValidation?.value) {
					validateCalendarModeDates()
				}
			}
			return
		}

		// Non-CalendarMode: valider sur tout changement
		// En mode noCalendar, validateDates() est un no-op (retourne early) —
		// il faut donc explicitement nettoyer la validation quand les dates sont vidées
		if (unref(options.noCalendar) && (newDates === null || (Array.isArray(newDates) && newDates.length === 0))) {
			clearValidation()
			return
		}

		validateDates()
	})

	// --- Validation de saisie texte (flow noCalendar / DateTextInput) ---

	const getReadyCustomRules = (): DatePickerRule[] | null => {
		const currentCustomRules = options.customRules.value
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
		if (shouldDisplayErrors() === false) {
			return !displayHasError.value
		}
		const readyRules = getReadyCustomRules()
		if (readyRules === null) {
			return true
		}
		const format = unref(options.displayFormat) ?? ''
		const safeCustomRules = adaptCustomRules(readyRules, format) as ValidationRule[]
		const safeWarningRules = adaptCustomRules(options.customWarningRules.value, format) as ValidationRule[]
		const safeSuccessRules = adaptCustomRules(options.customSuccessRules?.value ?? [], format) as ValidationRule[]
		const result = validateField(date, safeCustomRules, safeWarningRules, safeSuccessRules)

		if (result instanceof Promise) {
			return result.then(resolvedResult => !resolvedResult.hasError)
		}
		return !result.hasError
	}

	const validateSingleTextInput = async (value: string): Promise<boolean> => {
		const format = unref(options.displayFormat) ?? ''
		const emptyCheck = validateEmptyOrIncompleteDate(
			value,
			unref(options.required),
			(dateValue: string) => isDateComplete(dateValue, format),
			options.hasInteracted?.value ?? false,
		)

		if (!emptyCheck.isValid && emptyCheck.errorMessage && shouldDisplayErrors()) {
			pushError(emptyCheck.errorMessage)
		}

		if (!emptyCheck.shouldContinue) {
			return emptyCheck.isValid
		}

		const formatValidation = validateDateFormat(
			value,
			format,
			format,
			unref(options.required),
			options.hasInteracted?.value ?? false,
			!shouldDisplayErrors(),
		)
		if (!formatValidation.isValid) {
			if (shouldDisplayErrors()) {
				pushError(formatValidation.message)
			}
			return false
		}

		const date = options.parseDate?.(value, format) ?? null
		if (!date) {
			if (shouldDisplayErrors()) {
				pushError(locales.invalidDateFormatWithFormat(format))
			}
			return false
		}

		return !!(await validateCustomRulesForDate(date))
	}

	const validateTextInput = async (value: string): Promise<boolean> => {
		clearValidation()

		// En mode Vuetify natif, déléguer à useCustomValidation
		if (unref(options.useVuetifyValidation)) {
			const result = await Promise.resolve(validation.validateValue(value))
			return !result.hasError
		}

		// Empty / skeleton input
		if (!value || value.trim() === '') {
			if (unref(options.required) && (options.hasInteracted?.value ?? false) && !unref(options.readonly) && shouldDisplayErrors()) {
				pushError(locales.required)
				return false
			}
			if (options.customRules.value.length > 0 && (options.hasInteracted?.value ?? false)) {
				const format = unref(options.displayFormat) ?? ''
				const safeCustomRules = adaptCustomRules(options.customRules.value, format) as ValidationRule[]
				const safeWarningRules = adaptCustomRules(options.customWarningRules.value, format) as ValidationRule[]
				const safeSuccessRules = adaptCustomRules(options.customSuccessRules?.value ?? [], format) as ValidationRule[]
				const result = await validateField(
					null,
					safeCustomRules,
					safeWarningRules,
					safeSuccessRules,
				)
				return !result.hasError
			}
			return true
		}

		// Range input
		if (unref(options.displayRange) && value.includes(locales.rangeSeparator)) {
			const [startDateText = '', endDateText = ''] = value.split(locales.rangeSeparator)

			if (startDateText && !endDateText) {
				return await validateSingleTextInput(startDateText)
			}

			if (!(startDateText && endDateText)) {
				return !displayHasError.value
			}

			const format = unref(options.displayFormat) ?? ''
			const startFormatValidation = validateDateFormat(startDateText, format, format, unref(options.required), options.hasInteracted?.value ?? false, !shouldDisplayErrors())
			const endFormatValidation = validateDateFormat(endDateText, format, format, unref(options.required), options.hasInteracted?.value ?? false, !shouldDisplayErrors())
			if (!startFormatValidation.isValid) {
				if (shouldDisplayErrors()) pushError(startFormatValidation.message)
				return false
			}
			if (!endFormatValidation.isValid) {
				if (shouldDisplayErrors()) pushError(endFormatValidation.message)
				return false
			}

			const startDate = options.parseDate?.(startDateText, format) ?? null
			const endDate = options.parseDate?.(endDateText, format) ?? null

			if (!(startDate && endDate)) {
				return !displayHasError.value
			}

			const rangeErrors: string[] = []
			if (!isValidDateRange(startDate, endDate) && shouldDisplayErrors()) {
				rangeErrors.push(locales.endBeforeStart)
			}

			await validateCustomRulesForDate(startDate)
			const startErrors = [...errors.value]
			const startWarnings = [...warnings.value]
			const startSuccesses = [...successes.value]

			await validateCustomRulesForDate(endDate)
			replaceErrors([...rangeErrors, ...startErrors, ...errors.value])
			warnings.value = [...new Set([...startWarnings, ...warnings.value].filter(Boolean))]
			successes.value = [...new Set([...startSuccesses, ...successes.value].filter(Boolean))]

			return !displayHasError.value
		}

		// Single date input
		return await validateSingleTextInput(value)
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
		validateTextInput,
		validateCalendarModeDates,
		isRangeValid: isDateRangeValid,
	}
}
