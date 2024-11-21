import { cnamSemanticTokens } from '@/designTokens'

export const config = {
	sheet: {
		theme: 'dark',
		dense: true,
		color: cnamSemanticTokens.colors.background.accentContrasted,
	},
	tabs: {
		'height': '53',
		'show-arrows': true,
	},
	tab: {
		'base-color': cnamSemanticTokens.colors.text.subduedOnDark,
		'slider-color': '#fff',
		'ripple': false,
	},
}
