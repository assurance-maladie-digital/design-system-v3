import type { ValidationResult } from '@/composables/validation/useValidation'

/** Résultat vide : aucune erreur, aucun avertissement, aucun succès. */
export const emptyValidationResult = (): ValidationResult => ({
	hasError: false,
	hasWarning: false,
	hasSuccess: false,
	state: {
		errors: [],
		warnings: [],
		successes: [],
	},
})
