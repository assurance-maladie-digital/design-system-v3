const monday = new Date(2024, 5, 3) // a Monday
export const localizedDays = Array.from({ length: 7 }, (_, i) => {
	const date = new Date(monday)
	date.setDate(monday.getDate() + i)
	return {
		long: date.toLocaleDateString(navigator.language ?? 'fr-FR', { weekday: 'long' }),
		short: date.toLocaleDateString(navigator.language ?? 'fr-FR', { weekday: 'short' }),
	}
})

/**
 * Get the ISO date string (YYYY-MM-DD)
 */
export function getISODatePart(date: Date): string {
	return `${
		date.getFullYear().toString().padStart(4, '0')
	}-${
		(date.getMonth() + 1).toString().padStart(2, '0')
	}-${
		date.getDate().toString().padStart(2, '0')
	}`
}

/**
 * Parse an ISO date string (YYYY-MM-DD) into a Date at local midnight,
 * unlike new Date('YYYY-MM-DD') which parses it as UTC
 */
export function parseISODatePart(isoDate: string): Date {
	const [year, month, day] = isoDate.split('-')
	return new Date(Number(year), Number(month) - 1, Number(day))
}
