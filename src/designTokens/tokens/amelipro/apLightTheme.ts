import { apColorsTokens } from './apColors'
// import { apSemanticTokens } from '../amelipro/apSemantic'

export const apLightTheme = {
	error: apColorsTokens.apRed.base,
	info: apColorsTokens.apParme.darken1 as string,
	primary: apColorsTokens.apBlue.darken1 as string,
	secondary: apColorsTokens.apBlue.darken2 as string,
	success: apColorsTokens.apTurquoise.darken1 as string,
	warning: apColorsTokens.apYellow.darken4 as string,
}
