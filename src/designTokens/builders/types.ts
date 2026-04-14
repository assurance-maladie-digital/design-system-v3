export type ColorScale = Record<string, string>
export type ColorsTokens = Record<string, ColorScale>

export interface ContextualColors {
	background: string
	border: string
	text: string
	icon: string
	overlay: string
	interactive: string
	// Vuetify theme keys — not output as SCSS tokens; consumed by Vuetify's theme system
	interactiveHover?: string
	interactivePressed?: string
	interactiveFocus?: string
	interactiveDisabled?: string
	interactiveHoverOnSelected?: string
}

export interface ContextualTokens {
	colors: ContextualColors
	gap: Record<number, string>
	iconSize: {
		xsmall: string
		small: string
		default: string
		large: string
	}
	radius: {
		rounded0: string
		rounded: string
		roundedLg: string
		roundedPill: string
	}
	padding: Record<number, string>
	fontSize: {
		titres: string
		titresAlternatifs: string
		corpsDeTexte: string
		liensEtLibelles: string
	}
}

export interface SpacingTokens {
	vertical: Record<string, string>
	horizontal: Record<string, string>
	container: Record<string, string>
}

export interface VariantInput {
	colors: ColorsTokens
	contextual: ContextualTokens
	semanticValues: Record<string, string>
	additionalContextual: Record<string, string>
	spacingTokens?: SpacingTokens
	extraPrimitives?: string[]
}
