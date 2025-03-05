import { create } from '@storybook/theming/create'

export default create({
	base: 'light',
	brandTitle: 'PA-DS',
	brandUrl: './',
	brandImage: 'https://www.assurance-maladie.ameli.fr/themes/custom/ameli_instit/images/logo-assurance-maladie.svg', // TODO: Update with PA logo
	brandTarget: '_self',

	colorPrimary: '#0c419a',
	colorSecondary: '#0c419a',

	// UI
	appBg: '#e7ecf5',
	appContentBg: 'white',
	appBorderColor: 'grey',
	appBorderRadius: 4,

	// Text colors
	textColor: '#0c419a',
	textInverseColor: 'rgba(255,255,255,0.9)',

	// Toolbar default and active colors
	barTextColor: '#0c419a',
	barSelectedColor: '#0c419a',
	barBg: '#FFFFFF',

	// Form colors
	inputBg: 'white',
	inputBorder: '#0c419a',
	inputTextColor: '#0c419a',
	inputBorderRadius: 4,

	// Links colors
	textMutedColor: '#0c419a',
})
