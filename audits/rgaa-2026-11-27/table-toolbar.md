# TableToolbar — périmètre RGAA

## Critères couverts

- **7.1** : recherche et ajout restent des contrôles natifs et sont désactivés pendant le chargement.
- **8.2 / 11.1** : le champ de recherche expose un libellé visible ; le bouton d’ajout conserve un nom textuel.
- **10.7** : le focus clavier et le rendu CNAM sont vérifiés par la spec Cypress.

## Automatisation

- DOM : `src/components/TableToolbar/tests/TableToolbar.rgaa.a11y.spec.ts`
- Audit navigateur CNAM : `src/components/TableToolbar/tests/TableToolbar.rgaa.cy.ts`

## Limites

Le contraste réel, le zoom à 200 %, le reflow et l'intégration dans une page consommatrice restent à vérifier manuellement.
