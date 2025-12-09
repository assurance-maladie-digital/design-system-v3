import { type Ref, type ComponentPublicInstance } from 'vue'
import type { DateObjectValue } from '../types'
import { useDateInputEditing } from './useDateInputEditing'
import { useDateRangeInput } from './useDateRangeInput'

export interface InputHandlerOptions {
	// Configuration
	format: string
	displayRange: boolean
	dateFormatReturn?: string
	disableErrorHandling?: boolean

	// Fonctions externes
	parseDate: (dateStr: string, format: string) => Date | null
	formatDate: (date: Date, format: string) => string
	generateDateRange: (startDate: Date, endDate: Date) => Date[]
	isDateComplete: (value: string) => boolean

	// Références réactives
	displayFormattedDate: Ref<string>
	selectedDates: Ref<DateObjectValue>
	isFormatting: Ref<boolean>
	isManualInputActive: Ref<boolean>
	isUpdatingFromInternal: Ref<boolean>

	// Fonctions de validation
	clearValidation: () => void
	validateField: (value: unknown, rules?: unknown[], warningRules?: unknown[]) => unknown

	// Fonctions d'émission
	updateModel: (value: unknown) => void
	emitInput: (value: string) => void

	// Référence à l'élément input
	inputRef: Ref<ComponentPublicInstance | null>
}

