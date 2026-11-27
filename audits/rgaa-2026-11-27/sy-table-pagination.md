# SyTablePagination — périmètre RGAA

## Critères couverts

- **7.1** : la saisie directe de page est bornée à l'intervalle disponible.
- **8.2 / 12.6** : le sélecteur de lignes et la saisie de page possèdent des noms accessibles ; les identifiants de label sont uniques lorsque plusieurs paginations coexistent.
- **10.7** : les contrôles de pagination sont exercés dans le navigateur CNAM.

## Automatisation

- DOM : `src/components/Tables/common/tests/SyTablePagination.rgaa.a11y.spec.ts`
- Audit navigateur CNAM : `src/components/Tables/common/tests/SyTablePagination.rgaa.cy.ts`

## Limites

La cohérence des annonces de changement de page, le contraste réel, le zoom à 200 %, le reflow et l'intégration avec le tableau cible restent à valider manuellement.
