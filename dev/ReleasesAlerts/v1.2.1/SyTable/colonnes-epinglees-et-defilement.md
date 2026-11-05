# SyTable / SyServerTable — styles des colonnes épinglées surchargeables et indication du défilement (#2610, #2706)

Les colonnes épinglées (`pinnedColumns`, `pinnedColumnKey`), la colonne de sélection épinglée (`stickySelect`) et les cases à cocher n'imposent plus leur style par des styles inline ou des `!important`. Ils se personnalisent avec des variables CSS, posées sur le tableau ou sur l'un de ses ancêtres :

| Variable | Rôle |
|---|---|
| `--sy-table-pinned-cell-bg` | Fond des cellules épinglées et de la colonne de sélection épinglée |
| `--sy-table-row-bg` | Couleur d'une ligne, étendue aux cellules épinglées |
| `--sy-table-pinned-left-shadow` / `--sy-table-pinned-right-shadow` | Ombre signalant le contenu masqué à gauche / à droite (colonnes épinglées ou bord du tableau) |
| `--sy-table-checkbox-color` | Couleur des cases à cocher du tableau |

Changements observables :

| Changement | Avant | Après |
|---|---|---|
| Zébrage `striped` | Interrompu sur les cellules épinglées et la colonne de sélection (fond blanc) | Appliqué sur toute la ligne |
| Style inline des cellules épinglées | `position`, `z-index`, `background`, `left` / `right` | Uniquement `--sy-pinned-offset` |
| Ombre des colonnes épinglées de `SyServerTable` | Gris très clair (`on-surface-variant`), presque invisible | Même ombre que `SyTable` (`grey-base`) |
| Défilement horizontal (#2706) | Aucune indication au chargement ; ombre uniquement sur les colonnes épinglées, après défilement | Ombre au bord de la zone qui défile dès qu'il reste du contenu masqué de ce côté (bord droit dès l'affichage), sur tous les tableaux plus larges que leur conteneur |

## Conduite à tenir

- Si votre projet surchargeait le fond des cellules épinglées ou la couleur des cases à cocher avec `!important`, remplacez ces surcharges par les variables ci-dessus.
- Pour colorer une ligne, cellules épinglées comprises, définissez `--sy-table-row-bg` sur la ligne (classe ou `style` renvoyés par `row-props`). Un `background-color` posé seul sur la ligne ne s'étend pas aux cellules épinglées.
