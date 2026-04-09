type Theme = Record<string, string>
type ColorsMap = Record<string, Record<string, string>>
type LegacyColors = Record<string, { hexColor: string }>

/**
 * Creates a resolver that converts a color class name (e.g. "ap-blue-lighten-1")
 * into a hex value for the given theme and color palette.
 *
 * Lookup order:
 *   1. colors map: colorName + optional modifier (e.g. apBlue.lighten1)
 *   2. theme map: direct key lookup (e.g. primary, secondary)
 *   3. legacyColors map: flat key lookup (e.g. apBluelighten1.hexColor)
 */
export function createHexResolver(
	theme: Theme,
	colors: ColorsMap,
	legacyColors?: LegacyColors,
): (color: string) => string | undefined {
	return function resolveHex(color: string): string | undefined {
		color = color.trim()
		color = color.replace(/-./, x => x[1]!.toUpperCase())
		color = color.replace('-', ' ')

		// eslint-disable-next-line prefer-const
		let [colorName, colorModifier] = color.split(' ', 2) as (string | undefined)[]
		colorModifier = colorModifier?.replace('-', '')

		if (colorName && colorName in colors) {
			if (colorModifier && colorModifier in colors[colorName]!)
				return colors[colorName]![colorModifier]!
			if ('base' in colors[colorName]!)
				return colors[colorName].base
		}

		if (colorName && colorName in theme)
			return theme[colorName]

		if (legacyColors && colorName) {
			const fullColorName = colorModifier === undefined ? colorName : colorName + colorModifier
			return legacyColors[fullColorName]?.hexColor
		}

		return undefined
	}
}
