/**
 * validationUtils — Fonctions utilitaires de validation pour les composants DatePicker.
 *
 * ## Fonctions exportées
 *
 * - `isModelValueEqual` : Comparaison robuste de deux `DateModelValue` (insensible au timezone,
 *   gère les tableaux pour les plages). Utilisée par `updateModel` pour éviter les emits redondants.
 * - `adaptCustomRules` : Adapte les règles personnalisées pour qu'elles fonctionnent aussi bien
 *   avec des `Date` qu'avec des `string`. Convertit les `Date` en chaîne formatée avant de passer
 *   à la fonction `validate` de la règle.
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
import { formatDate } from '@/utils/formatDate'
import dayjs from 'dayjs'
import { locales } from '../locales'
import type { DatePickerRule } from '../types'
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
 * Adapte les règles personnalisées pour assurer la compatibilité avec différents types de valeurs
 *
 * @param rules - Règles personnalisées à adapter
 * @param format - Format de date à utiliser pour la conversion
 * @returns Règles adaptées pour fonctionner avec les dates et chaînes
 */
export const adaptCustomRules = (rules: DatePickerRule[] = [], format: string): DatePickerRule[] => {
	return rules.map((rule) => {
		if (rule.type === 'custom' && rule.options && rule.options.validate) {
			// Créer une copie de la règle pour ne pas modifier l'original
			const safeCopy: DatePickerRule = { ...rule }
			const originalValidate = rule.options.validate

			// Remplacer la fonction validate par une version sécurisée
			safeCopy.options = { ...rule.options }

			safeCopy.options.validate = (val: unknown) => {
				if (val instanceof Date) {
					const formatted = format ? formatDate(dayjs(val), format) : val.toISOString()
					return originalValidate(formatted)
				}
				return originalValidate(val)
			}
			return safeCopy
		}
		return rule
	})
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
