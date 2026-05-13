import { baseTokens } from '../baseTokens'

export const apLightTheme = {
	risquePro: baseTokens.color.red.base,

	// Border
	colorBorder: baseTokens.color.cyan.darken20,
	colorBorderVariant: baseTokens.color.grey.lighten40,
	colorBorderBright: baseTokens.color.white.base,
	colorBorderDim: baseTokens.color.white.alpha40,

	// Disabled
	colorDisabled: baseTokens.color.grey.lighten80,
	colorInverseSurface: baseTokens.color.grey.base,
	colorOnDisabled: baseTokens.color.grey.lighten40,
	colorOnDisabledVariant: baseTokens.color.white.alpha40,

	// Primary
	colorPrimary: baseTokens.color.cyan.darken20,
	colorOnPrimary: baseTokens.color.white.base,
	colorPrimaryVariant: baseTokens.color.cyan.darken40,
	colorOnPrimaryVariant: baseTokens.color.white.base,

	// Secondary
	colorSecondary: baseTokens.color.cyan.darken60,
	colorOnSecondary: baseTokens.color.white.base,
	colorSecondaryVariant: baseTokens.color.cyan.darken80,
	colorOnSecondaryVariant: baseTokens.color.white.base,

	// Overlay
	colorOverlay: baseTokens.color.grey.alpha40,

	// Surface
	colorSurface: baseTokens.color.white.base,
	colorSurfaceBright: baseTokens.color.cyan.lighten97,
	colorSurfaceDim: baseTokens.color.cyan.lighten80,
	colorOnSurface: baseTokens.color.grey.darken60,
	colorOnSurfaceVariant: baseTokens.color.grey.base,

	// Background
	backgroundBackground: baseTokens.color.cyan.lighten97,
	backgroundBackgroundVariant: baseTokens.color.white.base,
	backgroundOnBackground: baseTokens.color.grey.darken60,
	backgroundOnBackgroundVariant: baseTokens.color.grey.lighten40,

	// Feedback
	feedbackInfo: baseTokens.color.parma.darken40,
	feedbackInfoVariant: baseTokens.color.parma.lighten80,
	feedbackOnInfo: baseTokens.color.white.base,
	feedbackOnInfoVariant: baseTokens.color.parma.darken60,
	feedbackError: baseTokens.color.red.darken20,
	feedbackOnError: baseTokens.color.white.base,
	feedbackErrorVariant: baseTokens.color.red.lighten90,
	feedbackOnErrorVariant: baseTokens.color.red.darken60,
	feedbackSuccess: baseTokens.color.forestGreen.base,
	feedbackOnSuccess: baseTokens.color.white.base,
    feedbackSuccessVariant: baseTokens.color.forestGreen.base,
	feedbackOnSuccessVariant: baseTokens.color.forestGreen.darken60,
	feedbackWarning: baseTokens.color.yellow.base,
	feedbackOnWarning: baseTokens.color.grey.darken60,
	feedbackWarningVariant: baseTokens.color.yellow.lighten80,
	feedbackOnWarningVariant: baseTokens.color.yellow.darken60,

	// Interaction
	interactionLightenEnabled: baseTokens.color.none,
	interactionLightenHover: baseTokens.color.white.alpha20,
	interactionLightenSelected: baseTokens.color.white.alpha20,
	interactionLightenPressed: baseTokens.color.white.alpha38,
	interactionDarkEnabled: baseTokens.color.transparentCyan.alpha00,
	interactionDarkHover: baseTokens.color.transparentCyan.alpha08,
	interactionDarkPressed: baseTokens.color.transparentCyan.alpha18,
	interactionDarkenEnabled: baseTokens.color.transparentBlack.alpha00,
	interactionDarkenHover: baseTokens.color.transparentBlack.alpha20,
	interactionDarkenPressed: baseTokens.color.transparentBlack.alpha40,
}
