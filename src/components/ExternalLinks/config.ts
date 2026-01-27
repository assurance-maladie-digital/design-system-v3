import { cnamColorsTokens } from '@/designTokens/tokens/cnam/cnamColors'

export const config = {
	menu: {
		zIndex: 4,
		offset: 0,
	},
	btn: {
		tile: true,
		minHeight: '48px',
		minWidth: '328px',
		color: cnamColorsTokens.blue.base,
		class: 'd-flex px-3',
	},
	btnIcon: {
		color: 'white',
	},
	linkIcon: {
		size: 'large',
		color: 'rgba(0, 0, 0, .54)',
	},
	list: {
		class: 'py-0',
	},
	listItem: {
		target: '_blank',
		rel: 'noopener noreferrer',
		flat: true,
		rounded: 0,
		size: 'large',
	},
	sheet: {
		class: 'px-4 py-3',
	},
}
