import type { FilterOption } from './types'

function parseDate(value: unknown): Date | null {
	if (value instanceof Date) return value
	if (typeof value === 'string') {
		try {
			if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
				const [day, month, year] = value.split('/').map(Number)
				return new Date(year, month - 1, day)
			}
			const parsed = new Date(value)
			return isNaN(parsed.getTime()) ? null : parsed
		}
		catch {
			return null
		}
	}
	// Traite le type nombre
	if (typeof value === 'number') {
		const parsed = new Date(value)
		return isNaN(parsed.getTime()) ? null : parsed
	}
	// Ignore les objets vides
	if (value === null || value === undefined || (typeof value === 'object' && Object.keys(value as object).length === 0)) {
		return null
	}
	return null
}

export function filterItems<T extends Record<string, unknown>>(items: T[], filters: FilterOption[]): T[] {
	if (!Array.isArray(items) || items.length === 0) return []
	if (!Array.isArray(filters) || filters.length === 0) return items

	return items.filter(item =>
		filters.every(filter => applyFilter(item, filter)),
	)
}

/**
 * Convertit une chaîne de caractères de filtre avec des caractères spéciaux en expression régulière
 * @param filterStr Chaîne de caractères de filtre
 * @returns Expression régulière correspondante
 */
function convertFilterToRegex(filterStr: string): { regex: RegExp, caseSensitive: boolean } {
	// Vérifier si la recherche est sensible à la casse (entre guillemets doubles)
	const caseSensitiveMatch = /^"(.+)"$/.exec(filterStr)
	if (caseSensitiveMatch) {
		// Échapper les caractères spéciaux de regex sauf * et ?
		let pattern = caseSensitiveMatch[1].replace(/[.+^${}()|[\]\\]/g, '\\$&')
		// Remplacer les caractères spéciaux de filtre par leurs équivalents regex
		pattern = pattern.replace(/\*/g, '.*').replace(/\?/g, '.')
		// Ne pas ajouter ^ et $ pour permettre la recherche partielle dans la chaîne
		return { regex: new RegExp(pattern), caseSensitive: true }
	}

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
		const compareValue = greaterThanMatch[1].toLowerCase()
		// On ne peut pas utiliser une regex pour cette comparaison, on utilisera une fonction spéciale
		return { regex: new RegExp(`^${compareValue}$`, 'i'), caseSensitive: false }
	}

	// Échapper les caractères spéciaux de regex sauf * et ?
	let pattern = filterStr.replace(/[.+^${}()|[\]\\]/g, '\\$&')
	// Remplacer les caractères spéciaux de filtre par leurs équivalents regex
	pattern = pattern.replace(/\*/g, '.*').replace(/\?/g, '.')

	return { regex: new RegExp(`^${pattern}$`, 'i'), caseSensitive: false }
}

function applyFilter<T extends Record<string, unknown>>(item: T, filter: FilterOption): boolean {
	if (!filter.key) return true

	const itemValue = item[filter.key]
	const filterValue = filter.value

	if (itemValue == null || filterValue == null) return true

	switch (filter.type) {
		case 'text': {
			const str = String(itemValue)
			const search = String(filterValue)

			// Cas spécial pour les valeurs vides ou nulles
			if (search === '<>?*') {
				return str.trim() === ''
			}

			// Cas spécial pour la comparaison alphabétique
			const greaterThanMatch = /^>(.+)$/.exec(search)
			if (greaterThanMatch) {
				const compareValue = greaterThanMatch[1]
				return str.localeCompare(compareValue) > 0
			}

			// Cas spécial pour la recherche sensible à la casse (entre guillemets doubles)
			const caseSensitiveMatch = /^"(.+)"$/.exec(search)
			if (caseSensitiveMatch) {
				// Recherche exacte sensible à la casse
				return str.includes(caseSensitiveMatch[1])
			}
			
			// Utiliser la fonction de conversion en regex pour les autres cas
			const { regex, caseSensitive } = convertFilterToRegex(search)
			
			if (caseSensitive) {
				return regex.test(str)
			} else {
				return regex.test(str.toLowerCase())
			}
		}
		case 'number': {
			if (typeof itemValue === 'number') {
				if (typeof filterValue === 'number') return itemValue === filterValue
				return String(itemValue).includes(String(filterValue))
			}
			return false
		}
		case 'select': {
			if (Array.isArray(filterValue)) {
				// Utilise l'assertion de type pour gérer la méthode includes
				return filterValue.includes(itemValue as unknown as typeof filterValue[0])
			}
			if (typeof filterValue === 'object' && filterValue != null) {
				return JSON.stringify(filterValue) === JSON.stringify(itemValue)
			}
			return itemValue === filterValue
		}
		case 'period': {
			if (
				typeof itemValue === 'object'
				&& itemValue !== null
				&& 'from' in itemValue
				&& 'to' in itemValue
			) {
				const { from, to } = filterValue as { from?: string | Date, to?: string | Date }

				if (!from || !to) {
					return true
				}

				const itemFrom = parseDate(itemValue.from)
				const itemTo = parseDate(itemValue.to)
				const fromDate = parseDate(from)
				const toDate = parseDate(to)

				if (!itemFrom || !itemTo || !fromDate || !toDate) {
					return false
				}

				const normalizeDate = (date: Date) =>
					new Date(date.getFullYear(), date.getMonth(), date.getDate())

				const itemFromDay = normalizeDate(itemFrom)
				const itemToDay = normalizeDate(itemTo)
				const fromDay = normalizeDate(fromDate)
				const toDay = normalizeDate(toDate)

				// Applique la vérification de chevauchement uniquement si les deux dates sont valides
				return itemFromDay <= toDay && itemToDay >= fromDay
			}
			return false
		}
		case 'date': {
			const itemDate = parseDate(itemValue)
			const targetDate = parseDate(filterValue)
			if (!itemDate || !targetDate) return false
			return (
				itemDate.getDate() === targetDate.getDate()
				&& itemDate.getMonth() === targetDate.getMonth()
				&& itemDate.getFullYear() === targetDate.getFullYear()
			)
		}
		default:
			return true
	}
}
