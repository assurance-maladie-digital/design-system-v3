# Étude — [SyTable] Style non surchargeable et non cohérent (#2610)

## Description du bug

Sur `SyTable` / `SyServerTable`, les colonnes épinglées (`pinnedColumns`, `pinnedColumnKey`, `stickySelect`) et les cases à cocher imposent des styles que le projet consommateur ne peut pas surcharger, et qui ignorent certaines props comme `striped`.

**Attendu :**

- Les styles des colonnes épinglées (fond, ombre) et des cases à cocher sont surchargeables comme le reste du composant.
- Les cellules épinglées suivent le style de leur ligne : zébrage `striped`, coloration de ligne posée par le projet (`row-props`), survol.
- Une ombre / élévation signale qu'un défilement horizontal est possible.

**Réel :**

- Les cellules épinglées ont toujours un fond opaque `surface` (blanc) : le zébrage `striped` et la coloration de ligne du projet s'interrompent sur la colonne épinglée (ligne « trouée »).
- Ce fond n'est surchargeable qu'avec `!important` ; pour la colonne de sélection épinglée, même `!important` ne suffit pas sans un sélecteur plus spécifique.
- La couleur des cases à cocher est forcée en `primary` via `!important`.
- Avec des colonnes épinglées à gauche, l'ombre n'apparaît qu'après un premier scroll : à l'affichage, rien n'indique qu'on peut défiler horizontalement.

## Cause racine

Tout provient de la fonctionnalité « colonnes épinglées » (#2044).

1. **Styles inline sur les cellules.** `src/components/Tables/common/usePinnedColumns.ts` (`displayHeadersWithPinned`) injecte dans les `cellProps` un `style` inline :

   ```ts
   const stickyCellStyle = {
   	position: 'sticky',
   	zIndex: 'var(--sy-table-z-pinned-cell)',
   	background: 'rgb(var(--v-theme-surface))',
   }
   ```

   Idem pour les en-têtes dans le slot `#headers` de `SyTable.vue` / `SyServerTable.vue` (`background: var(--sy-table-header-bg-pinned)`). Un style inline l'emporte sur toute feuille de style sans `!important`.

2. **Colonne de sélection verrouillée.** Dans le `<style scoped>` de `SyTable.vue` / `SyServerTable.vue`, 4 sélecteurs très spécifiques forcent le fond :

   ```scss
   .sy-table--pinned-select-left :deep(.v-table__wrapper > table > tbody > tr:not(.v-data-table-rows-loading) > td:first-child) {
   	position: sticky !important;
   	left: 0 !important;
   	z-index: 3;
   	background: rgb(var(--v-theme-surface)) !important;
   }
   ```

3. **`striped` incompatible avec le fond opaque.** Le zébrage est appliqué sur le `<tr>` (`.v-table tbody tr:nth-child(even) { background-color: … }`). La cellule épinglée a son propre fond opaque, qui masque celui de la ligne. Même mécanisme pour la coloration de ligne posée par le projet via `row-props`. (Le survol `clickable-row` fonctionne, lui, car il cible le `td` avec `!important`.)

4. **Cases à cocher forcées.** `src/components/Tables/common/tableStyles.scss` contient 5 règles `color` / `border-color` / `background-color: rgb(var(--v-theme-primary)) !important` sur `.v-selection-control` et `.v-checkbox(-btn)`. Elles sont en plus redondantes : `SyCheckbox` / `VRadio` reçoivent déjà `color="primary"`.

Constats secondaires :

- **Indication de scroll limitée** : `updatePinnedShadows` n'active l'ombre gauche que si `scrollLeft > 0` ; aucune indication de contenu masqué à droite sans colonne épinglée à droite.
- **Incohérences SyTable / SyServerTable** : blocs `<style>` dupliqués, couleur d'ombre différente (`--v-theme-grey-base` vs `--v-theme-on-surface-variant`), `z-index` mélangeant valeurs en dur (`5`, `3`) et variables `--sy-table-z-*`.

## Correction

Pistes proposées :

1. **Supprimer les styles inline** : ne conserver inline que l'offset, exposé en variable CSS (`--sy-pinned-offset`). `position`, `z-index`, `background`, `left` / `right` passent en classes (`.sy-table__pinned--left` / `--right`) dans `tableStyles.scss`.
2. **Exposer des variables CSS surchargeables** sur `.v-table`, documentées dans les `.mdx` :
   - `--sy-table-pinned-cell-bg` (défaut `rgb(var(--v-theme-surface))`) ;
   - `--sy-table-row-bg` (couleur de ligne, défaut `transparent`) ;
   - `--sy-table-pinned-shadow` ;
   - `--sy-table-checkbox-color`.
3. **Propager le style de ligne aux cellules épinglées** : le mixin `striped-rows` (et le projet pour ses colorations) définit `--sy-table-row-bg` sur le `tr` ; la cellule épinglée superpose cette couleur à son fond opaque :

   ```scss
   background: linear-gradient(var(--sy-table-row-bg), var(--sy-table-row-bg)), var(--sy-table-pinned-cell-bg);
   ```

   Le fond reste opaque pendant le scroll tout en reflétant la couleur de ligne.
4. **Supprimer les `!important`** sur la colonne de sélection et les cases à cocher ; remplacer les sélecteurs `td:first-child` par la classe existante `.v-data-table__td--select-row`.
5. **Factoriser** les styles d'épinglage dans un mixin `pinned-styles` de `tableStyles.scss`, partagé par `SyTable` et `SyServerTable` (harmonisation de la couleur d'ombre et des `z-index`).
6. **Indication de scroll** : afficher l'ombre des colonnes épinglées à gauche dès que du contenu dépasse à droite, ou ajouter une ombre en bordure du wrapper scrollable.

