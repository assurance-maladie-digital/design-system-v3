/**
 * validationUtils — Fonctions utilitaires de validation pour les composants DatePicker.
 *
 * ## Fonctions exportées
 *
 * - `isModelValueEqual` : Comparaison robuste de deux `DateModelValue` (insensible au timezone,
 *   gère les tableaux pour les plages). Utilisée par `updateModel` pour éviter les emits redondants.
 * - `validateEmptyOrIncompleteDate` : Pré-validation pour les champs vides ou incomplets.
 *   Retourne `{ shouldContinue, isValid, errorMessage }` pour court-circuiter la validation
 *   quand le champ est vide (required géré) ou incomplet (pas assez de chiffres).
 * - `FormatValidationResult` : Interface du résultat de validation de format.
 *
 * ## Utilisation
 *
 * Ces fonctions sont consommées par `useDatePickerValidation.ts` (orchestrateur) et
 * indirectement par les composants DatePicker via le bridge de validation.
 */
import { locales } from '../locales'
import type { DateInput, DateModelValue } from '@/composables/date/useDateInitializationDayjs'

/**
 * Compare deux valeurs DateModelValue de manière robuste.
 * Contrairement à JSON.stringify, cette fonction est insensible au timezone
 * et ne dépend pas de la sérialisation.
 */
export const isModelValueEqual = (a: DateModelValue | undefined, b: DateInput | undefined): boolean => {
	if (a === b) return true
	if (a === null || a === undefined || b === null || b === undefined) return false
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false
		return a.every((val, i) => val === b[i])
	}
	if (Array.isArray(a) || Array.isArray(b)) return false
	return a === b
}

/**
 * Vérifie si une chaîne de date est vide ou incomplète
 *
 * @param value - Chaîne de date à vérifier
 * @param required - Indique si le champ est requis
 * @returns Objet indiquant si la validation doit continuer et si la valeur est valide
 */
export const validateEmptyOrIncompleteDate = (
	value: string,
	required: boolean,
	isDateComplete: (value: string) => boolean,
	hasInteracted: boolean,
): { shouldContinue: boolean, isValid: boolean, errorMessage?: string } => {
	// Vérifier si le champ est requis et vide
	if (!value && required && hasInteracted) {
		return {
			shouldContinue: false,
			isValid: false,
			errorMessage: locales.required,
		}
	}

	// Si le champ est vide et non requis, c'est valide
	if (!value && !required) {
		return { shouldContinue: false, isValid: true }
	}

	// Vérifier si la saisie est complète avant de valider le format
	if (!isDateComplete(value)) {
		// La saisie n'est pas complète, ne pas afficher d'erreur
		return { shouldContinue: false, isValid: true }
	}

	// La validation doit continuer
	return { shouldContinue: true, isValid: true }
}

/**
 * Structure de résultat de validation de format
 */
export interface FormatValidationResult {
	isValid: boolean
	message: string
}
