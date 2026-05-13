type VuetifyVariant = 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'

type PropsList = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
	[key: string]: any
}

interface ComponentConfig {
	[key: string]: PropsList
}

export const config: ComponentConfig = {
	chip: {
		color: 'primary',
		size: 'small',
		variant: 'flat' as VuetifyVariant,
		class: 'ma-1',
	},
	btn: {
		size: 'small',
		density: 'compact',
		variant: 'text' as VuetifyVariant,
		rounded: 'pill',
	},
	icon: {
		size: 'medium',
	},
}
