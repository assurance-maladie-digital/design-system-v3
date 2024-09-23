import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { cnamLightTheme, cnamContextualTokens, cnamColorsTokens } from '../src/designTokens'
import { createFlattenTheme } from '../src/designTokens/utils'

import 'vuetify/styles'
import './storybook.css';

const vuetify = createVuetify({
	theme: {
		themes: {
			light: {
				dark: false,
				colors: {
					...cnamLightTheme,
				},
				variables: {
					'border-color': cnamColorsTokens.grey.base,
					...createFlattenTheme(cnamContextualTokens),
				},
			},
		},
	},
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
})

setup((app) => {
	app.use(vuetify)
})

const preview: Preview = {
	parameters: {
		options: {
			storySort: {
				order: ['Synapse', 'Components', 'Templates'],
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: 'main',
			values: [
				{
					name: 'main',
					value: '#e7ecf5', // Colors.Blue.lighten-90
				},
				{
					name: 'surface',
					value: '#fff', // Neutral.white
				},
				{
					name: 'raised',
					value: '#f8f9fc', // Colors.Blue.lighten-97
				},
				{
					name: 'accent',
					value: '#0c419a', // Primary.base
				},
				{
					name: 'accent-contrasted',
					value: '#0a347b', // Primary.darker-2
				},
				{
					name: 'accent-alt',
					value: '#545859', // Neutral.black-lighter
				},
				{
					name: 'info',
					value: '#ced9eb', // Info.info-lighter
				},
				{
					name: 'info-subdued',
					value: '#e7ecf5', // Info.info-lightest
				},
				{
					name: 'info-contrasted',
					value: '#0c419a', // Info.default
				},
				{
					name: 'success',
					value: '#cceee8', // Success.lighter
				},
				{
					name: 'success-subdued',
					value: '#e5f7f4', // Success.lightest
				},
				{
					name: 'success-contrasted',
					value: '#56c271', // Success.default
				},
			],
		},
	},
	initialGlobals: {
		vueMdx: {
			beforeVueAppMount(app): void {
				app.use(vuetify)
			},
		},
	},
}

export default preview
