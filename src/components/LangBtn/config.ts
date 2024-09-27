type VariantType = 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'

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
