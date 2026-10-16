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

   Un style inline l'emporte sur toute feuille de style sans `!important`. Le fond des cellules est une **valeur littérale** : il est réellement verrouillé.

   Les en-têtes épinglés (slot `#headers` de `SyTable.vue` / `SyServerTable.vue`) ont aussi un style inline, mais leur fond référence une variable : `background: var(--sy-table-header-bg-pinned)`. Une variable se résout même dans un style inline : ce fond est **déjà surchargeable**, en redéfinissant la variable sur un élément plus proche que `.v-table` (`thead`, `th`) — l'héritage prime alors sans souci de spécificité. Redéfinie sur `.v-table` même, elle doit battre la spécificité de la déclaration scopée (`.sy-table[data-v-…] .v-table`). C'est le pattern à généraliser (cf. piste 2).

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

4. **Cases à cocher forcées.** `src/components/Tables/common/tableStyles.scss` contient 5 règles `color` / `border-color` / `background-color: rgb(var(--v-theme-primary)) !important` sur `.v-selection-control` et `.v-checkbox(-btn)`. Elles ne sont **pas redondantes** avec `color="primary"` : `SyCheckbox` n'applique `props.color` qu'à l'état coché et force `#727273` à l'état décoché (`SyCheckbox.vue` : `isChecked ? props.color : '#727273'`). Ces règles rendent donc les cases **décochées** du tableau en `primary`.

5. **`opacity: 1 !important` sur les cellules épinglées et la colonne de sélection** (`SyTable.vue` / `SyServerTable.vue`, `.sy-table__pinned`, `.v-data-table__th--select`, `.v-data-table__td--select-row`). Il contre la règle Vuetify de l'état de chargement (`VDataTable.css`) :

   ```css
   .v-data-table--loading > .v-table__wrapper > table > tbody > tr > .v-data-table__td:not(.v-data-table-column--fixed),
   .v-data-table--loading > .v-table__wrapper > table > tbody > tr > .v-data-table__td:not(.v-data-table-column--fixed-end) {
   	opacity: var(--v-disabled-opacity);
   }
   ```

   La liste `:not(--fixed), :not(--fixed-end)` fait qu'une cellule `--fixed` (sans `--fixed-end`) est tout de même atteinte par le second sélecteur. Sans cette règle, une cellule épinglée deviendrait semi-transparente pendant le chargement et laisserait voir le contenu qui défile dessous. **Ce `!important` est légitime** : rendre l'opacité d'une cellule sticky surchargeable n'a pas de cas d'usage.

Constats secondaires :

- **Indication de scroll limitée** : `updatePinnedShadows` n'active l'ombre gauche que si `scrollLeft > 0` (elle signale du contenu masqué *sous* la colonne épinglée). Rien n'indique, au chargement, du contenu masqué *à droite* quand aucune colonne n'est épinglée à droite.
- **Incohérences SyTable / SyServerTable** : blocs `<style>` dupliqués, couleur d'ombre différente (`--v-theme-grey-base` vs `--v-theme-on-surface-variant`), `z-index` mélangeant valeurs en dur et variables. Les valeurs en dur correspondent exactement aux variables (`5` = `--sy-table-z-pinned-header`, base + 4 ; `3` = `--sy-table-z-pinned-cell`, base + 2) : leur remplacement est neutre.

## Correction

Pistes proposées :

1. **Supprimer les styles inline** : ne conserver inline que l'offset, exposé en variable CSS (`--sy-pinned-offset`). `position`, `z-index`, `background`, `left` / `right` passent en classes (`.sy-table__pinned--left` / `--right`) dans `tableStyles.scss`.
2. **Exposer des variables CSS surchargeables**, sur le modèle de `--sy-table-header-bg-pinned` qui fonctionne déjà, documentées dans les `.mdx` :
   - `--sy-table-pinned-cell-bg` (défaut `rgb(var(--v-theme-surface))`) ;
   - `--sy-table-row-bg` (couleur de ligne, défaut `transparent`) ;
   - `--sy-table-pinned-shadow`.

   Pas de variable pour la couleur des cases à cocher tant qu'aucun besoin de surcharge par tableau n'est exprimé (cf. piste 4).
