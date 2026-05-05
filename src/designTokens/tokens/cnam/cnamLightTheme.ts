import { baseTokens } from '@/designTokens/tokens/baseTokens'

export const cnamLightTheme = {
	primary: baseTokens.color.blue.base, // colorPrimary
	secondary: baseTokens.color.cyan.darken40, // colorSecondary
	// accentPrimaryLight: baseTokens.color.blue.lighten20,
	// accentPrimary: baseTokens.color.blue.base,
	// accentPrimaryContrasted: baseTokens.color.blue.darken40,
	// accentSecondaryLight: baseTokens.color.cyan.lighten60,
	// accentSecondary: baseTokens.color.cyan.base,
	// accentSecondaryContrasted: baseTokens.color.cyan.darken40,//colorSecondary
	accentAlt: baseTokens.color.grey.base, // colorInverseSurface
	error: baseTokens.color.orange.darken20, // feedbackError
	info: baseTokens.color.blue.base, // feedbackInfo
	success: baseTokens.color.turquoise.darken60, // feedbackSuccessVariant
	warning: baseTokens.color.yellow.darken60, // feedbackOnWarningVariant
	// avatar: baseTokens.color.cyan.darken20,
	// risquePro: baseTokens.color.brick.base,
	// light: baseTokens.color.grey.lighten60,
	// dark: baseTokens.color.grey.darken80,

	// Border
	colorBorder: baseTokens.color.blue.base,
	colorBorderVariant: baseTokens.color.grey.lighten40,
	colorBorderBright: baseTokens.color.white.base,
	colorBorderDim: baseTokens.color.white.alpha40,

	// Disabled
	colorDisabled: baseTokens.color.grey.lighten80,
	colorOnDisabled: baseTokens.color.grey.lighten40,
	colorInverseSurface: baseTokens.color.grey.base,
	colorOnDisabledVariant: baseTokens.color.white.alpha40,

	// Primary
	colorPrimary: baseTokens.color.blue.base,
	colorOnPrimary: baseTokens.color.white.base,
	colorPrimaryVariant: baseTokens.color.blue.darken40,
	colorOnPrimaryVariant: baseTokens.color.white.base,

	// Secondary
	colorSecondary: baseTokens.color.cyan.darken40,
	colorOnSecondary: baseTokens.color.white.base,
	colorSecondaryVariant: baseTokens.color.cyan.darken60,
	colorOnSecondaryVariant: baseTokens.color.white.base,

	// Overlay
	colorOverlay: baseTokens.color.grey.alpha40,

	// Surface
	colorSurface: baseTokens.color.white.base,
	colorSurfaceBright: baseTokens.color.blue.lighten97,
	colorSurfaceDim: baseTokens.color.blue.lighten90,
	colorOnSurface: baseTokens.color.grey.darken60,
	colorOnSurfaceVariant: baseTokens.color.grey.base,

	// Background
	backgroundBackground: baseTokens.color.blue.lighten90,
	backgroundOnBackground: baseTokens.color.grey.darken60,
	backgroundBackgroundVariant: baseTokens.color.white.base,
	backgroundOnBackgroundVariant: baseTokens.color.grey.lighten40,

	// Feedback
	feedbackInfo: baseTokens.color.blue.base,
	feedbackInfoVariant: baseTokens.color.blue.lighten80,
	feedbackError: baseTokens.color.orange.darken20,
	feedbackOnError: baseTokens.color.white.base,
	feedbackErrorVariant: baseTokens.color.orange.lighten80,
	feedbackOnErrorVariant: baseTokens.color.orange.darken60,
	feedbackSuccess: baseTokens.color.green.base,
	feedbackSuccessVariant: baseTokens.color.green.lighten80,
	feedbackOnSuccess: baseTokens.color.grey.darken60,
	feedbackOnSuccessVariant: baseTokens.color.grey.darken60,
	feedbackWarning: baseTokens.color.yellow.base,
	feedbackOnWarning: baseTokens.color.grey.darken60,
	feedbackWarningVariant: baseTokens.color.yellow.lighten80,
	feedbackOnWarningVariant: baseTokens.color.yellow.darken60,

	// Interaction
	interactionDarkEnabled: baseTokens.color.transparentBlue.alpha00,
	interactionDarkHover: baseTokens.color.transparentBlue.alpha08,
	interactionDarkPressed: baseTokens.color.transparentBlue.alpha20,
	interactionDarkenEnabled: baseTokens.color.transparentBlack.alpha00,
	interactionDarkenHover: baseTokens.color.transparentBlack.alpha20,
	interactionDarkenPressed: baseTokens.color.transparentBlack.alpha40,
	interactionLightenEnabled: baseTokens.color.none,
	interactionLightenHover: baseTokens.color.white.alpha20,
	interactionLightenPressed: baseTokens.color.white.alpha40,
	// SelectedLight
}
