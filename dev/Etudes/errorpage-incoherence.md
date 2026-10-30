# Étude — ErrorPage : incohérences des stories

## Description du problème

**Branche étudiée :** `fix/incoherrence-errorpage`.

**Périmètre :** `src/components/ErrorPage/ErrorPage.stories.ts` (6 stories). Aucun changement de `ErrorPage.vue`.

**Attendu :** chaque extrait affiché (onglets Template et Script) est un composant Vue autonome qu'un consommateur peut recopier tel quel, et les Controls de Storybook agissent sur le rendu.

**Constats confirmés :**

| # | Constat | Stories |
|---|---|---|
| C1 | L'extrait Script n'importe pas `VBtn`, alors que l'extrait Template l'utilise. | `SlotAction` |
| C2 | Le `render` ne reçoit pas `args` : les Controls affichés par Storybook (la meta déclare `component: ErrorPage`) n'ont aucun effet. | `CustomIllustration`, `SlotAction`, `SlotAdditionalContent` |
| C3 | Les extraits reprennent le `<div style="padding: 20px; background: rgb(231, 236, 245)">` du decorator Storybook, qui n'a rien à faire dans le code d'un consommateur. | Toutes |
| C4 | Les extraits gardent 16 espaces d'indentation : le code copié arrive mal indenté. | Toutes |
| C5 | Couleurs codées en dur dans les exemples (`#0D419A`, `#555`), au lieu des couleurs du thème. | `CustomIllustration`, `SlotAdditionalContent` |
| C6 | `SlotAction` passe `:hide-btn="true"`, ce qui laisse croire que c'est nécessaire. Or le bouton par défaut est le contenu de repli du slot `action` (`StatusPage.vue:137-149`) : dès que le slot est fourni, il n'est jamais rendu, quelle que soit la valeur de `hideBtn`. | `SlotAction` |

**Faux positif écarté :** l'absence de `VBtn` dans les `components` du `render` de `SlotAction` n'avait aucun effet visible. Storybook crée Vuetify avec `createVuetifyInstance()` (`.storybook/preview.ts`), qui enregistre tous les composants Vuetify de façon globale (`src/vuetifyConfig.ts`). La story s'affichait donc correctement avant la correction ; seul l'extrait copiable était incomplet.

## Cause racine

Les extraits ont été écrits pour l'affichage dans Storybook, pas comme des composants autonomes : ils dépendent de l'enregistrement global de Vuetify (C1), reprennent l'habillage du decorator (C3, C4) et des valeurs codées en dur (C5). Les templates de `render` recopient ces extraits au lieu de lier les args (C2, C6). Aucun test ne vérifiait les extraits.

## Correction apportée

Dans `ErrorPage.stories.ts` :

- **C1 :** `import { VBtn } from 'vuetify/components'` dans l'extrait Script de `SlotAction` et dans le fichier de stories.
- **C2 :** les `render` de `CustomIllustration`, `SlotAction` et `SlotAdditionalContent` reçoivent `args` et les passent avec `v-bind="args"`.
- **C3 :** le decorator est déclaré une seule fois dans la meta, et retiré des extraits.
- **C4 :** extraits recalés en colonne 0, comme dans les stories SyTextField (#2718).
- **C5 :** classes du thème Vuetify à la place des couleurs en dur : `border-md border-dashed border-primary border-opacity-100 rounded-lg bg-surface` et `font-weight-bold text-primary` pour l'illustration. Le contenu additionnel prend la couleur de texte par défaut du thème au lieu du gris `#555` : le texte est donc un peu plus foncé qu'avant. Les dimensions de l'illustration restent en style en ligne.
- **C6 :** `hide-btn` retiré de `SlotAction` ; la description de la story précise que le slot remplace le bouton par défaut. Le style en ligne du conteneur de boutons est remplacé par `d-flex ga-2 mt-4` (mêmes espacements : 8 px et 16 px).

Test de régression ajouté : `src/components/ErrorPage/tests/ErrorPage.stories.spec.ts`. Il réutilise le helper `analyzeSnippet` (`tests/helpers/storySnippets.ts`, introduit par #2680) ; la branche a été rebasée sur `dev` pour en disposer.

## Impact et limites

- **Sévérité :** faible. Documentation uniquement : le rendu dans Storybook était correct, et un consommateur qui utilise `createVuetifyInstance()` n'aurait pas eu d'erreur avec l'extrait de `SlotAction`. Seuls les projets qui importent Vuetify composant par composant étaient concernés par C1.
- **Utilisateurs concernés :** développeurs qui consultent les stories `Templates/ErrorPage` ou copient leurs exemples.
- **Production :** aucun changement dans `ErrorPage.vue`, ses props, événements ou slots ; aucun changement de contrat ni de dépendance.

## Vérifications effectuées

- [x] `ErrorPage.stories.spec.ts` (16 tests) : extraits autonomes (`analyzeSnippet`), sans habillage Storybook ni couleur en dur, args transmis au composant dans les 3 `render`, slot `action` qui remplace le bouton par défaut sans `hide-btn`. Contre la version précédente des stories : 11 échecs sur 16 avant la correction de `VBtn`, 10 sur 16 après ; 16/16 avec la correction.
- [x] `pnpm vitest run src/components/ErrorPage` : 3 fichiers, 23 tests, tous passent (`ErrorPage.spec.ts` 5, `ErrorPage.stories.spec.ts` 16, `ErrorPage.a11y.spec.ts` 2).
- [x] `pnpm exec eslint src/components/ErrorPage` et `pnpm vue-tsc -p tsconfig.app.json --noEmit` : 0 erreur.
- [x] Rendu dans Storybook (Chrome headless), après correction, de `CustomIllustration`, `SlotAction` et `SlotAdditionalContent` : illustration en pointillés de la couleur primaire aux coins arrondis, deux boutons côte à côte, contenu additionnel affiché sous le message. Les espacements des boutons sont identiques en valeur (`$spacer` Vuetify à 4 px : `ga-2` = 8 px, `mt-4` = 16 px), sans comparaison d'images avec la version précédente.
- [ ] Console du navigateur : non vérifiée (capture headless sans lecture de la console).
- [ ] Tests visuels Cypress : non lancés en local ; `ErrorPage.visual.cy.ts` monte le composant, pas les stories, aucune baseline modifiée n'est attendue.
