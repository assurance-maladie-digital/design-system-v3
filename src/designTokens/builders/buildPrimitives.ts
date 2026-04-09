import type { ColorsTokens } from './types'
import { formatColor, toKebabCase, toTokenSuffix } from './formatters'

export function buildPrimitives(colorsTokens: ColorsTokens): string[] {
	const lines: string[] = ['// Primitives']

	for (const [colorName, scale] of Object.entries(colorsTokens)) {
		if (typeof scale !== 'object' || scale === null)
			continue

		const colorToken = toKebabCase(colorName)

		for (const [step, rawValue] of Object.entries(scale)) {
			const value = formatColor(rawValue)

			if (colorName === 'white') {
				if (step === 'base')
					lines.push(`$white-base: ${value};`)
				else if (step === 'lighten8')
					lines.push(`$white-08: ${value};`)
				else if (step === 'lighten20')
					lines.push(`$white-20: ${value};`)
				else if (step === 'lighten38')
					lines.push(`$white-38: ${value};`)
				else if (step === 'lighten40')
					lines.push(`$white-40: ${value};`)
				else if (step === 'lighten70')
					lines.push(`$white-70: ${value};`)
				continue
			}

			lines.push(`$${colorToken}-${toTokenSuffix(step)}: ${value};`)
		}
	}

	lines.push('$white-00: rgba(255, 255, 255, 0);')
	lines.push('$none-value: undefined;')
	lines.push('$transparent-blue-18: rgba(12, 65, 154, 0.18);')
	lines.push('$transparent-blue-08: rgba(12, 65, 154, 0.08);')
	lines.push('$transparent-blue-00: rgba(12, 65, 154, 0);')

	return lines
}
