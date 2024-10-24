import type { VariantType, DensityType } from '@/types/vuetifyTypes'
import { cnamColorsTokens } from '@/designTokens'

export const config = {
	footer: {
		elevation: 3,
		color: cnamColorsTokens.parma.darken60,
		height: 'auto',
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
