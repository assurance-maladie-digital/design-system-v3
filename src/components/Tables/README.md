# Tableaux (SyTable / SyServerTable) — organisation des stories

Ce dossier regroupe les composants de tableaux du Design System et leurs stories
Storybook. Les stories sont **découpées par fonctionnalité** en sous-groupes,
plutôt que rassemblées dans un unique fichier monolithique.

## Pattern de découpage

Storybook ne crée des sous-groupes dans la sidebar que via le `title` du `meta`,
et **un fichier = un `meta` = un `title`**. Regrouper des stories = donc **un
fichier par sous-groupe** :

1. `title: 'Composants/Tableaux/<Composant>/<Groupe>'` dans un fichier dédié
   (ex. `Tri.stories.ts`, `Filtres.stories.ts`).
2. `argTypes: { ...commonTableArgTypes, … }` — la doc commune des props/slots/events
   est centralisée dans [`common/storyArgTypes.ts`](./common/storyArgTypes.ts).
3. Données de démonstration partagées dans [`common/storyData.ts`](./common/storyData.ts)
   (`usersHeaders`, `users`, `serverUsers`, …). Les jeux spécifiques à une story
   restent définis **localement** dans son fichier.
4. Stories **serveur** : le boilerplate (état de chargement + « fetch » simulé +
   filtrage + tri multi-clés + pagination + sync `options`↔`args`) est mutualisé
   dans [`common/serverStoryHelpers.ts`](./common/serverStoryHelpers.ts) via
   `useServerTableDemo(args, dataset, customFilter?)`. Une story serveur passe de
   ~200 lignes à ~12.

## Arborescence cible

```
SyTable / SyServerTable
├─ (racine)  Default, ManyTables            ← vue d'ensemble, reste dans le fichier principal
├─ Tri       SortBy, MultiSort
├─ Filtres   FilterBy* (Text/Number/Select/…), CustomFilterSlot, CustomFilterInputs
│  └─ Rules  (FilterRules.stories.ts)
├─ Sélection RowSelection, SingleRowSelection
├─ Lignes    ClickableRow, ExpandableRows
├─ Colonnes  ResizableColumns, PinnedColumns, ColumnControls, DataAlignment
├─ Slots     SlotItem, SlotHeaders, SlotHeader, ComplexItemsDisplay
├─ Pagination ItemsPerPageOptions, HideDefaultFooter, PageInput
└─ Édition
   ├─ Ligne par ligne (RowEditing.stories.ts)
   └─ Actions groupées (BulkActions.stories.ts)
```

## Avancement

- [x] **Édition** — `Ligne par ligne` + `Actions groupées` (regroupées sous `Édition`).
- [x] **Tri** — `Tri.stories.ts` (SyTable + SyServerTable) + extraction `storyData` / `useServerTableDemo`.
- [x] **Filtres** — `Filtres.stories.ts` (SyTable + SyServerTable) + filtrage générique dans `useServerTableDemo` (`defaultFilterMatch`) ; `Rules` rattaché.
- [x] **Sélection** — `Selection.stories.ts` (SyTable + SyServerTable) : `RowSelection` + `SingleRowSelection`. La sélection reste un `v-model` local (hors helper) ; les stories serveur réutilisent `useServerTableDemo`.
- [x] **Lignes** — `Lignes.stories.ts` (SyTable + SyServerTable) : `ClickableRow` (`@row-click`) + `ExpandableRows` (slots `#item.data-table-expand` / `#expanded-row`). `ExpandableRows` serveur mutualisé via `useServerTableDemo` ; `ClickableRow` serveur garde son canvas dédié (émission `@row-click`).
- [x] **Pagination** — `Pagination.stories.ts` (SyTable + SyServerTable) : `ItemsPerPageOptions` + `HideDefaultFooter` + `PageInput`. Fixture client `manyUsers` (14 lignes) ajoutée à `storyData.ts` ; stories serveur mutualisées via `useServerTableDemo` (`serverUsers`, `.slice(0, 6)` / `.slice(0, 11)`).
- [x] **Colonnes** — `Colonnes.stories.ts` (SyTable + SyServerTable) : `DataAlignment` + `ResizableColumns` + `PinnedColumns` + `ColumnControls`. Fixtures « larges » ajoutées à `storyData.ts` (`wideHeaders`, `wideUsers` 12 lignes, `wideServerUsers` 30 lignes, dates statiques → rendu déterministe, plus de `dayjs`). Stories serveur mutualisées via `useServerTableDemo`.
- [x] **Slots** — `Slots.stories.ts` (SyTable + SyServerTable) : `SlotItem` (`#item`) + `SlotHeaders` (`#headers`) + `SlotHeader` (`#header.<key>`) + `ComplexItemsDisplay` (`#item.<key>`). Stories serveur mutualisées via `useServerTableDemo` ; `ComplexItemsDisplay` garde ses données « projets » (period/status) en local.

✅ **Migration terminée.** Le fichier principal (`SyTable.stories.ts` / `SyServerTable.stories.ts`)
ne conserve plus que **`Default`** + **`ManyTables`/`ManyServerTables`** (vue d'ensemble).

## Ordre recommandé (du plus sûr au plus lourd)

1. **Sélection** — valide le cas `v-model:modelValue` (la sélection reste un
   `v-model` à part, **pas** dans le helper) + `show-select-single`.
2. **Lignes** — `ClickableRow` (`@row-click`) + `ExpandableRows` (slot `#expanded-row`).
3. **Pagination** — nécessite un jeu suffisamment long (ajouter une fixture
   `manyUsers` côté client dans `storyData.ts`).
4. **Colonnes** — introduit une fixture « large » (`wideHeaders` / `wideUsers` :
   largeurs, alignements, colonnes épinglées).
5. **Slots** — `ComplexItemsDisplay` garde ses données « projets » (period/status)
   en **local**.

## Points d'attention

- **Fixtures** dans `storyData.ts` : `manyUsers` (Pagination) ✅, `wideHeaders` /
  `wideUsers` / `wideServerUsers` (Colonnes) ✅.
- **Sélection** : le helper serveur ne gère pas la sélection ; chaque story ajoute
  son `const selected = ref([])` + `show-select` / `selection-key`.
- **Helper serveur** : tri + filtrage + pagination sont déjà couverts. Aucune
  nouvelle extension attendue pour les groupes restants (la sélection est hors
  helper).
- **Lint** : la règle `@stylistic/quote-props` est « consistent-as-needed » ; comme
  les `args` contiennent `'onUpdate:options'` (guillemets obligatoires), **toutes**
  les clés de ces objets doivent être guillemetées → lancer `eslint --fix` sur
  chaque nouveau fichier de stories.
- **Vérification** de chaque migration :
  `npx vue-tsc --noEmit -p tsconfig.app.json` (0 erreur) + `eslint` (0 erreur).
