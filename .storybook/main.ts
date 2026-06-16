import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'

const isDev = process.env.NODE_ENV !== 'production'

const config: StorybookConfig = {
	stories: [
		'../src/**/*.mdx',
		'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
		...(isDev ? ['./Adoption.mdx'] : []),
	],
	staticDirs: ['./public'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-viewport',
		'@jls-digital/storybook-addon-code',
		'@storybook/addon-queryparams',
		'@storybook/addon-a11y',
	],
	framework: {
		name: '@storybook/vue3-vite',
		options: {},
	},
	async viteFinal(baseConfig) {
		return mergeConfig(baseConfig, {
			optimizeDeps: {
				exclude: [
					'@storybook/addon-docs',
					'@storybook/addon-docs/preview',
					'@storybook/addon-docs/blocks',
					'@storybook/addon-essentials/docs/preview',
					'@storybook/addon-essentials/docs/mdx-react-shim',
					'@storybook/blocks',
					'@storybook/vue3/dist/entry-preview-docs.mjs',
				],
			},
		})
	},
}
export default config
