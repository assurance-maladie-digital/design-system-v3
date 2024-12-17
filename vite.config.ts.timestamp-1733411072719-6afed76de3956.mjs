// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "file:///home/andrey/Documents/cnam/design-system-v3/node_modules/.pnpm/vite@5.4.11_@types+node@20.17.8_sass@1.81.0/node_modules/vite/dist/node/index.js";
import { coverageConfigDefaults } from "file:///home/andrey/Documents/cnam/design-system-v3/node_modules/.pnpm/vitest@2.1.6_@types+node@20.17.8_happy-dom@15.11.6_sass@1.81.0/node_modules/vitest/dist/config.js";
import vue from "file:///home/andrey/Documents/cnam/design-system-v3/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.11_vue@3.5.13/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///home/andrey/Documents/cnam/design-system-v3/node_modules/.pnpm/vite-plugin-dts@4.3.0_@types+node@20.17.8_typescript@5.4.2_vite@5.4.11/node_modules/vite-plugin-dts/dist/index.mjs";
import vuetify, { transformAssetUrls } from "file:///home/andrey/Documents/cnam/design-system-v3/node_modules/.pnpm/vite-plugin-vuetify@2.0.4_vite@5.4.11_vue@3.5.13_vuetify@3.7.4/node_modules/vite-plugin-vuetify/dist/index.mjs";
var __vite_injected_original_dirname = "/home/andrey/Documents/cnam/design-system-v3";
var __vite_injected_original_import_meta_url = "file:///home/andrey/Documents/cnam/design-system-v3/vite.config.ts";
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
      styles: "sass"
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
        api: "modern"
      },
      sass: {
        api: "modern"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hbmRyZXkvRG9jdW1lbnRzL2NuYW0vZGVzaWduLXN5c3RlbS12M1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYW5kcmV5L0RvY3VtZW50cy9jbmFtL2Rlc2lnbi1zeXN0ZW0tdjMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvYW5kcmV5L0RvY3VtZW50cy9jbmFtL2Rlc2lnbi1zeXN0ZW0tdjMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgY292ZXJhZ2VDb25maWdEZWZhdWx0cyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuaW1wb3J0IHZ1ZXRpZnksIHsgdHJhbnNmb3JtQXNzZXRVcmxzIH0gZnJvbSAndml0ZS1wbHVnaW4tdnVldGlmeSdcblxuZnVuY3Rpb24gZ2VuZXJhdGVWdWV0aWZ5R2xvYmFscygpIHtcblx0Y29uc3QgY29tcG9uZW50cyA9IFtcblx0XHQnVkZvcm0nLFxuXHRcdCdWQnRuJyxcblx0XHQnVkljb24nLFxuXHRcdCdWQ2hpcCcsXG5cdFx0J1ZNZW51Jyxcblx0XHQnVlJhZGlvR3JvdXAnLFxuXHRcdCdWUmFkaW8nLFxuXHRcdCdWVGFibGUnLFxuXHRcdCdWRGF0YVRhYmxlJyxcblx0XHQnVkJ0blRvZ2dsZScsXG5cdFx0J1ZDaGVja2JveCcsXG5cdFx0J1ZTZWxlY3QnLFxuXHRcdCdWUmF0aW5nJyxcblx0XHQnVlJhbmdlU2xpZGVyJyxcblx0XHQnVlNuYWNrYmFyJyxcblx0XHQnVlRvb2x0aXAnLFxuXHRcdCdWVGV4dEZpZWxkJyxcblx0XHQnVklucHV0Jyxcblx0XHQnVlRvb2xiYXInLFxuXHRcdCdWTmF2aWdhdGlvbkRyYXdlcicsXG5cdFx0J1ZUYWJzJyxcblx0XHQnVkxheW91dCcsXG5cdFx0J1ZGb290ZXInLFxuXHRcdCdWQWxlcnQnLFxuXHRcdCdWRGl2aWRlcicsXG5cdFx0J1ZTaGVldCcsXG5cdFx0J1ZMaXN0Jyxcblx0XHQnVkdyaWQnLFxuXHRcdCdWRGlhbG9nJyxcblx0XHQnVkNhcmQnLFxuXHRcdCdWU2tlbGV0b25Mb2FkZXInLFxuXHRcdCdWQmFkZ2UnLFxuXHRcdCdWRXhwYW5zaW9uUGFuZWwnLFxuXHRcdCdWQXV0b2NvbXBsZXRlJyxcblx0XHQnVlNsaWRlcicsXG5cdFx0J1ZUZXh0YXJlYScsXG5cdFx0J3RyYW5zaXRpb25zJyxcblx0XVxuXG5cdGNvbnN0IGdsb2JhbHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fVxuXG5cdGZvciAoY29uc3QgY29tcG9uZW50IG9mIGNvbXBvbmVudHMpIHtcblx0XHRnbG9iYWxzW2B2dWV0aWZ5L2xpYi9jb21wb25lbnRzLyR7Y29tcG9uZW50fS9pbmRleC5tanNgXSA9IGNvbXBvbmVudFxuXHR9XG5cdGdsb2JhbHNbJ3Z1ZXRpZnkvY29tcG9uZW50cy9WU2tlbGV0b25Mb2FkZXInXSA9ICdWU2tlbGV0b25Mb2FkZXInXG5cdGdsb2JhbHNbJ3Z1ZXRpZnkvbGliL2RpcmVjdGl2ZXMvaW5kZXgubWpzJ10gPSAndnVldGlmeURpcmVjdGl2ZXMnXG5cblx0cmV0dXJuIGdsb2JhbHNcbn1cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtcblx0XHRkdHMoe1xuXHRcdFx0cm9sbHVwVHlwZXM6IHRydWUsXG5cdFx0XHRpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuXHRcdFx0dHNjb25maWdQYXRoOiAnLi90c2NvbmZpZy5hcHAuanNvbicsXG5cdFx0fSksXG5cdFx0dnVlKHtcblx0XHRcdHRlbXBsYXRlOiB7IHRyYW5zZm9ybUFzc2V0VXJscyB9LFxuXHRcdH0pLFxuXHRcdHZ1ZXRpZnkoe1xuXHRcdFx0YXV0b0ltcG9ydDogdHJ1ZSxcblx0XHRcdHN0eWxlczogJ3Nhc3MnLFxuXHRcdH0pLFxuXHRdLFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuXHRcdFx0J0B0ZXN0cyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi90ZXN0cycsIGltcG9ydC5tZXRhLnVybCkpLFxuXHRcdH0sXG5cdH0sXG5cdGJ1aWxkOiB7XG5cdFx0bGliOiB7XG5cdFx0XHRlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbWFpbi50cycpLFxuXHRcdFx0bmFtZTogJ0Rlc2lnblN5c3RlbVYzJyxcblx0XHRcdGZpbGVOYW1lOiAnZGVzaWduLXN5c3RlbS12MycsXG5cdFx0fSxcblx0XHRyb2xsdXBPcHRpb25zOiB7XG5cdFx0XHRleHRlcm5hbDogWyd2dWUnLCAvdnVldGlmeS9dLFxuXHRcdFx0b3V0cHV0OiB7XG5cdFx0XHRcdGdsb2JhbHM6IHtcblx0XHRcdFx0XHQndnVlJzogJ1Z1ZScsXG5cdFx0XHRcdFx0J3Z1ZXRpZnknOiAnVnVldGlmeScsXG5cdFx0XHRcdFx0J3Z1ZXRpZnkvZGlyZWN0aXZlcyc6ICd2dWV0aWZ5RGlyZWN0aXZlcycsXG5cdFx0XHRcdFx0J3Z1ZXRpZnkvbGliL2RpcmVjdGl2ZXMnOiAndnVldGlmeURpcmVjdGl2ZXMnLFxuXHRcdFx0XHRcdC4uLmdlbmVyYXRlVnVldGlmeUdsb2JhbHMoKSxcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0fSxcblx0fSxcblx0Y3NzOiB7XG5cdFx0cHJlcHJvY2Vzc29yT3B0aW9uczoge1xuXHRcdFx0c2Nzczoge1xuXHRcdFx0XHRhcGk6ICdtb2Rlcm4nLFxuXHRcdFx0fSxcblx0XHRcdHNhc3M6IHtcblx0XHRcdFx0YXBpOiAnbW9kZXJuJyxcblx0XHRcdH0sXG5cdFx0fSxcblx0fSxcblx0dGVzdDoge1xuXHRcdGVudmlyb25tZW50OiAnaGFwcHktZG9tJyxcblx0XHRzZXJ2ZXI6IHtcblx0XHRcdGRlcHM6IHtcblx0XHRcdFx0aW5saW5lOiBbJ3Z1ZXRpZnknXSxcblx0XHRcdH0sXG5cdFx0fSxcblx0XHRjb3ZlcmFnZToge1xuXHRcdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRcdHByb3ZpZGVyOiAndjgnLFxuXHRcdFx0cmVwb3J0c0RpcmVjdG9yeTogJy4vdGVzdHMvdW5pdC9jb3ZlcmFnZScsXG5cdFx0XHRpbmNsdWRlOiBbXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy8qKi8qLntqcyx2dWUsdHN9Jyxcblx0XHRcdFx0J3NyYy9jb21wb3NhYmxlcy8qKicsXG5cdFx0XHRcdCdzcmMvdXRpbHMvKionLFxuXHRcdFx0XSxcblx0XHRcdGV4Y2x1ZGU6IFtcblx0XHRcdFx0J3NyYy8qKi8qLnNwZWMue2pzLHZ1ZSx0c30nLFxuXHRcdFx0XHQnc3JjLyoqLyouc3Rvcmllcy4qJyxcblx0XHRcdFx0J3NyYy8qKi8qLnRzKicsXG5cdFx0XHRcdCdzcmMvKiovdHlwZXMuKicsXG5cdFx0XHRcdCdzcmMvbWFpbi50cycsXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy9pbmRleC50cycsXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy9UZXN0QTExeS52dWUnLFxuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvY3VzdG9taXphYmxlT3B0aW9ucy52dWUnLFxuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvZ3JpZHNUZXN0cy52dWUnLFxuXHRcdFx0XHQnc3JjL2NvbXBvbmVudHMvVGVzdERlc2lnblRva2Vuc0NvbXBvbmVudC8qJyxcblx0XHRcdFx0Li4uY292ZXJhZ2VDb25maWdEZWZhdWx0cy5leGNsdWRlLFxuXHRcdFx0XSxcblx0XHRcdC8qIHRocmVzaG9sZHM6IHtcbiAgICAgICAgICAgICAgICBicmFuY2hlczogODAsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25zOiA4MCxcbiAgICAgICAgICAgICAgICBsaW5lczogODAsXG4gICAgICAgICAgICAgICAgc3RhdGVtZW50czogODAsXG4gICAgICAgICAgICB9LCAqL1xuXHRcdH0sXG5cdH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVCxTQUFTLGVBQWUsV0FBVztBQUN6VixTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyw4QkFBOEI7QUFDdkMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVcsMEJBQTBCO0FBTjVDLElBQU0sbUNBQW1DO0FBQXVKLElBQU0sMkNBQTJDO0FBUWpQLFNBQVMseUJBQXlCO0FBQ2pDLFFBQU0sYUFBYTtBQUFBLElBQ2xCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUVBLFFBQU0sVUFBa0MsQ0FBQztBQUV6QyxhQUFXLGFBQWEsWUFBWTtBQUNuQyxZQUFRLDBCQUEwQixTQUFTLFlBQVksSUFBSTtBQUFBLEVBQzVEO0FBQ0EsVUFBUSxvQ0FBb0MsSUFBSTtBQUNoRCxVQUFRLGtDQUFrQyxJQUFJO0FBRTlDLFNBQU87QUFDUjtBQUdBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVM7QUFBQSxJQUNSLElBQUk7QUFBQSxNQUNILGFBQWE7QUFBQSxNQUNiLGtCQUFrQjtBQUFBLE1BQ2xCLGNBQWM7QUFBQSxJQUNmLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxNQUNILFVBQVUsRUFBRSxtQkFBbUI7QUFBQSxJQUNoQyxDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDUCxZQUFZO0FBQUEsTUFDWixRQUFRO0FBQUEsSUFDVCxDQUFDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLE1BQ04sS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUNwRCxVQUFVLGNBQWMsSUFBSSxJQUFJLFdBQVcsd0NBQWUsQ0FBQztBQUFBLElBQzVEO0FBQUEsRUFDRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0osT0FBTyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUN2QyxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsSUFDWDtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2QsVUFBVSxDQUFDLE9BQU8sU0FBUztBQUFBLE1BQzNCLFFBQVE7QUFBQSxRQUNQLFNBQVM7QUFBQSxVQUNSLE9BQU87QUFBQSxVQUNQLFdBQVc7QUFBQSxVQUNYLHNCQUFzQjtBQUFBLFVBQ3RCLDBCQUEwQjtBQUFBLFVBQzFCLEdBQUcsdUJBQXVCO0FBQUEsUUFDM0I7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNKLHFCQUFxQjtBQUFBLE1BQ3BCLE1BQU07QUFBQSxRQUNMLEtBQUs7QUFBQSxNQUNOO0FBQUEsTUFDQSxNQUFNO0FBQUEsUUFDTCxLQUFLO0FBQUEsTUFDTjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDTCxhQUFhO0FBQUEsSUFDYixRQUFRO0FBQUEsTUFDUCxNQUFNO0FBQUEsUUFDTCxRQUFRLENBQUMsU0FBUztBQUFBLE1BQ25CO0FBQUEsSUFDRDtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1QsVUFBVTtBQUFBLE1BQ1Ysa0JBQWtCO0FBQUEsTUFDbEIsU0FBUztBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Q7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQSxHQUFHLHVCQUF1QjtBQUFBLE1BQzNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPRDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
