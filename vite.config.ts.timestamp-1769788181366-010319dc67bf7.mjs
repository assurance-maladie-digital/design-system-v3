// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "file:///Users/valentino.suma/Desktop/ds3/design-system-v3/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.27_sass-embedded@1.83.0/node_modules/vite/dist/node/index.js";
import { coverageConfigDefaults } from "file:///Users/valentino.suma/Desktop/ds3/design-system-v3/node_modules/.pnpm/vitest@3.2.4_@types+node@20.19.27_happy-dom@20.1.0_jsdom@27.4.0_sass-embedded@1.83.0/node_modules/vitest/dist/config.js";
import vue from "file:///Users/valentino.suma/Desktop/ds3/design-system-v3/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.21_@types+node@20.19.27_sass-embedded@1.83.0__vue@3.5.26_typescript@5.4.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vuetify, { transformAssetUrls } from "file:///Users/valentino.suma/Desktop/ds3/design-system-v3/node_modules/.pnpm/vite-plugin-vuetify@2.1.2_vite@5.4.21_@types+node@20.19.27_sass-embedded@1.83.0__vue@3._d8d7c500507edd1b53e0c873dede0781/node_modules/vite-plugin-vuetify/dist/index.mjs";
import dts from "file:///Users/valentino.suma/Desktop/ds3/design-system-v3/node_modules/.pnpm/vite-plugin-dts@4.5.4_@types+node@20.19.27_rollup@4.55.1_typescript@5.4.2_vite@5.4.21_@_23ac432ff75f7c4ee7c11700cf2caebb/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/valentino.suma/Desktop/ds3/design-system-v3";
var __vite_injected_original_import_meta_url = "file:///Users/valentino.suma/Desktop/ds3/design-system-v3/vite.config.ts";
function generateVuetifyGlobals() {
  const components = [
    "VForm",
    "VBtn",
    "VIcon",
    "VChip",
    "VMenu",
    "VRadioGroup",
    "VRadio",
    "VTable",
    "VDataTable",
    "VDataTableServer",
    "VBtnToggle",
    "VCheckbox",
    "VFileInput",
    "VSelect",
    "VRating",
    "VRangeSlider",
    "VSnackbar",
    "VTooltip",
    "VTextField",
    "VInput",
    "VToolbar",
    "VNavigationDrawer",
    "VTabs",
    "VLayout",
    "VFooter",
    "VAlert",
    "VDivider",
    "VSheet",
    "VList",
    "VGrid",
    "VDialog",
    "VCard",
    "VSkeletonLoader",
    "VBadge",
    "VExpansionPanel",
    "VAutocomplete",
    "VSlider",
    "VTextarea",
    "transitions",
    "VProgressLinear",
    "VLocaleProvider"
  ];
  const globals = {};
  for (const component of components) {
    globals[`vuetify/lib/components/${component}/index.mjs`] = component;
  }
  globals["vuetify/components/VSkeletonLoader"] = "VSkeletonLoader";
  globals["vuetify/lib/directives/index.mjs"] = "vuetifyDirectives";
  return globals;
}
var vite_config_default = defineConfig({
  plugins: [
    dts({
      exclude: ["**/*.stories.ts", "**/*.spec.ts", "src/stories/**"],
      entryRoot: "src",
      outDir: "dist",
      tsconfigPath: "tsconfig.app.json",
      rollupTypes: false,
      insertTypesEntry: true,
      copyDtsFiles: true,
      cleanVueFileName: true,
      aliasesExclude: [/vuetify/]
    }),
    vue({
      template: {
        transformAssetUrls
      }
    }),
    vuetify({
      autoImport: true,
      styles: { configFile: "src/assets/settings.scss" }
    })
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
    chunkSizeWarningLimit: 4e3,
    rollupOptions: {
      external: ["vue", /vuetify/],
      output: {
        globals: {
          "vue": "Vue",
          "vuetify": "Vuetify",
          "vuetify/directives": "vuetifyDirectives",
          "vuetify/lib/directives": "vuetifyDirectives",
          ...generateVuetifyGlobals()
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      },
      sass: {
        api: "modern-compiler"
      }
    }
  },
  test: {
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)", "**/*.a11y.spec.ts"],
    environment: "happy-dom",
    isolate: true,
    maxConcurrency: process.env.CI ? 1 : 5,
    server: {
      deps: {
        inline: ["vuetify"]
      }
    },
    setupFiles: ["./tests/unit/setup.ts"],
    snapshotSerializers: [
      "./node_modules/vue3-snapshot-serializer/index.js"
    ],
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
        "src/**/*ExpertiseLevelEnum.ts*",
        "src/**/tests/data/*",
        "src/**/constants/*",
        "src/composables/index.ts*",
        "src/**/types.*",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdmFsZW50aW5vLnN1bWEvRGVza3RvcC9kczMvZGVzaWduLXN5c3RlbS12M1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3ZhbGVudGluby5zdW1hL0Rlc2t0b3AvZHMzL2Rlc2lnbi1zeXN0ZW0tdjMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3ZhbGVudGluby5zdW1hL0Rlc2t0b3AvZHMzL2Rlc2lnbi1zeXN0ZW0tdjMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgY292ZXJhZ2VDb25maWdEZWZhdWx0cyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWV0aWZ5LCB7IHRyYW5zZm9ybUFzc2V0VXJscyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuZnVuY3Rpb24gZ2VuZXJhdGVWdWV0aWZ5R2xvYmFscygpIHtcblx0Y29uc3QgY29tcG9uZW50cyA9IFtcblx0XHQnVkZvcm0nLFxuXHRcdCdWQnRuJyxcblx0XHQnVkljb24nLFxuXHRcdCdWQ2hpcCcsXG5cdFx0J1ZNZW51Jyxcblx0XHQnVlJhZGlvR3JvdXAnLFxuXHRcdCdWUmFkaW8nLFxuXHRcdCdWVGFibGUnLFxuXHRcdCdWRGF0YVRhYmxlJyxcblx0XHQnVkRhdGFUYWJsZVNlcnZlcicsXG5cdFx0J1ZCdG5Ub2dnbGUnLFxuXHRcdCdWQ2hlY2tib3gnLFxuXHRcdCdWRmlsZUlucHV0Jyxcblx0XHQnVlNlbGVjdCcsXG5cdFx0J1ZSYXRpbmcnLFxuXHRcdCdWUmFuZ2VTbGlkZXInLFxuXHRcdCdWU25hY2tiYXInLFxuXHRcdCdWVG9vbHRpcCcsXG5cdFx0J1ZUZXh0RmllbGQnLFxuXHRcdCdWSW5wdXQnLFxuXHRcdCdWVG9vbGJhcicsXG5cdFx0J1ZOYXZpZ2F0aW9uRHJhd2VyJyxcblx0XHQnVlRhYnMnLFxuXHRcdCdWTGF5b3V0Jyxcblx0XHQnVkZvb3RlcicsXG5cdFx0J1ZBbGVydCcsXG5cdFx0J1ZEaXZpZGVyJyxcblx0XHQnVlNoZWV0Jyxcblx0XHQnVkxpc3QnLFxuXHRcdCdWR3JpZCcsXG5cdFx0J1ZEaWFsb2cnLFxuXHRcdCdWQ2FyZCcsXG5cdFx0J1ZTa2VsZXRvbkxvYWRlcicsXG5cdFx0J1ZCYWRnZScsXG5cdFx0J1ZFeHBhbnNpb25QYW5lbCcsXG5cdFx0J1ZBdXRvY29tcGxldGUnLFxuXHRcdCdWU2xpZGVyJyxcblx0XHQnVlRleHRhcmVhJyxcblx0XHQndHJhbnNpdGlvbnMnLFxuXHRcdCdWUHJvZ3Jlc3NMaW5lYXInLFxuXHRcdCdWTG9jYWxlUHJvdmlkZXInLFxuXHRdXG5cblx0Y29uc3QgZ2xvYmFsczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9XG5cblx0Zm9yIChjb25zdCBjb21wb25lbnQgb2YgY29tcG9uZW50cykge1xuXHRcdGdsb2JhbHNbYHZ1ZXRpZnkvbGliL2NvbXBvbmVudHMvJHtjb21wb25lbnR9L2luZGV4Lm1qc2BdID0gY29tcG9uZW50XG5cdH1cblx0Z2xvYmFsc1sndnVldGlmeS9jb21wb25lbnRzL1ZTa2VsZXRvbkxvYWRlciddID0gJ1ZTa2VsZXRvbkxvYWRlcidcblx0Z2xvYmFsc1sndnVldGlmeS9saWIvZGlyZWN0aXZlcy9pbmRleC5tanMnXSA9ICd2dWV0aWZ5RGlyZWN0aXZlcydcblxuXHRyZXR1cm4gZ2xvYmFsc1xufVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdGR0cyh7XG5cdFx0XHRleGNsdWRlOiBbJyoqLyouc3Rvcmllcy50cycsICcqKi8qLnNwZWMudHMnLCAnc3JjL3N0b3JpZXMvKionXSxcblx0XHRcdGVudHJ5Um9vdDogJ3NyYycsXG5cdFx0XHRvdXREaXI6ICdkaXN0Jyxcblx0XHRcdHRzY29uZmlnUGF0aDogJ3RzY29uZmlnLmFwcC5qc29uJyxcblx0XHRcdHJvbGx1cFR5cGVzOiBmYWxzZSxcblx0XHRcdGluc2VydFR5cGVzRW50cnk6IHRydWUsXG5cdFx0XHRjb3B5RHRzRmlsZXM6IHRydWUsXG5cdFx0XHRjbGVhblZ1ZUZpbGVOYW1lOiB0cnVlLFxuXHRcdFx0YWxpYXNlc0V4Y2x1ZGU6IFsvdnVldGlmeS9dLFxuXHRcdH0pLFxuXHRcdHZ1ZSh7XG5cdFx0XHR0ZW1wbGF0ZToge1xuXHRcdFx0XHR0cmFuc2Zvcm1Bc3NldFVybHMsXG5cdFx0XHR9LFxuXHRcdH0pLFxuXHRcdHZ1ZXRpZnkoe1xuXHRcdFx0YXV0b0ltcG9ydDogdHJ1ZSxcblx0XHRcdHN0eWxlczogeyBjb25maWdGaWxlOiAnc3JjL2Fzc2V0cy9zZXR0aW5ncy5zY3NzJyB9LFxuXHRcdH0pLFxuXHRdLFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuXHRcdFx0J0B0ZXN0cyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi90ZXN0cycsIGltcG9ydC5tZXRhLnVybCkpLFxuXHRcdH0sXG5cdH0sXG5cdGJ1aWxkOiB7XG5cdFx0bGliOiB7XG5cdFx0XHRlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbWFpbi50cycpLFxuXHRcdFx0bmFtZTogJ0Rlc2lnblN5c3RlbVYzJyxcblx0XHRcdGZpbGVOYW1lOiAnZGVzaWduLXN5c3RlbS12MycsXG5cdFx0fSxcblx0XHRjaHVua1NpemVXYXJuaW5nTGltaXQ6IDQwMDAsXG5cdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0ZXh0ZXJuYWw6IFsndnVlJywgL3Z1ZXRpZnkvXSxcblx0XHRcdG91dHB1dDoge1xuXHRcdFx0XHRnbG9iYWxzOiB7XG5cdFx0XHRcdFx0J3Z1ZSc6ICdWdWUnLFxuXHRcdFx0XHRcdCd2dWV0aWZ5JzogJ1Z1ZXRpZnknLFxuXHRcdFx0XHRcdCd2dWV0aWZ5L2RpcmVjdGl2ZXMnOiAndnVldGlmeURpcmVjdGl2ZXMnLFxuXHRcdFx0XHRcdCd2dWV0aWZ5L2xpYi9kaXJlY3RpdmVzJzogJ3Z1ZXRpZnlEaXJlY3RpdmVzJyxcblx0XHRcdFx0XHQuLi5nZW5lcmF0ZVZ1ZXRpZnlHbG9iYWxzKCksXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG5cdGNzczoge1xuXHRcdHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcblx0XHRcdHNjc3M6IHtcblx0XHRcdFx0YXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcblx0XHRcdH0sXG5cdFx0XHRzYXNzOiB7XG5cdFx0XHRcdGFwaTogJ21vZGVybi1jb21waWxlcicsXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG5cdHRlc3Q6IHtcblx0XHRpbmNsdWRlOiBbJyoqLyoue3Rlc3Qsc3BlY30uPyhjfG0pW2p0XXM/KHgpJywgJyoqLyouYTExeS5zcGVjLnRzJ10sXG5cdFx0ZW52aXJvbm1lbnQ6ICdoYXBweS1kb20nLFxuXHRcdGlzb2xhdGU6IHRydWUsXG5cdFx0bWF4Q29uY3VycmVuY3k6IHByb2Nlc3MuZW52LkNJID8gMSA6IDUsXG5cdFx0c2VydmVyOiB7XG5cdFx0XHRkZXBzOiB7XG5cdFx0XHRcdGlubGluZTogWyd2dWV0aWZ5J10sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0c2V0dXBGaWxlczogWycuL3Rlc3RzL3VuaXQvc2V0dXAudHMnXSxcblx0XHRzbmFwc2hvdFNlcmlhbGl6ZXJzOiBbXG5cdFx0XHQnLi9ub2RlX21vZHVsZXMvdnVlMy1zbmFwc2hvdC1zZXJpYWxpemVyL2luZGV4LmpzJyxcblx0XHRdLFxuXHRcdGNvdmVyYWdlOiB7XG5cdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0cHJvdmlkZXI6ICd2OCcsXG5cdFx0XHRyZXBvcnRzRGlyZWN0b3J5OiAnLi90ZXN0cy91bml0L2NvdmVyYWdlJyxcblx0XHRcdGluY2x1ZGU6IFtcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzLyoqLyoue2pzLHZ1ZSx0c30nLFxuXHRcdFx0XHQnc3JjL2NvbXBvc2FibGVzLyoqJyxcblx0XHRcdFx0J3NyYy91dGlscy8qKicsXG5cdFx0XHRdLFxuXHRcdFx0ZXhjbHVkZTogW1xuXHRcdFx0XHQnc3JjLyoqLyouc3BlYy57anMsdnVlLHRzfScsXG5cdFx0XHRcdCdzcmMvKiovKi5zdG9yaWVzLionLFxuXHRcdFx0XHQnc3JjLyoqLypFeHBlcnRpc2VMZXZlbEVudW0udHMqJyxcblx0XHRcdFx0J3NyYy8qKi90ZXN0cy9kYXRhLyonLFxuXHRcdFx0XHQnc3JjLyoqL2NvbnN0YW50cy8qJyxcblx0XHRcdFx0J3NyYy9jb21wb3NhYmxlcy9pbmRleC50cyonLFxuXHRcdFx0XHQnc3JjLyoqL3R5cGVzLionLFxuXHRcdFx0XHQnc3JjL21haW4udHMnLFxuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvaW5kZXgudHMnLFxuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvVGVzdEExMXkudnVlJyxcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzL2N1c3RvbWl6YWJsZU9wdGlvbnMudnVlJyxcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzL2dyaWRzVGVzdHMudnVlJyxcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzL1Rlc3REZXNpZ25Ub2tlbnNDb21wb25lbnQvKicsXG5cdFx0XHRcdC4uLmNvdmVyYWdlQ29uZmlnRGVmYXVsdHMuZXhjbHVkZSxcblx0XHRcdF0sXG5cdFx0XHQvKiB0aHJlc2hvbGRzOiB7XG4gICAgICAgICAgICAgICAgYnJhbmNoZXM6IDgwLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uczogODAsXG4gICAgICAgICAgICAgICAgbGluZXM6IDgwLFxuICAgICAgICAgICAgICAgIHN0YXRlbWVudHM6IDgwLFxuICAgICAgICAgICAgfSwgKi9cblx0XHR9LFxuXHR9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1UsU0FBUyxlQUFlLFdBQVc7QUFDM1csU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsOEJBQThCO0FBQ3ZDLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVcsMEJBQTBCO0FBQzVDLE9BQU8sU0FBUztBQU5oQixJQUFNLG1DQUFtQztBQUFtSyxJQUFNLDJDQUEyQztBQVE3UCxTQUFTLHlCQUF5QjtBQUNqQyxRQUFNLGFBQWE7QUFBQSxJQUNsQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBRUEsUUFBTSxVQUFrQyxDQUFDO0FBRXpDLGFBQVcsYUFBYSxZQUFZO0FBQ25DLFlBQVEsMEJBQTBCLFNBQVMs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
