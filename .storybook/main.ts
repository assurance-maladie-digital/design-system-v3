import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import remarkGfm from 'remark-gfm'

const isDev = process.env.NODE_ENV === 'development'

// Branche déployée par Netlify (`BRANCH`), absente en local.
const showConformitePanel = process.env.BRANCH !== 'prod'

const stories = [
	// Fichiers directement dans src/
	'../src/*.mdx',
	'../src/*.stories.@(js|jsx|mjs|ts|tsx)',

	// Tous les dossiers de src/ sauf components/
	'../src/!(components)/**/*.mdx',
	'../src/!(components)/**/*.stories.@(js|jsx|mjs|ts|tsx)',

	// components/ sauf ComponentStatusTable/
	'../src/components/!(ComponentStatusTable)/**/*.mdx',
	'../src/components/!(ComponentStatusTable)/**/*.stories.@(js|jsx|mjs|ts|tsx)',
]

if (isDev) {
	stories.push(
		'../src/components/ComponentStatusTable/**/*.mdx',
		'../src/components/ComponentStatusTable/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	)
}

const config: StorybookConfig = {
	stories,
	staticDirs: ['./public'],
	// L'onglet « Conformité » est un outil interne : visible en local, sur le
	// site de l'équipe et sur les deploy previews, absent du seul Storybook
	// publié. `NODE_ENV` ne sait pas les distinguer — Netlify construit tous
	// ses environnements avec `build-storybook` — d'où le test sur la branche.
	// Le manager est bundlé à part : on lui transmet la décision par le <head>.
	managerHead: head => `${head}<meta name="synapse-conformite" content="${showConformitePanel}">`,
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
