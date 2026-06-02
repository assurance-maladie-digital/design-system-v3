import { create } from '@storybook/theming/create'

export default create({
	base: 'light',
	brandTitle: 'AmeliPro',
	brandUrl: './',
    brandImage: '/logos/logo-amelipro-color.svg',
	brandTarget: '_self',

    colorPrimary: '#0084B2',
    colorSecondary: '#0084B2',

	// UI
    appBg: '#FFFFFF',
	appContentBg: 'white',
	appBorderColor: 'grey',
	appBorderRadius: 4,

	// Text colors
    textColor: '#0084b2',
	textInverseColor: 'rgba(255,255,255,0.9)',

	// Toolbar default and active colors
    barTextColor: '#0084b2',
    barSelectedColor: '#0084b2',
    barBg: '#FFFFFF',

	// Form colors
	inputBg: 'white',
    inputBorder: '#0084b2',
    inputTextColor: '#0084b2',
	inputBorderRadius: 4,

	// Links colors
    textMutedColor: '#0084b2',
})
