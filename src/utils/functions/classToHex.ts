import { apLightTheme } from '@/designTokens/tokens/amelipro/apLightTheme'
import { apColorsTokens } from '@/designTokens/tokens/amelipro/apColors'
import { AmeliproColors } from './ameliproColors/ameliproColors'

const currentTheme = apLightTheme
const ameliproColors = AmeliproColors
const colors = apColorsTokens as unknown as Record<string, Record<string, string>>
export function classToHex(color: string): string {
	color.toString().trim()
	color = color?.replace(/-./, x => x[1].toUpperCase())
	color = color?.replace('-', ' ')
	// eslint-disable-next-line prefer-const
	let [colorName, colorModifier] = color.split(' ', 2) as (string | undefined)[]
	colorModifier = colorModifier?.replace('-', '')
	let fullColorName = ''
	let hexColor = ''
	if (colorName && colorName in colors) {
		if (colorModifier && colorModifier in colors[colorName]) {
			hexColor = colors[colorName][colorModifier]
		}
		else if ('base' in colors[colorName]) {
			hexColor = colors[colorName].base
		}
	}
	else if (colorName && colorName in currentTheme) {
		hexColor = currentTheme[colorName] as string
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
