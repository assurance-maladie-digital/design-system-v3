/**
 * Composable pour le formatage et le parsing des dates
 */

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
		} catch {
			return null
		}
	}

	// Créer un mapping des positions des éléments de date selon le format
	const separator = format.includes('/') ? '/' : format.includes('-') ? '-' : '.'
	const parts = format.split(separator)
	const dateParts = dateString.split(separator)

	if (parts.length !== dateParts.length) return null

	let day = 0, month = 0, year = 0

	// Extraire les valeurs selon leur position dans le format
	parts.forEach((part, index) => {
		const value = parseInt(dateParts[index], 10)
		if (isNaN(value)) return

		if (part.includes('DD') || part.includes('D')) day = value
		else if (part.includes('MM') || part.includes('M')) month = value - 1 // Les mois en JS sont 0-indexés
		else if (part.includes('YYYY')) year = value
		else if (part.includes('YY')) {
			// Gestion intelligente des années à 2 chiffres
			// Si l'année est < 50, on considère qu'elle est dans le 21ème siècle
			// Sinon, elle est dans le 20ème siècle
			year = value < 50 ? 2000 + value : 1900 + value
		}
	})

	// Vérifier que nous avons toutes les parties nécessaires et qu'elles sont dans des plages valides
	if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1000 || year > 9999) return null

	// Créer la date à midi (12:00) pour éviter les problèmes de décalage de fuseau horaire
	// Cela garantit que la date reste la même lors de la conversion en UTC
	const date = new Date(year, month, day, 12, 0, 0)

	// Vérifier que la date est valide (par exemple, 31 février n'existe pas)
	if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null

	return date
}

/**
 * Formate une date selon un format spécifié
 * @param date - La date à formater
 * @param format - Le format de sortie (ex: 'DD/MM/YYYY')
 * @returns La date formatée en chaîne de caractères
 */
export const formatDate = (date: Date, format: string): string => {
	if (!date) return ''

	// Formats de base
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear().toString()
	const shortYear = year.slice(-2)

	// Formats sans padding
	const dayNoPad = date.getDate().toString()
	const monthNoPad = (date.getMonth() + 1).toString()

	// Remplacer les tokens dans l'ordre correct (du plus spécifique au moins spécifique)
	const result = format
		.replace(/YYYY/g, year)
		.replace(/YY/g, shortYear)
		.replace(/MM/g, month)
		.replace(/M/g, monthNoPad)
		.replace(/DD/g, day)
		.replace(/D/g, dayNoPad)

	return result
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
