import { create } from '@storybook/theming/create'

export default create({
	base: 'light',
	brandTitle: 'CNAM-DS',
	brandUrl: './',
	brandImage: 'https://www.assurance-maladie.ameli.fr/themes/custom/ameli_instit/images/logo-assurance-maladie.svg',
	brandTarget: '_self',

	colorPrimary: '#000091',
	colorSecondary: '#000091',

	// UI
	appBg: '#f0f0f0',
	appContentBg: 'white',
	appBorderColor: 'grey',
	appBorderRadius: 4,

	// Text colors
	textColor: '#000091',
	textInverseColor: 'rgba(255,255,255,0.9)',

	// Toolbar default and active colors
	barTextColor: '#000091',
	barSelectedColor: '#000091',
	barBg: '#FFFFFF',

	// Form colors
	inputBg: 'white',
	inputBorder: '#000091',
	inputTextColor: '#000091',
	inputBorderRadius: 4,



})
