import { baseContextualTokens } from '../baseContextualTokens'

export const cnamContextualTokens = {
	...baseContextualTokens,
	colors: {
		background: '#ffffff',
		border: '#dddddd',
		text: '#333333',
		icon: '#666666',
		overlay: 'rgba(0, 0, 0, 0.5)',
		interactive: '#fff',
		// Vuetify theme keys — not output as SCSS tokens; consumed by Vuetify's theme system
		interactiveHover: '#E7ECF5',
		interactivePressed: '#CED9EB',
		interactiveFocus: '#E7ECF5',
		interactiveDisabled: '#fff',
		interactiveHoverOnSelected: '#CED9EB',
	},
}
