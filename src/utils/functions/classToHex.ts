import { apLightTheme2026 } from '@/designTokens/tokens/amelipro/apLightTheme2026'
import { apColorsTokens2026 } from '@/designTokens/tokens/amelipro/apColors2026'
import { AmeliproColors } from './ameliproColors/ameliproColors'

const currentTheme = apLightTheme2026
const ameliproColors = AmeliproColors
const colors = apColorsTokens2026 as unknown as Record<string, Record<string, string>>
export function classToHex(color: string): string | undefined {
	color = color.trim()
	color = color.replace(/-./, x => x[1]!.toUpperCase())
	color = color.replace('-', ' ')
	// eslint-disable-next-line prefer-const
	let [colorName, colorModifier] = color.split(' ', 2) as (string | undefined)[]
	colorModifier = colorModifier?.replace('-', '')
	let fullColorName = ''
	let hexColor: string | undefined = undefined
	if (colorName && colorName in colors) {
		if (colorModifier && colorModifier in colors[colorName]!) {
			hexColor = colors[colorName]![colorModifier]!
		}
		else if ('base' in colors[colorName]!) {
			hexColor = colors[colorName].base
		}
	}
	else if (colorName && colorName in currentTheme) {
		hexColor = currentTheme[colorName]
	}
	else if (color && colorName) {
		if (colorModifier === undefined) {
			fullColorName = colorName
		}
		else {
			fullColorName = colorName + colorModifier
		}
		hexColor = ameliproColors[fullColorName]?.hexColor
	}
	return hexColor
}
