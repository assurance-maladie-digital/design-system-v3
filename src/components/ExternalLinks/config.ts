import { cnamColorsTokens } from '@/designTokens/tokens/cnam/cnamColors'

export const config = {
	menu: {
		tile: true,
		zIndex: 4,
		offset: 0,
	},
	btn: {
		tile: true,
		minHeight: '48px',
		minWidth: '328px',
		color: cnamColorsTokens.blue.lighten20,
		class: 'd-flex px-3',
	},
	btnIcon: {
		color: 'white',
	},
	linkIcon: {
		color: 'rgba(0, 0, 0, .54)',
	},
	list: {
		border: false,
		elevation: 3,
		class: 'py-0',
	},
	listItem: {
		target: '_blank',
		rel: 'noopener noreferrer',
	},
	sheet: {
		class: 'px-4 py-3',
	},
}
