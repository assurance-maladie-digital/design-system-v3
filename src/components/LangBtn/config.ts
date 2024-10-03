import type { VariantType } from '@/types/vuetifyTypes'

const defaultOptions = {
	menu: {
		offsetY: true,
	},
	btn: {
		color: 'primary',
		variant: 'outlined' as VariantType,
		ripple: true,
	},
	icon: {
		class: 'ml-1',
	},
}

export default defaultOptions
