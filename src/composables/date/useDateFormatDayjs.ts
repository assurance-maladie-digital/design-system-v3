/**
 * Composable pour le formatage et le parsing des dates avec dayjs
 */
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/fr'

// Initialiser les plugins dayjs
dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('fr')

/**
 * Parse une chaîne de caractères en objet Date selon un format spécifié
 * @param dateString - La chaîne de caractères à parser
 * @param format - Le format de la date (ex: 'DD/MM/YYYY')
 * @returns Un objet Date ou null si la chaîne n'est pas valide
 */
export const parseDate = (dateString: string | Date | null, format: string): Date | null => {
	// Si dateString est null ou undefined, retourner null
	if (!dateString) return null

	// Si dateString est déjà un objet Date, le retourner directement
	if (dateString instanceof Date) {
		return dateString
	}

	// Si dateString n'est pas une chaîne de caractères, convertir en chaîne ou retourner null
	if (typeof dateString !== 'string') {
		try {
			dateString = String(dateString)
		}
		catch {
			return null
		}
	}

	// Utiliser dayjs pour parser la date
	const parsedDate = dayjs(dateString, format, true)

	if (!parsedDate.isValid()) return null

	// Extraire les composants de la date pour créer une date UTC
	// Cela évite les problèmes de décalage de fuseau horaire
	return dayjs.utc()
		.year(parsedDate.year())
		.month(parsedDate.month())
		.date(parsedDate.date())
		.hour(0)
		.minute(0)
		.second(0)
		.millisecond(0)
		.toDate()
}

/**
 * Formate une date selon un format spécifié
 * @param date - La date à formater
 * @param format - Le format de sortie (ex: 'DD/MM/YYYY')
 * @returns La date formatée en chaîne de caractères
 */
export const formatDate = (date: Date | null, format: string): string => {
	if (!date) return ''

	return dayjs(date).format(format)
}

/**
 * Hook composable pour le formatage et le parsing des dates
 * @returns Fonctions de formatage et parsing de dates
 */
export function useDateFormat() {
	return {
		parseDate,
		formatDate,
	}
}

export default useDateFormat
