import { useKeyboardEvents } from './useKeyboardEvents'
import {
	formatDateInput as formatDateInputUtil,
	getDateDescription as getDateDescriptionUtil,
	type FormatDateInputResult,
} from '../utils/dateFormattingUtils'
import { ref } from 'vue'

/**
 * Options pour le composable useDateInputEditing
 */
export interface DateInputEditingOptions {
	/**
   * Format de date (ex: 'DD/MM/YYYY')
   */
	format: string
	/**
   * Fonction pour mettre à jour la valeur d'affichage
   */
	updateDisplayValue: (value: string) => void
	/**
   * Fonction pour mettre à jour l'attribut aria-label (pour l'accessibilité)
   */
	updateAriaLabel?: (value: string) => void
	/**
   * Caractère à utiliser pour les positions non remplies
   */
	placeholderChar?: string
	/**
   * Si true, utilise des caractères invisibles pour les lecteurs d'écran
   */
	accessiblePlaceholders?: boolean
}

/**
 * Composable pour gérer l'édition manuelle des dates
 * Ce composable fournit des fonctions pour formater les dates pendant la saisie
 * et gérer les touches spéciales comme Backspace et les flèches
 *
 * @param options - Options de configuration
 * @returns Fonctions pour gérer l'édition manuelle des dates
 */
export const useDateInputEditing = (options: DateInputEditingOptions) => {
	const {
		format,
		updateDisplayValue,
		updateAriaLabel,
		placeholderChar = '_',
		accessiblePlaceholders = true,
	} = options

	// Flag to prevent competing cursor position updates
	const isHandlingBackspace = ref(false)

	/**
   * Détermine le séparateur utilisé dans le format
   */
	const separator = format.match(/[^DMY]/)?.[0] || '/'

	/**
   * Wrapper pour formatDateInput avec les options prédéfinies
   */
	const formatDateInput = (input: string, cursorPosition?: number): FormatDateInputResult => {
		return formatDateInputUtil(input, format, {
			cursorPosition,
			placeholderChar,
		})
	}

	/**
   * Gère la suppression des caractères avec la touche Backspace
   */
	const handleBackspace = (event: KeyboardEvent & { target: HTMLInputElement }): void => {
		const input = event.target
		if (!input.selectionStart || input.selectionStart !== input.selectionEnd) {
			return
		}

		const cursorPos = input.selectionStart
		const charBeforeCursor = input.value[cursorPos - 1]

		// Si on est sur un séparateur, supprimer le séparateur et le chiffre qui le précède
		if (!/\d/.test(charBeforeCursor) && cursorPos > 1 && separator === charBeforeCursor) {
			event.preventDefault()
			isHandlingBackspace.value = true

			const newValue = input.value.substring(0, cursorPos - 2) + input.value.substring(cursorPos)
			updateDisplayValue(newValue)

			setTimeout(() => {
				const newCursorPos = cursorPos - 2
				input.setSelectionRange(newCursorPos, newCursorPos)
				isHandlingBackspace.value = false
			}, 0)
		}
		// Si on supprime un chiffre
		else if (cursorPos > 0 && /[\d_]/.test(charBeforeCursor)) {
			// Laisser le comportement par défaut se produire (suppression simple)
			// et empêcher tout reformatage supplémentaire
			isHandlingBackspace.value = true

			// Réinitialiser le flag après un court délai
			setTimeout(() => {
				isHandlingBackspace.value = false
			}, 50)
		}
	}

	/**
   * Gestionnaire d'événement keydown personnalisé
   */
	const onSpecialKeyDown = (event: KeyboardEvent & { target: HTMLInputElement }): void => {
		if (event.key === 'Backspace') {
			handleBackspace(event)
		}
		else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			const input = event.target
			const cursorPos = input.selectionStart || 0

			if (event.key === 'ArrowLeft' && cursorPos > 0) {
				const charBeforeCursor = input.value[cursorPos - 1]

				// Sauter par-dessus les séparateurs en naviguant vers la gauche
				if (!/\d/.test(charBeforeCursor)) {
					event.preventDefault()

					// Trouver la position du prochain chiffre à gauche
					let newPos = cursorPos - 1
					while (newPos > 0 && !/\d/.test(input.value[newPos - 1])) {
						newPos--
					}

					input.setSelectionRange(newPos, newPos)
				}
			}
			else if (event.key === 'ArrowRight' && cursorPos < input.value.length) {
				const charAtCursor = input.value[cursorPos]

				// Sauter par-dessus les séparateurs en naviguant vers la droite
				if (!/\d/.test(charAtCursor)) {
					event.preventDefault()

					// Trouver la position du prochain chiffre à droite
					let newPos = cursorPos + 1
					while (newPos < input.value.length && !/\d/.test(input.value[newPos])) {
						newPos++
					}

					input.setSelectionRange(newPos, newPos)
				}
			}
		}
	}

	// Utiliser le composable commun pour la gestion des événements clavier
	const keyboardEvents = useKeyboardEvents({
		allowedCharacters: /^\d$/,
		onKeyDown: onSpecialKeyDown,
		separator,
	})

	/**
   * Gère l'événement paste pour formater correctement les dates collées
   */
	const handlePaste = (event: ClipboardEvent): void => {
		if (!event.clipboardData) return

		const pastedText = event.clipboardData.getData('text')
		if (!pastedText) return

		event.preventDefault()

		const input = event.target as HTMLInputElement
		const cursorPos = input.selectionStart || 0
		const selectionEnd = input.selectionEnd || cursorPos

		const currentValue = input.value

		// Remplacer uniquement les caractères numériques pour le collage
		// Si nous sommes en mode édition d'une date existante
		const cleanedPastedText = pastedText.replace(/[^\d]/g, '')

		// Construire la nouvelle valeur en tenant compte d'une possible sélection
		const newValue = currentValue.substring(0, cursorPos)
			+ cleanedPastedText
			+ currentValue.substring(selectionEnd)

		// Formater la nouvelle valeur et calculer la nouvelle position du curseur
		const { formatted, cursorPos: newCursorPos } = formatDateInput(newValue, cursorPos + cleanedPastedText.length)

		updateDisplayValue(formatted)

		// Mettre à jour l'étiquette aria pour l'accessibilité
		if (updateAriaLabel && accessiblePlaceholders) {
			const accessibleValue = formatted.replace(new RegExp(placeholderChar, 'g'), ' ')
			const dateDescription = getDateDescription(accessibleValue)
			updateAriaLabel(dateDescription)
		}

		// Positionner le curseur après un court délai
		setTimeout(() => {
			input.setSelectionRange(newCursorPos, newCursorPos)
		}, 0)
	}

	/**
   * Wrapper pour getDateDescription avec les options prédéfinies
   */
	const getDateDescription = (dateStr: string): string => {
		return getDateDescriptionUtil(dateStr, format, placeholderChar)
	}

	return {
		formatDateInput,
		handleKeydown: keyboardEvents.handleKeyDown,
		handlePaste,
		getDateDescription,
		isHandlingBackspace, // Exporter le flag pour le composant parent
	}
}
