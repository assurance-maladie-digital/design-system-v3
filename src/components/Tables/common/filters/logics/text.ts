export default function filter(itemValue: unknown, filterValue: unknown): boolean {
	const str = String(itemValue)
	const search = String(filterValue)

	// Utiliser la fonction de conversion en regex pour les autres cas
	const result = convertFilterToRegex(search)

	if (result.caseSensitive) {
		return result.regex.test(str)
	}
	else {
		return result.regex.test(str.toLowerCase())
	}
}

/**
 * Convertit une chaîne de caractères de filtre avec des caractères spéciaux en expression régulière
 * @param filterStr Chaîne de caractères de filtre
 * @returns Expression régulière correspondante
 */
function convertFilterToRegex(filterStr: string): { regex: RegExp, caseSensitive: boolean, isGreaterThan?: boolean } {
	// Traiter les cas spéciaux
	// Cas <>?* - Toutes les valeurs vides ou nulles
	if (filterStr === '<>?*') {
		return { regex: /^\s*$/, caseSensitive: false }
	}

	// Cas =???? - Tous les mots de 4 lettres exactement (ou autre longueur)
	const exactLengthMatch = /^=(\?+)$/.exec(filterStr)
	if (exactLengthMatch) {
		const length = exactLengthMatch[1].length
		return { regex: new RegExp(`^.{${length}}$`), caseSensitive: false }
	}

	// Cas >zu - Tous les mots classés après "zu" alphabétiquement
	const greaterThanMatch = /^>(.+)$/.exec(filterStr)
	if (greaterThanMatch) {
		// On ne peut pas utiliser une regex pour cette comparaison, on utilisera une fonction spéciale
		return { regex: new RegExp(`.`), caseSensitive: false, isGreaterThan: true }
	}

	// Recherche insensible à la casse par défaut avec correspondance partielle
	return { regex: new RegExp(filterStr, 'i'), caseSensitive: false }
}
