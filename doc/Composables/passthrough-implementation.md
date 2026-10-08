# Passthrough & typage — implémentation recommandée

Suite de l'étude [passthrough-typage-wrappers](./passthrough-typage-wrappers.md) (#2417).
Ce document formalise **la méthode d'implémentation retenue** : le pattern déjà éprouvé par
`SyTextArea`, généralisé en trois utilitaires réutilisables.

> **Principe central** : les props Vuetify ne sont **jamais déclarées** comme props runtime
> du wrapper. `defineProps` ne contient que les props maison ; tout le reste circule dans
> `$attrs` et est forwardé au composant Vuetify. Le typage complet est apporté par un
> **cast `$props` au niveau de l'export public** — purement type-level, zéro diff runtime.

---

## Pourquoi ce pattern plutôt que `defineProps<Own & Partial<V['$props']>>`

| | Recette « tout déclarer » | Pattern retenu |
|---|---|---|
| Diff runtime | chaque prop Vuetify devient déclarée → sort de `$attrs` → doit être re-bindée | aucun pour les wrappers dont la racine est le composant Vuetify |
| Compilateur SFC | doit résoudre un mapped type géant pour générer les props runtime | `defineProps` reste un objet local simple |
| DOM | `v-bind="props"` fuit les props maison en attributs parasites | aucune fuite |
| Écouteurs | `onClick`… déclarés en props, à re-forwarder | typés via `$props`, transportés par `$attrs` — gratuit |
| Docgen/Storybook | props visibles dans les tables | invisibles → documenter dans le `.mdx` (voir §Limites) |
| Précédent | aucun | `SyTextArea` livré et publié |

Les deux approches **cohabitent** : quand le wrapper gère ou définit une prop Vuetify
(ex. `variant: 'outlined'`), elle est déclarée en prop maison et `Omit` la retire du
côté Vuetify — le typage maison (souvent plus précis) gagne.

---

## Les trois briques

### 1. `WithVuetifyProps` — le cast `$props` factorisé

```ts
// src/types/passthrough.ts
export type WithVuetifyProps<C, VProps, OwnProps> = C & {
  new (): { $props: Omit<VProps, keyof OwnProps> & OwnProps }
}
```

Utilisation en trois temps, par composant :

```ts
// src/components/SyAlert/types.ts
import type { VAlert } from 'vuetify/components'

export interface SyAlertOwnProps { /* props maison uniquement */ }
export type SyAlertPublicProps =
  Omit<VAlert['$props'], keyof SyAlertOwnProps> & SyAlertOwnProps
```

```vue
<!-- SyAlert.vue — inchangé ou presque -->
<script setup lang="ts">
	defineOptions({ inheritAttrs: false })
	const props = withDefaults(defineProps<SyAlertOwnProps>(), { /* … */ })
</script>

<template>
	<div class="sy-alert">
		<VAlert v-bind="$attrs" /* bindings explicites après le spread */ />
	</div>
</template>
```

```ts
// src/components/index.ts — une ligne
export const SyAlert = SyAlertComponent as WithVuetifyProps<
	typeof SyAlertComponent, VAlert['$props'], SyAlertOwnProps
>
```

Le consommateur obtient l'autocomplétion et le type-check de **toutes** les props `VAlert`
(et des écouteurs `onClick`…), alors qu'à l'exécution elles arrivent via `$attrs` et sont
forwardées — **rien n'a changé à l'exécution**.

### 2. `useSplitAttrs` — passthrough complet sans déplacer `class`/`style`/`id`

Pour les wrappers dont la racine est un **conteneur** (`<div>`, `<fieldset>`) :

```ts
// src/composables/useSplitAttrs.ts
import { computed, useAttrs } from 'vue'

export function useSplitAttrs(rootKeys: string[] = ['class', 'style', 'id']) {
	const attrs = useAttrs()

	const rootAttrs = computed(() =>
		Object.fromEntries(Object.entries(attrs).filter(([k]) => rootKeys.includes(k))))
	const childAttrs = computed(() =>
		Object.fromEntries(Object.entries(attrs).filter(([k]) => !rootKeys.includes(k))))

	return { rootAttrs, childAttrs }
}
```

