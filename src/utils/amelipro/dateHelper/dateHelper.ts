/**
 * Regular expression to match the ISO 8601 basic date format (YYYY-MM-DD).
 * @type {RegExp}
 */
const ISO_8601_BASIC = /^\d{4}-\d\d-\d\d$/i

/**
 * Formats a single-digit number as a two-digit string with a leading zero.
 * @param {number} num - The number to format.
 * @returns {string} The formatted two-digit string.
 */
export const padTo2Digits = (num: number): string => num.toString().padStart(2, '0')

/**
 * Checks if a given string matches the ISO 8601 basic date format (YYYY-MM-DD).
 * @param {string | null | undefined} date - The date string to check.
 * @returns {boolean} True if the string matches the format, false otherwise.
 */
export const dateMatchIso = (date: string | null | undefined): boolean => {
	if (typeof date !== 'string') {
		return false
	}
	return ISO_8601_BASIC.test(date)
}

/**
 * Parses a string in the format 'YYYY-MM-DD' into an array of year, month, and day strings.
 * @param {string} date - The date string to parse.
 * @returns {string[]} An array containing [year, month, day].
 */
export const parseDate = (date: string): string[] => {
	const [year, month, day] = date.split('-')
	return [year, month, day]
}

/**
 * Formats a date string in the ISO 8601 basic format (YYYY-MM-DD) to the French format (DD/MM/YYYY).
 * @param {string} date - The date string to format.
 * @returns {string} The formatted date string in French format, or an empty string if invalid input is provided.
 */
export const dateToFormatFr = (date: string): string => {
	if (typeof date !== 'string' || date === '') {
		return ''
	}
	const [year, month, day] = parseDate(date)
	return `${padTo2Digits(parseInt(day))}/${padTo2Digits(parseInt(month))}/${year.toString()}`
}

/**
 * Converts a string value in the ISO 8601 basic format (YYYY-MM-DD) to a JavaScript Date object.
 * @param {string} value - The string value to convert.
 * @returns {Date | undefined} A Date object representing the date, or undefined if the string is not in valid format.
 */
export const stringToDate = (value: string): Date | undefined => {
	if (!dateMatchIso(value)) {
		return undefined
	}
	const [year, month, day] = parseDate(value)
	// Adjust for JavaScript month indexing starting at 0
	return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0)
}
