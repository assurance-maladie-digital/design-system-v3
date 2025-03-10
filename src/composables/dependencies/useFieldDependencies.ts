import { ref, computed } from 'vue'

export interface DependencyRule {
	fields: string[]
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	validator: (values: Record<string, any>) => boolean | string
	message?: string
	warningMessage?: string
	successMessage?: string
	isWarning?: boolean
}

export interface FieldDependencies {
	[field: string]: DependencyRule[]
}

export interface DependencyValidationState {
	errors: string[]
	warnings: string[]
	successes: string[]
}

export interface DependencyValidationResult {
	hasError: boolean
	hasWarning: boolean
	hasSuccess: boolean
	state: DependencyValidationState
}

/**
 * Composable pour gérer les dépendances entre champs de formulaire
 * @param dependencies Configuration des règles de dépendance entre champs
 * @returns Un objet contenant les états et méthodes de validation des dépendances
 */
export function useFieldDependencies(dependencies: FieldDependencies) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const fields = ref<Record<string, any>>({})
	const errors = ref<Record<string, string[]>>({})
	const warnings = ref<Record<string, string[]>>({})
	const successes = ref<Record<string, string[]>>({})

	const hasError = computed(() => Object.values(errors.value).some(e => e.length > 0))
	const hasWarning = computed(() => Object.values(warnings.value).some(w => w.length > 0))
	const hasSuccess = computed(() =>
		Object.values(successes.value).some(s => s.length > 0)
		&& !hasError.value
		&& !hasWarning.value,
	)

	const clearValidation = (field?: string) => {
		if (field) {
			errors.value[field] = []
			warnings.value[field] = []
			successes.value[field] = []
		}
		else {
			errors.value = {}
			warnings.value = {}
			successes.value = {}
		}
	}

	const validateField = (field: string): DependencyValidationResult => {
		clearValidation(field)

		const rules = dependencies[field] || []
		let hasValidationError = false

		rules.forEach((rule) => {
			// Vérifier que tous les champs requis sont présents
			const requiredFields = rule.fields.filter(f => !(f in fields.value))
			if (requiredFields.length > 0) return

			const result = rule.validator(fields.value)

			// Si le résultat est une chaîne, c'est un message d'erreur
			if (typeof result === 'string') {
				if (rule.isWarning) {
					warnings.value[field] = warnings.value[field] || []
					warnings.value[field].push(rule.warningMessage || result)
				}
				else {
					errors.value[field] = errors.value[field] || []
					errors.value[field].push(rule.message || result)
					hasValidationError = true
				}
			}
			else if (result === true && !hasValidationError) {
				// Ajouter un message de succès si spécifié
				if (rule.successMessage) {
					successes.value[field] = successes.value[field] || []
					successes.value[field].push(rule.successMessage)
				}
			}
		})

		return {
			hasError: errors.value[field]?.length > 0 || false,
			hasWarning: warnings.value[field]?.length > 0 || false,
			hasSuccess: successes.value[field]?.length > 0 || false,
			state: {
				errors: errors.value[field] || [],
				warnings: warnings.value[field] || [],
				successes: successes.value[field] || [],
			},
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const updateField = (field: string, value: any) => {
		fields.value[field] = value

		// Valider tous les champs qui dépendent de ce champ
		Object.entries(dependencies).forEach(([targetField, rules]) => {
			if (rules.some(rule => rule.fields.includes(field))) {
				validateField(targetField)
			}
		})
	}

	const validateOnSubmit = async (): Promise<boolean> => {
		// Valider tous les champs avec des dépendances
		Object.keys(dependencies).forEach((field) => {
			validateField(field)
		})

		return !hasError.value
	}

	return {
		// États
		fields,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,

		// Méthodes
		updateField,
		validateField,
		validateOnSubmit,
		clearValidation,
	}
}
