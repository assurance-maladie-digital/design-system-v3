import { ref, computed } from 'vue'
import { useFieldValidation, type RuleOptions, type ValidationResult as FieldValidationResult } from '../rules/useFieldValidation'

export type ValidationRule = {
	type: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Support for validator at top level (e.g. SyCheckbox custom rules)
	validator?: (...args: any[]) => any
	options: RuleOptions
}

export interface ValidationOptions {
	showSuccessMessages?: boolean
	fieldIdentifier?: string
	customRules?: ValidationRule[]
	warningRules?: ValidationRule[]
	successRules?: ValidationRule[]
	disableErrorHandling?: boolean
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
		// If all results are synchronous, return them directly
		if (results.every(r => !(r instanceof Promise))) return results as FieldValidationResult[]

		// Wrap each result in a safe promise that catches async errors
		const safePromises = results.map((r: FieldValidationResult | Promise<FieldValidationResult>) => {
			if (!(r instanceof Promise)) return Promise.resolve(r)

			return r.catch((err: unknown) => {
				const message = err instanceof Error ? err.message : String(err)
				return { error: message || 'Erreur de validation' } as FieldValidationResult
			})
		})

		return Promise.all(safePromises)
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

	const validateField = (
		value: unknown,
		rules: ValidationRule[] = [],
		warningRules: ValidationRule[] = [],
		successRules: ValidationRule[] = [],
	): ValidationResult | Promise<ValidationResult> => {
		clearValidation()

		// Si la gestion des erreurs est désactivée, on retourne un résultat sans erreurs
		if (options.disableErrorHandling) {
			return {
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: {
					errors: [],
					warnings: [],
					successes: [],
				},
			}
		}

		// Validation des règles normales
		const normalRules = rules.map(rule => ({
			type: rule.type,
			options: {
				...rule.options,
				fieldIdentifier: options.fieldIdentifier || rule.options?.fieldIdentifier,
				// Support for validator function at top level of rule (e.g. SyCheckbox custom rules)
				...(rule.validator && !rule.options?.validate ? { validate: rule.validator } : {}),
			},
		}))

		const validationRules = generateRules(normalRules)
		const rawResults = validationRules.map(fn => fn(value))
		const resolved = resolveRuleResults(rawResults)

		if (resolved instanceof Promise) {
			return resolved.then(ruleResults => processResults(ruleResults, value, rules, warningRules, successRules))
		}

		return processResults(resolved, value, rules, warningRules, successRules)
	}

	/**
	 * Processes resolved normal-rule results, then runs warning & success rules.
	 */
	const processResults = (
		ruleResults: FieldValidationResult[],
		value: unknown,
		rules: ValidationRule[],
		warningRules: ValidationRule[],
		successRules: ValidationRule[],
	): ValidationResult | Promise<ValidationResult> => {
		let hasValidationError = false
		for (const result of ruleResults) {
			if (result.error) {
				errors.value.push(result.error)
				hasValidationError = true
			}
		}

		// Si pas d'erreur, ajouter le message de succès ou un message par défaut
		// Mais seulement si aucun customSuccessRules n'est défini pour éviter la duplication
		if (!hasValidationError && value && options.showSuccessMessages !== false && (!successRules || successRules.length === 0)) {
			const customSuccessMessage = rules.find(rule => rule.options?.successMessage)?.options.successMessage
			if (customSuccessMessage) {
				successes.value.push(customSuccessMessage)
			}
			else {
				const defaultMessage = options.fieldIdentifier ? `Le champ ${options.fieldIdentifier} est valide.` : 'Champ valide'
				successes.value.push(defaultMessage)
			}
		}

		// Validation des règles d'avertissement
		if (!hasValidationError && warningRules.length > 0) {
			const warningValidationRules = generateRules(
				warningRules.map(rule => ({
					type: rule.type,
					options: {
						...rule.options,
						isWarning: true,
						fieldIdentifier: options.fieldIdentifier || rule.options?.fieldIdentifier,
						...(rule.validator && !rule.options?.validate ? { validate: rule.validator } : {}),
					},
				})),
			)

			const warningRawResults = warningValidationRules.map(fn => fn(value))
			const warningResolved = resolveRuleResults(warningRawResults)

			if (warningResolved instanceof Promise) {
				return warningResolved.then((warningResults) => {
					for (const r of warningResults) {
						if (r.warning) warnings.value.push(r.warning)
					}
					return processSuccessRules(hasValidationError, value, successRules)
				})
			}

			for (const r of warningResolved) {
				if (r.warning) warnings.value.push(r.warning)
			}
		}

		return processSuccessRules(hasValidationError, value, successRules)
	}

	/**
	 * Processes success rules after normal + warning rules.
	 */
	const processSuccessRules = (
		hasValidationError: boolean,
		value: unknown,
		successRules: ValidationRule[],
	): ValidationResult | Promise<ValidationResult> => {
		if (!hasValidationError && !hasWarning.value && successRules.length > 0) {
			const successValidationRules = generateRules(
				successRules.map(rule => ({
					type: rule.type,
					options: {
						...rule.options,
						isSuccess: true,
						fieldIdentifier: options.fieldIdentifier || rule.options?.fieldIdentifier,
						...(rule.validator && !rule.options?.validate ? { validate: rule.validator } : {}),
					},
				})),
			)

			const successRawResults = successValidationRules.map(fn => fn(value))
			const successResolved = resolveRuleResults(successRawResults)

			if (successResolved instanceof Promise) {
				return successResolved.then((successResults) => {
					for (const r of successResults) {
						if (r.success && options.showSuccessMessages !== false) {
							successes.value.push(r.success)
						}
					}
					return buildResult()
				})
			}

			for (const r of successResolved) {
				if (r.success && options.showSuccessMessages !== false) {
					successes.value.push(r.success)
				}
			}
		}

		return buildResult()
	}

	const validateOnSubmit = (): boolean => {
		return !hasError.value
	}

	return {
		// États
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,

		// Méthodes
		validateField,
		validateOnSubmit,
		clearValidation,
	}
}
