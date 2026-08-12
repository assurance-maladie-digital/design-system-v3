import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'cypress'
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

async function createCypressViteConfig() {
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
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'@tests': fileURLToPath(new URL('./tests', import.meta.url)),
			},
		},
		build: {
			rollupOptions: {
				external: ['vue', /^vuetify/],
				output: {
					globals: {
						vue: 'Vue',
						vuetify: 'Vuetify',
					},
				},
			},
		},
		esbuild: {
			supported: {
				destructuring: true,
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
			esbuildOptions: {
				supported: {
					destructuring: true,
				},
			},
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
		specPattern: 'src/**/*.cy.ts',
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
