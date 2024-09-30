// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vite@5.4.7_@types+node@20.16.5_sass@1.79.3/node_modules/vite/dist/node/index.js";
import { coverageConfigDefaults } from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vitest@2.1.1_@types+node@20.16.5_happy-dom@15.7.4_sass@1.79.3/node_modules/vitest/dist/config.js";
import vue from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.7_vue@3.5.8/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vite-plugin-dts@4.2.1_@types+node@20.16.5_typescript@5.6.2_vite@5.4.7/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/vivi/Dev/Cnam/design-system-v3";
var __vite_injected_original_import_meta_url = "file:///Users/vivi/Dev/Cnam/design-system-v3/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json"
    }),
    vue()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "@tests": fileURLToPath(new URL("./tests", __vite_injected_original_import_meta_url))
    }
  },
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/main.ts"),
      name: "DesignSystemV3",
      fileName: "design-system-v3"
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  test: {
    environment: "happy-dom",
    server: {
      deps: {
        inline: ["vuetify"]
      }
    },
    coverage: {
      enabled: true,
      provider: "v8",
      reportsDirectory: "./tests/unit/coverage",
      include: [
        "src/components/**/*.{js,vue,ts}",
        "src/composables/**",
        "src/utils/**"
      ],
      exclude: [
        "src/**/*.spec.{js,vue,ts}",
        "src/**/*.stories.*",
        "src/main.ts",
        "src/components/index.ts",
        "src/components/TestA11y.vue",
        "src/components/customizableOptions.vue",
        "src/components/gridsTests.vue",
        "src/components/TestDesignTokensComponent/*",
        ...coverageConfigDefaults.exclude
      ]
      /* thresholds: {
      	branches: 80,
      	functions: 80,
      	lines: 80,
      	statements: 80,
      }, */
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdml2aS9EZXYvQ25hbS9kZXNpZ24tc3lzdGVtLXYzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdml2aS9EZXYvQ25hbS9kZXNpZ24tc3lzdGVtLXYzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy92aXZpL0Rldi9DbmFtL2Rlc2lnbi1zeXN0ZW0tdjMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgY292ZXJhZ2VDb25maWdEZWZhdWx0cyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdGR0cyh7XG5cdFx0XHRyb2xsdXBUeXBlczogdHJ1ZSxcblx0XHRcdGluc2VydFR5cGVzRW50cnk6IHRydWUsXG5cdFx0XHR0c2NvbmZpZ1BhdGg6ICcuL3RzY29uZmlnLmFwcC5qc29uJyxcblx0XHR9KSxcblx0XHR2dWUoKSxcblx0XSxcblx0cmVzb2x2ZToge1xuXHRcdGFsaWFzOiB7XG5cdFx0XHQnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcblx0XHRcdCdAdGVzdHMnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vdGVzdHMnLCBpbXBvcnQubWV0YS51cmwpKSxcblx0XHR9LFxuXHR9LFxuXHRidWlsZDoge1xuXHRcdGxpYjoge1xuXHRcdFx0ZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL21haW4udHMnKSxcblx0XHRcdG5hbWU6ICdEZXNpZ25TeXN0ZW1WMycsXG5cdFx0XHRmaWxlTmFtZTogJ2Rlc2lnbi1zeXN0ZW0tdjMnLFxuXHRcdH0sXG5cdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0ZXh0ZXJuYWw6IFsndnVlJ10sXG5cdFx0XHRvdXRwdXQ6IHtcblx0XHRcdFx0Z2xvYmFsczoge1xuXHRcdFx0XHRcdHZ1ZTogJ1Z1ZScsXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG5cdHRlc3Q6IHtcblx0XHRlbnZpcm9ubWVudDogJ2hhcHB5LWRvbScsXG5cdFx0c2VydmVyOiB7XG5cdFx0XHRkZXBzOiB7XG5cdFx0XHRcdGlubGluZTogWyd2dWV0aWZ5J10sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0Y292ZXJhZ2U6IHtcblx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRwcm92aWRlcjogJ3Y4Jyxcblx0XHRcdHJlcG9ydHNEaXJlY3Rvcnk6ICcuL3Rlc3RzL3VuaXQvY292ZXJhZ2UnLFxuXHRcdFx0aW5jbHVkZTogW1xuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvKiovKi57anMsdnVlLHRzfScsXG5cdFx0XHRcdCdzcmMvY29tcG9zYWJsZXMvKionLFxuXHRcdFx0XHQnc3JjL3V0aWxzLyoqJyxcblx0XHRcdF0sXG5cdFx0XHRleGNsdWRlOiBbXG5cdFx0XHRcdCdzcmMvKiovKi5zcGVjLntqcyx2dWUsdHN9Jyxcblx0XHRcdFx0J3NyYy8qKi8qLnN0b3JpZXMuKicsXG5cdFx0XHRcdCdzcmMvbWFpbi50cycsXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy9pbmRleC50cycsXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy9UZXN0QTExeS52dWUnLFxuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvY3VzdG9taXphYmxlT3B0aW9ucy52dWUnLFxuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvZ3JpZHNUZXN0cy52dWUnLFxuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvVGVzdERlc2lnblRva2Vuc0NvbXBvbmVudC8qJyxcblx0XHRcdFx0Li4uY292ZXJhZ2VDb25maWdEZWZhdWx0cy5leGNsdWRlLFxuXHRcdFx0XSxcblx0XHRcdC8qIHRocmVzaG9sZHM6IHtcblx0XHRcdFx0YnJhbmNoZXM6IDgwLFxuXHRcdFx0XHRmdW5jdGlvbnM6IDgwLFxuXHRcdFx0XHRsaW5lczogODAsXG5cdFx0XHRcdHN0YXRlbWVudHM6IDgwLFxuXHRcdFx0fSwgKi9cblx0XHR9LFxuXHR9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVMsU0FBUyxlQUFlLFdBQVc7QUFDcFUsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsOEJBQThCO0FBQ3ZDLE9BQU8sU0FBUztBQUNoQixPQUFPLFNBQVM7QUFMaEIsSUFBTSxtQ0FBbUM7QUFBeUksSUFBTSwyQ0FBMkM7QUFRbk8sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUztBQUFBLElBQ1IsSUFBSTtBQUFBLE1BQ0gsYUFBYTtBQUFBLE1BQ2Isa0JBQWtCO0FBQUEsTUFDbEIsY0FBYztBQUFBLElBQ2YsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLEVBQ0w7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNOLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFDcEQsVUFBVSxjQUFjLElBQUksSUFBSSxXQUFXLHdDQUFlLENBQUM7QUFBQSxJQUM1RDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNKLE9BQU8sUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDdkMsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLElBQ1g7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNkLFVBQVUsQ0FBQyxLQUFLO0FBQUEsTUFDaEIsUUFBUTtBQUFBLFFBQ1AsU0FBUztBQUFBLFVBQ1IsS0FBSztBQUFBLFFBQ047QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNMLGFBQWE7QUFBQSxJQUNiLFFBQVE7QUFBQSxNQUNQLE1BQU07QUFBQSxRQUNMLFFBQVEsQ0FBQyxTQUFTO0FBQUEsTUFDbkI7QUFBQSxJQUNEO0FBQUEsSUFDQSxVQUFVO0FBQUEsTUFDVCxTQUFTO0FBQUEsTUFDVCxVQUFVO0FBQUEsTUFDVixrQkFBa0I7QUFBQSxNQUNsQixTQUFTO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRDtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQSxHQUFHLHVCQUF1QjtBQUFBLE1BQzNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPRDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
