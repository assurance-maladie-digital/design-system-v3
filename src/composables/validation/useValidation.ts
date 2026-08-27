import { ref, computed, unref, type MaybeRef, type Ref } from 'vue'
import { devWarn } from '@/utils/devWarn'
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
	showSuccessMessages?: MaybeRef<boolean>
	disableErrorHandling?: MaybeRef<boolean>
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
export function useValidation(options: ValidationOptions = { showSuccessMessages: false }) {
	// Set local par instance pour éviter les interférences entre composants
	// IMPORTANT: Ce Set conserve en mémoire les champs qui ont déjà eu des messages de succès personnalisés
	// Une fois qu'un champ est ajouté ici, il ne recevra plus jamais de message de succès par défaut
	// Ceci est un comportement volontaire pour éviter l'incohérence visuelle
	const fieldsWithCustomSuccess = new Set<string>()
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = ref<string[]>([])
	const successState = ref(false)

	let currentValidationToken = 0

	const { generateRules } = useFieldValidation()

	const hasError = computed(() => errors.value.length > 0)
	const hasWarning = computed(() => warnings.value.length > 0)
	const hasSuccess = computed(() =>
		successState.value && !hasError.value && !hasWarning.value,
	)
	const displaySuccesses = computed(() =>
		unref(options.showSuccessMessages) !== false ? successes.value : [],
	)

	const clearValidation = () => {
		errors.value = []
		warnings.value = []
		successes.value = []
		successState.value = false
		// IMPORTANT: NE PAS réinitialiser fieldsWithCustomSuccess ici
		// Raison : Une fois qu'un champ a eu un message de succès personnalisé, il ne doit JAMAIS
		// revenir au message de succès par défaut pour éviter l'incohérence visuelle.
		// Exemple : Si un utilisateur voit "Email valide et vérifié", il ne doit jamais voir
		// ensuite "Champ valide" pour le même champ, même après modification.
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
				devWarn('[useValidation] "validator" en top level de ValidationRule n\'est plus supporté. Utilisez rule.options.validate à la place.')
				return []
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
	const addDefaultSuccessMessage = () => {
		const defaultMessage = options.fieldIdentifier ? `Le champ ${options.fieldIdentifier} est valide.` : 'Champ valide'
		successes.value.push(defaultMessage)
	}

	/**
	 * Détermine si un message de succès par défaut doit être ajouté.
	 *
	 * Un message de succès par défaut est ajouté uniquement si :
	 * - Aucune erreur de validation n'est présente
	 * - Le champ contient une valeur (non vide)
	 * - Aucune règle de succès personnalisée n'est définie
	 * - Aucun message de succès n'est déjà présent
	 * - Aucune règle n'a retourné de succès
	 * - Aucune règle d'avertissement n'a de message de succès personnalisé
	 * - Le champ n'a pas déjà eu de succès personnalisé précédemment
	 */
	const shouldAddDefaultSuccess = (
		hasValidationError: boolean,
		isValueFilled: boolean,
		successRules: ValidationRule[],
		successes: Ref<string[]>,
		hasRuleSuccess: boolean,
		hasWarningRuleWithCustomSuccessMessage: boolean,
		fieldIdentifier: string | undefined,
		fieldsWithCustomSuccess: Set<string>,
	): boolean => {
		return !hasValidationError
			&& isValueFilled
			&& successRules.length === 0
			&& successes.value.length === 0
			&& !hasRuleSuccess
			&& !hasWarningRuleWithCustomSuccessMessage
			&& !(fieldIdentifier && fieldsWithCustomSuccess.has(fieldIdentifier))
	}

	const validateField = (
		value: unknown,
		rules: ValidationRule[] = [],
		warningRules: ValidationRule[] = [],
		successRules: ValidationRule[] = [],
	): ValidationResult | Promise<ValidationResult> => {
		const token = ++currentValidationToken
		clearValidation()

		if (unref(options.disableErrorHandling)) return buildResult()

		const resolved = executeRules(rules, value)

		return thenOrSync(resolved, token, (ruleResults) => {
			let hasValidationError = false
			let hasRuleSuccess = false
			for (const result of ruleResults) {
				if (result.error) {
					errors.value.push(result.error)
					hasValidationError = true
				}
				if (result.success) {
					hasRuleSuccess = true
				}
			}

			// Traiter les successMessages des rules normales uniquement si successMessage est explicitement défini
			const ruleSuccessMessages = new Set(rules.map(r => r.options?.successMessage).filter(Boolean))
			if (!hasValidationError) {
				// Dédupliquer les messages de succès pour éviter les doublons (ex: required + minLength)
				const uniqueSuccessMessages = new Set<string>()
				for (const result of ruleResults) {
					if (result.success && unref(options.showSuccessMessages) !== false) {
						if (ruleSuccessMessages.has(result.success)) {
							if (!uniqueSuccessMessages.has(result.success)) {
								uniqueSuccessMessages.add(result.success)
								successes.value.push(result.success)
							}
						}
					}
				}
			}

			const isValueFilled = Array.isArray(value) ? value.length > 0 : !!value
			// Vérifier si une règle a un successMessage personnalisé
			const hasRuleWithCustomSuccessMessage = rules.some(rule => rule.options?.successMessage)
			const hasWarningRuleWithCustomSuccessMessage = warningRules.some(rule => rule.options?.successMessage)
			if ((hasRuleWithCustomSuccessMessage || hasWarningRuleWithCustomSuccessMessage) && options.fieldIdentifier) {
				// MARQUE PERMANENTE : Ce champ ne recevra plus jamais de message de succès par défaut
				// Même si l'utilisateur modifie la valeur, le message personnalisé reste prioritaire
				fieldsWithCustomSuccess.add(options.fieldIdentifier)
			}
			// hasRuleSuccess ne bloque le message par défaut que si la règle a un successMessage explicite
			const hasExplicitRuleSuccess = hasRuleSuccess && hasRuleWithCustomSuccessMessage
			// N'ajouter le message par défaut que si la valeur est remplie, aucune règle n'a de successMessage personnalisé, et aucun succès n'a été retourné
			if (shouldAddDefaultSuccess(hasValidationError, isValueFilled, successRules, successes, hasExplicitRuleSuccess, hasWarningRuleWithCustomSuccessMessage, options.fieldIdentifier, fieldsWithCustomSuccess)) {
				successState.value = true
				if (unref(options.showSuccessMessages) !== false) {
					addDefaultSuccessMessage()
				}
			}
			else if (!hasValidationError && isValueFilled && (successes.value.length > 0 || hasRuleSuccess)) {
				successState.value = true
			}

			if (!hasValidationError && warningRules.length > 0) {
				const warningResolved = executeRules(warningRules, value, { isWarning: true })
				return thenOrSync(warningResolved, token, (warningResults) => {
					const warningSuccessMessages = new Set(warningRules.map(r => r.options?.successMessage).filter(Boolean))
					// Dédupliquer les messages de succès des warningRules pour éviter les doublons
					const uniqueWarningSuccessMessages = new Set<string>()
					for (const r of warningResults) {
						if (r.warning) warnings.value.push(r.warning)
						if (r.success && warningSuccessMessages.has(r.success) && unref(options.showSuccessMessages) !== false) {
							if (!uniqueWarningSuccessMessages.has(r.success)) {
								uniqueWarningSuccessMessages.add(r.success)
								successes.value.push(r.success)
								successState.value = true
							}
						}
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
			successState.value = successResults.some(result => Boolean(result.success))

			// Dédupliquer les messages de succès des successRules pour éviter les doublons
			const uniqueSuccessRuleMessages = new Set<string>()
			for (const r of successResults) {
				if (r.success && unref(options.showSuccessMessages) !== false) {
					if (!uniqueSuccessRuleMessages.has(r.success)) {
						uniqueSuccessRuleMessages.add(r.success)
						successes.value.push(r.success)
					}
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
		displaySuccesses,
		hasError,
		hasWarning,
		hasSuccess,
		validateField,
		validateOnSubmit,
		clearValidation,
	}
}
