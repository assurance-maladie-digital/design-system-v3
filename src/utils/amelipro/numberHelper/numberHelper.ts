/**
 * Regular expression to match number format.
 * @type {RegExp}
 */
const NUMBER_REGEX = /^(-)?\d*([,.]\d+)?$/i

/**
 * Checks if a given string matches the regex.
 * @param {number | string | null | undefined} value - The value to check.
 * @returns {boolean} True if the string matches the format, false otherwise.
 */
export const numberMatchRegex = (value: number | string | null | undefined): boolean => {
	if (typeof value !== 'string' && typeof value !== 'number') {
		return false
	}
	return NUMBER_REGEX.test(String(value))
}

export const parseToNumber = (value: number | string): number => Number((String(value)).replace(',', '.'))
export const parseToFrNumberFormat = (value: number | string): string => (String(value)).replace('.', ',')
