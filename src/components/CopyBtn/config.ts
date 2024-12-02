import type { VariantType, DensityType, locationType } from '@/types/vuetifyTypes'

export const config = {
	menu: {
		location: 'end center' as locationType,
		offset: 16,
		zIndex: 8,
		contentClass: 'vd-copy-tooltip-menu text-white text-body-2 ml-2',
	},
	btn: {
		icon: true,
		variant: 'text' as VariantType,
		density: 'comfortable' as DensityType,
	},
	icon: {
		// TODO refactor to use our theme color
		color: 'grey-darken-20',
	},
}
