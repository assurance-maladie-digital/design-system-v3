import { create } from '@storybook/theming/create'

export default create({
	base: 'light',
	brandTitle: 'PA-DS',
	brandUrl: './',
	brandImage: '/logos/logo-assurance-maladie.svg',
	brandTarget: '_self',

	colorPrimary: '#0C419A',
	colorSecondary: '#07275C',

	// UI
	appBg: '#FFFFFF',
	appContentBg: 'white',
	appBorderColor: 'grey',
	appBorderRadius: 4,

	// Text colors
	textColor: '#0C419A',
	textInverseColor: 'rgba(255,255,255,0.9)',

	// Toolbar default and active colors
	barTextColor: '#0C419A',
	barSelectedColor: '#0C419A',
	barBg: '#FFFFFF',

	// Form colors
	inputBg: 'white',
	inputBorder: '#0C419A',
	inputTextColor: '#0C419A',
	inputBorderRadius: 4,

	// Links colors
	textMutedColor: '#0C419A',
})
