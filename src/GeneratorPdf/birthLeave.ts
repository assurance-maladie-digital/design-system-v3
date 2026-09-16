function parseDate(value: string): Date | null {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
	const date = new Date(`${value}T00:00:00Z`)
	return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null
}

/** Reproduit DATE(YEAR(d), MONTH(d) + 1, DAY(d) - 1), débordements inclus. */
export function calculateMonthEnd(value: string): string {
	const date = parseDate(value)
	if (!date) return ''
	date.setUTCMonth(date.getUTCMonth() + 1, date.getUTCDate() - 1)
	return date.toISOString().slice(0, 10)
}

/** Jour suivant, sans décalage de fuseau horaire. */
export function addOneDay(value: string): string {
	const date = parseDate(value)
	if (!date) return ''
	date.setUTCDate(date.getUTCDate() + 1)
	return date.toISOString().slice(0, 10)
}

/** Affiche une date ISO valide au format français. */
export function formatFrenchDate(value: string): string {
	return parseDate(value) ? value.split('-').reverse().join('/') : ''
}
