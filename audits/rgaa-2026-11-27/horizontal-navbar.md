# HorizontalNavbar — couverture RGAA

## Critères applicables

- **8.2** : la navigation expose une structure de navigation identifiable.
- **12.1** : les liens de navigation sont nommés et utilisables au clavier.

## Couverture automatisée

- DOM : `HorizontalNavbar.rgaa.a11y.spec.ts` avec le contrat du composant SyTabs.
- Cypress CNAM : `HorizontalNavbar.rgaa.cy.ts`.

## Limites

La cohérence de l'état actif avec le routeur et la navigation après confirmation nécessitent des scénarios d'intégration. Le contraste et le zoom restent manuels.
