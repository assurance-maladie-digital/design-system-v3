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
                'src/**/*.{js,vue,ts}',
            ],
            exclude: [
                'src/**/*.spec.{js,vue,ts}',
                'src/**/*.stories.*',
                'src/main.ts',
                'src/components/index.ts',
                ...coverageConfigDefaults.exclude,
            ],
            /*thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            },*/
        },
    },
})