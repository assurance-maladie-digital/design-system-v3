import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import remarkGfm from 'remark-gfm'

const isDev = process.env.NODE_ENV === 'development'

const stories = [
	'../src/**/*.mdx',
	'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
]

if (!isDev) {
	stories.push(
		'!../src/components/ComponentStatusTable/**/*.mdx',
		'!../src/components/ComponentStatusTable/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	)
}

const config: StorybookConfig = {
	stories,
	staticDirs: ['./public'],
	addons: [
		'@storybook/addon-links',
		'@jls-digital/storybook-addon-code',
		'@storybook/addon-queryparams',
		'@storybook/addon-a11y',
		{
			name: '@storybook/addon-docs',
			options: {
				mdxPluginOptions: {
					mdxCompileOptions: {
						remarkPlugins: [remarkGfm], // doit être présent
					},
				},
			},
		},
	],
	framework: {
		name: '@storybook/vue3-vite',
		options: {},
	},
	async viteFinal(baseConfig) {
		return mergeConfig(baseConfig, {
			esbuild: {
				supported: {
					destructuring: true,
				},
			},
			optimizeDeps: {
				esbuildOptions: {
					supported: {
						destructuring: true,
					},
				},
				exclude: [
					'@storybook/addon-docs',
					'@storybook/addon-docs/preview',
					'@storybook/addon-docs/blocks',
					'@storybook/addon-essentials/docs/preview',
					'@storybook/addon-essentials/docs/mdx-react-shim',
					'@storybook/addon-docs/blocks',
					'@storybook/vue3/dist/entry-preview-docs.mjs',
				],
			},
		})
	},
}
export default config