3. **Propager le style de ligne aux cellules épinglées** : le mixin `striped-rows` (et le projet pour ses colorations) définit `--sy-table-row-bg` sur le `tr` ; la cellule épinglée superpose cette couleur à son fond opaque :

   ```scss
   background: linear-gradient(var(--sy-table-row-bg), var(--sy-table-row-bg)), var(--sy-table-pinned-cell-bg);
   ```

   Le fond reste opaque pendant le scroll tout en reflétant la couleur de ligne (le zébrage `rgba(…, 0.05)` se composite sur `surface`).

   **Contrat à documenter** : un projet qui pose un `background-color` sur le `tr` via `row-props` ne verra toujours pas sa couleur sur les cellules épinglées. La coloration de ligne doit passer par `--sy-table-row-bg` (via la classe ou le `style` renvoyés par `row-props`) ; c'est à expliciter dans les `.mdx` avec un exemple. Alternative écartée : cibler le zébrage sur les `td` plutôt que le `tr` — plus proche de l'existant, mais n'offre aucun point d'extension au projet.
4. **Cases à cocher** : supprimer les 5 règles `!important` de `tableStyles.scss`. ⚠️ Ce n'est pas neutre : les cases **décochées** passent de `primary` au gris `#727273` de `SyCheckbox` (cohérent avec le reste du DS). Décision UX à prendre, contraste à vérifier (RGAA : 3:1 pour un composant d'interface), baselines Cypress à mettre à jour.
5. **Colonne de sélection** : supprimer les `!important` de fond et de position ; remplacer les sélecteurs `td:first-child` par la classe `.v-data-table__td--select-row`, plus robuste (la cellule de sélection n'est pas garantie en première position si des colonnes `expand` / `group` la précèdent). Vérifié dans Vuetify :
   - la classe est posée selon `column.key === 'data-table-select'` (`VDataTableRow.js`), quel que soit le contenu du slot : le mode `showSelectSingle` (radio) est couvert ;
   - la ligne de chargement (`tr.v-data-table-rows-loading`) est rendue par `VDataTableRows` avec une cellule unique qui ne porte pas cette classe : l'exclusion `:not(.v-data-table-rows-loading)` devient inutile.
6. **`opacity: 1 !important`** : conserver, mais restreindre à l'état de chargement (`.v-data-table--loading`) et commenter la raison (contre-règle Vuetify, cellule sticky qui doit rester opaque).
7. **Factoriser** les styles d'épinglage dans un mixin `pinned-styles` de `tableStyles.scss`, partagé par `SyTable` et `SyServerTable` (harmonisation de la couleur d'ombre, remplacement des `z-index` en dur par les variables). Les classes internes sont communes (`sy-table__pinned*`) mais les modificateurs racine diffèrent (`sy-table--*` / `sy-server-table--*`) : le mixin prend le préfixe racine en paramètre.
8. **Indication de scroll** (évolution, à arbitrer avec l'UX) : une ombre en bordure **droite** du conteneur scrollable (`.v-table__wrapper`), visible tant que du contenu dépasse à droite.
   - Implémentation recommandée : pseudo-élément piloté par un état `canScrollRight` calculé dans `usePinnedColumns`, qui écoute déjà le scroll et le resize (aucun coût JS supplémentaire).
   - Écartée : la technique CSS `background-attachment: local` — l'ombre est peinte en fond du conteneur et serait masquée par les cellules à fond opaque (épinglées, en-têtes).
   - Peut faire l'objet d'un ticket distinct.

## Points à trancher avant implémentation

1. **Contrat `--sy-table-row-bg`** : valider le mécanisme et la documentation associée (piste 3).
2. **Couleur des cases décochées** : `primary` (comportement actuel) ou gris `SyCheckbox` (cohérence DS) — décision UX + contraste (piste 4).
3. **Indication de scroll** : forme exacte (ombre bord droit) et périmètre — dans ce ticket ou un ticket dédié (piste 8).

## Reproduction / vérification

1. Storybook › `SyTable` › Colonnes : `pinned-columns="['name']"`, `striped`, `show-select`, `sticky-select`, avec une largeur de fenêtre réduite pour forcer le scroll horizontal.
2. **Avant** : les lignes paires sont zébrées, sauf sur les cellules épinglées et la colonne de sélection, qui restent blanches ; aucune ombre au chargement.
3. **Avant** : côté projet, `:deep(.sy-table__pinned) { background: red }` ou `.v-selection-control { color: green }` n'ont aucun effet sans `!important` (et pas d'effet du tout sur la colonne de sélection).
4. **Après** : le zébrage et une ligne colorée via `row-props` (`--sy-table-row-bg`) couvrent toute la ligne, cellules épinglées comprises ; la surcharge de `--sy-table-pinned-cell-bg` fonctionne sans `!important`.
5. **Après** : pendant un chargement (`loading`), les cellules épinglées restent opaques.
6. **Après** : aucune régression du sticky ni des ombres, sur `SyTable` et `SyServerTable`, y compris en mode `show-select-single`.

