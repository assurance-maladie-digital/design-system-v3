import { type Ref } from 'vue'
import { type ValidationResult } from '@/composables/validation/useValidation'
import { DATE_PICKER_MESSAGES } from '../constants/messages'
import {
	adaptCustomRules,
	validateEmptyOrIncompleteDate,
	type CustomRule,
} from '../utils/validationUtils'

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
	customRules?: CustomRule[]
	customWarningRules?: CustomRule[]

	// Références réactives
	hasInteracted: Ref<boolean>
	errors: Ref<string[]>

	// Fonctions de validation
	clearValidation: () => void
	validateDateFormat: (dateStr: string) => { isValid: boolean, message: string }
	isDateComplete: (value: string) => boolean
	parseDate: (dateStr: string, format: string) => Date | null
	validateField: (value: unknown, rules?: CustomRule[], warningRules?: CustomRule[]) => ValidationResult
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

		// Vérifier les cas de champ vide ou incomplet
		const emptyCheck = validateEmptyOrIncompleteDate(
			value,
			required,
			isDateComplete,
			hasInteracted.value,
		)

		// Gérer les erreurs pour champ vide requis
		if (!emptyCheck.isValid && !disableErrorHandling && emptyCheck.errorMessage) {
			errors.value.push(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
		}

		// Si on ne doit pas continuer la validation (champ vide/incomplet)
		if (!emptyCheck.shouldContinue) {
			return emptyCheck.isValid
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
			// Adapter les règles pour maintenir la compatibilité avec les tests existants
			// en utilisant notre utilitaire pour éviter les erreurs de type
			const safeCustomRules = adaptCustomRules(customRules, format)
			const safeWarningRules = adaptCustomRules(customWarningRules, format)

			// Appeler validateField pour évaluer les règles
			const result = validateField(
				date,
				safeCustomRules,
				safeWarningRules,
			)

			return !result.hasError
		}

		return errors.value.length === 0
	}

	return {
		validateManualInput,
	}
}
