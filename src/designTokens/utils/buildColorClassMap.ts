function toKebabCase(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([a-zA-Z])(\d)/g, '$1-$2')
		.replace(/_/g, '-')
		.toLowerCase()
}

/**
 * Generates a flat class-name → hex value map from a color token object.
 *
 * Example:
 *   { apBlue: { base: '#0C419A', darken1: '#00749C' } }
 *   →
 *   { 'ap-blue': '#0c419a', 'ap-blue-darken-1': '#00749c' }
 *
 * The 'base' variation is dropped from the class name (e.g. apBlue.base → ap-blue).
 * Numeric suffixes in variation names are separated with a dash (darken1 → darken-1).
 */
export function buildColorClassMap<T extends Record<string, Record<string, string>>>(tokens: T): Record<string, string> {
	const map: Record<string, string> = {}

	for (const [colorName, colorValues] of Object.entries(tokens)) {
		for (const [variationName, colorValue] of Object.entries(colorValues)) {
			const rawClass = `${colorName}-${variationName}`
				.replace(/(\d+)/, '-$1')
				.replace('-base', '')

			map[toKebabCase(rawClass)] = colorValue.toLowerCase()
		}
	}

	return map
}
