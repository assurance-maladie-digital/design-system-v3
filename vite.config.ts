import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { coverageConfigDefaults } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		dts({
			exclude: ['**/*.stories.ts', '**/*.spec.ts', 'src/stories/**'],
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
			entry: {
				'design-system-v3': resolve(__dirname, 'src/main.ts'),
				'vuetifyConfig': resolve(__dirname, 'src/vuetifyConfig.ts'),
			},
			name: 'DesignSystemV3',
			cssFileName: 'synapse',
			formats: ['es'],
			fileName: (format, entryAlias) => `${entryAlias}.js`,
		},
		chunkSizeWarningLimit: 4000,
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
		include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', '**/*.a11y.spec.ts'],
		environment: 'happy-dom',
		isolate: true,
		maxConcurrency: process.env.CI ? 1 : 5,
		server: {
			deps: {
				inline: ['vuetify'],
			},
		},
		setupFiles: ['./tests/unit/setup.ts'],
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
				'src/components/DatePicker/docExamples/**',
				'src/components/DatePicker/playground/**',
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
