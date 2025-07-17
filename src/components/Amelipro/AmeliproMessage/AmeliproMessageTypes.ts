import type { MessageTypes } from './types'

export const AmeliproMessageTypes: MessageTypes = {
	error: {
		color: 'ap-red',
		icon: 'sensInterdit',
		type: 'light',
	},
	info: {
		color: 'ap-parme-darken-1',
		icon: 'information',
		type: 'light',
	},
	success: {
		color: 'ap-turquoise-darken-1',
		icon: 'check',
		type: 'light',
	},
	warning: {
		color: 'ap-yellow',
		icon: 'exclamation',
		iconBgColor: 'ap-yellow',
		textColor: 'ap-yellow-darken-4',
		type: 'dark',
	},
}
