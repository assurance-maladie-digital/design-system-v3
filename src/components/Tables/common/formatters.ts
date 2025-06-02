/**
 * Fonctions utilitaires pour formater les données dans les tableaux
 */

/**
 * Formate un objet période pour l'affichage
 *
 * @param value - L'objet période à formater
 * @returns Chaîne de période formatée
 */
export function formatPeriod(value: unknown): string {
	// Traite les valeurs null ou undefined
	if (value === null || value === undefined) {
		return ''
	}

	// Traite les objets période
	if (typeof value === 'object' && value !== null && 'from' in value && 'to' in value) {
		const periodValue = value as { from?: string | null, to?: string | null }
		const from = periodValue.from || ''
		const to = periodValue.to || ''

		// Formate comme "du [date] au [date]"
		if (from && to) {
			return `du ${from} au ${to}`
		}
		// Si seule la date de début est présente
		else if (from) {
			return `du ${from}`
		}
		// Si seule la date de fin est présente
		else if (to) {
			return `au ${to}`
		}
	}

	// Repli sur la représentation en chaîne de caractères
	return String(value)
}

/**
 * Traite les éléments du tableau pour formater les champs spéciaux comme les périodes
 *
 * @param items - Les éléments du tableau à traiter
 * @returns Éléments traités avec des valeurs formatées
 */
export function processItems(items: Record<string, unknown>[]): Record<string, unknown>[] {
	if (!items || !Array.isArray(items)) return []

	return items.map((item) => {
		if (!item) return item

		const newItem = { ...item } as Record<string, unknown>

		// Traite tous les champs de l'élément
		Object.keys(newItem).forEach((key) => {
			const value = newItem[key]

			// Vérifie si ce champ est un objet de type période (possède les propriétés from et to)
			if (value
				&& typeof value === 'object'
				&& value !== null
				&& 'from' in value
				&& 'to' in value) {
				// Formate la période et la stocke à nouveau
				newItem[key] = formatPeriod(value)
			}
		})

		return newItem
	})
}
