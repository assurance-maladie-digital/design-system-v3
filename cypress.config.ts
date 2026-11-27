import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'cypress'
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

async function createCypressViteConfig() {
	return {
		// Dedicated cache dir: the Cypress config differs from the Storybook/dev
		// config, and servers sharing node_modules/.vite would invalidate each
		// other's optimized deps on every alternation.
		cacheDir: 'node_modules/.vite-cypress',
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
			rolldownOptions: {
				external: ['vue', /^vuetify/],
				output: {
					globals: {
						vue: 'Vue',
						vuetify: 'Vuetify',
					},
				},
			},
		},
		optimizeDeps: {
			// Cypress loads specs through dynamic imports, so the dep scanner never
			// sees their imports: every runtime dependency must be listed here.
			// A dependency discovered mid-run triggers a full re-optimization,
			// which changes every chunk hash and breaks pages still referencing
			// the previous generation ("The file does not exist ... in the
			// optimize deps directory").
			include: [
				'@mdi/js',
				'cypress/vue',
				'dayjs',
				'dayjs/locale/fr',
				'dayjs/plugin/customParseFormat',
				'dayjs/plugin/isBetween',
				'dayjs/plugin/isLeapYear',
				'dayjs/plugin/localizedFormat',
				'dayjs/plugin/timezone',
				'dayjs/plugin/utc',
				'deepmerge',
				'iso-639-1',
				'maska',
				'maska/vue',
				'pdfjs-dist',
				'slugify',
				'vue',
				'vue-router',
				'vuetify',
				'vuetify/components',
				'vuetify/components/VBtn',
				'vuetify/components/VCheckbox',
				'vuetify/components/VDataTable',
				'vuetify/components/VForm',
				'vuetify/components/VList',
				'vuetify/components/VMessages',
				'vuetify/components/VNavigationDrawer',
				'vuetify/components/VRadio',
				'vuetify/components/VRadioGroup',
				'vuetify/components/VSkeletonLoader',
				'vuetify/components/VTextarea',
				'vuetify/components/VTextField',
				'vuetify/directives',
				'vuetify/iconsets/mdi-svg',
				'vuetify/lib/components/VDataTable/composables/paginate.mjs',
				'vuetify/lib/composables/icons.mjs',
				'vuetify/lib/composables/validation.mjs',
				'vuetify/lib/framework.mjs',
				'vuetify/locale',
			],
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
