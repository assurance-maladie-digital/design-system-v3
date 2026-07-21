import { baseTokens } from '../baseTokens'

export const paLightTheme = {
	risquePro: baseTokens.color.brick.base,

	// Border
	border: baseTokens.color.blue.base,
	borderVariant: baseTokens.color.grey.lighten40,
	borderBright: baseTokens.color.white.base,
	borderDim: baseTokens.color.white.alpha40,

	// Disabled
	disabled: baseTokens.color.grey.lighten80,
	onDisabled: baseTokens.color.grey.lighten40,
	inverseSurface: baseTokens.color.grey.base,
	onDisabledVariant: baseTokens.color.white.alpha40,

	// Primary
	primary: baseTokens.color.blue.base,
	onPrimary: baseTokens.color.white.base,
	primaryVariant: baseTokens.color.blue.darken40,
	onPrimaryVariant: baseTokens.color.white.base,

	// Secondary
	secondary: baseTokens.color.cyan.darken40,
	onSecondary: baseTokens.color.white.base,
	secondaryVariant: baseTokens.color.cyan.darken60,
	onSecondaryVariant: baseTokens.color.white.base,

	// Overlay
	overlay: baseTokens.color.grey.alpha40,

	// Surface
	surface: baseTokens.color.white.base,
	surfaceBright: baseTokens.color.blue.lighten97,
	surfaceDim: baseTokens.color.blue.lighten90,
	onSurface: baseTokens.color.grey.darken60,
	onSurfaceVariant: baseTokens.color.grey.base,

	// Background
	background: baseTokens.color.blue.lighten90,
	onBackground: baseTokens.color.grey.darken60,
	backgroundVariant: baseTokens.color.white.base,
	onBackgroundVariant: baseTokens.color.grey.lighten40,

	// Feedback
	info: baseTokens.color.blue.base,
	infoVariant: baseTokens.color.blue.lighten80,
	infoVariantLighten: baseTokens.color.blue.lighten90,
	onInfo: baseTokens.color.white.base,
	onInfoVariant: baseTokens.color.blue.darken20,
	error: baseTokens.color.orange.darken20,
	onError: baseTokens.color.white.base,
	errorVariant: baseTokens.color.orange.lighten80,
	errorVariantLighten: baseTokens.color.orange.lighten90,
	onErrorVariant: baseTokens.color.orange.darken60,
	success: baseTokens.color.green.base,
	successVariant: baseTokens.color.green.lighten80,
	successVariantLighten: baseTokens.color.green.lighten90,
	onSuccess: baseTokens.color.grey.darken60,
	onSuccessVariant: baseTokens.color.green.darken60,
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
	interactionDarkEnabled: baseTokens.color.transparentBlue.alpha00,
	interactionDarkHover: baseTokens.color.transparentBlue.alpha08,
	interactionDarkPressed: baseTokens.color.transparentBlue.alpha18,
	interactionDarkenEnabled: baseTokens.color.transparentBlack.alpha00,
	interactionDarkenHover: baseTokens.color.transparentBlack.alpha20,
	interactionDarkenPressed: baseTokens.color.transparentBlack.alpha40,
	interactionDark: baseTokens.color.blue.base,
	interactionDarken: baseTokens.color.black.base,
	interactionLighten: baseTokens.color.white.base,
}