## Impact

- **Sévérité :** Moyenne — cosmétique et contournable via `!important` / sélecteurs très spécifiques, mais ces contournements sont fragiles et l'absence d'indication de scroll dégrade l'usage.
- **Introduit dans :** #2044 (`a2fa7229`, 2026-04-03 — « SyTable / SyServerTable: pinned columns »). Constaté en 1.1.5, toujours présent en 1.1.6.
- **Utilisateurs concernés :** sous-ensemble — projets utilisant `pinnedColumns` / `pinnedColumnKey` / `stickySelect`, en particulier avec `striped` ou une coloration de lignes (ex. GEDI refonte INVA). Pour les cases à cocher : tout projet souhaitant une couleur autre que `primary`.
- **Zones à risque :**
  - fonds et empilement (`z-index`) des colonnes épinglées pendant le scroll (chevauchement du contenu, en-tête sticky, barre de progression) ;
  - opacité des cellules épinglées pendant le chargement ;
  - mode `showSelectSingle` (radio), qui a des règles spécifiques ;
  - couleur des cases décochées dans les tableaux (changement visuel si la piste 4 est retenue) ;
  - survol `clickable-row` ;
  - baselines Cypress `SyTable.visual.cy.ts` / `SyServerTable.visual.cy.ts` ;
  - projets ayant déjà contourné le problème avec `!important` (à signaler dans les notes de version).

## Checklist

- [ ] La correction traite la cause racine (suppression des styles inline et des `!important` non justifiés, au profit de classes et de variables CSS)
- [ ] Un test a été ajouté pour prévenir la régression (`SyTable.spec.ts` et `SyServerTable.spec.ts`) :
  - cellule épinglée sans `background` ni `position: sticky` dans son style inline ;
  - classes `sy-table__pinned--*` présentes ;
  - `--sy-table-row-bg` posée sur les lignes paires quand `striped` est actif (si la piste 3 est retenue)
- [ ] `pnpm vitest run src/components/Tables` passe sur le périmètre modifié
- [ ] Tests a11y passés si du markup a été modifié (`SyTable.a11y.spec.ts`, `SyServerTable.a11y.spec.ts`)
- [ ] Tests visuels Cypress passés / baselines à jour si le rendu change (baselines régénérées via la GHA Linux)
- [ ] Aucun nouvel avertissement ou erreur de console

## Tickets liés

- Fixes #2610
- Fonctionnalité d'origine : #2044
