const commonBtnConfig = {
	color: 'primary',
	height: 'auto',
	minHeight: '44px',
	class: 'text-wrap ma-2',
} as const

export const config = {
	banner: {
		rounded: true,
		elevation: 2,
		class: 'pa-8',
	},
	closeBtn: {
		icon: true,
		variant: 'text',
		width: '32px',
		height: '32px',
		class: 'ml-4',
	},
	backBtn: {
		icon: true,
		variant: 'text',
		width: '32px',
		height: '32px',
		class: 'ml-4',
	},
	customizeBtn: {
		...commonBtnConfig,
		variant: 'outlined',
	},
	rejectBtn: {
		...commonBtnConfig,
	},
	acceptBtn: {
		...commonBtnConfig,
	},
} as const
