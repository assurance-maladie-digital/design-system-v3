import { baseTokens } from '../baseTokens'

export const apLightTheme = {
	risquePro: baseTokens.color.red.base,

	// Border
	border: baseTokens.color.cyan.darken20,
	borderVariant: baseTokens.color.grey.lighten40,
	borderBright: baseTokens.color.white.base,
	borderDim: baseTokens.color.white.alpha40,

	// Disabled
	disabled: baseTokens.color.grey.lighten80,
	inverseSurface: baseTokens.color.grey.base,
	onDisabled: baseTokens.color.grey.lighten40,
	onDisabledVariant: baseTokens.color.white.alpha40,

	// Primary
	primary: baseTokens.color.cyan.darken20,
	onPrimary: baseTokens.color.white.base,
	primaryVariant: baseTokens.color.cyan.darken40,
	onPrimaryVariant: baseTokens.color.white.base,

	// Secondary
	secondary: baseTokens.color.cyan.darken60,
	onSecondary: baseTokens.color.white.base,
	secondaryVariant: baseTokens.color.cyan.darken80,
	onSecondaryVariant: baseTokens.color.white.base,

	// Overlay
	overlay: baseTokens.color.grey.alpha40,

	// Surface
	surface: baseTokens.color.white.base,
	surfaceBright: baseTokens.color.cyan.lighten97,
	surfaceDim: baseTokens.color.cyan.lighten80,
	onSurface: baseTokens.color.grey.darken60,
	onSurfaceVariant: baseTokens.color.grey.base,

	// Background
	background: baseTokens.color.cyan.lighten97,
	backgroundVariant: baseTokens.color.white.base,
	onBackground: baseTokens.color.grey.darken60,
	onBackgroundVariant: baseTokens.color.grey.lighten40,

	// Feedback
	info: baseTokens.color.parma.darken40,
	infoVariant: baseTokens.color.parma.lighten80,
	infoVariant90: baseTokens.color.parma.lighten90,
	onInfo: baseTokens.color.white.base,
	onInfoVariant: baseTokens.color.parma.darken60,
	error: baseTokens.color.red.darken20,
	onError: baseTokens.color.white.base,
	errorVariant: baseTokens.color.red.lighten90,
    errorVariantLighten: baseTokens.color.red.lighten97,
    onErrorVariant: baseTokens.color.red.darken60,
	success: baseTokens.color.forestGreen.base,
	onSuccess: baseTokens.color.white.base,
	successVariant: baseTokens.color.forestGreen.lighten90,
    successVariantLighten: baseTokens.color.forestGreen.lighten97,
	onSuccessVariant: baseTokens.color.forestGreen.darken60,
	warning: baseTokens.color.yellow.base,
	onWarning: baseTokens.color.grey.darken60,
	warningVariant: baseTokens.color.yellow.lighten80,
    warningVariantLigthen: baseTokens.color.yellow.lighten90,
	onWarningVariant: baseTokens.color.yellow.darken60,

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
