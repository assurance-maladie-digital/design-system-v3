import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { DATE_PICKER_MESSAGES } from '../constants/messages'

// Initialiser le plugin dayjs nécessaire pour la validation des formats de date
dayjs.extend(customParseFormat)

/**
 * Utilitaires pour la validation du format des dates
 * Fonctions pures sans état ni refs
 */
export const validateDateFormat = (
	dateStr: string,
	format: string,
	dateFormatReturn: string | undefined = undefined,
	required: boolean = false,
	hasInteracted: boolean = false,
	disableErrorHandling: boolean = false,
): { isValid: boolean, message: string } => {
	if (!dateStr) {
		return {
			isValid: !required || !hasInteracted || disableErrorHandling,
			message: (required && hasInteracted && !disableErrorHandling) ? DATE_PICKER_MESSAGES.ERROR_REQUIRED : '',
		}
	}

	if (!/^[\d/.-]*$/.test(dateStr)) {
		return {
			isValid: disableErrorHandling,
			message: disableErrorHandling ? '' : DATE_PICKER_MESSAGES.ERROR_INVALID_FORMAT_WITH_FORMAT(format),
		}
	}

	const isValid = dayjs(dateStr, format, true).isValid()
		|| (dateFormatReturn ? dayjs(dateStr, dateFormatReturn, true).isValid() : false)

	if (!isValid) {
		return {
			isValid: disableErrorHandling,
			message: disableErrorHandling ? '' : DATE_PICKER_MESSAGES.ERROR_INVALID_FORMAT_WITH_FORMAT(format),
		}
	}

	return { isValid: true, message: '' }
}

/**
 * Vérifie si une chaîne de date est complète selon le format spécifié
 * en comptant le nombre de chiffres attendus et saisis
 */
export const isDateComplete = (dateStr: string, format: string): boolean => {
	if (!dateStr) return false

	// Compter le nombre de chiffres attendus en fonction du format
	const expectedDigits = format.replace(/[^DMY]/g, '').length

	// Compter le nombre de chiffres saisis
	const actualDigits = dateStr.replace(/[^\d]/g, '').length

	// Vérifier si la date est complète en termes de nombre de chiffres
	return actualDigits === expectedDigits
}