```vue
<script setup lang="ts">
	defineOptions({ inheritAttrs: false })
	const { rootAttrs, childAttrs } = useSplitAttrs()
</script>

<template>
	<div v-bind="rootAttrs"><!-- class/style/id restent ici, comme aujourd'hui -->
		<VCheckbox v-bind="childAttrs" :model-value="model" /* … */ />
	</div>
</template>
```

- `class`/`style`/`id` **ne bougent pas** → contrat DOM préservé (règle d'or de l'étude).
- Toutes les autres props/attrs (`density`, `aria-*`, `data-*`, écouteurs…) arrivent au
  contrôle réel — passthrough **complet** en une ligne, sans liste blanche à maintenir.
- `rootKeys` est paramétrable : `useSplitAttrs(['class', 'style'])` si `id` doit aller au
  contrôle (pertinent pour les champs, voir §Points d'attention).

### 3. `OptionsFor` — `vuetifyOptions` typé par les vraies clés

La convention réelle du codebase est **camelCase** (`btn`, `chip`, `menu`, `dialog`,
`cancelBtn`, `cardActions`…) — pas `VBtn`/`VTextField`.

```ts
// src/types/passthrough.ts
export type OptionsFor<M extends Record<string, unknown>> =
	{ [K in keyof M]?: Partial<M[K]> } & Record<string, unknown>
```

```ts
// DialogBox
vuetifyOptions?: OptionsFor<{
	dialog: VDialog['$props']
	card: VCard['$props']
	cancelBtn: VBtn['$props']
	confirmBtn: VBtn['$props']
}>
```

→ autocomplétion sur les clés réellement lues par le composant, `Record<string, unknown>`
conserve la permissivité (aucun projet existant ne casse à la compilation).

---

## Stratégie par groupe

### Groupe 1 — la racine **est** le composant Vuetify

`BackBtn`, `SyForm`, `SyRadioGroup`, `SyIconButton`, `CollapsibleList`, `HeaderLoading`,
`DownloadBtn`, `BackToTopBtn`, `SyAlert`, `SyTabs` (racine `VSheet`), `SyTable`,
`SyServerTable`, `PaginatedTable`, `DialogBox`, `TableToolbar`, `SubHeader`…

**Travail : purement type-level.** Les attrs tombent déjà sur le bon composant
(fallthrough ou `v-bind="$attrs"` existant).

1. Créer `XxxOwnProps` (souvent : renommer le type inline existant).
2. `XxxPublicProps = Omit<VComp['$props'], keyof XxxOwnProps> & XxxOwnProps`.
3. Cast `WithVuetifyProps` dans `index.ts`.

**Aucune modification du `.vue`**, aucun test de régression nécessaire (le runtime est
identique) — seul `vue-tsc` doit valider. C'est le plus gros de l'audit #2417 pour un
risque nul : traiter en premier, possiblement en une seule PR groupée.

### Groupe 2 — la racine est un conteneur

`SyCheckbox`, `ChipList`, `SyCheckBoxGroup`, `PageContainer`, `CopyBtn`, `DataListItem`,
`FilterInline`, `FilterSideBar`, `NirField`…

1. `defineOptions({ inheritAttrs: false })`.
2. `useSplitAttrs()` : `v-bind="rootAttrs"` sur la racine, `v-bind="childAttrs"` sur le
   composant Vuetify interne (avant les bindings explicites, qui gardent la priorité).
3. Cast `WithVuetifyProps` comme groupe 1.

**Diff runtime minimal et contrôlé** : `class`/`style`/`id` ne bougent pas ; seuls les
autres attrs migrent vers le contrôle — cf. §Points d'attention.

### Groupe 3 — champs à API restreinte

`SyTextField`, `SySelect`, `SyAutocomplete`… : la restriction est **volontaire**
(validation, thème). On ne veut pas exposer tout `$props`.

```ts
// whitelist type-level : seules ces props Vuetify deviennent publiques
export type SyTextFieldPublicProps =
	Pick<VTextField['$props'], 'variant' | 'density' | 'autofocus' | 'placeholder'> &
	SyTextFieldOwnProps
```

Le runtime est inchangé (ces props étaient déjà déclarées ou forwardées) ; le `Pick`
formalise simplement la liste blanche dans le type public.

### Groupe 4 — composites

`DatePicker`, `ComplexDatePicker`, `SyBtnMenu`, `FooterBar`, `CookieBanner`,
`FilterInline`… : plusieurs composants Vuetify internes → la bonne surface est
`vuetifyOptions`, typée via `OptionsFor` (brique 3) avec les **clés réelles** du
`config.ts` du composant. Pas de cast `$props` pertinent ici (le wrapper n'est pas
« un » composant Vuetify).

---

## Points d'attention

- **Où placer `id`** : aujourd'hui il tombe sur la racine conteneur. Pour un champ,
  l'`id` sur le contrôle est souvent préférable (association `label`/`htmlFor`,
  tests e2e) → `useSplitAttrs(['class', 'style'])`. Décision par composant, à documenter
  dans sa story : c'est le seul attr dont le point de chute doit être un choix explicite.
