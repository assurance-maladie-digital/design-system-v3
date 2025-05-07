import { computed, type Ref } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Initialiser le plugin dayjs nécessaire pour la validation des formats de date
dayjs.extend(customParseFormat)

/**
 * Composable pour la validation du format des dates
 *
 * @param options - Options de configuration
 * @param options.format - Format d'affichage de la date (ex: 'DD/MM/YYYY')
 * @param options.dateFormatReturn - Format de retour de la date (optionnel)
 * @param options.required - Indique si le champ est requis
 * @param options.hasInteracted - Ref indiquant si l'utilisateur a interagi avec le champ
 * @param options.disableErrorHandling - Désactive la gestion des erreurs
 * @returns Fonctions et propriétés pour la validation du format des dates
 */
export const useDateFormatValidation = (options: {
	format: string
	dateFormatReturn?: string
	required?: boolean
	hasInteracted: Ref<boolean>
	disableErrorHandling?: boolean
}) => {
	const { format, dateFormatReturn, required = false, hasInteracted, disableErrorHandling = false } = options

	/**
   * Valide le format d'une chaîne de date
   *
   * @param dateStr - Chaîne de date à valider
   * @returns Objet contenant l'état de validité et un message d'erreur éventuel
   */
	const validateDateFormat = (dateStr: string): { isValid: boolean, message: string } => {
		if (!dateStr) {
			return {
				isValid: !required || !hasInteracted.value || disableErrorHandling,
				message: (required && hasInteracted.value && !disableErrorHandling) ? 'La date est requise' : '',
			}
		}

		if (!/^[\d/.-]*$/.test(dateStr)) {
			return {
				isValid: disableErrorHandling,
				message: disableErrorHandling ? '' : `Format de date invalide (${format})`,
			}
		}

		const isValid = dayjs(dateStr, format, true).isValid()
			|| (dateFormatReturn ? dayjs(dateStr, dateFormatReturn, true).isValid() : false)

		if (!isValid) {
			return {
				isValid: disableErrorHandling,
				message: disableErrorHandling ? '' : `Format de date invalide (${format})`,
			}
		}

		return { isValid: true, message: '' }
	}

	/**
   * Vérifie si une chaîne de date est complète selon le format spécifié
   * en comptant le nombre de chiffres attendus et saisis, et en vérifiant la validité de la date
   *
   * @param dateStr - Chaîne de date à vérifier
   * @returns Booléen indiquant si la date est complète
   */
	const isDateComplete = computed(() => (dateStr: string): boolean => {
		if (!dateStr) return false

		// Compter le nombre de chiffres attendus en fonction du format
		const expectedDigits = format.replace(/[^DMY]/g, '').length

		// Compter le nombre de chiffres saisis
		const actualDigits = dateStr.replace(/[^\d]/g, '').length

		// Vérifier si la date est complète en termes de nombre de chiffres
		const hasAllDigits = actualDigits === expectedDigits

		// Vérifier si la date est valide selon le format spécifié
		const isValid = hasAllDigits

		return isValid
	})

	return {
		validateDateFormat,
		isDateComplete,
	}
}
