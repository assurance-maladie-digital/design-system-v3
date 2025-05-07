// Pas besoin d'importer Ref car il n'est pas utilisé

/**
 * Options pour le composable useDateInputEditing
 */
export interface DateInputEditingOptions {
	// Format de date (ex: 'DD/MM/YYYY')
	format: string
	// Fonction pour mettre à jour la valeur d'affichage
	updateDisplayValue: (value: string) => void
	// Fonction pour mettre à jour l'attribut aria-label (pour l'accessibilité)
	updateAriaLabel?: (value: string) => void
	// Caractère à utiliser pour les positions non remplies (défaut: '_')
	placeholderChar?: string
	// Si true, utilise des caractères invisibles pour les lecteurs d'écran
	accessiblePlaceholders?: boolean
}

/**
 * Résultat du formatage d'une date
 */
export interface FormatDateInputResult {
	// Valeur formatée
	formatted: string
	// Position du curseur après formatage
	cursorPos: number
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
	 * Formate une entrée de date en ajoutant les séparateurs appropriés
	 *
	 * @param input - Chaîne de caractères saisie
	 * @param cursorPosition - Position actuelle du curseur
	 * @returns Objet contenant la chaîne formatée et la nouvelle position du curseur
	 */
	const formatDateInput = (input: string, cursorPosition?: number): FormatDateInputResult => {
		// Nettoyer l'entrée pour ne garder que les chiffres
		let cleanedInput = input.replace(/[^\d]/g, '')

		// Déterminer le séparateur utilisé dans le format
		const separator = format.match(/[^DMY]/)?.[0] || '/'

		// Calculer la position du curseur dans l'entrée nettoyée (sans séparateurs)
		const inputBeforeCursor = input.substring(0, cursorPosition || 0)
		const digitsBeforeCursor = inputBeforeCursor.replace(/[^\d]/g, '').length

		// Extraire les groupes de chiffres du format (DD, MM, YYYY)
		const digitGroups: string[] = []
		let currentGroup = ''

		for (const char of format) {
			if (['D', 'M', 'Y'].includes(char.toUpperCase())) {
				currentGroup += char
			}
			else if (currentGroup) {
				digitGroups.push(currentGroup)
				currentGroup = ''
			}
		}

		// Ajouter le dernier groupe s'il existe
		if (currentGroup) {
			digitGroups.push(currentGroup)
		}

		// Calculer le nombre total de chiffres attendus dans le format
		const expectedDigits = format.replace(/[^DMY]/g, '').length

		// Limiter le nombre de chiffres saisis au nombre attendu
		if (cleanedInput.length > expectedDigits) {
			cleanedInput = cleanedInput.substring(0, expectedDigits)
		}

		// Construire la chaîne formatée
		let result = ''
		let digitIndex = 0

		// Parcourir les groupes de chiffres pour construire la date formatée
		for (let groupIndex = 0; groupIndex < digitGroups.length; groupIndex++) {
			const group = digitGroups[groupIndex]
			const groupLength = group.length

			// Ajouter les chiffres pour ce groupe
			for (let j = 0; j < groupLength; j++) {
				if (digitIndex < cleanedInput.length) {
					result += cleanedInput[digitIndex]
					digitIndex++
				}
				else {
					// Utiliser le caractère de placeholder configuré pour les positions non remplies
					result += placeholderChar
				}
			}

			// Ajouter le séparateur après chaque groupe sauf le dernier
			if (groupIndex < digitGroups.length - 1) {
				result += separator
			}
		}

		// Calculer la nouvelle position du curseur
		let newCursorPos = 0
		let digitCount = 0

		// Parcourir le résultat formaté pour trouver la position du curseur
		for (let i = 0; i < result.length && digitCount < digitsBeforeCursor; i++) {
			newCursorPos++
			if (/\d/.test(result[i])) {
				digitCount++
			}
		}

		return {
			formatted: result,
			cursorPos: Math.min(newCursorPos, result.length),
		}
	}

