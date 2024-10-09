import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { coverageConfigDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		dts({
			rollupTypes: true,
			insertTypesEntry: true,
			tsconfigPath: './tsconfig.app.json',
		}),
		vue(),
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
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				silenceDeprecations: ['legacy-js-api'],
			},
		},
	},
	test: {
		environment: 'happy-dom',
		server: {
			deps: {
				inline: ['vuetify'],
			},
		},
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
