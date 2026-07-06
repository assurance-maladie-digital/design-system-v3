import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

	staticDirs: ['./public'],

	addons: [
        '@storybook/addon-links',
        '@jls-digital/storybook-addon-code',
        '@storybook/addon-queryparams',
        '@storybook/addon-a11y',
        '@storybook/addon-docs'
    ],
	framework: {
		name: '@storybook/vue3-vite',
		options: {},
	},

	async viteFinal(baseConfig) {
		return mergeConfig(baseConfig, {
			build: {
				sourcemap: false,
			},
			optimizeDeps: {
				include: ['vue', '@storybook/addon-docs/blocks'],
			},
		})
	},
}
export default config
