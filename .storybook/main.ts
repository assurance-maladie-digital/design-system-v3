import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	staticDirs: ['./public'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-viewport',
		'@jls-digital/storybook-addon-code',
	],
	framework: {
		name: '@storybook/vue3-vite',
		options: {},
	},
}
export default config
