import type { ValidationResult } from '@/composables/unifyValidation/useValidation'
import { locales } from '../../locales'

/** Résultat vide : aucune erreur, aucun warning, aucun succès. */
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

/** Résultat succès : champ valide et non obligatoire, sans message de succès particulier. */
export const successValidationResult = (): ValidationResult => ({
	hasError: false,
	hasWarning: false,
	hasSuccess: true,
	state: {
		errors: [],
		warnings: [],
		successes: [],
	},
})

/** Résultat required : champ obligatoire non rempli. `shouldDisplayErrors` contrôle l'affichage. */
export const requiredValidationResult = (shouldDisplayErrors: boolean): ValidationResult => ({
	hasError: true,
	hasWarning: false,
	hasSuccess: false,
	state: {
		errors: shouldDisplayErrors ? [locales.required] : [],
		warnings: [],
		successes: [],
	},
})
