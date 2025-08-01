import type { StorybookConfig } from '@storybook/vue3-vite'
import vuetify from 'vite-plugin-vuetify'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	staticDirs: ['./public'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-viewport',
		'@jls-digital/storybook-addon-code',
		'@storybook/addon-queryparams',
	],
	framework: {
		name: '@storybook/vue3-vite',
		options: {},
	},
	viteFinal: async (config) => {
		config.plugins?.push(
			vuetify({
				styles: { configFile: 'src/assets/settings.scss' },
			})
		)
		return config
	},
}
export default config
