import { ruleMessage } from '@/utils/ruleMessage'
import { useHolidayDay } from '@/composables/date/useHolidayDay'
import type {
	ErrorMessages,
	ValidationResult,
	ValidationRule,
	Value,
} from '@/utils/rules/types'
import { defaultErrorMessages } from './locales'

/**
 * Vérifie qu'une date n'est pas un jour férié
 * @param errorMessages - Messages d'erreur personnalisés
 * @returns Fonction de validation
 */
export function isHolidayDayFn(
	errorMessages: ErrorMessages = defaultErrorMessages,
): ValidationRule {
	return (value: Value): ValidationResult => {
		// Si la valeur est vide, on considère que c'est valide
		if (!value) {
			return true
		}

		// Utiliser le composable pour vérifier si la date est un jour férié
		const { isHolidayDay } = useHolidayDay()

		// On retourne true si ce n'est PAS un jour férié, sinon on retourne le message d'erreur
		return ((typeof value === 'string' || value instanceof Date) && !isHolidayDay(value)) || ruleMessage(errorMessages, 'default')
	}
}

/**
 * Règle de validation pour vérifier qu'une date n'est pas un jour férié
 */
export const isHolidayDay = isHolidayDayFn()
