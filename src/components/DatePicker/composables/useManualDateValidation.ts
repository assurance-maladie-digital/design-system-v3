import { type Ref } from 'vue'
import { type ValidationResult } from '@/composables/validation/useValidation'
import { DATE_PICKER_MESSAGES } from '../constants/messages'

/**
 * Composable pour la validation manuelle des dates saisies
 *
 * @param options - Options de configuration
 * @returns Fonction pour valider la saisie manuelle de date
 */
export const useManualDateValidation = (options: {
	// Propriétés de configuration
	format: string
	required?: boolean
	disableErrorHandling?: boolean
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Règles personnalisées
	customRules?: { type: string, options: any }[]
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Règles d'avertissement personnalisées
	customWarningRules?: { type: string, options: any }[]

	// Références réactives
	hasInteracted: Ref<boolean>
	errors: Ref<string[]>

	// Fonctions de validation
	clearValidation: () => void
	validateDateFormat: (dateStr: string) => { isValid: boolean, message: string }
	isDateComplete: (value: string) => boolean
	parseDate: (dateStr: string, format: string) => Date | null
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Règles personnalisées
	validateField: (value: any, rules?: any[], warningRules?: any[]) => ValidationResult
}) => {
	const {
		format,
		required = false,
		disableErrorHandling = false,
		customRules = [],
		customWarningRules = [],
		hasInteracted,
		errors,
		clearValidation,
		validateDateFormat,
		isDateComplete,
		parseDate,
		validateField,
	} = options

	/**
	 * Valide une saisie manuelle de date
	 *
	 * @param value - Chaîne de date à valider
	 * @returns Booléen indiquant si la saisie est valide
	 */
	const validateManualInput = (value: string): boolean => {
		// Réinitialiser la validation
		clearValidation()

		// Vérifier si le champ est requis et vide
		if (!value && required && hasInteracted.value) {
			if (!disableErrorHandling) {
				errors.value.push(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
			}
			return false
		}

		// Si le champ est vide et non requis, c'est valide
		if (!value && !required) {
			return true
		}

		// Vérifier si la saisie est complète avant de valider le format
		if (!isDateComplete(value)) {
			// La saisie n'est pas complète, ne pas afficher d'erreur
			return true
		}

		// Valider le format de la date
		const formatValidation = validateDateFormat(value)
		if (!formatValidation.isValid) {
			if (!disableErrorHandling && formatValidation.message) {
				errors.value.push(formatValidation.message)
			}
			return false
		}

		// Si le format est valide, vérifier si la date peut être parsée
		const date = parseDate(value, format)
		if (!date) {
			// La date n'a pas pu être parsée
			if (!disableErrorHandling) {
				errors.value.push(`Format de date invalide (${format})`)
			}
			return false
		}

		// Valider les règles personnalisées
		if (!disableErrorHandling) {
			// Séparer les règles personnalisées des règles standard
			const customTypeRules = customRules.filter(rule => rule.type === 'custom')
			const standardRules = customRules.filter(rule => rule.type !== 'custom')

			const customTypeWarningRules = customWarningRules.filter(rule => rule.type === 'custom')
			const standardWarningRules = customWarningRules.filter(rule => rule.type !== 'custom')

			// Valider les règles personnalisées avec la chaîne de caractères
			if (customTypeRules.length > 0 || customTypeWarningRules.length > 0) {
				const stringResult = validateField(
					value,
					customTypeRules,
					customTypeWarningRules,
				)

				if (stringResult.hasError) {
					return false
				}
			}

			// Valider les règles standard avec l'objet Date
			if (standardRules.length > 0 || standardWarningRules.length > 0) {
				const dateResult = validateField(
					date,
					standardRules,
					standardWarningRules,
				)

				if (dateResult.hasError) {
					return false
				}
			}

			// Si aucune erreur n'a été détectée, la validation est réussie
			return true
		}

		return errors.value.length === 0
	}

	return {
		validateManualInput,
	}
}
