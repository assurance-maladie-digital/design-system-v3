import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Initialiser les plugins dayjs
dayjs.extend(customParseFormat)

/**
 * Composable pour gérer l'auto-clamping des dates invalides
 * Cette fonctionnalité permet de ramener automatiquement les dates invalides
 * (comme le 29/02 sur une année non bissextile ou 33/12) au dernier jour valide du mois
 */
export const useDateAutoClamp = () => {
	/**
	 * Ajuste une date pour qu'elle soit valide en ramenant les jours invalides
	 * au dernier jour du mois correspondant
	 *
	 * @param day - Le jour à ajuster
	 * @param month - Le mois (0-11)
	 * @param year - L'année
	 * @returns Un objet contenant le jour ajusté et un booléen indiquant si un ajustement a été fait
	 */
	const clampDayToValidDate = (day: number, month: number, year: number): { day: number, adjusted: boolean } => {
		// Vérifier si le jour est valide pour ce mois et cette année
		// Créer une date pour le premier jour du mois et obtenir le nombre de jours dans ce mois
		const dateObj = dayjs(`${year}-${month + 1}-01`)
		const daysInMonth = dateObj.daysInMonth()

		// Si le jour est supérieur au nombre de jours dans le mois, le ramener au dernier jour du mois
		if (day > daysInMonth) {
			return { day: daysInMonth, adjusted: true }
		}

		return { day, adjusted: false }
	}

	/**
	 * Ajuste une date complète pour qu'elle soit valide
	 *
	 * @param dateStr - La chaîne de date à ajuster
	 * @param format - Le format de la date (ex: 'DD/MM/YYYY')
	 * @returns Un objet contenant la date ajustée et un booléen indiquant si un ajustement a été fait
	 */
	const autoClampDate = (dateStr: string, format: string): { clampedDate: string, adjusted: boolean } => {
		// Si la chaîne est vide, retourner telle quelle
		if (!dateStr) {
			return { clampedDate: dateStr, adjusted: false }
		}

		// Déterminer le séparateur utilisé dans le format
		const separator = format.match(/[^DMY]/)?.[0] || '/'

		// Extraire les parties du format pour déterminer l'ordre (jour, mois, année)
		const formatParts = format.split(separator)
		const dateParts = dateStr.split(separator)

		// Si le nombre de parties ne correspond pas, retourner la chaîne originale
		if (formatParts.length !== dateParts.length) {
			return { clampedDate: dateStr, adjusted: false }
		}

		let day = -1
		let month = -1
		let year = -1

		// Extraire les valeurs de jour, mois et année selon le format
		for (let i = 0; i < formatParts.length; i++) {
			const formatPart = formatParts[i].toUpperCase()
			const value = parseInt(dateParts[i], 10)

			if (isNaN(value)) {
				return { clampedDate: dateStr, adjusted: false }
			}

			if (formatPart.startsWith('D')) {
				day = value
			}
			else if (formatPart.startsWith('M')) {
				month = value - 1 // Convertir en index de mois (0-11)
			}
			else if (formatPart.startsWith('Y')) {
				year = value
			}
		}

		// Vérifier si toutes les parties nécessaires ont été trouvées
		if (day === -1 || month === -1 || year === -1) {
			return { clampedDate: dateStr, adjusted: false }
		}

		// Vérifier si nous avons une date valide
		if (month < 0 || month > 11 || year < 0 || day < 1) {
			return { clampedDate: dateStr, adjusted: false }
		}

		// Calculer directement le nombre de jours dans le mois
		const daysInMonth = dayjs(new Date(year, month, 1)).daysInMonth()

		// Ajuster le jour si nécessaire
		let adjusted = false
		let clampedDay = day

		if (day > daysInMonth) {
			clampedDay = daysInMonth
			adjusted = true
		}

		// Si aucun ajustement n'a été fait, retourner la chaîne originale
		if (!adjusted) {
			return { clampedDate: dateStr, adjusted: false }
		}

		// Reconstruire la chaîne de date avec le jour ajusté
		const newDateParts = [...dateParts]
		for (let i = 0; i < formatParts.length; i++) {
			const formatPart = formatParts[i].toUpperCase()
			if (formatPart.startsWith('D')) {
				// Formater le jour avec le bon nombre de chiffres (01 ou 1 selon le format)
				newDateParts[i] = formatPart.length > 1
					? clampedDay.toString().padStart(2, '0')
					: clampedDay.toString()
			}
		}

		return {
			clampedDate: newDateParts.join(separator),
			adjusted: true,
		}
	}

	return {
		autoClampDate,
		clampDayToValidDate,
	}
}

export default useDateAutoClamp
