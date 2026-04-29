import { ref, computed } from 'vue'
import { useFieldValidation, type RuleOptions, type ValidationResult as FieldValidationResult } from '../rules/useFieldValidation'

type builtInDateRuleType =
	'noWeekend'
	| 'noBeforeToday'
	| 'notAfterToday'
	| 'notBeforeDate'
	| 'notAfterDate'
	| 'dateExact'
	| 'isHolidayDay'

type BuiltInNumberRuleType = 'min' | 'max'
type BuiltInStringRuleType = 'minLength' | 'maxLength' | 'exactLength' | 'email' | 'matchPattern'
type BuiltInRuleGeneralType = 'required' | 'custom'
export type BuiltInRuleType =
	| BuiltInRuleGeneralType
	| BuiltInNumberRuleType
	| BuiltInStringRuleType
	| builtInDateRuleType

interface CustomValidationRule {
	type: 'custom'
	options: RuleOptions & { validate: NonNullable<RuleOptions['validate']> }
}

interface StandardValidationRule {
	type: BuiltInRuleType | ({} & string)
	options: RuleOptions
}

export type ValidationRule = CustomValidationRule | StandardValidationRule

export interface ValidationOptions {
	showSuccessMessages?: boolean
	disableErrorHandling?: boolean
	fieldIdentifier?: string
}

export interface ValidationState {
	errors: string[]
	warnings: string[]
	successes: string[]
}

export interface ValidationResult {
	hasError: boolean
	hasWarning: boolean
	hasSuccess: boolean
	state: ValidationState
}

/**
 * Composable pour gérer la validation des champs de formulaire
 * @param options Options de configuration de la validation
 * @returns Un objet contenant les états et méthodes de validation
 */
export function useValidation(options: ValidationOptions = { showSuccessMessages: true }) {
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = ref<string[]>([])

	let currentValidationToken = 0

	const { generateRules } = useFieldValidation()

	const hasError = computed(() => errors.value.length > 0)
	const hasWarning = computed(() => warnings.value.length > 0)
	const hasSuccess = computed(() =>
		successes.value.length > 0 && !hasError.value && !hasWarning.value,
	)

	const clearValidation = () => {
		errors.value = []
		warnings.value = []
		successes.value = []
	}

	/**
	 * Resolves an array of rule results that may be sync or async.
	 * Returns the resolved array directly if all are sync, or a Promise if any are async.
	 */
	const resolveRuleResults = (
		results: (FieldValidationResult | Promise<FieldValidationResult>)[],
	): FieldValidationResult[] | Promise<FieldValidationResult[]> => {
		if (results.every(r => !(r instanceof Promise))) return results as FieldValidationResult[]

		const safePromises = results.map((r: FieldValidationResult | Promise<FieldValidationResult>) => {
			if (!(r instanceof Promise)) return Promise.resolve(r)

			return r.catch((err: unknown) => {
				const message = err instanceof Error ? err.message : String(err)
				return { error: message || 'Erreur de validation' } as FieldValidationResult
			})
		})

		return Promise.all(safePromises)
	}

	/** Executes validation rules against a value, returning sync or async results. */
	const executeRules = (
		rules: ValidationRule[],
		value: unknown,
		extraOptions?: Record<string, boolean>,
	): FieldValidationResult[] | Promise<FieldValidationResult[]> => {
		for (const rule of rules) {
			if ('validator' in rule) {
				console.error('[useValidation] "validator" en top level de ValidationRule n\'est plus supporté. Utilisez rule.options.validate à la place.')
			}
		}

		const prepared = rules.map(rule => ({
			type: rule.type,
			options: { ...rule.options, ...extraOptions, ...(options.fieldIdentifier && !rule.options?.fieldIdentifier ? { fieldIdentifier: options.fieldIdentifier } : {}) },
		}))
		const fns = generateRules(prepared)
		return resolveRuleResults(fns.map(fn => fn(value)))
	}

	/** Applies a callback to a sync or async value, discarding stale results via token. */
	const thenOrSync = <T>(
		value: T | Promise<T>,
		token: number,
		fn: (resolved: T) => ValidationResult | Promise<ValidationResult>,
	): ValidationResult | Promise<ValidationResult> => {
		if (value instanceof Promise) {
			return value.then(resolved =>
				token !== currentValidationToken ? buildResult() : fn(resolved),
			)
		}
		return fn(value)
	}

	const buildResult = (): ValidationResult => ({
		hasError: hasError.value,
		hasWarning: hasWarning.value,
		hasSuccess: hasSuccess.value,
		state: {
			errors: errors.value,
			warnings: warnings.value,
			successes: successes.value,
		},
	})

	/** Adds a default success message when no custom success rules are provided. */
	const addDefaultSuccessMessage = (rules: ValidationRule[]) => {
		const customSuccessMessage = rules.find(rule => rule.options?.successMessage)?.options.successMessage
		if (customSuccessMessage) {
			successes.value.push(customSuccessMessage)
		}
		else {
			const defaultMessage = options.fieldIdentifier ? `Le champ ${options.fieldIdentifier} est valide.` : 'Champ valide'
			successes.value.push(defaultMessage)
		}
	}

	const validateField = (
		value: unknown,
		rules: ValidationRule[] = [],
		warningRules: ValidationRule[] = [],
		successRules: ValidationRule[] = [],
	): ValidationResult | Promise<ValidationResult> => {
		const token = ++currentValidationToken
		clearValidation()

		if (options.disableErrorHandling) return buildResult()

		const resolved = executeRules(rules, value)

		return thenOrSync(resolved, token, (ruleResults) => {
			let hasValidationError = false
			for (const result of ruleResults) {
				if (result.error) {
					errors.value.push(result.error)
					hasValidationError = true
				}
			}

			if (!hasValidationError && value && successRules.length === 0) {
				addDefaultSuccessMessage(rules)
			}

			if (!hasValidationError && warningRules.length > 0) {
				const warningResolved = executeRules(warningRules, value, { isWarning: true })
				return thenOrSync(warningResolved, token, (warningResults) => {
					for (const r of warningResults) {
						if (r.warning) warnings.value.push(r.warning)
					}
					return runSuccessRules(hasValidationError, value, successRules, token)
				})
			}

			return runSuccessRules(hasValidationError, value, successRules, token)
		})
	}

	/** Runs success rules after normal + warning rules. */
	const runSuccessRules = (
		hasValidationError: boolean,
		value: unknown,
		successRules: ValidationRule[],
		token: number,
	): ValidationResult | Promise<ValidationResult> => {
		if (hasValidationError || hasWarning.value || successRules.length === 0) return buildResult()

		const successResolved = executeRules(successRules, value, { isSuccess: true })

		return thenOrSync(successResolved, token, (successResults) => {
			for (const r of successResults) {
				if (r.success) {
					successes.value.push(r.success)
				}
			}
			return buildResult()
		})
	}

	const validateOnSubmit = (): boolean => {
		return !hasError.value
	}

	return {
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validateField,
		validateOnSubmit,
		clearValidation,
	}
}