## Reproduction / vérification

1. Storybook › `SyTable` › Colonnes : `pinned-columns="['name']"`, `striped`, `show-select`, `sticky-select`, avec une largeur de fenêtre réduite pour forcer le scroll horizontal.
2. **Avant** : les lignes paires sont zébrées, sauf sur les cellules épinglées et la colonne de sélection, qui restent blanches ; aucune ombre au chargement.
3. **Avant** : côté projet, `:deep(.sy-table__pinned) { background: red }` ou `.v-selection-control { color: green }` n'ont aucun effet sans `!important` (et pas d'effet du tout sur la colonne de sélection).
4. **Après** : le zébrage et une ligne colorée via `row-props` (`--sy-table-row-bg`) couvrent toute la ligne, cellules épinglées comprises ; la surcharge de `--sy-table-pinned-cell-bg` / `--sy-table-checkbox-color` fonctionne sans `!important`.
5. **Après** : aucune régression du sticky ni des ombres, sur `SyTable` et `SyServerTable`, y compris en mode `show-select-single`.

## Impact

- **Sévérité :** Moyenne — cosmétique et contournable via `!important` / sélecteurs très spécifiques, mais ces contournements sont fragiles et l'absence d'indication de scroll dégrade l'usage.
- **Introduit dans :** #2044 (`a2fa7229`, 2026-04-03 — « SyTable / SyServerTable: pinned columns »). Constaté en 1.1.5, toujours présent en 1.1.6.
- **Utilisateurs concernés :** sous-ensemble — projets utilisant `pinnedColumns` / `pinnedColumnKey` / `stickySelect`, en particulier avec `striped` ou une coloration de lignes (ex. GEDI refonte INVA). Pour les cases à cocher : tout projet souhaitant une couleur autre que `primary`.
- **Zones à risque :**
  - fonds et empilement (`z-index`) des colonnes épinglées pendant le scroll (chevauchement du contenu, en-tête sticky, barre de progression) ;
  - mode `showSelectSingle` (radio), qui a des règles spécifiques ;
  - survol `clickable-row` ;
  - baselines Cypress `SyTable.visual.cy.ts` / `SyServerTable.visual.cy.ts` ;
  - projets ayant déjà contourné le problème avec `!important` (à signaler dans les notes de version).

## Checklist

- [ ] La correction traite la cause racine (suppression des styles inline et des `!important`, au profit de classes et de variables CSS)
- [ ] Un test a été ajouté pour prévenir la régression (cellule épinglée sans `background` inline, classes `sy-table__pinned--*` présentes — `SyTable.spec.ts` et `SyServerTable.spec.ts`)
- [ ] `pnpm vitest run src/components/Tables` passe sur le périmètre modifié
- [ ] Tests a11y passés si du markup a été modifié (`SyTable.a11y.spec.ts`, `SyServerTable.a11y.spec.ts`)
- [ ] Tests visuels Cypress passés / baselines à jour si le rendu change (baselines régénérées via la GHA Linux)
- [ ] Aucun nouvel avertissement ou erreur de console

## Tickets liés

- Fixes #2610
- Fonctionnalité d'origine : #2044
