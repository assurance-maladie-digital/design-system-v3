import { apColorsTokensOld } from './apColorsOld'
// import { apSemanticTokens } from '../amelipro/apSemantic'
import { apColorClasses } from './apColorsOld'

export const apLightThemeOld = {
	...apColorClasses,
	error: apColorsTokensOld.apRed.base,
	info: apColorsTokensOld.apParme.darken1 as string,
	primary: apColorsTokensOld.apBlue.darken1 as string,
	secondary: apColorsTokensOld.apBlue.darken2 as string,
	success: apColorsTokensOld.apTurquoise.darken1 as string,
	warning: apColorsTokensOld.apYellow.darken4 as string,
}
