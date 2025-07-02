import { configDefaults, coverageConfigDefaults, defineConfig, mergeConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
	test: {
		coverage: {
			enabled: true,
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
			include: [
				'src/components/**/*.{js,vue,ts}',
				'src/composables/**',
				'src/utils/**',
			],
			provider: 'v8',
			reportsDirectory: './tests/unit/coverage',
			/* thresholds: {
				branches: 80,
				functions: 80,
				lines: 80,
				statements: 80,
			}, */
		},
		environment: 'happy-dom',
		exclude: [...configDefaults.exclude, 'e2e/**'],
		globals: true,
		include: [
			'src/**/__tests__/*.spec.ts',
			'tests/**/*.spec.ts',
		],
		root: fileURLToPath(new URL('./', import.meta.url)),
		server: {
			deps: {
				inline: ['vuetify'],
			},
		},
		setupFiles: ['./tests/unit/setup.ts'],
		snapshotSerializers: [
			'./node_modules/vue3-snapshot-serializer/index.js',
		],
	},
}))
