import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { extractRangeParts as extractRangePartsUtil, hasRangeSeparator as hasRangeSeparatorUtil, isValidDateRange } from '../utils/dateFormattingUtils'
import { locales } from '../locales'
import { useKeyboardEvents } from './useKeyboardEvents'

// Initialiser les plugins dayjs
dayjs.extend(customParseFormat)

/**
 * Composable pour gérer la saisie manuelle des plages de dates
 * Permet de saisir et formater correctement une plage de dates au format "date1 - date2"
 */
export function useDateRangeInput(
	format: string,
	isRangeMode: boolean,
	parseDate: (dateStr: string, format: string) => Date | null,
	formatDate: (date: Date, format: string) => string,
) {
	// Séparateur de plage
	const rangeSeparator = locales.rangeSeparator

	// Utiliser useKeyboardEvents pour centraliser la gestion des événements clavier
	const { handlePaste: handlePasteFromKeyboardEvents } = useKeyboardEvents({
		allowedCharacters: /^\d$/,
	})

	const toSafeString = (value: string | unknown): string => typeof value === 'string' ? value : ''

	/**
	 * Formate une plage de dates pour l'affichage
	 */
	const formatRangeForDisplay = (startDate: Date | null, endDate: Date | null): string => {
		if (!startDate) return ''
		if (!endDate) return `${formatDate(startDate, format)}${rangeSeparator}`
		return `${formatDate(startDate, format)}${rangeSeparator}${formatDate(endDate, format)}`
	}

	/**
	 * Analyse une chaîne de caractères pour en extraire une plage de dates
	 * Retourne un tableau contenant les dates de début et de fin
	 */
	const parseRangeInput = (value: string): [Date | null, Date | null] => {
		if (!value) return [null, null]

		// Si la valeur contient un séparateur de plage
		if (hasRangeSeparatorUtil(value, rangeSeparator)) {
			const [startStr, endStr] = extractRangePartsUtil(value, rangeSeparator)
			const startDate = parseDate(startStr, format)
			const endDate = parseDate(endStr, format)
			return [startDate, endDate]
		}

		// Si la valeur ne contient pas de séparateur, c'est une seule date
		const singleDate = parseDate(value, format)
		return [singleDate, null]
	}

	/**
	 * Gère la saisie manuelle d'une plage de dates
	 * @param inputValue Valeur actuelle du champ de saisie
	 * @param newValue Nouvelle valeur saisie
	 * @param cursorPosition Position actuelle du curseur (optionnel)
	 * @returns Objet contenant les informations sur la plage de dates
	 */
	const handleRangeInput = (inputValue: string | unknown, newValue: string | unknown, cursorPosition?: number): {
		formattedValue: string
		dates: [Date | null, Date | null]
		isComplete: boolean
		justCompletedFirstDate?: boolean
		cursorPosition?: number
	} => {
		const safeInputValue = toSafeString(inputValue)
		const safeNewValue = toSafeString(newValue)

		// Si le mode plage n'est pas activé, traiter comme une date unique
		if (!isRangeMode) {
			const date = parseDate(safeNewValue, format)
			return {
				formattedValue: date ? formatDate(date, format) : safeNewValue,
				dates: [date, null],
				isComplete: !!date,
				cursorPosition: cursorPosition,
			}
		}

		// Si la valeur contient déjà un séparateur de plage
		if (hasRangeSeparatorUtil(safeNewValue, rangeSeparator)) {
			const [startStr, endStr] = extractRangePartsUtil(safeNewValue, rangeSeparator)
			const startDate = parseDate(startStr, format)
			const endDate = parseDate(endStr, format)

			// Formater correctement la valeur
			const formattedStart = startDate ? formatDate(startDate, format) : startStr
			const formattedValue = `${formattedStart}${rangeSeparator}${endStr}`

			// Calculer la nouvelle position du curseur en fonction de la position actuelle
			let newCursorPosition = cursorPosition

			// Si la position du curseur est dans la première partie de la date
			if (cursorPosition !== undefined) {
				const separatorPos = safeInputValue.indexOf(rangeSeparator)
				if (separatorPos !== -1 && cursorPosition <= separatorPos) {
					// Ajuster la position si la première partie a été formatée
					if (startStr !== formattedStart) {
						// Conserver la position relative dans la première partie
						const relativePos = Math.min(cursorPosition, startStr.length)
						newCursorPosition = Math.min(relativePos, formattedStart.length)
					}
				}
				else if (separatorPos !== -1) {
					// Le curseur est dans la seconde partie
					// Conserver la position relative après le séparateur
					const posAfterSeparator = cursorPosition - (separatorPos + rangeSeparator.length)
					newCursorPosition = formattedStart.length + rangeSeparator.length + Math.min(posAfterSeparator, endStr.length)
				}
			}

			return {
				formattedValue,
				dates: [startDate, endDate],
				isComplete: !!startDate && !!endDate,
				cursorPosition: newCursorPosition,
			}
		}

		// Si nous éditons la première date
		const date = parseDate(safeNewValue, format)

		// Si la première date est complète, passer à la saisie de la deuxième date
		if (date && safeNewValue.length >= format.length) {
			const formattedDate = formatDate(date, format)

			return {
				formattedValue: `${formattedDate}${rangeSeparator}`,
				dates: [date, null],
				isComplete: false,
				justCompletedFirstDate: true,
				cursorPosition: formattedDate.length + rangeSeparator.length,
			}
		}

		return {
			formattedValue: safeNewValue,
			dates: [date, null],
			isComplete: false,
			cursorPosition: cursorPosition,
		}
	}

	/**
	 * Vérifie si une plage de dates est valide (la date de début est antérieure à la date de fin)
	 */
	const isValidRange = (startDate: Date | null, endDate: Date | null): boolean => {
		return isValidDateRange(startDate, endDate)
	}

	/**
	 * Gère l'événement paste pour filtrer les caractères non numériques
	 * Utilise handlePasteFromKeyboardEvents pour centraliser la logique
	 *
	 * @param event - Événement paste
	 */
	const handlePaste = (event: ClipboardEvent): void => {
		handlePasteFromKeyboardEvents(event)
	}

	return {
		formatRangeForDisplay,
		parseRangeInput,
		handleRangeInput,
		isValidRange,
		handlePaste,
	}
}
