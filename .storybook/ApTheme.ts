import { create } from '@storybook/theming/create'

export default create({
	base: 'light',
	brandTitle: 'AmeliPro',
	brandUrl: './',
	brandImage: '/logos/logo-amelipro.svg',
	brandTarget: '_self',

	colorPrimary: 'rgba(0, 81, 109, 0.7)',
	colorSecondary: 'rgba(0, 81, 109, 1)',

	// UI
	appBg: 'rgba(0, 81, 109, 0.08)',
	appContentBg: 'white',
	appBorderColor: 'grey',
	appBorderRadius: 4,

	// Text colors
	textColor: 'rgb(0,34,44)',
	textInverseColor: 'rgba(255,255,255,0.9)',

	// Toolbar default and active colors
	barTextColor: 'rgba(0, 81, 109, 1)',
	barSelectedColor: 'rgba(0, 81, 109, 1)',
	barBg: 'rgba(244, 245, 241, 0.9)',

	// Form colors
	inputBg: 'white',
	inputBorder: 'rgba(0, 81, 109, 1)',
	inputTextColor: 'rgba(0, 81, 109, 1)',
	inputBorderRadius: 4,

	// Links colors
	textMutedColor: 'rgba(0, 81, 109, 1)',
})
