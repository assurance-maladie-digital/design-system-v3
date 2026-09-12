/**
 * Formats a Date object into a string in the format "Month Year" (e.g., "January 2024") using the user's locale.
 */
export function dateToString(date: Date): string {
	return new Intl.DateTimeFormat(navigator.language, { month: 'long', year: 'numeric' }).format(date)
}

/**
 * Parses a string in the format "month/year" and returns a tuple of [month, year].
 */
export function parseMonthYearString(value: string | undefined): [number | undefined, number | undefined] {
	if (!value) return [undefined, undefined]
	const [monthStr, yearStr] = value.split('/')
	const month = monthStr ? parseInt(monthStr, 10) : undefined
	const year = yearStr ? parseInt(yearStr, 10) : undefined
	return [month, year]
}
