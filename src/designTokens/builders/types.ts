export type ColorScale = Record<string, string>
export type ColorsTokens = Record<string, ColorScale>

export interface ContextualColors {
	background: string
	border: string
	text: string
	icon: string
	overlay: string
	interactive: string
}

export interface ContextualTokens {
	colors: ContextualColors
	gap: Record<string | number, string | number>
	iconSize: {
		xsmall: string | number
		small: string | number
		default: string | number
		large: string | number
	}
	radius: {
		rounded0: string | number
		rounded: string | number
		roundedLg: string | number
		roundedPill: string | number
	}
	padding: Record<string | number, string | number>
	fontSize: {
		titres: string | number
		titresAlternatifs: string | number
		corpsDeTexte: string | number
		liensEtLibelles: string | number
	}
}

export interface VariantInput {
	colors: ColorsTokens
	contextual: ContextualTokens
	semanticValues: Record<string, string>
	additionalContextual: Record<string, string>
	includeContainerAliases: boolean
}
