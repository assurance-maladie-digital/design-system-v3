import { ref, computed } from 'vue'
import { useFieldValidation, type RuleOptions } from '../rules/useFieldValidation'

export type ValidationRule = {
	type: string
	options: RuleOptions
	isAsync?: boolean
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
	isPending?: boolean
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
	const isPending = ref(false)

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
		isPending.value = false
	}

	/**
	 * Valide un champ avec les règles spécifiées
	 * @param value Valeur à valider
	 * @param rules Règles de validation
	 * @param warningRules Règles d'avertissement
	 * @param successRules Règles de succès
	 * @returns Résultat de la validation
	 */
	const validateField = async (
		value: unknown,
		rules: ValidationRule[] = [],
		warningRules: ValidationRule[] = [],
		successRules: ValidationRule[] = [],
	): Promise<ValidationResult> => {
		clearValidation()
		isPending.value = true

		try {
			// Si la gestion des erreurs est désactivée, on retourne un résultat sans erreur
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
					isPending: false,
				}
			}

			// Séparation des règles synchrones et asynchrones
			const syncRules = rules.filter(rule => !rule.isAsync)
			const asyncRules = rules.filter(rule => rule.isAsync)

			// Validation des règles synchrones normales
			const normalRules = syncRules.map(rule => ({
				type: rule.type,
				options: {
					...rule.options,
					fieldIdentifier: options.fieldIdentifier || rule.options.fieldIdentifier,
				},
			}))

			const validationRules = generateRules(normalRules)
			let hasValidationError = false

			// Exécution des règles synchrones
			validationRules.forEach((validationRule) => {
				const result = validationRule(value)
				if (result.error) {
					errors.value.push(result.error)
					hasValidationError = true
				}
			})

			// Si pas d'erreur synchrone, exécuter les règles asynchrones
			if (!hasValidationError && asyncRules.length > 0) {
				const asyncValidationPromises = asyncRules.map(async (rule) => {
					try {
						// Pour les règles asynchrones, on utilise principalement le type 'custom'
						if (rule.type === 'custom' && rule.options.validate) {
							const validateFn = rule.options.validate as (value: unknown) => Promise<boolean | string> | boolean | string
							const result = await Promise.resolve(validateFn(value))

							if (result !== true) {
								const errorMessage = typeof result === 'string'
									? result
									: rule.options.message || `Validation asynchrone échouée pour ${options.fieldIdentifier || 'ce champ'}`

								errors.value.push(errorMessage)
								return false
							}
							return true
						}
						return true
					}
					catch (error) {
						errors.value.push(`Erreur lors de la validation asynchrone: ${error}`)
						return false
					}
				})

				const asyncResults = await Promise.all(asyncValidationPromises)
				hasValidationError = asyncResults.includes(false) || hasValidationError
			}

			// Si pas d'erreur, ajouter le message de succès ou un message par défaut
			if (!hasValidationError && value && options.showSuccessMessages !== false) {
				const customSuccessMessage = rules.find(rule => rule.options.successMessage)?.options.successMessage
				if (customSuccessMessage) {
					successes.value.push(customSuccessMessage)
				}
				else {
					const defaultMessage = options.fieldIdentifier
						? `Le champ ${options.fieldIdentifier} est valide.`
						: 'Champ valide'
					successes.value.push(defaultMessage)
				}
			}

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

			return {
				hasError: hasError.value,
				hasWarning: hasWarning.value,
				hasSuccess: hasSuccess.value,
				state: {
					errors: errors.value,
					warnings: warnings.value,
					successes: successes.value,
				},
				isPending: false,
			}
		}
		finally {
			isPending.value = false
		}
	}

	/**
	 * Valide le champ lors de la soumission du formulaire
	 * @returns true si le champ est valide, false sinon
	 */
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
		isPending,

		// Méthodes
		validateField,
		validateOnSubmit,
		clearValidation,
	}
}
