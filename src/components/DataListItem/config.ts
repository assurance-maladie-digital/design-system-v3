import type { VariantType } from '@/types/vuetifyTypes'

export const config = {
	icon: {
		size: 24,
		class: 'mr-4 mt-2',
	},
	chip: {
		class: 'mt-1',
	},
	actionBtn: {
		variant: 'text' as VariantType,
		size: 'small',
		color: 'secondary',
		class: 'text-body-1 pa-0',
	},
}
