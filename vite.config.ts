import { URL, fileURLToPath } from 'node:url'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// import { coverageConfigDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'

function generateVuetifyGlobals() {
	const components = [
		'VForm',
		'VBtn',
		'VIcon',
		'VChip',
		'VMenu',
		'VRadioGroup',
		'VRadio',
		'VTable',
		'VDataTable',
		'VDataTableServer',
		'VBtnToggle',
		'VCheckbox',
		'VSelect',
		'VRating',
		'VRangeSlider',
		'VSnackbar',
		'VTooltip',
		'VTextField',
		'VInput',
		'VToolbar',
		'VNavigationDrawer',
		'VTabs',
		'VLayout',
		'VFooter',
		'VAlert',
		'VDivider',
		'VSheet',
		'VList',
		'VGrid',
		'VDialog',
		'VCard',
		'VSkeletonLoader',
		'VBadge',
		'VExpansionPanel',
		'VAutocomplete',
		'VSlider',
		'VTextarea',
		'transitions',
		'VProgressLinear',
		'VLocaleProvider',
	]

	const globals: Record<string, string> = {}

	for (const component of components) {
		globals[`vuetify/lib/components/${component}/index.mjs`] = component
	}
	globals['vuetify/components/VSkeletonLoader'] = 'VSkeletonLoader'
	globals['vuetify/lib/directives/index.mjs'] = 'vuetifyDirectives'

	return globals
}

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/main.ts'),
			fileName: 'design-system-v3',
			name: 'DesignSystemV3',
		},
		rollupOptions: {
			external: ['vue', /vuetify/],
			output: {
				globals: {
					'vue': 'Vue',
					'vuetify': 'Vuetify',
					'vuetify/directives': 'vuetifyDirectives',
					'vuetify/lib/directives': 'vuetifyDirectives',
					...generateVuetifyGlobals(),
				},
			},
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
			},
			sass: {
				api: 'modern-compiler',
			},
		},
	},
	plugins: [
		dts({
			aliasesExclude: [/vuetify/],
			cleanVueFileName: true,
			copyDtsFiles: true,
			entryRoot: 'src',
			exclude: ['**/*.stories.ts', '**/*.spec.ts'],
			insertTypesEntry: true,
			outDir: 'dist',
			rollupTypes: false,
			tsconfigPath: 'tsconfig.app.json',
		}),
		vue({
			template: {
				transformAssetUrls,
			},
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
	// test: {
	// ... déplacé dans vitest.config.ts
	// },
})
