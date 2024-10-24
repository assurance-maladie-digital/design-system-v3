import type { VariantType, DensityType } from '@/types/vuetifyTypes'

export const config = {
	footer: {
		elevation: 3,
		color: 'primary',
		minHeight: '40px',
	},
	goTopBtn: {
		density: 'compact' as DensityType,
		icon: 'true',
		variant: 'text' as VariantType,
		elevation: 0,
	},
	goTopBtnIcon: {
		color: 'primary',
	},
}
