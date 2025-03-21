import { create } from '@storybook/theming/create'

export default create({
	base: 'light',
	brandTitle: 'CNAM-DS',
	brandUrl: './',
	brandImage: '/logos/logo-assurance-maladie.svg',
	brandTarget: '_self',

	colorPrimary: '#00516D',
	colorSecondary: '#00516D',

	// UI
	appBg: '#00516D',
	appContentBg: 'white',
	appBorderColor: 'grey',
	appBorderRadius: 4,

	// Text colors
	textColor: '#00516D',
	textInverseColor: 'rgba(255,255,255,0.9)',

	// Toolbar default and active colors
	barTextColor: '#00516D',
	barSelectedColor: '#00516D',
	barBg: '#00516D',

	// Form colors
	inputBg: 'white',
	inputBorder: '#00516D',
	inputTextColor: '#00516D',
	inputBorderRadius: 4,

	// Links colors
	textMutedColor: '#00516D',
})
