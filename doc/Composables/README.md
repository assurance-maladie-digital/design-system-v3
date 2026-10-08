# Index — Composables

Composables utilitaires exportés par le Design System et utilisables dans les projets consommateurs ou dans les composants internes.

---

## Pages

### 1. [vuetifyOptions — useCustomizableOptions](./vuetify-options.md)
Le mécanisme de personnalisation des props Vuetify sous-jacentes via la prop `vuetifyOptions`. Utilisé par la quasi-totalité des composants du Design System.

### 2. [Composables utilitaires](./composables-utilitaires.md)
Référence de `useWidthable`, `useFilterable`, `useHolidayDay`, `usePagination`, `useFormFieldErrorHandling`.

### 3. [Passthrough & typage des wrappers — stratégie sans breaking change](./passthrough-typage-wrappers.md)
Comment harmoniser le passage des props (`v-bind` / `$attrs` / `vuetifyOptions`) et leur typage vers les composants Vuetify sous-jacents, sans casser les projets consommateurs (suite à #2417).

### 4. [Passthrough & typage — implémentation recommandée](./passthrough-implementation.md)
Le pattern retenu (cast `$props` type-level, `useSplitAttrs`, `vuetifyOptions` typé par les clés réelles) et son application par groupe de composants.
