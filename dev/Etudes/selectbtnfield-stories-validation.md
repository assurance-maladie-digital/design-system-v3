# Étude — Stories SelectBtnField : extraits copiables incomplets, args non liés, DisableErrorHandling non démonstratif

## Description du bug

**Périmètre :** `src/components/Customs/Selects/SelectBtnField/Validation/Validation.stories.ts` (8 stories) et `src/components/Customs/Selects/SelectBtnField/SelectBtnField.stories.ts` (7 stories).

**Attendu :** les extraits affichés (onglets Template / Script) sont autonomes, reproduisent l'état initial de la story, et les Controls / Actions pilotent le rendu.

**Réel (vérifié sur le dépôt) :**

| Story | Constat audit | Confirmé ? | Détail vérifié |
|---|---|---|---|
| `WithError` | I3 | Oui | `Validation.stories.ts:44-75` : le Template affiché n'a pas `ref="fieldRef"`, le Script affiché n'a ni `fieldRef` ni `onMounted` alors que le render appelle `validateOnSubmit()` au montage (`:93-95`). Le code copié ne reproduit pas l'erreur initiale. |
| `WithWarning` | I3 + onglet manquant | Oui | `:119-139` : pas d'onglet Template, Script sans `items`, `fieldRef`, `onMounted` (render `:155-157`). |
| `WithSuccess` | I3 + onglet manquant | Oui | `:181-201` : pas d'onglet Template, Script sans `items`, `fieldRef`, `onMounted` (render `:217-219`), `show-success-messages` absent du Script/Template affiché. |
| `DisableErrorHandling` | pas de comparaison | Oui | `:237-263` : un seul champ `required` + `disable-error-handling`, aucune validation déclenchée, aucun `sourceCode` → l'effet de l'option n'est pas observable. |
| `ExternalMessages` | — | Oui (même classe de défaut) | `:265-324` : aucun `sourceCode`, `VBtn` utilisé dans le template sans extrait montrant l'import. |
| `SyFormValidation` | I1 `VBtn` | Oui | `:350-359` : le Script affiché importe `SelectBtnField, SyForm` mais pas `VBtn` utilisé au Template (`:344`). |
| `VFormValidation` | I1 `VBtn`, `VForm` | Oui | `:413-435` : Script sans `VBtn`/`VForm` (utilisés `:399,408`). |
| `SyFormVuetifyValidation` | I1 `VBtn` | Oui | `:502-515` : Script sans `VBtn` (utilisé `:496`). |
| `VFormVuetifyValidation` | I1 + sans template | Oui | `:555-569` : pas d'onglet Template ; le Script n'importe ni `VBtn`/`VForm` ni `handleSubmit` utilisés par le render (`:586-595`). Nom exact confirmé : `VFormVuetifyValidation`. |
| Toutes les stories Validation | args retournés non liés | Oui | Chaque `setup()` retourne `args` sans qu'aucun template ne référence `args.*` ni `v-bind="args"` → tous les Controls inopérants. L'action `onUpdate:modelValue` déclarée au meta (`:20`) n'est jamais liée → Actions inopérantes. |
| Stories `SelectBtnField.stories.ts` | args non liés | Partiellement | **Nuance par rapport à l'audit** : les templates lient bien `args.*` (`Default:126-135`, etc.). En revanche `Required` écrase `label`/`required` par des valeurs fixes (`:193-195`) malgré `args.label`/`args.required` (`:173-174`), et `Readonly` ne lie pas `label` (`:511` vs `:523-528`) → ces Controls restent inopérants. |

## Cause racine

- **I1 — Imports incomplets** : les extraits `sourceCode` Script omettent `VBtn` / `VForm` (`vuetify/components`) pourtant présents dans le Template affiché. Exports réels vérifiés : `SelectBtnField` et `SyForm` sont exportés de `@cnamts/synapse` (`src/components/index.ts:56,63`), `VBtn`/`VForm` depuis `vuetify/components`.
- **I3 — Cycle de validation tronqué** : `WithError`/`WithWarning`/`WithSuccess` valident au montage via `fieldRef.value?.validateOnSubmit()` dans `onMounted`, absent des extraits → le code copié affiche un champ neutre au lieu de l'état validé.
- **Args non liés** : retourner `args` depuis `setup()` ne lie rien ; aucun template n'utilise `args`/`v-bind="args"`. Convention de référence trouvée dans `SySelect/validation/Validation.stories.ts` (`v-model` local + `v-bind="args"`, args par story, action `onUpdate:modelValue` fusionnée avec le handler du `v-model`).
- **Onglets manquants** : `WithWarning`, `WithSuccess`, `VFormVuetifyValidation` sans Template ; `DisableErrorHandling`, `ExternalMessages` sans `sourceCode`.
- **Démonstration insuffisante** : `disableErrorHandling` court-circuite `validate()` et masque les messages issus des règles (`src/composables/unifyValidation/useValidation.ts:202-235`) — sans déclencheur ni cas témoin, rien à observer.