- **`aria-*` / `data-*` bougent** (groupe 2) : de la racine vers le contrôle.
  Sémantiquement meilleur pour l'a11y, mais c'est un changement de DOM → valider par
  snapshot visuel et tests existants (`data-testid` ciblant la racine).
- **Écouteurs sur les conteneurs** : `@click` posé par le parent part vers le contrôle
  au lieu de la racine. Les clics internes continuent de le déclencher (bulle), mais les
  zones hors contrôle (ex. `helpText` de `SyCheckbox`) ne le couvrent plus — à vérifier.
- **Composants génériques** (`VDataTable`) : vérifier que `VDataTable['$props']` se
  résout sous `vue-tsc` ; sinon passer par `InstanceType<typeof VDataTable>['$props']`.
- **`defineProps` runtime** (`SyBtnMenu`, `SocialMediaLinks`) : le cast `$props`
  fonctionne quand même — pas besoin de convertir en type-based pour bénéficier du
  typage public.
- **`withDefaults`** ne concerne que les props maison ; un défaut sur une prop Vuetify
  s'exprime en binding explicite (`:variant="variant"`).

---

## Limites assumées

- **Docgen/Storybook** lit `defineProps` : les props Vuetify n'apparaissent pas dans les
  tables de props. Compenser par une ligne standard dans le `.mdx` :
  *« Ce composant accepte également toutes les props de `VAlert` »* + lien Vuetify.
- **Imports profonds** (`import X from '.../SyAlert.vue'`) contournent le cast : seul
  l'export `index.ts` est typé. C'est le seul point d'entrée supporté du package —
  cohérent, voire souhaitable (l'interne garde le typage strict des props maison).
- **Dissymétrie mainteneur/consommateur** : dans le `.vue`, `props.density` n'existe pas
  alors que le consommateur peut le passer — il est dans `childAttrs`/`$attrs`. La
  convention `OwnProps`/`PublicProps` dans `types.ts` rend la frontière explicite.

---

## Ordre de migration

| Ordre | Quoi | Risque |
|:--:|---|:--:|
| 1 | Créer `WithVuetifyProps`, `useSplitAttrs`, `OptionsFor` (+ tests unitaires) | aucun |
| 2 | Groupe 1 : cast type-level (~15 composants, une PR possible) | aucun |
| 3 | Groupe 3 : `Pick` whitelist sur les champs | aucun |
| 4 | Groupe 2 : `useSplitAttrs`, un composant par PR + snapshot | faible |
| 5 | Groupe 4 : `OptionsFor` sur `vuetifyOptions` existant | aucun |
| 6 | **Majeure** : déplacer `class`/`style`/`id`, renommer `options`→`vuetifyOptions`
    (`SyBtnMenu`), revoir `vuetifyOptions.accordion` (`Accordion`) | breaking |

## Verrouillage par les tests

- Test partagé (helper vitest) : *« une prop Vuetify arbitraire atteint le composant
  interne »* et *« `class`/`style` restent sur la racine »* — réutilisable sur chaque
  composant migré.
- Snapshots visuels Cypress systématiques pour le groupe 2.
- `pnpm vue-tsc -p tsconfig.app.json --noEmit` valide les casts (aucun test runtime ne
  peut les couvrir — c'est du type-level).

---

## Voir aussi

- [Étude : passer & typer les props vers Vuetify](./passthrough-typage-wrappers.md)
- [vuetifyOptions — useCustomizableOptions](./vuetify-options.md)
- Implémentation de référence : `src/components/SyTextArea/` (`types.ts`,
  `forwardedTextareaProps`, cast dans `src/components/index.ts`)
