import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'cypress'
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineConfig({
	component: {
		devServer: {
			framework: 'vue',
			bundler: 'vite',
			viteConfig: {
				plugins: [
					vue({
						template: { transformAssetUrls },
					}),
					vuetify({
						autoImport: true,
						styles: { configFile: 'src/assets/settings.scss' },
					}),
				],
				resolve: {
					alias: {
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
			},
		},
		specPattern: 'src/**/*.visual.cy.ts',
		supportFile: 'cypress/support/component.ts',
		indexHtmlFile: 'cypress/support/component-index.html',
		screenshotsFolder: 'cypress/snapshots/actual',
		video: false,
		setupNodeEvents(on) {
			addMatchImageSnapshotPlugin(on)
		},
		viewportWidth: 1280,
		viewportHeight: 720,
	},
})
