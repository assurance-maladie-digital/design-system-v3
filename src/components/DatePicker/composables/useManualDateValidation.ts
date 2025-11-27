import { type Ref, unref } from 'vue'
import { type ValidationResult } from '@/composables/validation/useValidation'
import { DATE_PICKER_MESSAGES } from '../constants/messages'
import {
	adaptCustomRules,
	validateEmptyOrIncompleteDate,
	type CustomRule,
} from '../utils/validationUtils'
import { useDateFormatDisplay } from './useDateFormatDisplay'

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
	customRules?: CustomRule[] | Ref<CustomRule[]>
	customWarningRules?: CustomRule[] | Ref<CustomRule[]>

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

	const { getDisplayFormat } = useDateFormatDisplay()
	const displayFormat = getDisplayFormat(format)

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
				errors.value.push(`Format de date invalide (${displayFormat})`)
			}
			return false
		}

		// Valider les règles personnalisées
		if (!disableErrorHandling) {
			// Résoudre les références pour obtenir les valeurs actuelles
			const currentCustomRules = unref(customRules)
			const currentCustomWarningRules = unref(customWarningRules)

			// Filtrer les règles qui sont prêtes (ont une date définie)
			const readyRules = currentCustomRules.filter((rule) => {
				if (rule.type === 'notBeforeDate' || rule.type === 'notAfterDate' || rule.type === 'exactDate') {
					return rule.options && rule.options.date !== undefined
				}
				return true // Les autres types de règles sont toujours prêtes
			})

			// Si aucune règle n'est prête, skip la validation
			if (readyRules.length === 0 && currentCustomRules.length > 0) {
				return true
			}

			// Adapter les règles prêtes pour maintenir la compatibilité avec les tests existants
			// en utilisant notre utilitaire pour éviter les erreurs de type
			const safeCustomRules = adaptCustomRules(readyRules, format)
			const safeWarningRules = adaptCustomRules(currentCustomWarningRules, format)

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
