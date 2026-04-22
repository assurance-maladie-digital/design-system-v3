import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'cypress'
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin'

async function createCypressViteConfig() {
	const [vueModule, vuetifyModule] = await Promise.all([
		import('@vitejs/plugin-vue'),
		import('vite-plugin-vuetify'),
	])
	const { default: vue } = vueModule
	const { default: vuetify, transformAssetUrls } = vuetifyModule

	return {
		plugins: [
			vue({
				template: { transformAssetUrls },
			}),
			vuetify({
				autoImport: false,
				styles: { configFile: 'src/assets/settings.scss' },
			}),
		],
		resolve: {
			alias: {
				'vue': 'vue/dist/vue.esm-bundler.js',
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'@tests': fileURLToPath(new URL('./tests', import.meta.url)),
			},
		},
		css: {
			preprocessorOptions: {
				scss: { api: 'modern' },
				sass: { api: 'modern' },
			},
		},
		optimizeDeps: {
			include: ['vuetify', 'vuetify/components', 'vuetify/directives', 'vuetify/iconsets/mdi-svg', 'vuetify/locale'],
		},
	}
}

export default defineConfig({
	component: {
		devServer: {
			framework: 'vue',
			bundler: 'vite',
			viteConfig: createCypressViteConfig,
		},
		specPattern: 'src/**/*.visual.cy.ts',
		supportFile: 'cypress/support/component.ts',
		indexHtmlFile: 'cypress/support/component-index.html',
		video: false,
		allowCypressEnv: false,
		setupNodeEvents(on) {
			addMatchImageSnapshotPlugin(on)
		},
		viewportWidth: 1280,
		viewportHeight: 720,
	},
})
