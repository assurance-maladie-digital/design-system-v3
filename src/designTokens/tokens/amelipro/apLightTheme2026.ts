import {apColorsTokens2026} from './apColors2026'
import {apColorClasses} from './apColors2026'

export const apLightTheme2026 = {
	...apColorClasses,
    error: apColorsTokens2026.apRed.base,
    info: apColorsTokens2026.apParme.darken1 as string,
    primary: apColorsTokens2026.apBlue.darken1 as string,
    secondary: apColorsTokens2026.apBlue.darken2 as string,
    success: apColorsTokens2026.apTurquoise.darken1 as string,
    warning: apColorsTokens2026.apYellow.darken4 as string,
}
