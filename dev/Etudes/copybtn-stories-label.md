# Étude — CopyBtn : `label` n'est plus une prop, nom accessible perdu dans les exemples

## Problème

Constats relevés lors de la revue du correctif des imports de l'extrait `SlotIcon` (branche `fix/copy-btn-story-imports`), puis traités en deux temps :

- branche `fix/copy-btn-story-imports` (#2725) et #2743 : P1, P4 et coquille ;
- branche `fix/copy-btn-story-args` : P2, P3 et P5.

**Périmètre :** `src/components/CopyBtn/CopyBtn.stories.ts`, `src/components/CopyBtn/CopyBtn.mdx`, `src/components/CopyBtn/tests/CopyBtn.spec.ts`, `src/components/CopyBtn/tests/CopyBtn.stories.spec.ts`.

Aucun changement du composant de production n'est nécessaire.

| Point | Sévérité | Statut |
|---|---|---|
| P1 — `label` au lieu de `aria-label` dans les exemples | Moyenne | **Corrigé** (#2725) |
| P2 — Controls `ariaLabel`, `textToCopy`, `tooltipDuration`, `ariaOwns` et `separatorsToRemove` sans effet | Basse | **Corrigé** (`fix/copy-btn-story-args`) |
| P3 — Extrait `SlotIcon` : `VIcon` plutôt que `SyIcon` | Basse, facultatif | **Corrigé** (`fix/copy-btn-story-args`) |
| P4 — Tests unitaires passant l'ancienne prop `label` | Basse | **Corrigé** (#2743) |
| P5 — Le test de régression de P1 ne détecte pas P2 | Basse | **Corrigé** (`fix/copy-btn-story-args`) |
| P6 — Args `ariaOwns` et `vuetifyOptions` absents des extraits affichés | Basse | **Corrigé** (`fix/copy-btn-story-args`) |
| P7 — Clé `default` des argTypes inutilisée, détail de `vuetifyOptions` absent | Basse | **Corrigé** (`fix/copy-btn-story-args`) |
| Coquille « personalisé » (`SlotTooltip`) | Basse | **Corrigé** (#2725) |

### P1 — `label` n'est pas une prop de `CopyBtn` (corrigé)

**Constat :** les 7 extraits affichés (onglet *Template*), les 7 templates de `render` et l'exemple de `CopyBtn.mdx` (l. 48) passaient `label="…"` à `CopyBtn`.

`CopyBtn.vue` ne déclare pas de prop `label` ; le nom accessible du bouton est porté par `ariaLabel` (défaut : `'bouton de copie'`, `CopyBtn.vue:20`), lié sur le `VBtn` (`CopyBtn.vue:105`).

**Conséquence :**

- `label` tombait dans les attributs hérités et était posé sur la `<div class="sy-copy-btn">` racine (`CopyBtn.vue:90`) : attribut HTML sans signification.
- Le bouton gardait le nom accessible générique « bouton de copie ». Un consommateur qui recopiait l'exemple croyait fournir un intitulé explicite, jamais restitué par les technologies d'assistance (RGAA, critère 11.9 : intitulé de bouton pertinent).

**Correctif :** `label="…"` remplacé par `aria-label="…"` dans les 7 extraits, les 7 `render` et `CopyBtn.mdx`.

### P2 — Controls sans effet (corrigé)

**Constat :** les `render` codaient en dur des valeurs que les `args` définissent, au lieu de les lier. Modifier ces Controls dans Storybook ne changeait rien au rendu :

| Arg | Stories concernées | Détail |
|---|---|---|
| `ariaLabel` | les 7 stories | `aria-label="…"` statique dans `render` |
| `textToCopy` | `Default`, `NoTooltip`, `SlotIcon`, `SlotTooltip` | `text-to-copy="1970756541"` statique (déjà lié dans `RemoveSeparators`, `MultiSeparators`, `RemoveSpaces`) |
| `tooltipDuration` | les 7 stories | `2000` dans `args`, jamais passé au composant : la durée effective était le défaut `5000` (`CopyBtn.vue:24`) |
| `ariaOwns` | `Default` | `copy-btn-1` dans `args`, non lié dans `render` |
| `separatorsToRemove` | `Default`, `NoTooltip`, `SlotIcon`, `SlotTooltip`, `RemoveSpaces` | non lié ; `RemoveSpaces` codait `separators-to-remove=" "` en dur, sans arg correspondant |

**Correctif appliqué :**

- Les 7 `render` lient les mêmes props, dans le même ordre : `:aria-label`, `:aria-owns`, `:text-to-copy`, `:hide-tooltip`, `:tooltip-duration`, `:separators-to-remove` (plus `:vuetify-options` pour `Default`). `v-bind="args"` n'a pas été retenu : les args propres aux stories (`icon`, `tooltip`) ne sont pas des props de `CopyBtn` et seraient tombés en attributs sur la `div` racine.
- `RemoveSpaces` : ajout de l'arg `separatorsToRemove: ' '`.
- `tooltipDuration: 2000` retiré des `args` des 7 stories : aucun extrait ne passe `tooltip-duration`, le rendu utilise donc le même défaut (`5000`) que le code affiché. Le `default` de l'argType passe de `2000` à `5000`.

### P3 — Extrait `SlotIcon` : `VIcon` plutôt que `SyIcon` (corrigé)

**Constat :** le contenu par défaut du slot `icon` est un `SyIcon decorative` (`CopyBtn.vue:110-114`), alors que l'exemple et le rendu proposaient `VIcon`.

**Conséquence :** aucune en accessibilité (`VIcon` sans gestionnaire de clic rend `aria-hidden="true"`). Simple cohérence avec le Design System ; non bloquant.

**Correctif appliqué :** dans l'extrait, `import { CopyBtn, SyIcon } from '@cnamts/synapse'` et `<SyIcon :icon="duplicateIcon" decorative />` ; même remplacement dans le `render` (import local `@/components/Customs/SyIcon/SyIcon.vue`).

### P4 — Tests unitaires utilisant l'ancienne prop `label` (corrigé)

**Constat :** `CopyBtn.spec.ts` montait le composant avec `label: 'test'` (l. 28 à 162) ; le snapshot `__snapshots__/CopyBtn.spec.ts.snap:7` figeait `label="test"` sur la `div` racine.

**Conséquence :** pas d'impact consommateur, mais les tests entretenaient l'ancienne API et le snapshot validait un attribut invalide.

**Correctif :** `label` remplacé par `ariaLabel` dans les props de montage, snapshot mis à jour (#2743).

### P5 — Le test de régression de P1 ne détecte pas P2 (corrigé)

**Constat :** `CopyBtn.stories.spec.ts` vérifiait que le bouton porte `story.args.ariaLabel`, mais avec les args **par défaut**. Ces valeurs étant identiques à celles codées en dur dans `render`, le test passait alors que l'arg n'était pas lié.

**Correctif appliqué :** chaque story composée est montée avec des args **modifiés** :

- le nom accessible (`aria-label`) et le `data-test-id` du bouton reflètent `ariaLabel` et `ariaOwns` ;
- `CopyBtn` reçoit le `tooltipDuration` modifié ;
- un clic copie le `textToCopy` modifié (`navigator.clipboard.writeText` simulé) ;
- `CopyBtn` reçoit le `separatorsToRemove` modifié.

### P6 — Args absents des extraits affichés (corrigé)

**Constat :** `Default` définissait `ariaOwns: 'copy-btn-1'` et un `vuetifyOptions` (avec `btn.color: 'primary'`) absents de l'extrait ; `RemoveSeparators`, `MultiSeparators` et `RemoveSpaces` définissaient aussi un `ariaOwns` non affiché. Le rendu ne correspondait donc pas au code proposé à la copie.

**Correctif appliqué :** ces args sont retirés. `ariaOwns` ne sert qu'au `data-test-id` (l'identifiant du conteneur reste unique grâce à `useId`), et le `vuetifyOptions` de `Default` reproduisait `config.ts` : le rendu est inchangé. Les Controls restent disponibles.

**Test :** `CopyBtn.snippets.spec.ts` vérifie que chaque prop de `CopyBtn` définie dans les args avec une valeur différente du défaut apparaît dans l'extrait (4 tests en échec avant correctif).

### P7 — Clé `default` des argTypes (corrigé)

**Constat :** les argTypes utilisaient une clé `default`, ignorée par Storybook, avec des valeurs souvent fausses (`ariaLabel: 'copy-btn'`, `textToCopy: 'test'`, `vuetifyOptions` sans `color` ni `rounded`). La colonne « Default » n'était pas vide pour autant : `vue-component-meta` (`.storybook/main.ts:64`) en extrait les valeurs depuis `withDefaults`. Seul `vuetifyOptions`, sans défaut déclaré, n'avait aucune valeur affichée.

**Correctif appliqué :** clés `default` supprimées ; les valeurs par défaut des props restent fournies par `vue-component-meta`. Pour `vuetifyOptions`, `table.defaultValue` avec `summary: 'object'` et `detail` généré depuis `config.ts`.

**Test :** `CopyBtn.stories.spec.ts` vérifie qu'aucun argType n'utilise la clé `default` et que le détail de `vuetifyOptions` correspond à `config.ts`.

## Cause racine

Vérifiée dans l'historique Git :

- `d4592f02a` (#81, 2024-09-27, création du composant) : `CopyBtn` déclare une prop `label: string`, utilisée par les stories et la doc.
- `30ce91e56` (#87, 2024-09-27, « fix CopyBtn accessibility ») : la prop `label` est remplacée par `ariaLabel`, sans mise à jour des stories, de `CopyBtn.mdx` ni des tests unitaires.

Les exemples sont donc un reliquat de l'API d'origine. Les templates de `render` ayant été écrits en recopiant l'extrait plutôt qu'en liant les `args` (P2), aucun Control ne révélait l'écart.

`analyzeSnippet` ne le détectait pas : il vérifie la résolution des composants et identifiants, pas la correspondance entre attributs et props déclarées. Le premier test de régression comparait le rendu aux args par défaut, sans vérifier qu'ils étaient liés (P5).

## Vérification

### P1 et coquille (#2725)

- [x] Test de régression dans `CopyBtn.stories.spec.ts` (14 tests, tous en échec avant correctif) :
  - chaque extrait affiché ne passe à `<CopyBtn>` que des props déclarées par le composant, dont `aria-label` ;
  - chaque story montée nomme le bouton avec `args.ariaLabel` (avant : « bouton de copie ») et ne pose pas d'attribut `label` sur la racine.
- [x] `pnpm vitest run src/components/CopyBtn` : 3 fichiers, 36 tests passés, aucun avertissement Vue.
- [x] `pnpm exec eslint src/components/CopyBtn`
- [x] `pnpm vue-tsc -p tsconfig.app.json --noEmit` : aucune erreur sur `CopyBtn`.

### P2, P3 et P5 (`fix/copy-btn-story-args`)

- [x] Test de régression P5 dans `CopyBtn.stories.spec.ts` : 12 tests en échec avant correctif (valeurs codées en dur), tous passés après.
- [x] `pnpm vitest run src/components/CopyBtn` : 50 tests passés, aucun avertissement Vue.
- [x] `pnpm vitest run CopyBtn.snippets.spec.ts` : 14 tests passés (résolution de `SyIcon` dans l'extrait `SlotIcon`).
- [x] `pnpm vitest run CopyBtn.a11y.spec.ts` : 3 tests passés.
- [x] `pnpm exec eslint src/components/CopyBtn`
- [x] `pnpm vue-tsc -p tsconfig.app.json --noEmit` : aucune erreur sur `CopyBtn`.
- [ ] Storybook : les Controls `ariaLabel`, `textToCopy`, `tooltipDuration`, `ariaOwns` et `separatorsToRemove` modifient le rendu ; `SyIcon` affiché dans `SlotIcon` ; aucune erreur de console.
- [ ] Tests visuels Cypress : aucune baseline modifiée attendue (`CopyBtn.visual.cy.ts` n'utilise pas les stories).

### P6 et P7 (`fix/copy-btn-story-args`)

- [x] Tests de régression P6 : 4 tests en échec avant correctif, tous passés après.
- [x] `pnpm vitest run src/components/CopyBtn` : 65 tests passés.
- [x] `pnpm vitest run CopyBtn.snippets.spec.ts CopyBtn.a11y.spec.ts` : 24 tests passés.
- [x] `pnpm exec eslint src/components/CopyBtn`
- [x] `pnpm vue-tsc -p tsconfig.app.json --noEmit` : aucune erreur sur `CopyBtn`.
- [x] `vue-component-meta` sur `CopyBtn.vue` : défauts extraits pour toutes les props sauf `vuetifyOptions`.
- [ ] Storybook : colonne « Default » renseignée dans la table des Controls, détail de `vuetifyOptions` affiché.

## Impact

Documentation et stories uniquement : aucun changement de contrat du composant, donc pas de note dans `releasesAlerts/`. Les consommateurs ayant recopié l'exemple avec `label` ont un bouton nommé « bouton de copie » ; une mention dans la note de version invitant à passer à `aria-label` peut être envisagée.

## Suite

Aucun point résiduel.