export function useInputHandler(options: InputHandlerOptions) {
	const {
		format,
		displayRange,
		dateFormatReturn,
		disableErrorHandling,
		parseDate,
		formatDate,
		generateDateRange,
		isDateComplete,
		displayFormattedDate,
		selectedDates,
		isFormatting,
		isManualInputActive,
		isUpdatingFromInternal,
		clearValidation,
		validateField,
		updateModel,
		emitInput,
		inputRef,
	} = options

	// Nous utilisons useDateRangeInput pour centraliser le parsing des plages,
	// tout en conservant ici la logique de saisie spécifique (caret, complétion, cas particuliers)

	// Utiliser le composable useDateInputEditing pour le formatage
	const dateInputEditing = useDateInputEditing({
		format,
		updateDisplayValue: (value) => {
			displayFormattedDate.value = value
			emitInput(value)
		},
	})

	const { parseRangeInput: parseRangeInputForSelectedDates } = useDateRangeInput(
		format,
		displayRange,
		parseDate,
		formatDate,
	)

	/**
   * Met à jour la position du curseur dans l'élément input
   */
	const updateCursorPosition = (inputElement: HTMLInputElement | null, position: number) => {
		if (!inputElement) return

		setTimeout(() => {
			if (inputElement) {
				const safePos = Math.min(position, inputElement.value.length)
				inputElement.setSelectionRange(safePos, safePos)
				inputElement.focus()
			}
		}, 0)
	}

	/**
   * Gère le cas spécial où la première date vient d'être complétée
   * et nous devons passer à la saisie de la seconde date
   */
	const handleFirstDateCompletion = (value: string): boolean => {
		// Ne traiter que si nous sommes en mode plage
		if (!displayRange) {
			return false
		}

		const previousValue = displayFormattedDate.value

		// Vérifier si la valeur contient déjà un séparateur de plage
		if (previousValue.includes(' - ') || value.includes(' - ')) {
			return false
		}

		// Vérifier si la date est complète
		if (!isDateComplete(value)) {
			return false
		}

		let date: Date | null = null

		if (value.charAt(value.length - 1) === '_') {
			date = parseDate(value.substring(0, value.length - 1), format)
		}
		else {
			date = parseDate(value, format)
		}

		if (date) {
			// Formater la date pour s'assurer qu'elle est correctement formatée
			const formattedDate = formatDate(date, format)

			// Ajouter le séparateur de plage
			const newValue = `${formattedDate} - `
			displayFormattedDate.value = newValue
			emitInput(newValue)

			// Mettre à jour les dates sélectionnées (première date remplie, seconde vide)
			selectedDates.value = [date, null]

			// Mettre à jour la position du curseur après le séparateur
			const inputElement = inputRef.value?.$el?.querySelector('input')

			// Positionner le curseur après le séparateur ' - '
			const cursorPosition = formattedDate.length + 3 // longueur de la date formatée + longueur du séparateur

			// Utiliser setTimeout pour s'assurer que le positionnement du curseur se fait après le rendu
			setTimeout(() => {
				updateCursorPosition(inputElement, cursorPosition)
			}, 0)

			return true
		}

		return false
	}

	/**
   * Gère le cas spécial où nous commençons à saisir la seconde date
   */
	const handleStartingSecondDate = (value: string): boolean => {
		const previousValue = displayFormattedDate.value

		// Vérifier si la valeur précédente contient déjà un séparateur de plage
		if (previousValue.includes(' - ')) {
			// Si la valeur précédente se termine par le séparateur, c'est qu'on commence à saisir la seconde date
			if (previousValue.endsWith(' - ') && value.length > previousValue.length) {
				// La nouvelle valeur doit commencer par la première partie + séparateur
				const firstPart = previousValue.substring(0, previousValue.length - 3) // Enlever ' - '
				const secondPart = value.substring(previousValue.length)

				// Formater la seconde partie avec le composable useDateInputEditing
				const { formatted, cursorPos: newPos } = dateInputEditing.formatDateInput(secondPart, secondPart.length)
				const newValue = `${firstPart} - ${formatted}`
				displayFormattedDate.value = newValue
				emitInput(newValue)

				// Mettre à jour les dates sélectionnées
				if (displayRange) {
					// Récupérer la première date
					const firstDate = parseDate(firstPart, format)
					// Essayer de parser la seconde date (peut être incomplète)
					const secondDate = parseDate(secondPart, format)
					// Mettre à jour les dates sélectionnées
					selectedDates.value = [firstDate, secondDate]
				}

				// Mettre à jour la position du curseur après le séparateur et la seconde partie formatée
				const inputElement = inputRef.value?.$el?.querySelector('input')
				// Calculer la position du curseur : longueur de la première partie + longueur du séparateur + nouvelle position du curseur dans la seconde partie
				const cursorPosition = firstPart.length + 3 + newPos
				updateCursorPosition(inputElement, cursorPosition)
				return true
			}

			// Si nous avons déjà une partie de la seconde date, continuer à éditer cette partie
			const parts = previousValue.split(' - ')
			if (parts.length === 2 && parts[1].length > 0) {
				// Vérifier si la nouvelle valeur contient la première partie et le séparateur
				if (value.startsWith(parts[0] + ' - ')) {
					// Extraire la nouvelle seconde partie
					const secondPart = value.substring((parts[0] + ' - ').length)

					// Formater la seconde partie avec le composable useDateInputEditing
					const secondPartCursorPos = value.length - (parts[0].length + 3)
					const { formatted, cursorPos: newPos } = dateInputEditing.formatDateInput(secondPart, secondPartCursorPos)

					// Créer la nouvelle valeur formatée
					const newValue = `${parts[0]} - ${formatted}`
					displayFormattedDate.value = newValue
					emitInput(newValue)

					// Mettre à jour les dates sélectionnées
					if (displayRange) {
						// Récupérer la première date
						const firstDate = parseDate(parts[0], format)
						// Essayer de parser la seconde date (peut être incomplète)
						const secondDate = parseDate(secondPart, format)
						// Mettre à jour les dates sélectionnées
						selectedDates.value = [firstDate, secondDate]
					}

					// Mettre à jour la position du curseur après le séparateur et la seconde partie formatée
					const inputElement = inputRef.value?.$el?.querySelector('input')
					// Calculer la position du curseur : longueur de la première partie + longueur du séparateur + nouvelle position du curseur dans la seconde partie
					const cursorPosition = parts[0].length + 3 + newPos
					updateCursorPosition(inputElement, cursorPosition)
					return true
				}
			}
		}
		return false
	}

	/**
   * Formate une plage de dates pendant la saisie
   */
	const formatRangeInput = (value: string, cursorPos: number): { formattedInput: string, newCursorPos: number } => {
		let formattedInput = value
		let newCursorPos = cursorPos

		// Si la valeur contient déjà un séparateur de plage
		if (value.includes(' - ')) {
			const parts = value.split(' - ')
			if (parts.length === 2) {
				// Déterminer quelle partie est en cours d'édition
				const firstPartLength = parts[0].length
				const separatorLength = 3 // ' - '

				if (cursorPos <= firstPartLength) {
					// Édition de la première partie
					const { formatted, cursorPos: newPos } = dateInputEditing.formatDateInput(parts[0], cursorPos)
					formattedInput = `${formatted} - ${parts[1]}`
					newCursorPos = newPos
				}
				else {
					// Édition de la seconde partie
					const secondPartCursorPos = cursorPos - (firstPartLength + separatorLength)
					const { formatted, cursorPos: newPos } = dateInputEditing.formatDateInput(parts[1], secondPartCursorPos)
					formattedInput = `${parts[0]} - ${formatted}`
					newCursorPos = newPos + (firstPartLength + separatorLength)
				}
			}
		}
		else {
			// Pas de séparateur, formater normalement
			const { formatted, cursorPos: newPos } = dateInputEditing.formatDateInput(value, cursorPos)
			formattedInput = formatted
			newCursorPos = newPos
		}
		return { formattedInput, newCursorPos }
	}

	/**
	 * Met à jour les dates sélectionnées à partir d'une valeur formatée
	 */
	const updateSelectedDatesFromFormattedValue = (formattedInput: string) => {
		if (displayRange) {
			const [startDate, endDate] = parseRangeInputForSelectedDates(formattedInput)
			if (startDate && endDate) {
				selectedDates.value = [startDate, endDate]
			}
			else if (startDate) {
				selectedDates.value = [startDate, null]
			}
			else {
				selectedDates.value = null
			}
		}
		else {
			const date = parseDate(formattedInput, format)
			selectedDates.value = date
		}
	}

	/**
	 * Met à jour le modèle à partir des dates sélectionnées
	 */
	const updateModelFromSelectedDates = () => {
		try {
			isUpdatingFromInternal.value = true

			const currentDates = Array.isArray(selectedDates.value)
				? selectedDates.value
				: (selectedDates.value ? [selectedDates.value] : [])

			if (displayRange && currentDates.length >= 2 && currentDates[0] && currentDates[1]) {
				// Générer toutes les dates entre les deux dates
				const allDates = generateDateRange(currentDates[0], currentDates[1])
				selectedDates.value = allDates

				// Formater les dates pour le modèle
				const returnFormat = dateFormatReturn || format
				const modelValue = [
					formatDate(currentDates[0], returnFormat),
					formatDate(currentDates[1], returnFormat),
				] as [string, string]

				updateModel(modelValue)

				// Valider les règles personnalisées si la saisie est complète
				if (!disableErrorHandling && displayFormattedDate.value && isDateComplete(displayFormattedDate.value)) {
					validateField(currentDates[0])
					validateField(currentDates[1])
				}
			}
			else if (currentDates.length > 0 && currentDates[0]) {
				const returnFormat = dateFormatReturn || format
				const modelValue = formatDate(currentDates[0], returnFormat)
				updateModel(modelValue)

				// Valider les règles personnalisées si la saisie est complète
				if (!disableErrorHandling && displayFormattedDate.value && isDateComplete(displayFormattedDate.value)) {
					validateField(currentDates[0])
				}
			}
			else {
				updateModel(null)
			}
		}
		finally {
			isUpdatingFromInternal.value = false
		}
	}

	/**
   * Gère l'entrée utilisateur en mode plage de dates
   */
	const handleRangeInput = (event: Event) => {
		const input = event.target as HTMLInputElement
		const cursorPos = input.selectionStart || 0
		const value = input.value

		// Cas spéciaux pour la gestion des plages
		if (handleFirstDateCompletion(value)) return
		if (handleStartingSecondDate(value)) return

		// Traitement normal pour les autres cas
		const { formattedInput, newCursorPos } = formatRangeInput(value, cursorPos)

		// Mettre à jour la valeur affichée
		displayFormattedDate.value = formattedInput
		emitInput(formattedInput)

		// Mettre à jour les dates sélectionnées
		updateSelectedDatesFromFormattedValue(formattedInput)

		// Mettre à jour la position du curseur
		const inputElement = inputRef.value?.$el?.querySelector('input')
		updateCursorPosition(inputElement, newCursorPos)

		// Réinitialiser les messages d'erreur
		clearValidation()

		// Mettre à jour le modèle en fonction des dates sélectionnées
		const currentDates = Array.isArray(selectedDates.value)
			? selectedDates.value
			: (selectedDates.value ? [selectedDates.value] : [])

		if (displayRange && currentDates.length >= 2 && currentDates[0] && currentDates[1]) {
			updateModelFromSelectedDates()
		}
	}

	/**
   * Gère l'entrée utilisateur en mode date simple
   */
	const handleSingleDateInput = (event: Event) => {
		const input = event.target as HTMLInputElement
		const cursorPos = input.selectionStart || 0
		const value = input.value

		// Utiliser le composable useDateInputEditing pour formater la date
		const { formatted, cursorPos: newPos } = dateInputEditing.formatDateInput(value, cursorPos)

		// Mettre à jour la valeur affichée
		displayFormattedDate.value = formatted
		emitInput(formatted)

		// Mettre à jour les dates sélectionnées
		const date = parseDate(formatted, format)
		selectedDates.value = date

		// Mettre à jour la position du curseur
		const inputElement = inputRef.value?.$el?.querySelector('input')
		updateCursorPosition(inputElement, newPos)

		// Réinitialiser les messages d'erreur
		clearValidation()

		// Mettre à jour le modèle si la date est complète
		if (date && isDateComplete(formatted)) {
			updateModelFromSelectedDates()
		}
	}

	/**
   * Fonction principale pour gérer l'entrée utilisateur
   */
	const handleInput = (event: Event) => {
		if (isFormatting.value) return
		if (!isManualInputActive.value) return

		try {
			isFormatting.value = true

			if (displayRange) {
				handleRangeInput(event)
			}
			else {
				handleSingleDateInput(event)
			}
		}
		finally {
			isFormatting.value = false
		}
	}

	return {
		handleInput,
		updateModelFromSelectedDates,
		updateCursorPosition,
		formatRangeInput,
		updateSelectedDatesFromFormattedValue,
	}
}
