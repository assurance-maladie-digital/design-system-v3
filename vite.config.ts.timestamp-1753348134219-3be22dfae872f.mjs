// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "file:///Users/davidfyon/Desktop/cnam/design-system-v3/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.9_sass-embedded@1.89.2/node_modules/vite/dist/node/index.js";
import { coverageConfigDefaults } from "file:///Users/davidfyon/Desktop/cnam/design-system-v3/node_modules/.pnpm/vitest@2.1.9_@types+node@20.19.9_happy-dom@15.11.7_sass-embedded@1.89.2/node_modules/vitest/dist/config.js";
import vue from "file:///Users/davidfyon/Desktop/cnam/design-system-v3/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.19_vue@3.5.18/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vuetify, { transformAssetUrls } from "file:///Users/davidfyon/Desktop/cnam/design-system-v3/node_modules/.pnpm/vite-plugin-vuetify@2.1.1_vite@5.4.19_vue@3.5.18_vuetify@3.9.2/node_modules/vite-plugin-vuetify/dist/index.mjs";
import dts from "file:///Users/davidfyon/Desktop/cnam/design-system-v3/node_modules/.pnpm/vite-plugin-dts@4.5.4_@types+node@20.19.9_typescript@5.4.2_vite@5.4.19/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/davidfyon/Desktop/cnam/design-system-v3";
var __vite_injected_original_import_meta_url = "file:///Users/davidfyon/Desktop/cnam/design-system-v3/vite.config.ts";
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
    "VLocaleProvider",
    "VHotkey"
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
      exclude: ["**/*.stories.ts", "**/*.spec.ts"],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGF2aWRmeW9uL0Rlc2t0b3AvY25hbS9kZXNpZ24tc3lzdGVtLXYzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGF2aWRmeW9uL0Rlc2t0b3AvY25hbS9kZXNpZ24tc3lzdGVtLXYzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kYXZpZGZ5b24vRGVza3RvcC9jbmFtL2Rlc2lnbi1zeXN0ZW0tdjMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgY292ZXJhZ2VDb25maWdEZWZhdWx0cyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWV0aWZ5LCB7IHRyYW5zZm9ybUFzc2V0VXJscyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuZnVuY3Rpb24gZ2VuZXJhdGVWdWV0aWZ5R2xvYmFscygpIHtcblx0Y29uc3QgY29tcG9uZW50cyA9IFtcblx0XHQnVkZvcm0nLFxuXHRcdCdWQnRuJyxcblx0XHQnVkljb24nLFxuXHRcdCdWQ2hpcCcsXG5cdFx0J1ZNZW51Jyxcblx0XHQnVlJhZGlvR3JvdXAnLFxuXHRcdCdWUmFkaW8nLFxuXHRcdCdWVGFibGUnLFxuXHRcdCdWRGF0YVRhYmxlJyxcblx0XHQnVkRhdGFUYWJsZVNlcnZlcicsXG5cdFx0J1ZCdG5Ub2dnbGUnLFxuXHRcdCdWQ2hlY2tib3gnLFxuXHRcdCdWU2VsZWN0Jyxcblx0XHQnVlJhdGluZycsXG5cdFx0J1ZSYW5nZVNsaWRlcicsXG5cdFx0J1ZTbmFja2JhcicsXG5cdFx0J1ZUb29sdGlwJyxcblx0XHQnVlRleHRGaWVsZCcsXG5cdFx0J1ZJbnB1dCcsXG5cdFx0J1ZUb29sYmFyJyxcblx0XHQnVk5hdmlnYXRpb25EcmF3ZXInLFxuXHRcdCdWVGFicycsXG5cdFx0J1ZMYXlvdXQnLFxuXHRcdCdWRm9vdGVyJyxcblx0XHQnVkFsZXJ0Jyxcblx0XHQnVkRpdmlkZXInLFxuXHRcdCdWU2hlZXQnLFxuXHRcdCdWTGlzdCcsXG5cdFx0J1ZHcmlkJyxcblx0XHQnVkRpYWxvZycsXG5cdFx0J1ZDYXJkJyxcblx0XHQnVlNrZWxldG9uTG9hZGVyJyxcblx0XHQnVkJhZGdlJyxcblx0XHQnVkV4cGFuc2lvblBhbmVsJyxcblx0XHQnVkF1dG9jb21wbGV0ZScsXG5cdFx0J1ZTbGlkZXInLFxuXHRcdCdWVGV4dGFyZWEnLFxuXHRcdCd0cmFuc2l0aW9ucycsXG5cdFx0J1ZQcm9ncmVzc0xpbmVhcicsXG5cdFx0J1ZMb2NhbGVQcm92aWRlcicsXG5cdFx0J1ZIb3RrZXknLFxuXHRdXG5cblx0Y29uc3QgZ2xvYmFsczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9XG5cblx0Zm9yIChjb25zdCBjb21wb25lbnQgb2YgY29tcG9uZW50cykge1xuXHRcdGdsb2JhbHNbYHZ1ZXRpZnkvbGliL2NvbXBvbmVudHMvJHtjb21wb25lbnR9L2luZGV4Lm1qc2BdID0gY29tcG9uZW50XG5cdH1cblx0Z2xvYmFsc1sndnVldGlmeS9jb21wb25lbnRzL1ZTa2VsZXRvbkxvYWRlciddID0gJ1ZTa2VsZXRvbkxvYWRlcidcblx0Z2xvYmFsc1sndnVldGlmeS9saWIvZGlyZWN0aXZlcy9pbmRleC5tanMnXSA9ICd2dWV0aWZ5RGlyZWN0aXZlcydcblxuXHRyZXR1cm4gZ2xvYmFsc1xufVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdGR0cyh7XG5cdFx0XHRleGNsdWRlOiBbJyoqLyouc3Rvcmllcy50cycsICcqKi8qLnNwZWMudHMnXSxcblx0XHRcdGVudHJ5Um9vdDogJ3NyYycsXG5cdFx0XHRvdXREaXI6ICdkaXN0Jyxcblx0XHRcdHRzY29uZmlnUGF0aDogJ3RzY29uZmlnLmFwcC5qc29uJyxcblx0XHRcdHJvbGx1cFR5cGVzOiBmYWxzZSxcblx0XHRcdGluc2VydFR5cGVzRW50cnk6IHRydWUsXG5cdFx0XHRjb3B5RHRzRmlsZXM6IHRydWUsXG5cdFx0XHRjbGVhblZ1ZUZpbGVOYW1lOiB0cnVlLFxuXHRcdFx0YWxpYXNlc0V4Y2x1ZGU6IFsvdnVldGlmeS9dLFxuXHRcdH0pLFxuXHRcdHZ1ZSh7XG5cdFx0XHR0ZW1wbGF0ZToge1xuXHRcdFx0XHR0cmFuc2Zvcm1Bc3NldFVybHMsXG5cdFx0XHR9LFxuXHRcdH0pLFxuXHRcdHZ1ZXRpZnkoe1xuXHRcdFx0YXV0b0ltcG9ydDogdHJ1ZSxcblx0XHRcdHN0eWxlczogeyBjb25maWdGaWxlOiAnc3JjL2Fzc2V0cy9zZXR0aW5ncy5zY3NzJyB9LFxuXHRcdH0pLFxuXHRdLFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuXHRcdFx0J0B0ZXN0cyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi90ZXN0cycsIGltcG9ydC5tZXRhLnVybCkpLFxuXHRcdH0sXG5cdH0sXG5cdGJ1aWxkOiB7XG5cdFx0bGliOiB7XG5cdFx0XHRlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbWFpbi50cycpLFxuXHRcdFx0bmFtZTogJ0Rlc2lnblN5c3RlbVYzJyxcblx0XHRcdGZpbGVOYW1lOiAnZGVzaWduLXN5c3RlbS12MycsXG5cdFx0fSxcblx0XHRyb2xsdXBPcHRpb25zOiB7XG5cdFx0XHRleHRlcm5hbDogWyd2dWUnLCAvdnVldGlmeS9dLFxuXHRcdFx0b3V0cHV0OiB7XG5cdFx0XHRcdGdsb2JhbHM6IHtcblx0XHRcdFx0XHQndnVlJzogJ1Z1ZScsXG5cdFx0XHRcdFx0J3Z1ZXRpZnknOiAnVnVldGlmeScsXG5cdFx0XHRcdFx0J3Z1ZXRpZnkvZGlyZWN0aXZlcyc6ICd2dWV0aWZ5RGlyZWN0aXZlcycsXG5cdFx0XHRcdFx0J3Z1ZXRpZnkvbGliL2RpcmVjdGl2ZXMnOiAndnVldGlmeURpcmVjdGl2ZXMnLFxuXHRcdFx0XHRcdC4uLmdlbmVyYXRlVnVldGlmeUdsb2JhbHMoKSxcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0fSxcblx0fSxcblx0Y3NzOiB7XG5cdFx0cHJlcHJvY2Vzc29yT3B0aW9uczoge1xuXHRcdFx0c2Nzczoge1xuXHRcdFx0XHRhcGk6ICdtb2Rlcm4tY29tcGlsZXInLFxuXHRcdFx0fSxcblx0XHRcdHNhc3M6IHtcblx0XHRcdFx0YXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcblx0XHRcdH0sXG5cdFx0fSxcblx0fSxcblx0dGVzdDoge1xuXHRcdGVudmlyb25tZW50OiAnaGFwcHktZG9tJyxcblx0XHRzZXJ2ZXI6IHtcblx0XHRcdGRlcHM6IHtcblx0XHRcdFx0aW5saW5lOiBbJ3Z1ZXRpZnknXSxcblx0XHRcdH0sXG5cdFx0fSxcblx0XHRzbmFwc2hvdFNlcmlhbGl6ZXJzOiBbXG5cdFx0XHQnLi9ub2RlX21vZHVsZXMvdnVlMy1zbmFwc2hvdC1zZXJpYWxpemVyL2luZGV4LmpzJyxcblx0XHRdLFxuXHRcdGNvdmVyYWdlOiB7XG5cdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0cHJvdmlkZXI6ICd2OCcsXG5cdFx0XHRyZXBvcnRzRGlyZWN0b3J5OiAnLi90ZXN0cy91bml0L2NvdmVyYWdlJyxcblx0XHRcdGluY2x1ZGU6IFtcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzLyoqLyoue2pzLHZ1ZSx0c30nLFxuXHRcdFx0XHQnc3JjL2NvbXBvc2FibGVzLyoqJyxcblx0XHRcdFx0J3NyYy91dGlscy8qKicsXG5cdFx0XHRdLFxuXHRcdFx0ZXhjbHVkZTogW1xuXHRcdFx0XHQnc3JjLyoqLyouc3BlYy57anMsdnVlLHRzfScsXG5cdFx0XHRcdCdzcmMvKiovKi5zdG9yaWVzLionLFxuXHRcdFx0XHQnc3JjLyoqLypFeHBlcnRpc2VMZXZlbEVudW0udHMqJyxcblx0XHRcdFx0J3NyYy8qKi8qQWNjZXNzaWJpbGl0ZUl0ZW1zLnRzKicsXG5cdFx0XHRcdCdzcmMvKiovdGVzdHMvZGF0YS8qJyxcblx0XHRcdFx0J3NyYy8qKi9jb25zdGFudHMvKicsXG5cdFx0XHRcdCdzcmMvY29tcG9zYWJsZXMvaW5kZXgudHMqJyxcblx0XHRcdFx0J3NyYy8qKi90eXBlcy4qJyxcblx0XHRcdFx0J3NyYy9tYWluLnRzJyxcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzL2luZGV4LnRzJyxcblx0XHRcdFx0J3NyYy9jb21wb25lbnRzL1Rlc3RBMTF5LnZ1ZScsXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy9jdXN0b21pemFibGVPcHRpb25zLnZ1ZScsXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy9ncmlkc1Rlc3RzLnZ1ZScsXG5cdFx0XHRcdCdzcmMvY29tcG9uZW50cy9UZXN0RGVzaWduVG9rZW5zQ29tcG9uZW50LyonLFxuXHRcdFx0XHQuLi5jb3ZlcmFnZUNvbmZpZ0RlZmF1bHRzLmV4Y2x1ZGUsXG5cdFx0XHRdLFxuXHRcdFx0LyogdGhyZXNob2xkczoge1xuICAgICAgICAgICAgICAgIGJyYW5jaGVzOiA4MCxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbnM6IDgwLFxuICAgICAgICAgICAgICAgIGxpbmVzOiA4MCxcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzOiA4MCxcbiAgICAgICAgICAgIH0sICovXG5cdFx0fSxcblx0fSxcbn0pXG4iXSwKICAibWFw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
