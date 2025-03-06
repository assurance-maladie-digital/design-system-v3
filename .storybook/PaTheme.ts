import { create } from '@storybook/theming/create'

export default create({
	base: 'light',
	brandTitle: 'PA-DS',
	brandUrl: './',
	brandImage: '/logos/logo-pa.png',
	brandTarget: '_self',

	colorPrimary: 'rgba(74, 63, 89, 0.7)',
	colorSecondary: 'rgba(74, 63, 89, 1)',

	// UI
	appBg: 'rgba(74, 63, 89, 0.05)',
	appContentBg: 'white',
	appBorderColor: 'grey',
	appBorderRadius: 4,

	// Text colors
	textColor: '#4A3F59',
	textInverseColor: 'rgba(255,255,255,0.9)',

	// Toolbar default and active colors
	barTextColor: '#4A3F59',
	barSelectedColor: '#4A3F59',
	barBg: 'rgba(244, 245, 241, 0.7)',

	// Form colors
	inputBg: 'white',
	inputBorder: 'rgba(74, 63, 89, 1)',
	inputTextColor: 'rgba(74, 63, 89, 1)',
	inputBorderRadius: 4,

	// Links colors
	textMutedColor: 'rgba(74, 63, 89, 1)',
})
