import type { VariantType, DensityType } from '@/types/vuetifyTypes'

export const config = {
	footer: {
		elevation: 3,
		color: 'backgroundSurface',
		height: 'auto',
	},
	goTopBtn: {
		elevation: 0,
		density: 'compact' as DensityType,
		icon: 'true',
		variant: 'text' as VariantType,
		color: 'backgroundSurface',
	},
	goTopBtnIcon: {
		color: 'white',
	},
}
