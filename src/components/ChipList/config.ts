type VuetifyVariant = 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'

type PropsList = {
	[key: string]: unknown
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
