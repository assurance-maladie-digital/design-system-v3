import { baseTokens } from '../baseTokens'

export const apLightTheme = {
	risquePro: baseTokens.color.red.base,

	// Border
	border: baseTokens.color.cyan.darken40,
	borderVariant: baseTokens.color.grey.base,
	borderBright: baseTokens.color.white.base,
	borderDim: baseTokens.color.white.alpha40,

	// Disabled
	disabled: baseTokens.color.grey.lighten80,
	inverseSurface: baseTokens.color.grey.base,
	onDisabled: baseTokens.color.grey.lighten40,
	onDisabledVariant: baseTokens.color.white.alpha40,

	// Primary
	primary: baseTokens.color.cyan.darken40,
	onPrimary: baseTokens.color.white.base,
	primaryVariant: baseTokens.color.cyan.darken60,
	onPrimaryVariant: baseTokens.color.white.base,

	// Secondary
	secondary: baseTokens.color.blue.base,
	onSecondary: baseTokens.color.white.base,
	secondaryVariant: baseTokens.color.blue.darken40,
	onSecondaryVariant: baseTokens.color.white.base,

	// Overlay
	overlay: baseTokens.color.grey.alpha40,

	// Surface
	surface: baseTokens.color.white.base,
	surfaceBright: baseTokens.color.cyan.lighten97,
	surfaceDim: baseTokens.color.cyan.lighten90,
	onSurface: baseTokens.color.grey.darken60,
	onSurfaceVariant: baseTokens.color.grey.lighten90,

	// Background
	background: baseTokens.color.cyan.lighten97,
	backgroundVariant: baseTokens.color.white.base,
	onBackground: baseTokens.color.grey.darken60,
	onBackgroundVariant: baseTokens.color.grey.base,

	// Feedback
	info: baseTokens.color.parma.darken40,
	infoVariant: baseTokens.color.parma.lighten80,
	infoVariantLighten: baseTokens.color.parma.lighten90,
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
	warningVariantLighten: baseTokens.color.yellow.lighten90,
	onWarningVariant: baseTokens.color.yellow.darken60,

	// Interaction
	interactionDark: baseTokens.color.cyan.darken40,
	interactionDarken: baseTokens.color.black.base,
	interactionLighten: baseTokens.color.white.base,
}
