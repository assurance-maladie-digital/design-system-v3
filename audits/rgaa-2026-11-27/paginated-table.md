# PaginatedTable — couverture RGAA

## Critères applicables

- **7.1** : les commandes de pagination sont des boutons natifs et focusables.
- **9.1** : le tableau expose une caption et des en-têtes de colonnes.
- **11.1** : les données sont rendues dans une structure tabulaire native.

## Couverture automatisée

- DOM : `PaginatedTable.rgaa.a11y.spec.ts`, complété par `PaginatedTable.a11y.spec.ts`.
- Cypress CNAM : `PaginatedTable.rgaa.cy.ts`.

## Limites

Le zoom à 200 %, le reflow, le contraste réel et la compréhension des libellés par lecteur d'écran restent manuels.
