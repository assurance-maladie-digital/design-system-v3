import type { VariantType, DensityType } from '@/types/vuetifyTypes'

export const config = {
	footer: {
		elevation: 3,
		color: 'parma-darken60',
		height: 'auto',
	},
	goTopBtn: {
		elevation: 0,
		density: 'compact' as DensityType,
		icon: 'true',
		variant: 'text' as VariantType,
		color: 'parma-darken60',
	},
	goTopBtnIcon: {
		color: 'white',
	},
}
