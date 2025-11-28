import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { extractRangeParts as extractRangePartsUtil, hasRangeSeparator as hasRangeSeparatorUtil, isValidDateRange } from '../utils/dateFormattingUtils'

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
		return hasRangeSeparatorUtil(value, rangeSeparator)
	}

	/**
	 * Extrait les deux parties d'une plage de dates
	 */
	const extractRangeParts = (value: string): [string, string] => {
		return extractRangePartsUtil(value, rangeSeparator)
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
		// S'assurer que inputValue et newValue sont des chaînes de caractères
		const safeInputValue = typeof inputValue === 'string' ? inputValue : ''
		const safeNewValue = typeof newValue === 'string' ? newValue : ''
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

		// Cas spécial : si la valeur précédente se terminait par un séparateur et que la nouvelle valeur
		// contient du texte après le séparateur, c'est qu'on commence à saisir la seconde date
		if (safeInputValue && safeInputValue.endsWith(rangeSeparator)
			&& safeNewValue.startsWith(safeInputValue)
			&& safeNewValue.length > safeInputValue.length) {
			// On est en train de saisir la seconde date pour la première fois
			isEditingSecondDate.value = true

			// Extraire la première date et le nouveau caractère saisi
			const firstPart = safeInputValue.substring(0, safeInputValue.length - rangeSeparator.length)
			const firstDateObj = parseDate(firstPart, format)
			firstDate.value = firstDateObj

			// Extraire le caractère nouvellement saisi (après le séparateur)
			const secondPart = safeNewValue.substring(safeInputValue.length)
			secondDate.value = parseDate(secondPart, format)

			return {
				formattedValue: `${firstPart}${rangeSeparator}${secondPart}`,
				dates: [firstDateObj, secondDate.value],
				isComplete: false,
				cursorPosition: safeNewValue.length,
			}
		}

		// Si la valeur contient déjà un séparateur de plage
		if (hasRangeSeparator(safeNewValue)) {
			const [startStr, endStr] = extractRangeParts(safeNewValue)
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

		// Si nous sommes déjà en train d'éditer la deuxième date
		// (ce cas ne devrait pas arriver souvent car la valeur devrait contenir un séparateur)
		if (isEditingSecondDate.value && firstDate.value) {
			// Formater la valeur pour afficher la première date + séparateur + nouvelle valeur
			const formattedValue = `${formatDate(firstDate.value, format)}${rangeSeparator}${typeof newValue === 'string' ? newValue : ''}`
			const secondDateParsed = parseDate(typeof newValue === 'string' ? newValue : '', format)
			secondDate.value = secondDateParsed

			return {
				formattedValue,
				dates: [firstDate.value, secondDateParsed],
				isComplete: !!firstDate.value && !!secondDateParsed,
				cursorPosition: cursorPosition !== undefined ? formatDate(firstDate.value, format).length + rangeSeparator.length + Math.min(cursorPosition, typeof newValue === 'string' ? newValue.length : 0) : undefined,
			}
		}

		// Si nous éditons la première date
		const date = parseDate(typeof newValue === 'string' ? newValue : '', format)
		firstDate.value = date

		// Si la première date est complète, passer à la saisie de la deuxième date
		if (date && typeof newValue === 'string' && newValue.length >= format.length) {
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
			formattedValue: safeNewValue,
			dates: [date, null],
			isComplete: false,
			cursorPosition: cursorPosition,
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
		return isValidDateRange(startDate, endDate)
	}

	/**
	 * Vérifie si la plage actuelle est valide
	 */
	const currentRangeIsValid = computed(() => {
		return isValidRange(firstDate.value, secondDate.value)
	})

	/**
	 * Gère l'événement keydown pour filtrer les caractères non numériques
	 *
	 * @param event - Événement keydown
	 */
	const handleKeydown = (event: KeyboardEvent & { target: HTMLInputElement }): void => {
		// Bloquer la saisie de caractères non numériques
		// Autoriser uniquement : chiffres, touches de navigation, touches de modification et touches de contrôle
		if (
			// Si la touche n'est pas un chiffre
			!/^\d$/.test(event.key)
			// Et n'est pas une touche spéciale autorisée
			&& ![
				'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
				'Home', 'End', 'Tab', 'Escape', 'Enter',
				'Control', 'Alt', 'Shift', 'Meta',
			].includes(event.key)
			// Et n'est pas une combinaison de touches (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
			&& !(event.ctrlKey || event.metaKey)
		) {
			// Empêcher la saisie de caractères non numériques
			event.preventDefault()
			return
		}

		// Gérer les touches spéciales pour le mode plage
		if (isRangeMode) {
			// Gérer la suppression des séparateurs de plage
			if (event.key === 'Backspace') {
				const input = event.target
				if (!input.selectionStart || input.selectionStart !== input.selectionEnd) {
					return
				}

				const cursorPos = input.selectionStart

				// Si on est juste après un séparateur de plage
				if (cursorPos >= rangeSeparator.length
					&& input.value.substring(cursorPos - rangeSeparator.length, cursorPos) === rangeSeparator) {
					// Empêcher le comportement par défaut
					event.preventDefault()

					// Supprimer le séparateur complet
					const newValue = input.value.substring(0, cursorPos - rangeSeparator.length)
						+ input.value.substring(cursorPos)

					// Mettre à jour la valeur (via l'événement input)
					const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true, data: newValue })
					Object.defineProperty(inputEvent, 'target', { value: input, enumerable: true })
					input.value = newValue
					input.dispatchEvent(inputEvent)

					// Positionner le curseur
					setTimeout(() => {
						const newCursorPos = cursorPos - rangeSeparator.length
						input.setSelectionRange(newCursorPos, newCursorPos)
					}, 0)
				}
			}
		}
	}

	/**
	 * Gère l'événement paste pour filtrer les caractères non numériques
	 *
	 * @param event - Événement paste
	 */
	const handlePaste = (event: ClipboardEvent): void => {
		// Récupérer le contenu du presse-papiers
		const clipboardData = event.clipboardData
		if (!clipboardData) return

		// Extraire le texte
		const pastedText = clipboardData.getData('text')

		// Filtrer pour ne garder que les chiffres
		const cleanedText = pastedText.replace(/[^0-9]/g, '')

		// Si le texte collé ne contient pas de chiffres, annuler l'opération
		if (cleanedText.length === 0) {
			event.preventDefault()
			return
		}

		// Si le texte a été modifié (des caractères non numériques ont été supprimés)
		if (cleanedText !== pastedText) {
			event.preventDefault()

			// Insérer manuellement le texte nettoyé
			const input = event.target as HTMLInputElement
			if (!input) return

			const start = input.selectionStart || 0
			const end = input.selectionEnd || 0

			// Construire la nouvelle valeur
			const newValue = input.value.substring(0, start) + cleanedText + input.value.substring(end)

			// Mettre à jour la valeur (via l'événement input)
			const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true, data: newValue })
			Object.defineProperty(inputEvent, 'target', { value: input, enumerable: true })
			input.value = newValue
			input.dispatchEvent(inputEvent)

			// Positionner le curseur après le texte collé
			setTimeout(() => {
				const newCursorPos = start + cleanedText.length
				input.setSelectionRange(newCursorPos, newCursorPos)
			}, 0)
		}
	}

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
		handleKeydown,
		handlePaste,
	}
}
