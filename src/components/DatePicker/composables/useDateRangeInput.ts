import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { extractRangeParts as extractRangePartsUtil, hasRangeSeparator as hasRangeSeparatorUtil, isValidDateRange } from '../utils/dateFormattingUtils'
import { locales } from '../locales'
import { useKeyboardEvents } from './useKeyboardEvents'

// Initialiser les plugins dayjs
dayjs.extend(customParseFormat)

type RangeDates = [Date | null, Date | null]

type RangeInputResult = {
	formattedValue: string
	dates: RangeDates
	isComplete: boolean
	justCompletedFirstDate?: boolean
	cursorPosition?: number
}

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
	const parseSingleDate = (value: string): Date | null => parseDate(value, format)
	const hasRangeSeparator = (value: string): boolean => hasRangeSeparatorUtil(value, rangeSeparator)
	const extractRangeParts = (value: string): [string, string] => extractRangePartsUtil(value, rangeSeparator)

	const buildRangeInputResult = ({
		formattedValue,
		dates,
		isComplete,
		justCompletedFirstDate,
		cursorPosition,
	}: RangeInputResult): RangeInputResult => ({
		formattedValue,
		dates,
		isComplete,
		justCompletedFirstDate,
		cursorPosition,
	})

	const parseDatesFromRangeValue = (value: string): { startStr: string, endStr: string, dates: RangeDates } => {
		const [startStr, endStr] = extractRangeParts(value)
		return {
			startStr,
			endStr,
			dates: [parseSingleDate(startStr), parseSingleDate(endStr)],
		}
	}

	const formatSingleModeResult = (value: string, cursorPosition?: number): RangeInputResult => {
		const date = parseSingleDate(value)

		return buildRangeInputResult({
			formattedValue: date ? formatDate(date, format) : value,
			dates: [date, null],
			isComplete: !!date,
			cursorPosition,
		})
	}

	const computeRangeCursorPosition = (
		previousValue: string,
		cursorPosition: number | undefined,
		startStr: string,
		formattedStart: string,
		endStr: string,
	): number | undefined => {
		if (cursorPosition === undefined) {
			return cursorPosition
		}

		const separatorPosition = previousValue.indexOf(rangeSeparator)
		if (separatorPosition === -1 || cursorPosition <= separatorPosition) {
			if (startStr === formattedStart) {
				return cursorPosition
			}

			const relativePosition = Math.min(cursorPosition, startStr.length)
			return Math.min(relativePosition, formattedStart.length)
		}

		const positionAfterSeparator = cursorPosition - (separatorPosition + rangeSeparator.length)
		return formattedStart.length + rangeSeparator.length + Math.min(positionAfterSeparator, endStr.length)
	}

	const formatExistingRangeResult = (
		previousValue: string,
		nextValue: string,
		cursorPosition?: number,
	): RangeInputResult => {
		const { startStr, endStr, dates: [startDate, endDate] } = parseDatesFromRangeValue(nextValue)
		const formattedStart = startDate ? formatDate(startDate, format) : startStr

		return buildRangeInputResult({
			formattedValue: `${formattedStart}${rangeSeparator}${endStr}`,
			dates: [startDate, endDate],
			isComplete: !!startDate && !!endDate,
			cursorPosition: computeRangeCursorPosition(previousValue, cursorPosition, startStr, formattedStart, endStr),
		})
	}

	const formatRangeStartResult = (value: string, cursorPosition?: number): RangeInputResult => {
		const date = parseSingleDate(value)

		if (date && value.length >= format.length) {
			const formattedDate = formatDate(date, format)
			return buildRangeInputResult({
				formattedValue: `${formattedDate}${rangeSeparator}`,
				dates: [date, null],
				isComplete: false,
				justCompletedFirstDate: true,
				cursorPosition: formattedDate.length + rangeSeparator.length,
			})
		}

		return buildRangeInputResult({
			formattedValue: value,
			dates: [date, null],
			isComplete: false,
			cursorPosition,
		})
	}

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
		if (hasRangeSeparator(value)) {
			return parseDatesFromRangeValue(value).dates
		}

		// Si la valeur ne contient pas de séparateur, c'est une seule date
		return [parseSingleDate(value), null]
	}

	/**
	 * Gère la saisie manuelle d'une plage de dates
	 * @param inputValue Valeur actuelle du champ de saisie
	 * @param newValue Nouvelle valeur saisie
	 * @param cursorPosition Position actuelle du curseur (optionnel)
	 * @returns Objet contenant les informations sur la plage de dates
	 */
	const handleRangeInput = (
		inputValue: string | unknown,
		newValue: string | unknown,
		cursorPosition?: number,
	): RangeInputResult => {
		const safeInputValue = toSafeString(inputValue)
		const safeNewValue = toSafeString(newValue)

		// Si le mode plage n'est pas activé, traiter comme une date unique
		if (!isRangeMode) {
			return formatSingleModeResult(safeNewValue, cursorPosition)
		}

		// Si la valeur contient déjà un séparateur de plage
		if (hasRangeSeparator(safeNewValue)) {
			return formatExistingRangeResult(safeInputValue, safeNewValue, cursorPosition)
		}

		return formatRangeStartResult(safeNewValue, cursorPosition)
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
