import { ref, computed } from 'vue'
import { useFieldValidation, type RuleOptions } from '../rules/useFieldValidation'

export type ValidationRule = {
	type: string
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

	const validateField = (
		value: unknown,
		rules: ValidationRule[] = [],
		warningRules: ValidationRule[] = [],
		successRules: ValidationRule[] = [],
	): ValidationResult => {
		// Ne conserver les succès existants que si c'est vraiment un appel vide
		// (pas de règles du tout) et qu'il n'y a pas d'erreurs existantes
		const hasExistingErrors = errors.value.length > 0
		const isEmptyCall = rules.length === 0 && warningRules.length === 0 && successRules.length === 0
		const existingSuccesses = isEmptyCall && !hasExistingErrors ? [...successes.value] : []
		clearValidation()

		// Collecter tous les résultats avant de les traiter
		const allErrors: string[] = []
		const allWarnings: string[] = []
		const allSuccesses: string[] = []

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
				fieldIdentifier: options.fieldIdentifier || rule.options.fieldIdentifier,
			},
		}))

		const validationRules = generateRules(normalRules)
		validationRules.forEach((validationRule) => {
			const result = validationRule(value)
			if (result.error) {
				allErrors.push(result.error)
			}
			if (result.warning) {
				allWarnings.push(result.warning)
			}
			if (result.success && options.showSuccessMessages !== false) {
				allSuccesses.push(result.success)
			}
		})

		// Appliquer les résultats : les erreurs ont la priorité
		if (allErrors.length > 0) {
			errors.value.push(...allErrors)
		}
		else if (allWarnings.length > 0) {
			warnings.value.push(...allWarnings)
		}
		else if (allSuccesses.length > 0) {
			successes.value.push(...allSuccesses)
		}
		else if (existingSuccesses.length > 0 && successRules.length === 0) {
			// Restaurer les succès existants SEULEMENT si pas de nouvelles successRules
			successes.value.push(...existingSuccesses)
		}

		const hasValidationError = errors.value.length > 0

		// Validation des règles d'avertissement
		if (!hasValidationError) {
			const warningValidationRules = generateRules(
				warningRules.map(rule => ({
					type: rule.type,
					options: {
						...rule.options,
						isWarning: true,
						fieldIdentifier: options.fieldIdentifier || rule.options.fieldIdentifier,
					},
				})),
			)

			warningValidationRules.forEach((validationRule) => {
				const result = validationRule(value)
				if (result.warning) {
					warnings.value.push(result.warning)
				}
			})
		}

		// Validation des règles de succès
		if (!hasValidationError && !hasWarning.value) {
			// Si on a des successRules, vider complètement les succès existants
			if (successRules.length > 0) {
				successes.value = []
			}

			const successValidationRules = generateRules(
				successRules.map(rule => ({
					type: rule.type,
					options: {
						...rule.options,
						isSuccess: true,
						fieldIdentifier: options.fieldIdentifier || rule.options.fieldIdentifier,
					},
				})),
			)

			successValidationRules.forEach((validationRule) => {
				const result = validationRule(value)
				if (result.success && options.showSuccessMessages !== false) {
					successes.value.push(result.success)
				}
			})
		}

		// Si pas d'erreur et pas de warning, ajouter le message de succès par défaut si nécessaire
		// Mais seulement si aucun customSuccessRules n'est défini et qu'il n'y a pas déjà de succès
		if (!hasValidationError && !hasWarning.value && value && options.showSuccessMessages !== false && successRules.length === 0 && allSuccesses.length === 0 && existingSuccesses.length === 0 && successes.value.length === 0) {
			const customSuccessMessage = rules.find(rule => rule.options.successMessage)?.options.successMessage
			if (customSuccessMessage) {
				successes.value.push(customSuccessMessage)
			}
			else {
				const defaultMessage = options.fieldIdentifier ? `Le champ ${options.fieldIdentifier} est valide.` : 'Champ valide'
				successes.value.push(defaultMessage)
			}
		}

		return {
			hasError: hasError.value,
			hasWarning: hasWarning.value,
			hasSuccess: hasSuccess.value,
			state: {
				errors: errors.value,
				warnings: warnings.value,
				successes: successes.value,
			},
		}
	}

	const validateOnSubmit = async (): Promise<boolean> => {
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
