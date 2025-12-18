import { useHolidayDay } from '@/composables/date/useHolidayDay'
import type {
	ErrorMessages,
	ValidationResult,
	ValidationRule,
	Value,
} from '@/utils/rules/types'
import { defaultErrorMessages } from './locales'
import { validateDateValue } from '../validateDateValue'

/**
 * Vérifie qu'une date n'est pas un jour férié
 * @param errorMessages - Messages d'erreur personnalisés
 * @returns Fonction de validation
 */
export function isHolidayDayFn(
	errorMessages: ErrorMessages = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		// Utiliser le composable pour vérifier si la date est un jour férié
		const { isHolidayDay } = useHolidayDay()
		// On retourne true si ce n'est PAS un jour férié, sinon on retourne le message d'erreur
		return validateDateValue(
			value,
			formatted => !isHolidayDay(formatted),
			{ errorMessages },
		)
	}
}

/**
 * Règle de validation pour vérifier qu'une date n'est pas un jour férié
 */
export const isHolidayDay = isHolidayDayFn()
