import type { IndexedObject } from '@/components/Amelipro/types'

export const apColorsTokens = {
	apBlack: { base: '#000000' },
	apBlue: {
		base: '#0C419A',
		darken1: '#00749C',
		darken2: '#00516D',
		lighten1: '#99DBF2',
		lighten2: '#CCEDF9',
		lighten3: '#E6F6FC',
		lighten4: '#F3FBFE',
	},
	apGreen: {
		base: '#56C271',
		darken1: '#459B5A',
		darken2: '#337343',
		lighten1: '#78CE8D',
		lighten2: '#DDF3E3',
	},
	apGrey: {
		base: '#545859',
		darken1: '#1A1B1B',
		lighten1: '#CCCDCE',
		lighten2: '#DDDEDE',
		lighten3: '#EEEEEE',
		lighten4: '#F3F4F4',
		lighten5: '#FAFAFA',
		lighten6: '#F4F8F9',
	},
	apParme: {
		base: '#C8D1E6',
		darken1: '#4D547D',
	},
	apPink: { base: '#D00063' },
	apRed: {
		base: '#B33F2E',
		darken1: '#9D3728',
		darken2: '#70281C',
		lighten1: '#E67261',
		lighten2: '#EC9588',
		lighten3: '#F9DCD7',
		lighten4: '#FDF0EE',
	},
	apTurquoise: {
		base: '#33BCA5',
		darken1: '#007863',
		darken2: '#006654',
		darken3: '#005647',
		lighten1: '#CCEEE8',
		lighten2: '#E6F7F4',
	},
	apWhite: { base: '#FFFFFF' },
	apYellow: {
		base: '#F0B323',
		darken1: '#D8A120',
		darken2: '#C08F1C',
		darken3: '#A87D19',
		darken4: '#906C16',
		lighten1: '#F3C24F',
		lighten2: '#FED66D',
		lighten3: '#F7D990',
		lighten4: '#F9E1A7',
		lighten5: '#FCF0D3',
	},
}

export const apColorClasses: IndexedObject = {}

export function toKebabCase(value: string): string {
	return value.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

Object.entries(apColorsTokens).forEach(([colorName, colorValues]) => {
	Object.entries(colorValues).forEach(([variationName, colorValue]) => {
		const colorClass = toKebabCase(`${colorName}-${variationName}`
			.replace(/\d+/, '-$&')
			.replace('-base', ''))
		apColorClasses[colorClass] = colorValue as string
	})
})
