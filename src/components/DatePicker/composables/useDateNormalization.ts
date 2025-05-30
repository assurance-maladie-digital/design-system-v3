import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Initialiser le plugin dayjs nécessaire pour la validation des formats de date
dayjs.extend(customParseFormat)

/**
 * Composable pour normaliser les dates invalides en les remplaçant par la première date valide la plus proche
 * Par exemple, 31/02/2024 sera remplacé par 01/03/2024 (premier jour valide après le 31/02)
 *
 * @param options - Options de configuration
 * @returns Fonctions pour normaliser les dates
 */
export const useDateNormalization = (options: {
	format: string
	parseDate: (dateStr: string, format: string) => Date | null
	formatDate: (date: Date | null, format: string) => string
}) => {
	const { format, parseDate, formatDate } = options

	/**
	 * Trouve la première date valide la plus proche d'une date invalide
	 *
	 * @param dateStr - Chaîne de date potentiellement invalide
	 * @returns Un objet contenant la date normalisée et un booléen indiquant si une normalisation a été effectuée
	 */
	const normalizeDate = (dateStr: string): { normalizedDate: Date | null, wasNormalized: boolean } => {
		// Essayer de parser la date normalement d'abord
		const parsedDate = parseDate(dateStr, format)

		// Si la date est valide, la retourner telle quelle
		if (parsedDate !== null) {
			return { normalizedDate: parsedDate, wasNormalized: false }
		}

		// Si la date est invalide, extraire les composants (jour, mois, année)
		const separator = format.match(/[^DMY]/)?.[0] || '/'
		const parts = dateStr.split(separator)
		const formatParts = format.split(separator)

		// Mapper les parties de la date selon le format
		let day: number | null = null
		let month: number | null = null
		let year: number | null = null

		for (let i = 0; i < formatParts.length; i++) {
			if (i >= parts.length) break

			const formatPart = formatParts[i].charAt(0).toUpperCase()
			const valuePart = parseInt(parts[i], 10)

			if (isNaN(valuePart)) continue

			switch (formatPart) {
				case 'D':
					day = valuePart
					break
				case 'M':
					month = valuePart - 1 // dayjs utilise des mois de 0 à 11
					break
				case 'Y':
					year = valuePart
					break
			}
		}

		// Si nous n'avons pas tous les composants nécessaires, retourner null
		if (day === null || month === null || year === null) {
			return { normalizedDate: null, wasNormalized: false }
		}

		// Vérifier si la date est valide en comparant avec le dernier jour du mois
		const lastDayOfMonth = dayjs().year(year).month(month).endOf('month').date()
		const isInvalidDay = day > lastDayOfMonth

		// Si le jour est invalide, normaliser vers le dernier jour valide du mois sélectionné
		let normalizedDayjs
		if (isInvalidDay) {
			// Utiliser le dernier jour du mois sélectionné
			normalizedDayjs = dayjs().year(year).month(month).date(lastDayOfMonth)
		}
		else {
			// La date est valide ou a été normalisée par dayjs
			normalizedDayjs = dayjs().year(year).month(month).date(day)
		}

		// Pour une date invalide comme 31/02/2024, nous avons déjà déterminé qu'elle est normalisée
		const wasNormalized = isInvalidDay || (
			normalizedDayjs.date() !== day
			|| normalizedDayjs.month() !== month
			|| normalizedDayjs.year() !== year
		)

		// Convertir en objet Date
		const normalizedDate = normalizedDayjs.toDate()

		return { normalizedDate, wasNormalized }
	}

	/**
	 * Normalise une chaîne de date et retourne la date formatée
	 *
	 * @param dateStr - Chaîne de date potentiellement invalide
	 * @returns Un objet contenant la date formatée et un booléen indiquant si une normalisation a été effectuée
	 */
	const normalizeAndFormatDate = (dateStr: string): { formattedDate: string, wasNormalized: boolean } => {
		const { normalizedDate, wasNormalized } = normalizeDate(dateStr)
		return {
			formattedDate: formatDate(normalizedDate, format),
			wasNormalized,
		}
	}

	/**
	 * Normalise une date ou un tableau de dates
	 *
	 * @param value - Date ou tableau de dates à normaliser
	 * @returns Un objet contenant la valeur normalisée et un booléen indiquant si une normalisation a été effectuée
	 */
	const normalizeValue = (value: Date | Date[] | string | string[] | null): { normalizedValue: Date | Date[] | null, wasNormalized: boolean } => {
		// Si la valeur est null, la retourner telle quelle
		if (value === null || value === undefined) {
			return { normalizedValue: null, wasNormalized: false }
		}

		// Si la valeur est une chaîne, normaliser la date
		if (typeof value === 'string') {
			const { normalizedDate, wasNormalized } = normalizeDate(value)
			return { normalizedValue: normalizedDate, wasNormalized }
		}

		// Si la valeur est un tableau de chaînes, normaliser chaque date
		if (Array.isArray(value) && typeof value[0] === 'string') {
			let anyNormalized = false
			const normalizedDates = value.map((dateStr) => {
				if (typeof dateStr !== 'string') return null

				const { normalizedDate, wasNormalized } = normalizeDate(dateStr)
				if (wasNormalized) anyNormalized = true
				return normalizedDate
			}).filter((date): date is Date => date !== null)

			return {
				normalizedValue: normalizedDates.length > 0 ? normalizedDates : null,
				wasNormalized: anyNormalized,
			}
		}

		// Si la valeur est déjà une Date ou un tableau de Dates, la retourner telle quelle
		return { normalizedValue: value as Date | Date[], wasNormalized: false }
	}

	return {
		normalizeDate,
		normalizeAndFormatDate,
		normalizeValue,
	}
}

export default useDateNormalization