## Correction

Alignement sur la convention `SySelect/validation/Validation.stories.ts` :

- **Args liés** : chaque story Validation déclare `args` (`items`, `label`, props du scénario) et le template utilise `v-model="value"` + `v-bind="args"` ; les règles restent des valeurs fixes du scénario. L'action `onUpdate:modelValue` du meta devient active via `v-bind`.
- **Imports complétés** : `VBtn`/`VForm` ajoutés aux Scripts concernés.
- **Cycle complet** : `ref="fieldRef"` au Template, `fieldRef` + `onMounted(() => fieldRef.value?.validateOnSubmit())` au Script pour `WithError`/`WithWarning`/`WithSuccess` ; `items` ajouté aux Scripts de `WithWarning`/`WithSuccess`.
- **Onglets ajoutés** : Template pour `WithWarning`, `WithSuccess`, `VFormVuetifyValidation` (+ `handleSubmit` dans son Script) ; `sourceCode` complet pour `DisableErrorHandling` et `ExternalMessages`.
- **`DisableErrorHandling` comparatif** : deux champs `required` identiques (`value` null, mêmes items), chacun avec `ref` + `validateOnSubmit()` au montage ; l'un avec `disable-error-handling`, l'autre sans → erreur visible vs absente. Pattern comparable : `DateTextInput/validation/Validation.stories.ts` `WithErrorDisabled`.
- **`SelectBtnField.stories.ts`** : `v-model="args.modelValue" v-bind="args"` dans les 7 stories (supprime les valeurs fixes qui écrasaient les args).

## Reproduction / vérification

1. Ouvrir chaque story concernée dans Storybook, copier les onglets Template + Script dans un SVue minimal du projet → aucun composant/variable non résolu.
2. `WithError`/`WithWarning`/`WithSuccess` : l'extrait copié reproduit l'état validé au montage.
3. Modifier `label`, `items`, etc. dans les Controls → rendu mis à jour ; cliquer une option → Action `update:modelValue` tracée.
4. `DisableErrorHandling` : même validation sur les deux champs, différence observable.
5. `pnpm exec eslint` sur les fichiers modifiés + `pnpm vitest run src/components/Customs/Selects/SelectBtnField`.

## Impact

- **Sévérité :** Élevée (documentation/extraits dégradés, copie non fonctionnelle) — contournable (le composant n'est pas affecté) mais le périmètre touche 15 stories.
- **Introduit dans :** commit `3b4a99c7` « SelectBtnField: add validation (#2269) », première version publiée le contenant : **v1.1.1** (`git tag --contains`). Le commit `3c03fa0a` n'a fait que reformater.
- **Utilisateurs concernés :** développeurs consommateurs de la doc Storybook.
- **Zones à risque :** uniquement les fichiers `*.stories.ts` ; aucun changement de composant de production. Risque résiduel : les tests visuels Cypress `SelectBtnField.visual.cy.ts` si le rendu des stories de référence change (à rejouer).

## Checklist

- [x] Cause racine traitée (liaison args + extraits autonomes, pas un patch cosmétique par onglet)
- [x] Régression : pas de harnais existant pour tester les extraits `sourceCode` ; vérification via `eslint` + revue Storybook manuelle (la règle custom `story-template-component-casing` ne couvre que la casse des balises)
- [x] Extraits autonomes et fidèles à l'état initial (imports complets, `fieldRef`/`onMounted` reflétés)
- [x] Controls/Actions : `args` liés via `v-bind="args"` sur les 8 stories Validation et les 7 stories principales ; `onUpdate:modelValue` lié partout
- [x] Onglets Script/Template présents et cohérents (Template ajouté pour `WithWarning`, `WithSuccess`, `VFormVuetifyValidation` ; `sourceCode` complet pour `DisableErrorHandling` et `ExternalMessages`)
- [x] `DisableErrorHandling` démontre l'option : deux champs `required` vides validés au montage, erreur visible uniquement sans `disable-error-handling`
- [x] `pnpm vitest run src/components/Customs/Selects/SelectBtnField` → 55/55 (dont 11 a11y)
- [x] `pnpm exec eslint` sur les 2 fichiers → 0 erreur ; `vue-tsc -p tsconfig.app.json --noEmit` → 0 erreur
- [x] `pnpm test:visual` : non requis — `SelectBtnField.visual.cy.ts` monte le composant directement, pas les stories
