import { formatDate } from '@/utils/formatDate'
import dayjs from 'dayjs'

/**
 * Type pour une règle de validation personnalisée
 */
export interface CustomRule {
	type: string
	options: {
		validate: (value: unknown) => boolean
		message?: string
		[key: string]: unknown
	}
}

/**
 * Adapte les règles personnalisées pour assurer la compatibilité avec différents types de valeurs
 *
 * @param rules - Règles personnalisées à adapter
 * @param format - Format de date à utiliser pour la conversion
 * @returns Règles adaptées pour fonctionner avec les dates et chaînes
 */
export const adaptCustomRules = (rules: CustomRule[] = [], format: string): CustomRule[] => {
	return rules.map((rule) => {
		if (rule.type === 'custom' && rule.options && rule.options.validate) {
			// Créer une copie de la règle pour ne pas modifier l'original
			const safeCopy: CustomRule = { ...rule }
			const originalValidate = rule.options.validate

			// Remplacer la fonction validate par une version sécurisée
			safeCopy.options = { ...rule.options }
			safeCopy.options.validate = (val: unknown) => {
				// Si la valeur est une Date mais que la fonction originale attend une chaîne
				// (détecté par la présence de includes dans le code source)
				if (val instanceof Date && originalValidate.toString().includes('.includes')) {
					// Convertir la date en chaîne au format spécifié
					return originalValidate(format ? formatDate(dayjs(val), format) : val.toISOString())
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
			errorMessage: 'Ce champ est requis',
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
