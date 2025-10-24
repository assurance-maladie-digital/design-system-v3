/**
 * Utilitaires de formatage de dates pour les composants DatePicker
 * Extrait et centralisé à partir des différents composables
 */

/**
 * Résultat du formatage d'une date
 */
export interface FormatDateInputResult {
	/**
   * Valeur formatée
   */
	formatted: string
	/**
   * Position du curseur après formatage
   */
	cursorPos: number
}

/**
 * Options pour le formatage d'une date
 */
export interface FormatDateOptions {
	/**
   * Position actuelle du curseur
   */
	cursorPosition?: number
	/**
   * Caractère à utiliser pour les positions non remplies
   */
	placeholderChar?: string
}

/**
 * Formate une entrée de date en ajoutant les séparateurs appropriés
 *
 * @param input - Chaîne de caractères saisie
 * @param format - Format de date (ex: 'DD/MM/YYYY')
 * @param options - Options de formatage
 * @returns Objet contenant la chaîne formatée et la nouvelle position du curseur
 */
export const formatDateInput = (
	input: string,
	format: string,
	options: FormatDateOptions = {},
): FormatDateInputResult => {
	const {
		cursorPosition,
		placeholderChar = '_',
	} = options

	// Handle completely empty input
	// if (!input || input.trim() === '') {
	// 	return {
	// 		formatted: '',
	// 		cursorPos: 0,
	// 	}
	// }

	// Créer une carte de correspondance entre les positions avant et après formatage
	const positionMap: number[] = []
	let cleanedIndex = 0

	// Pour chaque caractère dans l'entrée originale, noter sa position dans la chaîne nettoyée
	for (let i = 0; i < input.length; i++) {
		positionMap[i] = cleanedIndex
		if (/\d/.test(input[i])) {
			cleanedIndex++
		}
	}
	// Ajouter une entrée finale pour la position après le dernier caractère
	positionMap[input.length] = cleanedIndex

	// Nettoyer l'entrée pour ne garder que les chiffres
	let cleanedInput = input.replace(/[^\d]/g, '')

	// Déterminer le séparateur utilisé dans le format
	const separator = format.match(/[^DMY]/)?.[0] || '/'

	// Calculer la position du curseur dans l'entrée nettoyée (sans séparateurs)
	const adjustedCursorPosition = cursorPosition !== undefined ? cursorPosition : input.length
	const digitPositionInCleaned = positionMap[adjustedCursorPosition]

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

	// Calculate expected digits based on original format
	const originalExpectedDigits = digitGroups.join('').length

	// Expand 2-digit year to 4-digit for placeholder purposes only when input is incomplete
	const shouldExpandYear = cleanedInput.length < originalExpectedDigits
	const expandedDigitGroups = digitGroups.map((group) => {
		if (group.toUpperCase() === 'YY' && shouldExpandYear) {
			return 'YYYY'
		}
		return group
	})

	// Calculer le nombre total de chiffres attendus dans le format
	const expectedDigits = shouldExpandYear ? expandedDigitGroups.join('').length : originalExpectedDigits

	// Limiter le nombre de chiffres saisis au nombre attendu
	if (cleanedInput.length > expectedDigits) {
		cleanedInput = cleanedInput.substring(0, expectedDigits)
	}

	// Construire la chaîne formatée
	let result = ''
	let digitIndex = 0

	// Carte inverse pour suivre où chaque chiffre du résultat se retrouve dans la sortie formatée
	const resultPositionMap: number[] = []

	// Use the appropriate digit groups based on whether we're expanding
	const groupsToUse = shouldExpandYear ? expandedDigitGroups : digitGroups

	// Parcourir les groupes de chiffres pour construire la date formatée
	for (let groupIndex = 0; groupIndex < groupsToUse.length; groupIndex++) {
		const group = groupsToUse[groupIndex]
		const groupLength = group.length

		// Ajouter les chiffres pour ce groupe
		for (let j = 0; j < groupLength; j++) {
			if (digitIndex < cleanedInput.length) {
				resultPositionMap[digitIndex] = result.length
				result += cleanedInput[digitIndex]
				digitIndex++
			}
			else {
				// Utiliser le caractère de placeholder configuré pour les positions non remplies
				result += placeholderChar
			}
		}

		// Ajouter le séparateur après chaque groupe sauf le dernier
		if (groupIndex < groupsToUse.length - 1) {
			result += separator
		}
	}

	// Calculer la nouvelle position du curseur en tenant compte du contexte d'édition
	let newCursorPos

	if (cursorPosition === undefined) {
		// Si aucune position de curseur n'est fournie, placer à la fin
		newCursorPos = result.length
	}
	else {
		// Si la position du curseur est à l'intérieur des chiffres saisis
		if (digitPositionInCleaned <= cleanedInput.length) {
			// Rechercher la position correspondante dans le résultat formaté
			if (digitPositionInCleaned < cleanedInput.length) {
				// Le curseur est positionné sur un chiffre existant
				newCursorPos = resultPositionMap[digitPositionInCleaned]
			}
			else if (cleanedInput.length > 0) {
				// Le curseur est après le dernier chiffre saisi
				const lastDigitPos = resultPositionMap[cleanedInput.length - 1]
				// Positionner après le dernier chiffre saisi
				newCursorPos = lastDigitPos + 1
				// Si la position tombe sur un séparateur, avancer d'une position
				if (newCursorPos < result.length && result[newCursorPos] === separator) {
					newCursorPos++
				}
			}
			else {
				// Aucun chiffre saisi, placer au début
				newCursorPos = 0
			}
		}
		else {
			// Position au-delà de la longueur - cas rare
			newCursorPos = result.length
		}
	}

	return {
		formatted: result,
		cursorPos: Math.min(newCursorPos, result.length),
	}
}

/**
 * Crée une description accessible de la date pour les lecteurs d'écran
 *
 * @param dateStr - La chaîne de date à décrire
 * @param format - Le format de la date
 * @param placeholderChar - Caractère utilisé pour les positions vides
 * @returns Une description de la date adaptée aux lecteurs d'écran
 */
export const getDateDescription = (
	dateStr: string,
	format: string,
	placeholderChar = '_',
): string => {
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

/**
 * Extrait les deux parties d'une plage de dates
 *
 * @param value - Chaîne de caractères contenant une plage de dates
 * @param separator - Séparateur de plage (par défaut: ' - ')
 * @returns Tableau contenant les deux parties de la plage
 */
export const extractRangeParts = (value: string, separator = ' - '): [string, string] => {
	const parts = value.split(separator)
	return [
		parts[0]?.trim() || '',
		parts[1]?.trim() || '',
	]
}

/**
 * Vérifie si une chaîne de caractères contient un séparateur de plage
 *
 * @param value - Chaîne de caractères à vérifier
 * @param separator - Séparateur de plage (par défaut: ' - ')
 * @returns Booléen indiquant si la chaîne contient le séparateur
 */
export const hasRangeSeparator = (value: string, separator = ' - '): boolean => {
	return value.includes(separator)
}

/**
 * Vérifie si une plage de dates est valide (la date de début est antérieure à la date de fin)
 *
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Booléen indiquant si la plage est valide
 */
export const isValidDateRange = (startDate: Date | null, endDate: Date | null): boolean => {
	if (!startDate || !endDate) return true
	return startDate.getTime() <= endDate.getTime()
}
