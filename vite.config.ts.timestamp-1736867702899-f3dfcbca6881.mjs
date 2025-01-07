// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vite@5.4.11_@types+node@20.17.12_sass-embedded@1.83.1/node_modules/vite/dist/node/index.js";
import { coverageConfigDefaults } from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vitest@2.1.8_@types+node@20.17.12_happy-dom@15.11.7_sass-embedded@1.83.1/node_modules/vitest/dist/config.js";
import vue from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.11_vue@3.5.13/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vite-plugin-dts@4.4.0_@types+node@20.17.12_typescript@5.4.2_vite@5.4.11/node_modules/vite-plugin-dts/dist/index.mjs";
import vuetify, { transformAssetUrls } from "file:///Users/vivi/Dev/Cnam/design-system-v3/node_modules/.pnpm/vite-plugin-vuetify@2.0.4_vite@5.4.11_vue@3.5.13_vuetify@3.7.6/node_modules/vite-plugin-vuetify/dist/index.mjs";
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
    "transitions"
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
      rollupTypes: true,
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json"
    }),
    vue({
      template: { transformAssetUrls }
    }),
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/assets/settings.scss"
      }
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
        "src/**/*.ts*",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdml2aS9EZXYvQ25hbS9kZXNpZ24tc3lzdGVtLXYzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdml2aS9EZXYvQ25hbS9kZXNpZ24tc3lzdGVtLXYzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy92aXZpL0Rldi9DbmFtL2Rlc2lnbi1zeXN0ZW0tdjMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgY292ZXJhZ2VDb25maWdEZWZhdWx0cyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuaW1wb3J0IHZ1ZXRpZnksIHsgdHJhbnNmb3JtQXNzZXRVcmxzIH0gZnJvbSAndml0ZS1wbHVnaW4tdnVldGlmeSdcblxuZnVuY3Rpb24gZ2VuZXJhdGVWdWV0aWZ5R2xvYmFscygpIHtcblx0Y29uc3QgY29tcG9uZW50cyA9IFtcblx0XHQnVkZvcm0nLFxuXHRcdCdWQnRuJyxcblx0XHQnVkljb24nLFxuXHRcdCdWQ2hpcCcsXG5cdFx0J1ZNZW51Jyxcblx0XHQnVlJhZGlvR3JvdXAnLFxuXHRcdCdWUmFkaW8nLFxuXHRcdCdWVGFibGUnLFxuXHRcdCdWRGF0YVRhYmxlJyxcblx0XHQnVkJ0blRvZ2dsZScsXG5cdFx0J1ZDaGVja2JveCcsXG5cdFx0J1ZTZWxlY3QnLFxuXHRcdCdWUmF0aW5nJyxcblx0XHQnVlJhbmdlU2xpZGVyJyxcblx0XHQnVlNuYWNrYmFyJyxcblx0XHQnVlRvb2x0aXAnLFxuXHRcdCdWVGV4dEZpZWxkJyxcblx0XHQnVklucHV0Jyxcblx0XHQnVlRvb2xiYXInLFxuXHRcdCdWTmF2aWdhdGlvbkRyYXdlcicsXG5cdFx0J1ZUYWJzJyxcblx0XHQnVkxheW91dCcsXG5cdFx0J1ZGb290ZXInLFxuXHRcdCdWQWxlcnQnLFxuXHRcdCdWRGl2aWRlcicsXG5cdFx0J1ZTaGVldCcsXG5cdFx0J1ZMaXN0Jyxcblx0XHQnVkdyaWQnLFxuXHRcdCdWRGlhbG9nJyxcblx0XHQnVkNhcmQnLFxuXHRcdCdWU2tlbGV0b25Mb2FkZXInLFxuXHRcdCdWQmFkZ2UnLFxuXHRcdCdWRXhwYW5zaW9uUGFuZWwnLFxuXHRcdCdWQXV0b2NvbXBsZXRlJyxcblx0XHQnVlNsaWRlcicsXG5cdFx0J1ZUZXh0YXJlYScsXG5cdFx0J3RyYW5zaXRpb25zJyxcblx0XVxuXG5cdGNvbnN0IGdsb2JhbHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fVxuXG5cdGZvciAoY29uc3QgY29tcG9uZW50IG9mIGNvbXBvbmVudHMpIHtcblx0XHRnbG9iYWxzW2B2dWV0aWZ5L2xpYi9jb21wb25lbnRzLyR7Y29tcG9uZW50fS9pbmRleC5tanNgXSA9IGNvbXBvbmVudFxuXHR9XG5cdGdsb2JhbHNbJ3Z1ZXRpZnkvY29tcG9uZW50cy9WU2tlbGV0b25Mb2FkZXInXSA9ICdWU2tlbGV0b25Mb2FkZXInXG5cdGdsb2JhbHNbJ3Z1ZXRpZnkvbGliL2RpcmVjdGl2ZXMvaW5kZXgubWpzJ10gPSAndnVldGlmeURpcmVjdGl2ZXMnXG5cblx0cmV0dXJuIGdsb2JhbHNcbn1cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtcblx0XHRkdHMoe1xuXHRcdFx0cm9sbHVwVHlwZXM6IHRydWUsXG5cdFx0XHRpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuXHRcdFx0dHNjb25maWdQYXRoOiAnLi90c2NvbmZpZy5hcHAuanNvbicsXG5cdFx0fSksXG5cdFx0dnVlKHtcblx0XHRcdHRlbXBsYXRlOiB7IHRyYW5zZm9ybUFzc2V0VXJscyB9LFxuXHRcdH0pLFxuXHRcdHZ1ZXRpZnkoe1xuXHRcdFx0YXV0b0ltcG9ydDogdHJ1ZSxcblx0XHRcdHN0eWxlczoge1xuXHRcdFx0XHRjb25maWdGaWxlOiAnc3JjL2Fzc2V0cy9zZXR0aW5ncy5zY3NzJyxcblx0XHRcdH0sXG5cdFx0fSksXG5cdF0sXG5cdHJlc29sdmU6IHtcblx0XHRhbGlhczoge1xuXHRcdFx0J0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG5cdFx0XHQnQHRlc3RzJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3Rlc3RzJywgaW1wb3J0Lm1ldGEudXJsKSksXG5cdFx0fSxcblx0fSxcblx0YnVpbGQ6IHtcblx0XHRsaWI6IHtcblx0XHRcdGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9tYWluLnRzJyksXG5cdFx0XHRuYW1lOiAnRGVzaWduU3lzdGVtVjMnLFxuXHRcdFx0ZmlsZU5hbWU6ICdkZXNpZ24tc3lzdGVtLXYzJyxcblx0XHR9LFxuXHRcdHJvbGx1cE9wdGlvbnM6IHtcblx0XHRcdGV4dGVybmFsOiBbJ3Z1ZScsIC92dWV0aWZ5L10sXG5cdFx0XHRvdXRwdXQ6IHtcblx0XHRcdFx0Z2xvYmFsczoge1xuXHRcdFx0XHRcdCd2dWUnOiAnVnVlJyxcblx0XHRcdFx0XHQndnVldGlmeSc6ICdWdWV0aWZ5Jyxcblx0XHRcdFx0XHQndnVldGlmeS9kaXJlY3RpdmVzJzogJ3Z1ZXRpZnlEaXJlY3RpdmVzJyxcblx0XHRcdFx0XHQndnVldGlmeS9saWIvZGlyZWN0aXZlcyc6ICd2dWV0aWZ5RGlyZWN0aXZlcycsXG5cdFx0XHRcdFx0Li4uZ2VuZXJhdGVWdWV0aWZ5R2xvYmFscygpLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxuXHRjc3M6IHtcblx0XHRwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG5cdFx0XHRzY3NzOiB7XG5cdFx0XHRcdGFwaTogJ21vZGVybi1jb21waWxlcicsXG5cdFx0XHR9LFxuXHRcdFx0c2Fzczoge1xuXHRcdFx0XHRhcGk6ICdtb2Rlcm4tY29tcGlsZXInLFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxuXHR0ZXN0OiB7XG5cdFx0ZW52aXJvbm1lbnQ6ICdoYXBweS1kb20nLFxuXHRcdHNlcnZlcjoge1xuXHRcdFx0ZGVwczoge1xuXHRcdFx0XHRpbmxpbmU6IFsndnVldGlmeSddLFxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdGNvdmVyYWdlOiB7XG5cdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0cHJvdmlkZXI6ICd2OCcsXG5cdFx0XHRyZXBvcnRzRGlyZWN0b3J5OiAnLi90ZXN0cy91bml0L2NvdmVyYWdlJyxcblx0XHRcdGluY2x1ZGU6IFtcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzLyoqLyoue2pzLHZ1ZSx0c30nLFxuXHRcdFx0XHQnc3JjL2NvbXBvc2FibGVzLyoqJyxcblx0XHRcdFx0J3NyYy91dGlscy8qKicsXG5cdFx0XHRdLFxuXHRcdFx0ZXhjbHVkZTogW1xuXHRcdFx0XHQnc3JjLyoqLyouc3BlYy57anMsdnVlLHRzfScsXG5cdFx0XHRcdCdzcmMvKiovKi5zdG9yaWVzLionLFxuXHRcdFx0XHQnc3JjLyoqLyoudHMqJyxcblx0XHRcdFx0J3NyYy8qKi90eXBlcy4qJyxcblx0XHRcdFx0J3NyYy9tYWluLnRzJyxcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzL2luZGV4LnRzJyxcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzL1Rlc3RBMTF5LnZ1ZScsXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy9jdXN0b21pemFibGVPcHRpb25zLnZ1ZScsXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy9ncmlkc1Rlc3RzLnZ1ZScsXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy9UZXN0RGVzaWduVG9rZW5zQ29tcG9uZW50LyonLFxuXHRcdFx0XHQuLi5jb3ZlcmFnZUNvbmZpZ0RlZmF1bHRzLmV4Y2x1ZGUsXG5cdFx0XHRdLFxuXHRcdFx0LyogdGhyZXNob2xkczoge1xuICAgICAgICAgICAgICAgIGJyYW5jaGVzOiA4MCxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbnM6IDgwLFxuICAgICAgICAgICAgICAgIGxpbmVzOiA4MCxcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzOiA4MCxcbiAgICAgICAgICAgIH0sICovXG5cdFx0fSxcblx0fSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlTLFNBQVMsZUFBZSxXQUFXO0FBQ3BVLFNBQVMsZUFBZTtBQUN4QixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLDhCQUE4QjtBQUN2QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sV0FBVywwQkFBMEI7QUFONUMsSUFBTSxtQ0FBbUM7QUFBeUksSUFBTSwyQ0FBMkM7QUFRbk8sU0FBUyx5QkFBeUI7QUFDakMsUUFBTSxhQUFhO0FBQUEsSUFDbEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBRUEsUUFBTSxVQUFrQyxDQUFDO0FBRXpDLGFBQVcsYUFBYSxZQUFZO0FBQ25DLFlBQVEsMEJBQTBCLFNBQVMsWUFBWSxJQUFJO0FBQUEsRUFDNUQ7QUFDQSxVQUFRLG9DQUFvQyxJQUFJO0FBQ2hELFVBQVEsa0NBQWtDLElBQUk7QUFFOUMsU0FBTztBQUNSO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUztBQUFBLElBQ1IsSUFBSTtBQUFBLE1BQ0gsYUFBYTtBQUFBLE1BQ2Isa0JBQWtCO0FBQUEsTUFDbEIsY0FBYztBQUFBLElBQ2YsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLE1BQ0gsVUFBVSxFQUFFLG1CQUFtQjtBQUFBLElBQ2hDLENBQUM7QUFBQSxJQUNELFFBQVE7QUFBQSxNQUNQLFlBQVk7QUFBQSxNQUNaLFFBQVE7QUFBQSxRQUNQLFlBQVk7QUFBQSxNQUNiO0FBQUEsSUFDRCxDQUFDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLE1BQ04sS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUNwRCxVQUFVLGNBQWMsSUFBSSxJQUFJLFdBQVcsd0NBQWUsQ0FBQztBQUFBLElBQzVEO0FBQUEsRUFDRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0osT0FBTyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUN2QyxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsSUFDWDtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2QsVUFBVSxDQUFDLE9BQU8sU0FBUztBQUFBLE1BQzNCLFFBQVE7QUFBQSxRQUNQLFNBQVM7QUFBQSxVQUNSLE9BQU87QUFBQSxVQUNQLFdBQVc7QUFBQSxVQUNYLHNCQUFzQjtBQUFBLFVBQ3RCLDBCQUEwQjtBQUFBLFVBQzFCLEdBQUcsdUJBQXVCO0FBQUEsUUFDM0I7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNKLHFCQUFxQjtBQUFBLE1BQ3BCLE1BQU07QUFBQSxRQUNMLEtBQUs7QUFBQSxNQUNOO0FBQUEsTUFDQSxNQUFNO0FBQUEsUUFDTCxLQUFLO0FBQUEsTUFDTjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDTCxhQUFhO0FBQUEsSUFDYixRQUFRO0FBQUEsTUFDUCxNQUFNO0FBQUEsUUFDTCxRQUFRLENBQUMsU0FBUztBQUFBLE1BQ25CO0FBQUEsSUFDRDtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1QsVUFBVTtBQUFBLE1BQ1Ysa0JBQWtCO0FBQUEsTUFDbEIsU0FBUztBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Q7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQSxHQUFHLHVCQUF1QjtBQUFBLE1BQzNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPRDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
