import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { coverageConfigDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import dts from 'vite-plugin-dts'

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
	plugins: [
		dts({
			exclude: ['**/*.stories.ts', '**/*.spec.ts'],
			entryRoot: 'src',
			outDir: 'dist',
			tsconfigPath: 'tsconfig.app.json',
			rollupTypes: false,
			insertTypesEntry: true,
			copyDtsFiles: true,
			cleanVueFileName: true,
			aliasesExclude: [/vuetify/],
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
	build: {
		lib: {
			entry: resolve(__dirname, 'src/main.ts'),
			name: 'DesignSystemV3',
			fileName: 'design-system-v3',
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
	test: {
		environment: 'happy-dom',
		setupFiles: ['./tests/unit/setup.ts'],
		server: {
			deps: {
				inline: ['vuetify'],
			},
		},
		snapshotSerializers: [
			'./node_modules/vue3-snapshot-serializer/index.js',
		],
		coverage: {
			enabled: true,
			provider: 'v8',
			reportsDirectory: './tests/unit/coverage',
			include: [
				'src/components/**/*.{js,vue,ts}',
				'src/composables/**',
				'src/utils/**',
			],
			exclude: [
				'src/**/*.spec.{js,vue,ts}',
				'src/**/*.stories.*',
				'src/**/*ExpertiseLevelEnum.ts*',
				'src/**/*AccessibiliteItems.ts*',
				'src/**/tests/data/*',
				'src/**/constants/*',
				'src/composables/index.ts*',
				'src/**/types.*',
				'src/main.ts',
				'src/components/index.ts',
				'src/components/TestA11y.vue',
				'src/components/customizableOptions.vue',
				'src/components/gridsTests.vue',
				'src/components/TestDesignTokensComponent/*',
				...coverageConfigDefaults.exclude,
			],
			/* thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            }, */
		},
	},
})