	/**
	 * Gère l'événement keydown pour les touches spéciales
	 *
	 * @param event - Événement keydown
	 */
	const handleKeydown = (event: KeyboardEvent & { target: HTMLInputElement }): void => {
		// Gérer la suppression des séparateurs
		if (event.key === 'Backspace') {
			const input = event.target
			if (!input.selectionStart || input.selectionStart !== input.selectionEnd) {
				return
			}

			const cursorPos = input.selectionStart
			const charBeforeCursor = input.value[cursorPos - 1]

			if (!/\d/.test(charBeforeCursor)) {
				// Si le caractère avant le curseur n'est pas un chiffre, on le supprime aussi
				// et on supprime le chiffre avant le séparateur
				event.preventDefault() // Empêcher le comportement par défaut

				const newValue = input.value.substring(0, cursorPos - 2)
					+ input.value.substring(cursorPos)

				// Mettre à jour la valeur
				updateDisplayValue(newValue)

				// Positionner le curseur après un court délai
				setTimeout(() => {
					const newCursorPos = cursorPos - 2
					input.setSelectionRange(newCursorPos, newCursorPos)
				}, 0)
			}
		}

		// Gérer les touches de direction pour éviter de se retrouver entre un séparateur et un chiffre
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			const input = event.target
			const cursorPos = input.selectionStart || 0

			// Déterminer le séparateur utilisé dans le format
			const separator = format.match(/[^DMY]/)?.[0] || '/'

			if (event.key === 'ArrowLeft' && cursorPos > 0) {
				const charBeforeCursor = input.value[cursorPos - 1]

				if (charBeforeCursor === separator) {
					// Si on se déplace à gauche et qu'on rencontre un séparateur, sauter par-dessus
					event.preventDefault()
					input.setSelectionRange(cursorPos - 2, cursorPos - 2)
				}
			}
			else if (event.key === 'ArrowRight' && cursorPos < input.value.length) {
				const charAtCursor = input.value[cursorPos]

				if (charAtCursor === separator) {
					// Si on se déplace à droite et qu'on rencontre un séparateur, sauter par-dessus
					event.preventDefault()
					input.setSelectionRange(cursorPos + 2, cursorPos + 2)
				}
			}
		}
	}

	/**
	 * Gère l'événement paste pour formater correctement les dates collées
	 *
	 * @param event - Événement paste
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
			const dateDescription = getDateDescription(accessibleValue, format)
			updateAriaLabel(dateDescription)
		}

		// Positionner le curseur après un court délai
		setTimeout(() => {
			input.setSelectionRange(newCursorPos, newCursorPos)
		}, 0)
	}

	/**
	 * Crée une description accessible de la date pour les lecteurs d'écran
	 *
	 * @param dateStr - La chaîne de date à décrire
	 * @param format - Le format de la date
	 * @returns Une description de la date adaptée aux lecteurs d'écran
	 */
	const getDateDescription = (dateStr: string, format: string): string => {
		// Si la chaîne est vide, retourner un message simple
		if (!dateStr.trim()) {
			return 'Aucune date saisie'
		}

		// Déterminer le séparateur utilisé dans le format
		const separator = format.match(/[^DMY]/)?.[0] || '/'

		// Extraire les parties de la date
		const dateParts = dateStr.split(separator)
		const formatParts = format.split(separator)

		// Créer une description en fonction du format
		let description = 'Date en cours de saisie: '

		for (let i = 0; i < formatParts.length; i++) {
			if (i >= dateParts.length) break

			const part = dateParts[i].trim()
			const formatPart = formatParts[i].charAt(0).toUpperCase()

			// Ignorer les parties vides ou contenant uniquement des placeholders
			if (!part || part.replace(new RegExp(placeholderChar, 'g'), '').length === 0) {
				continue
			}

			switch (formatPart) {
				case 'D':
					description += `jour ${part}, `
					break
				case 'M':
					description += `mois ${part}, `
					break
				case 'Y':
					description += `année ${part}, `
					break
			}
		}

		// Supprimer la virgule finale si elle existe
		return description.endsWith(', ')
			? description.slice(0, -2)
			: description
	}

	return {
		formatDateInput,
		handleKeydown,
		handlePaste,
		getDateDescription,
	}
}
