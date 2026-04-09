import { toKebabCase } from './formatters'

type ColorTokens = Record<string, Record<string, string>>

/**
 * Generates a flat class-name → hex value map from a color token object.
 *
 * Example:
 *   { apBlue: { base: '#0c419a', darken1: '#00749c' } }
 *   →
 *   { 'ap-blue': '#0c419a', 'ap-blue-darken-1': '#00749c' }
 *
 * The 'base' variation is dropped from the class name (e.g. apBlue-base → ap-blue).
 * Numeric suffixes in variation names are separated with a dash (darken1 → darken-1).
 */
export function buildColorClassMap(tokens: ColorTokens): Record<string, string> {
	const map: Record<string, string> = {}

	for (const [colorName, colorValues] of Object.entries(tokens)) {
		for (const [variationName, colorValue] of Object.entries(colorValues)) {
			const rawClass = `${colorName}-${variationName}`
				.replace(/(\d+)/, '-$1')
				.replace('-base', '')

			const colorClass = toKebabCase(rawClass)
			map[colorClass] = colorValue
		}
	}

	return map
}
