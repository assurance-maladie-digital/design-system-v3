import type { ColorsTokens } from './types'
import { formatColor, toKebabCase, toTokenSuffix } from './formatters'

// Maps white scale step names to their output token suffixes.
// Add entries here when new white shades are added to the color tokens.
const WHITE_STEP_NAMES: Record<string, string> = {
	base: 'base',
	lighten8: '08',
	lighten20: '20',
	lighten38: '38',
	lighten40: '40',
	lighten70: '70',
}

export function buildPrimitives(colorsTokens: ColorsTokens, extraPrimitives?: string[]): string[] {
	const lines: string[] = ['// Primitives']

	for (const [colorName, scale] of Object.entries(colorsTokens)) {
		if (typeof scale !== 'object' || scale === null)
			continue

		const colorToken = toKebabCase(colorName)

		for (const [step, rawValue] of Object.entries(scale)) {
			const value = formatColor(rawValue)

			if (colorName === 'white') {
				const suffix = WHITE_STEP_NAMES[step]
				if (suffix)
					lines.push(`$white-${suffix}: ${value};`)
				continue
			}

			lines.push(`$${colorToken}-${toTokenSuffix(step)}: ${value};`)
		}
	}

	lines.push('$white-00: rgba(255, 255, 255, 0);')

	if (extraPrimitives)
		lines.push(...extraPrimitives)

	return lines
}
