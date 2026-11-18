import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import remarkGfm from 'remark-gfm'

const isDev = process.env.NODE_ENV === 'development'
// Outil de travail local : aucun Storybook déployé ne doit le porter, et
// Netlify lance `build-storybook` pour tous ses environnements.
const showConformitePanel = isDev

// Outils et composants réservés au Storybook local : la rubrique Labs
// (composants en cours de validation) n'est pas publiée tant qu'elle n'est pas prête.
const devOnlyComponents = ['ComponentStatusTable', 'SyNavList']

const stories = [
	// Tous les dossiers de src/ sauf components/ et stories/
	'../src/!(components|stories)/**/*.mdx',
	'../src/!(components|stories)/**/*.stories.@(js|jsx|mjs|ts|tsx)',

	// stories/ sauf Labs/
	'../src/stories/!(Labs)/**/*.mdx',
	'../src/stories/!(Labs)/**/*.stories.@(js|jsx|mjs|ts|tsx)',

	// components/ sauf les composants réservés au dev
	`../src/components/!(${devOnlyComponents.join('|')})/**/*.mdx`,
	`../src/components/!(${devOnlyComponents.join('|')})/**/*.stories.@(js|jsx|mjs|ts|tsx)`,
]

if (isDev) {
	stories.push(
		'../src/stories/Labs/**/*.mdx',
		'../src/stories/Labs/**/*.stories.@(js|jsx|mjs|ts|tsx)',
		...devOnlyComponents.flatMap(name => [
			`../src/components/${name}/**/*.mdx`,
			`../src/components/${name}/**/*.stories.@(js|jsx|mjs|ts|tsx)`,
		]),
	)
}

const config: StorybookConfig = {
	stories,
	staticDirs: ['./public'],
	features: {
		// Hide the "Get started" onboarding checklist card in the sidebar.
		sidebarOnboardingChecklist: false,
		// Needed by '@storybook/addon-mcp'
		componentsManifest: true,
		experimentalDocgenServer: true,
	},
	// Le manager est bundlé à part : la décision lui passe par le <head>.
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
		'@storybook/addon-mcp',
	],
	framework: {
		name: '@storybook/vue3-vite',
		options: {
			// tsconfig.json n'a que des références : le checker a besoin de celui qui inclut src/.
			docgen: { plugin: 'vue-component-meta', tsconfig: 'tsconfig.app.json' },
		},
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
					'@storybook/vue3/dist/entry-preview-docs.mjs',
				],
			},
		})
	},
}
export default config
