type VariantType = 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'
type DensityType = 'comfortable' | 'compact'
type locationType = 'start' | 'end' | 'top' | 'bottom' | 'start center' | 'end center' | 'top center' | 'bottom center'
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
		color: 'grey-darken-20',
	},
}
