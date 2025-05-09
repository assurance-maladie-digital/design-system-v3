import type { VariantType } from '@/types/vuetifyTypes'

export const config = {
	btn: {
		size: 'small',
		variant: 'tonal' as VariantType,
		color: 'primary',
		class: 'ml-3',
		ariaLabel: 'Caractères accentués',
	},
	dialog: {
		width: 'auto',
		maxWidth: '600px',
	},
}
