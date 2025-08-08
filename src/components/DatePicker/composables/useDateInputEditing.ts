import { useKeyboardEvents } from './useKeyboardEvents'
import {
	formatDateInput as formatDateInputUtil,
	getDateDescription as getDateDescriptionUtil,
	type FormatDateInputResult,
} from '../utils/dateFormattingUtils'

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
   * Gère la suppression des séparateurs
   */
	const handleBackspace = (event: KeyboardEvent & { target: HTMLInputElement }): void => {
		const input = event.target
		if (!input.selectionStart || input.selectionStart !== input.selectionEnd) {
			return
		}

		const cursorPos = input.selectionStart
		const charBeforeCursor = input.value[cursorPos - 1]

		// Si le caractère avant le curseur n'est pas un chiffre
		if (!/\d/.test(charBeforeCursor)) {
			event.preventDefault()

			const newValue = input.value.substring(0, cursorPos - 2) + input.value.substring(cursorPos)
			updateDisplayValue(newValue)

			// Positionner le curseur après un court délai
			setTimeout(() => {
				const newCursorPos = cursorPos - 2
				input.setSelectionRange(newCursorPos, newCursorPos)
			}, 0)
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
			// Handle arrow key navigation around separators
			const input = event.target
			const cursorPos = input.selectionStart || 0

			if (event.key === 'ArrowLeft' && cursorPos > 0) {
				const charBeforeCursor = input.value[cursorPos - 1]

				if (charBeforeCursor === separator) {
					event.preventDefault()
					input.setSelectionRange(cursorPos - 2, cursorPos - 2)
				}
			}
			else if (event.key === 'ArrowRight' && cursorPos < input.value.length) {
				const charAtCursor = input.value[cursorPos]

				if (charAtCursor === separator) {
					event.preventDefault()
					input.setSelectionRange(cursorPos + 2, cursorPos + 2)
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

		// Empêcher le comportement par défaut
		event.preventDefault()

		// Récupérer l'élément input
		const input = event.target as HTMLInputElement
		const cursorPos = input.selectionStart || 0

		// Récupérer la valeur actuelle
		const currentValue = input.value

		// Insérer le texte collé à la position du curseur
		const newValue = currentValue.substring(0, cursorPos)
			+ pastedText
			+ currentValue.substring(input.selectionEnd || cursorPos)

		// Formater la nouvelle valeur
		const { formatted, cursorPos: newCursorPos } = formatDateInput(newValue, cursorPos + pastedText.length)

		// Mettre à jour la valeur
		updateDisplayValue(formatted)

		// Mettre à jour l'aria-label si la fonction est fournie
		if (updateAriaLabel && accessiblePlaceholders) {
			// Créer une version accessible pour les lecteurs d'écran (sans les caractères de placeholder)
			const accessibleValue = formatted.replace(new RegExp(placeholderChar, 'g'), ' ')

			// Créer un message descriptif pour le lecteur d'écran
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
	}
}
