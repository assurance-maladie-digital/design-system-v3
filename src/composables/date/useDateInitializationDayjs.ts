/**
 * Composable pour l'initialisation des dates dans le DatePicker avec dayjs
 */
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/fr'

// Initialiser les plugins dayjs
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('fr')

// Types
export type DateValue = string | [string, string] | null
export type DateInput = string | string[] | null | object

/**
 * Parse une date en utilisant dayjs et retourne une Date UTC
 * @param dateStr - La chaîne de date à analyser
 * @param format - Le format de la date
 * @returns Une Date ou null si la date est invalide
 */
const parseToUTCDate = (dateStr: string, format: string): Date | null => {
	if (!dayjs(dateStr, format).isValid()) return null

	// Extraire les composants de la date à partir de la chaîne
	const dateParts = dayjs(dateStr, format)

	// Créer une date UTC avec les composants exacts pour éviter les décalages de fuseau horaire
	// Utiliser set pour définir explicitement l'année, le mois et le jour
	return dayjs.utc()
		.year(dateParts.year())
		.month(dateParts.month())
		.date(dateParts.date())
		.hour(0)
		.minute(0)
		.second(0)
		.millisecond(0)
		.toDate()
}

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
			let dates = [
				parseToUTCDate(modelValue[0], parseFormat),
				parseToUTCDate(modelValue[1], parseFormat),
			]

			// Si l'une des dates est invalide avec le format de retour, essayer avec le format d'affichage
			if (dates.some(date => date === null) && returnFormat) {
				dates = [
					parseToUTCDate(modelValue[0], displayFormat),
					parseToUTCDate(modelValue[1], displayFormat),
				]
			}

			// Vérifie si l'une des dates est toujours invalide
			if (dates.some(date => date === null)) {
				return []
			}

			// Vérifie si la première date est après la seconde
			if (dates[0] && dates[1] && dayjs(dates[0]).isAfter(dayjs(dates[1]))) {
				return []
			}

			// Filtrer les dates nulles et convertir en tableau de Date
			return dates.filter((date): date is Date => date !== null)
		}

		if (modelValue.length === 1) {
			// Essayer d'abord avec le format de retour, puis avec le format d'affichage
			let date = parseToUTCDate(modelValue[0], parseFormat)

			// Si la date est invalide avec le format de retour, essayer avec le format d'affichage
			if (date === null && returnFormat) {
				date = parseToUTCDate(modelValue[0], displayFormat)
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
	let date = parseToUTCDate(modelValue, parseFormat)

	// Si la date est invalide avec le format de retour, essayer avec le format d'affichage
	if (date === null && returnFormat) {
		date = parseToUTCDate(modelValue, displayFormat)
	}

	return date
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
