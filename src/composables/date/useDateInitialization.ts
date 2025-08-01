/**
 * Composable pour l'initialisation des dates dans le CalendarMode
 */
import { parseDate } from './useDateFormat'

// Types
export type DateValue = string | [string, string] | null
export type DateInput = string | string[] | null | object

/**
 * Initialise les dates sélectionnées à partir d'une valeur d'entrée
 * @param modelValue - La valeur d'entrée (peut être une chaîne, un tableau, null ou un objet)
 * @param displayFormat - Le format d'affichage des dates
 * @param returnFormat - Le format de retour des dates (optionnel)
 * @returns Une date, un tableau de dates ou null
 */
export const initializeSelectedDates = (
	modelValue: DateInput | null,
	displayFormat: string,
	returnFormat: string = '',
): Date | Date[] | null => {
	if (!modelValue) return null

	// Déterminer le format à utiliser pour l'analyse
	const parseFormat = returnFormat || displayFormat

	if (Array.isArray(modelValue)) {
		if (modelValue.length >= 2) {
			// Essayer d'abord avec le format de retour, puis avec le format d'affichage
			let dates = [parseDate(modelValue[0], parseFormat), parseDate(modelValue[1], parseFormat)]

			// Si l'une des dates est invalide avec le format de retour, essayer avec le format d'affichage
			if (dates.some(date => date === null) && returnFormat) {
				dates = [parseDate(modelValue[0], displayFormat), parseDate(modelValue[1], displayFormat)]
			}

			// Vérifie si l'une des dates est toujours invalide
			if (dates.some(date => date === null)) {
				return []
			}

			// Vérifie si la première date est après la seconde
			if (dates[0] && dates[1] && dates[0] > dates[1]) {
				return []
			}

			// Filtrer les dates nulles et convertir en tableau de Date
			return dates.filter((date): date is Date => date !== null)
		}

		if (modelValue.length === 1) {
			// Essayer d'abord avec le format de retour, puis avec le format d'affichage
			let date = parseDate(modelValue[0], parseFormat)

			// Si la date est invalide avec le format de retour, essayer avec le format d'affichage
			if (date === null && returnFormat) {
				date = parseDate(modelValue[0], displayFormat)
			}

			return date === null ? [] : [date]
		}

		return []
	}

	// Si modelValue est un objet, on le convertit en chaîne
	if (typeof modelValue === 'object') {
		return null
	}

	// Essayer d'abord avec le format de retour, puis avec le format d'affichage
	let date = parseDate(modelValue, parseFormat)

	// Si la date est invalide avec le format de retour, essayer avec le format d'affichage
	if (date === null && returnFormat) {
		date = parseDate(modelValue, displayFormat)
	}

	return date === null ? null : date
}

/**
 * Hook composable pour l'initialisation des dates
 * @returns Fonction d'initialisation des dates
 */
export function useDateInitialization() {
	return {
		initializeSelectedDates,
	}
}

export default useDateInitialization
