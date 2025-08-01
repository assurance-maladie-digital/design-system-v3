/**
 * Composable pour centraliser la gestion des événements clavier
 * Utilisé dans les différents composants de saisie de date
 */

/**
 * Options pour la gestion des événements clavier
 */
export interface KeyboardEventsOptions {
	/**
   * Expression régulière pour les caractères autorisés
   * Par défaut, seuls les chiffres sont autorisés
   */
	allowedCharacters?: RegExp
	/**
   * Fonction à appeler lors d'un appui sur une touche
   * Appelée après la validation des caractères
   */
	onKeyDown?: (event: KeyboardEvent & { target: HTMLInputElement }) => void
	/**
   * Séparateur utilisé dans le format de date
   * Utilisé pour gérer les touches de navigation
   */
	separator?: string
}

/**
 * Composable pour gérer les événements clavier communs aux champs de date
 *
 * @param options - Options de configuration
 * @returns Fonctions pour gérer les événements clavier
 */
export const useKeyboardEvents = (options: KeyboardEventsOptions = {}) => {
	const {
		allowedCharacters = /^\d$/,
		onKeyDown,
		separator = '/',
	} = options

	/**
   * Liste des touches spéciales toujours autorisées
   */
	const SPECIAL_KEYS = [
		'Backspace', 'Delete',
		'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
		'Home', 'End', 'Tab', 'Escape', 'Enter',
		'Control', 'Alt', 'Shift', 'Meta',
	]

	/**
   * Traite les événements keydown en filtrant les caractères non autorisés
   */
	const handleKeyDown = (event: KeyboardEvent & { target: HTMLInputElement }): void => {
		// Autoriser uniquement : caractères autorisés, touches spéciales et combinaisons de touches
		if (
			!allowedCharacters.test(event.key)
			&& !SPECIAL_KEYS.includes(event.key)
			&& !(event.ctrlKey || event.metaKey)
		) {
			event.preventDefault()
			return
		}

		// Appeler le gestionnaire personnalisé s'il existe
		if (onKeyDown) {
			onKeyDown(event)
		}
	}

	/**
   * Gère la navigation autour des séparateurs
   * Évite que le curseur se positionne entre un chiffre et un séparateur
   */
	const handleArrowKeys = (event: KeyboardEvent & { target: HTMLInputElement }): void => {
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

	/**
   * Gère les événements paste pour filtrer les caractères non autorisés
   */
	const handlePaste = (event: ClipboardEvent): void => {
		if (!event.clipboardData) return

		const pastedText = event.clipboardData.getData('text')
		if (!pastedText) return

		// Filtrer pour ne garder que les caractères autorisés
		const filteredText = pastedText
			.split('')
			.filter(char => allowedCharacters.test(char))
			.join('')

		// Si le texte collé ne contient pas de caractères autorisés, annuler l'opération
		if (filteredText.length === 0) {
			event.preventDefault()
			return
		}

		// Si le texte a été modifié (des caractères non autorisés ont été supprimés)
		if (filteredText !== pastedText) {
			event.preventDefault()

			const input = event.target as HTMLInputElement
			if (!input) return

			const start = input.selectionStart || 0
			const end = input.selectionEnd || 0

			// Construire la nouvelle valeur
			const newValue = input.value.substring(0, start) + filteredText + input.value.substring(end)

			// Mettre à jour la valeur (via l'événement input)
			const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true, data: newValue })
			Object.defineProperty(inputEvent, 'target', { value: input, enumerable: true })
			input.value = newValue
			input.dispatchEvent(inputEvent)

			// Positionner le curseur après le texte collé
			setTimeout(() => {
				const newCursorPos = start + filteredText.length
				input.setSelectionRange(newCursorPos, newCursorPos)
			}, 0)
		}
	}

	return {
		handleKeyDown,
		handleArrowKeys,
		handlePaste,
	}
}
