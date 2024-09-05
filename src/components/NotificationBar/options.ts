type VariantType = 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'

const defaultOptions = {
	snackBar: {
		timeout: -1,
	},
	icon: {
		class: 'mr-2',
	},
	btn: {
		variant: 'text' as VariantType,
	},
}

export default defaultOptions
