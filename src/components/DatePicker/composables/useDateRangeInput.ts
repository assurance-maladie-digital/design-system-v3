import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

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
	// État pour suivre si nous sommes en train de saisir la première ou la deuxième date
	const isEditingSecondDate = ref(false)
	// Stockage temporaire pour la première date saisie
	const firstDate = ref<Date | null>(null)
	// Stockage temporaire pour la deuxième date saisie
	const secondDate = ref<Date | null>(null)
	// Séparateur de plage
	const rangeSeparator = ' - '

	/**
	 * Vérifie si une chaîne de caractères contient un séparateur de plage
	 */
	const hasRangeSeparator = (value: string): boolean => {
		return value.includes(rangeSeparator)
	}

	/**
	 * Extrait les deux parties d'une plage de dates
	 */
	const extractRangeParts = (value: string): [string, string] => {
		const parts = value.split(rangeSeparator)
		return [
			parts[0]?.trim() || '',
			parts[1]?.trim() || '',
		]
	}

	/**
	 * Formate une plage de dates pour l'affichage
	 */
	const formatRangeForDisplay = (startDate: Date | null, endDate: Date | null): string => {
		if (!startDate) return ''
		if (!endDate) return formatDate(startDate, format)
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
			const [startStr, endStr] = extractRangeParts(value)
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
	 * @returns Objet contenant les informations sur la plage de dates
	 */
	const handleRangeInput = (inputValue: string, newValue: string): {
		formattedValue: string
		dates: [Date | null, Date | null]
		isComplete: boolean
		justCompletedFirstDate?: boolean
		cursorPosition?: number
	} => {
		// Si le mode plage n'est pas activé, traiter comme une date unique
		if (!isRangeMode) {
			const date = parseDate(newValue, format)
			return {
				formattedValue: date ? formatDate(date, format) : newValue,
				dates: [date, null],
				isComplete: !!date,
			}
		}

		// Cas spécial : si la valeur précédente se terminait par un séparateur et que la nouvelle valeur
		// contient du texte après le séparateur, c'est qu'on commence à saisir la seconde date
		if (inputValue && inputValue.endsWith(rangeSeparator)
			&& newValue.startsWith(inputValue)
			&& newValue.length > inputValue.length) {
			// On est en train de saisir la seconde date pour la première fois
			isEditingSecondDate.value = true

			// Extraire la première date et le nouveau caractère saisi
			const firstPart = inputValue.substring(0, inputValue.length - rangeSeparator.length)
			const firstDateObj = parseDate(firstPart, format)
			firstDate.value = firstDateObj

			// Extraire le caractère nouvellement saisi (après le séparateur)
			const secondPart = newValue.substring(inputValue.length)
			secondDate.value = parseDate(secondPart, format)

			return {
				formattedValue: `${firstPart}${rangeSeparator}${secondPart}`,
				dates: [firstDateObj, secondDate.value],
				isComplete: false,
				cursorPosition: newValue.length,
			}
		}

		// Si la valeur contient déjà un séparateur de plage
		if (hasRangeSeparator(newValue)) {
			const [startStr, endStr] = extractRangeParts(newValue)
			const startDate = parseDate(startStr, format)
			const endDate = parseDate(endStr, format)

			// Mettre à jour les dates temporaires
			firstDate.value = startDate
			secondDate.value = endDate

			// Déterminer si nous sommes en train d'éditer la deuxième date
			isEditingSecondDate.value = !!startDate && startStr.length >= format.length

			// Formater correctement la valeur
			const formattedStart = startDate ? formatDate(startDate, format) : startStr
			const formattedValue = `${formattedStart}${rangeSeparator}${endStr}`

			return {
				formattedValue,
				dates: [startDate, endDate],
				isComplete: !!startDate && !!endDate,
			}
		}

		// Si nous sommes déjà en train d'éditer la deuxième date
		// (ce cas ne devrait pas arriver souvent car la valeur devrait contenir un séparateur)
		if (isEditingSecondDate.value && firstDate.value) {
			// Formater la valeur pour afficher la première date + séparateur + nouvelle valeur
			const formattedValue = `${formatDate(firstDate.value, format)}${rangeSeparator}${newValue}`
			const secondDateParsed = parseDate(newValue, format)
			secondDate.value = secondDateParsed

			return {
				formattedValue,
				dates: [firstDate.value, secondDateParsed],
				isComplete: !!firstDate.value && !!secondDateParsed,
			}
		}

		// Si nous éditons la première date
		const date = parseDate(newValue, format)
		firstDate.value = date

		// Si la première date est complète, passer à la saisie de la deuxième date
		if (date && newValue.length >= format.length) {
			isEditingSecondDate.value = true
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
			formattedValue: newValue,
			dates: [date, null],
			isComplete: false,
		}
	}

	/**
	 * Initialise l'état du composable avec des valeurs existantes
	 */
	const initializeWithDates = (startDate: Date | null, endDate: Date | null) => {
		firstDate.value = startDate
		secondDate.value = endDate
		isEditingSecondDate.value = !!startDate && !!endDate
	}

	/**
	 * Réinitialise l'état du composable
	 */
	const resetState = () => {
		firstDate.value = null
		secondDate.value = null
		isEditingSecondDate.value = false
	}

	/**
	 * Vérifie si une plage de dates est valide (la date de début est antérieure à la date de fin)
	 */
	const isValidRange = (startDate: Date | null, endDate: Date | null): boolean => {
		if (!startDate || !endDate) return true
		return startDate.getTime() <= endDate.getTime()
	}

	/**
	 * Vérifie si la plage actuelle est valide
	 */
	const currentRangeIsValid = computed(() => {
		return isValidRange(firstDate.value, secondDate.value)
	})

	return {
		isEditingSecondDate,
		firstDate,
		secondDate,
		rangeSeparator,
		hasRangeSeparator,
		extractRangeParts,
		formatRangeForDisplay,
		parseRangeInput,
		handleRangeInput,
		initializeWithDates,
		resetState,
		isValidRange,
		currentRangeIsValid,
	}
}
