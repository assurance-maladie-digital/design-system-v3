import { bootstrapColorsTokens } from './bootstrapColors'
import { cnamColorsTokens } from '../cnam/cnamColors'

// Pour l'utiilser cf : dev/main.ts -> a ajouter a la place des cnamColorsTokens
export const bootstrapLightTheme = {
	primary: bootstrapColorsTokens.amBlue.darken40,
	secondary: bootstrapColorsTokens.pink.darken40,
	accent: bootstrapColorsTokens.cyan.base,
	error: bootstrapColorsTokens.brick.darken20,
	info: bootstrapColorsTokens.amBlue.darken60,
	success: bootstrapColorsTokens.green.lighten40,
	warning: bootstrapColorsTokens.yellow.lighten90,
	risquePro: cnamColorsTokens.brick.base,
	light: cnamColorsTokens.grey.lighten60,
	dark: cnamColorsTokens.grey.darken80,
	brand: '#4a3f59',
	brandSecondary: '#ac1c81',
	brandMuted: '#b7cbd6',
	brandMutedLite: '#E7F3F9',
	hilitePrimary: '#0062ac',
	hiliteSecondary: '#e6bebf',
}
