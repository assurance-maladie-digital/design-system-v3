# TableBulkActions — périmètre RGAA

- **7.1 / 10.7** : l’effacement de la sélection est un bouton natif focusable et nommé.
- **7.5** : le compteur de sélection est exposé avec `aria-live="polite"`.
- **8.2** : la barre d’actions est une région nommée.

Tests : `src/components/Tables/common/tests/TableBulkActions.rgaa.a11y.spec.ts` et `TableBulkActions.rgaa.cy.ts`.

Contraste réel, sticky, zoom à 200 %, reflow et annonces lecteur d’écran restent à valider manuellement.
