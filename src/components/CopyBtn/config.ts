import type { VariantType, DensityType, locationType } from '@/types/vuetifyTypes'

export const config = {
	menu: {
		location: 'end center' as locationType,
		offset: 16,
		zIndex: 8,
		contentClass: 'sy-copy-tooltip-menu text-white text-body-2 ml-2',
	},
	btn: {
		icon: true,
		variant: 'text' as VariantType,
		color: 'primary',
		density: 'comfortable' as DensityType,
		rounded: 'pill',
	},
	icon: {
		// Note: 'grey-darken-20' est utilisé en attendant de migrer vers une couleur du thème DS
		color: 'grey-darken-20',
	},
}
