// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vite@5.4.14_@types+node@20.17.16_sass-embedded@1.83.4/node_modules/vite/dist/node/index.js";
import { coverageConfigDefaults } from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vitest@2.1.8_@types+node@20.17.16_happy-dom@15.11.7_sass-embedded@1.83.4/node_modules/vitest/dist/config.js";
import vue from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.14_vue@3.5.13/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vuetify, { transformAssetUrls } from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vite-plugin-vuetify@2.0.4_vite@5.4.14_vue@3.5.13_vuetify@3.7.8/node_modules/vite-plugin-vuetify/dist/index.mjs";
import dts from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vite-plugin-dts@4.5.0_@types+node@20.17.16_typescript@5.4.2_vite@5.4.14/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/vivi/Dev/Cnam/design-system-v3";
var __vite_injected_original_import_meta_url = "file:///Users/vivi/Dev/Cnam/design-system-v3/vite.config.ts";
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
      exclude: ["**/*.stories.ts"],
      entryRoot: "src",
      outDir: "dist/src",
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
        "src/**/*ExpertiseLevelEnum.ts*",
        "src/**/*AccessibiliteItems.ts*",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdml2aS9EZXYvQ25hbS9kZXNpZ24tc3lzdGVtLXYzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdml2aS9EZXYvQ25hbS9kZXNpZ24tc3lzdGVtLXYzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy92aXZpL0Rldi9DbmFtL2Rlc2lnbi1zeXN0ZW0tdjMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgY292ZXJhZ2VDb25maWdEZWZhdWx0cyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWV0aWZ5LCB7IHRyYW5zZm9ybUFzc2V0VXJscyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuZnVuY3Rpb24gZ2VuZXJhdGVWdWV0aWZ5R2xvYmFscygpIHtcblx0Y29uc3QgY29tcG9uZW50cyA9IFtcblx0XHQnVkZvcm0nLFxuXHRcdCdWQnRuJyxcblx0XHQnVkljb24nLFxuXHRcdCdWQ2hpcCcsXG5cdFx0J1ZNZW51Jyxcblx0XHQnVlJhZGlvR3JvdXAnLFxuXHRcdCdWUmFkaW8nLFxuXHRcdCdWVGFibGUnLFxuXHRcdCdWRGF0YVRhYmxlJyxcblx0XHQnVkRhdGFUYWJsZVNlcnZlcicsXG5cdFx0J1ZCdG5Ub2dnbGUnLFxuXHRcdCdWQ2hlY2tib3gnLFxuXHRcdCdWU2VsZWN0Jyxcblx0XHQnVlJhdGluZycsXG5cdFx0J1ZSYW5nZVNsaWRlcicsXG5cdFx0J1ZTbmFja2JhcicsXG5cdFx0J1ZUb29sdGlwJyxcblx0XHQnVlRleHRGaWVsZCcsXG5cdFx0J1ZJbnB1dCcsXG5cdFx0J1ZUb29sYmFyJyxcblx0XHQnVk5hdmlnYXRpb25EcmF3ZXInLFxuXHRcdCdWVGFicycsXG5cdFx0J1ZMYXlvdXQnLFxuXHRcdCdWRm9vdGVyJyxcblx0XHQnVkFsZXJ0Jyxcblx0XHQnVkRpdmlkZXInLFxuXHRcdCdWU2hlZXQnLFxuXHRcdCdWTGlzdCcsXG5cdFx0J1ZHcmlkJyxcblx0XHQnVkRpYWxvZycsXG5cdFx0J1ZDYXJkJyxcblx0XHQnVlNrZWxldG9uTG9hZGVyJyxcblx0XHQnVkJhZGdlJyxcblx0XHQnVkV4cGFuc2lvblBhbmVsJyxcblx0XHQnVkF1dG9jb21wbGV0ZScsXG5cdFx0J1ZTbGlkZXInLFxuXHRcdCdWVGV4dGFyZWEnLFxuXHRcdCd0cmFuc2l0aW9ucycsXG5cdFx0J1ZQcm9ncmVzc0xpbmVhcicsXG5cdFx0J1ZMb2NhbGVQcm92aWRlcicsXG5cdF1cblxuXHRjb25zdCBnbG9iYWxzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge31cblxuXHRmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBjb21wb25lbnRzKSB7XG5cdFx0Z2xvYmFsc1tgdnVldGlmeS9saWIvY29tcG9uZW50cy8ke2NvbXBvbmVudH0vaW5kZXgubWpzYF0gPSBjb21wb25lbnRcblx0fVxuXHRnbG9iYWxzWyd2dWV0aWZ5L2NvbXBvbmVudHMvVlNrZWxldG9uTG9hZGVyJ10gPSAnVlNrZWxldG9uTG9hZGVyJ1xuXHRnbG9iYWxzWyd2dWV0aWZ5L2xpYi9kaXJlY3RpdmVzL2luZGV4Lm1qcyddID0gJ3Z1ZXRpZnlEaXJlY3RpdmVzJ1xuXG5cdHJldHVybiBnbG9iYWxzXG59XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXHRwbHVnaW5zOiBbXG5cdFx0ZHRzKHtcblx0XHRcdGV4Y2x1ZGU6IFsnKiovKi5zdG9yaWVzLnRzJ10sXG5cdFx0XHRlbnRyeVJvb3Q6ICdzcmMnLFxuXHRcdFx0b3V0RGlyOiAnZGlzdC9zcmMnLFxuXHRcdFx0dHNjb25maWdQYXRoOiAndHNjb25maWcuYXBwLmpzb24nLFxuXHRcdFx0cm9sbHVwVHlwZXM6IGZhbHNlLFxuXHRcdFx0aW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcblx0XHRcdGNvcHlEdHNGaWxlczogdHJ1ZSxcblx0XHRcdGNsZWFuVnVlRmlsZU5hbWU6IHRydWUsXG5cdFx0XHRhbGlhc2VzRXhjbHVkZTogWy92dWV0aWZ5L11cblx0XHR9KSxcblx0XHR2dWUoe1xuXHRcdFx0dGVtcGxhdGU6IHtcblx0XHRcdFx0dHJhbnNmb3JtQXNzZXRVcmxzLFxuXHRcdFx0fSxcblx0XHR9KSxcblx0XHR2dWV0aWZ5KHtcblx0XHRcdGF1dG9JbXBvcnQ6IHRydWUsXG5cdFx0XHRzdHlsZXM6IHsgY29uZmlnRmlsZTogJ3NyYy9hc3NldHMvc2V0dGluZ3Muc2NzcycgfSxcblx0XHR9KSxcblx0XSxcblx0cmVzb2x2ZToge1xuXHRcdGFsaWFzOiB7XG5cdFx0XHQnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcblx0XHRcdCdAdGVzdHMnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vdGVzdHMnLCBpbXBvcnQubWV0YS51cmwpKSxcblx0XHR9LFxuXHR9LFxuXHRidWlsZDoge1xuXHRcdGxpYjoge1xuXHRcdFx0ZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL21haW4udHMnKSxcblx0XHRcdG5hbWU6ICdEZXNpZ25TeXN0ZW1WMycsXG5cdFx0XHRmaWxlTmFtZTogJ2Rlc2lnbi1zeXN0ZW0tdjMnLFxuXHRcdH0sXG5cdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0ZXh0ZXJuYWw6IFsndnVlJywgL3Z1ZXRpZnkvXSxcblx0XHRcdG91dHB1dDoge1xuXHRcdFx0XHRnbG9iYWxzOiB7XG5cdFx0XHRcdFx0J3Z1ZSc6ICdWdWUnLFxuXHRcdFx0XHRcdCd2dWV0aWZ5JzogJ1Z1ZXRpZnknLFxuXHRcdFx0XHRcdCd2dWV0aWZ5L2RpcmVjdGl2ZXMnOiAndnVldGlmeURpcmVjdGl2ZXMnLFxuXHRcdFx0XHRcdCd2dWV0aWZ5L2xpYi9kaXJlY3RpdmVzJzogJ3Z1ZXRpZnlEaXJlY3RpdmVzJyxcblx0XHRcdFx0XHQuLi5nZW5lcmF0ZVZ1ZXRpZnlHbG9iYWxzKCksXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG5cdGNzczoge1xuXHRcdHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcblx0XHRcdHNjc3M6IHtcblx0XHRcdFx0YXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcblx0XHRcdH0sXG5cdFx0XHRzYXNzOiB7XG5cdFx0XHRcdGFwaTogJ21vZGVybi1jb21waWxlcicsXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG5cdHRlc3Q6IHtcblx0XHRlbnZpcm9ubWVudDogJ2hhcHB5LWRvbScsXG5cdFx0c2VydmVyOiB7XG5cdFx0XHRkZXBzOiB7XG5cdFx0XHRcdGlubGluZTogWyd2dWV0aWZ5J10sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0Y292ZXJhZ2U6IHtcblx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRwcm92aWRlcjogJ3Y4Jyxcblx0XHRcdHJlcG9ydHNEaXJlY3Rvcnk6ICcuL3Rlc3RzL3VuaXQvY292ZXJhZ2UnLFxuXHRcdFx0aW5jbHVkZTogW1xuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvKiovKi57anMsdnVlLHRzfScsXG5cdFx0XHRcdCdzcmMvY29tcG9zYWJsZXMvKionLFxuXHRcdFx0XHQnc3JjL3V0aWxzLyoqJyxcblx0XHRcdF0sXG5cdFx0XHRleGNsdWRlOiBbXG5cdFx0XHRcdCdzcmMvKiovKi5zcGVjLntqcyx2dWUsdHN9Jyxcblx0XHRcdFx0J3NyYy8qKi8qLnN0b3JpZXMuKicsXG5cdFx0XHRcdCdzcmMvKiovKkV4cGVydGlzZUxldmVsRW51bS50cyonLFxuXHRcdFx0XHQnc3JjLyoqLypBY2Nlc3NpYmlsaXRlSXRlbXMudHMqJyxcblx0XHRcdFx0J3NyYy8qKi90ZXN0cy9kYXRhLyonLFxuXHRcdFx0XHQnc3JjLyoqL2NvbnN0YW50cy8qJyxcblx0XHRcdFx0J3NyYy9jb21wb3NhYmxlcy9pbmRleC50cyonLFxuXHRcdFx0XHQnc3JjLyoqL3R5cGVzLionLFxuXHRcdFx0XHQnc3JjL21haW4udHMnLFxuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvaW5kZXgudHMnLFxuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvVGVzdEExMXkudnVlJyxcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzL2N1c3RvbWl6YWJsZU9wdGlvbnMudnVlJyxcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzL2dyaWRzVGVzdHMudnVlJyxcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzL1Rlc3REZXNpZ25Ub2tlbnNDb21wb25lbnQvKicsXG5cdFx0XHRcdC4uLmNvdmVyYWdlQ29uZmlnRGVmYXVsdHMuZXhjbHVkZSxcblx0XHRcdF0sXG5cdFx0XHQvKiB0aHJlc2hvbGRzOiB7XG4gICAgICAgICAgICAgICAgYnJhbmNoZXM6IDgwLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uczogODAsXG4gICAgICAgICAgICAgICAgbGluZXM6IDgwLFxuICAgICAgICAgICAgICAgIHN0YXRlbWVudHM6IDgwLFxuICAgICAgICAgICAgfSwgKi9cblx0XHR9LFxuXHR9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVMsU0FBUyxlQUFlLFdBQVc7QUFDcFUsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsOEJBQThCO0FBQ3ZDLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVcsMEJBQTBCO0FBQzVDLE9BQU8sU0FBUztBQU5oQixJQUFNLG1D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
