# CookiesInformation — couverture RGAA

## Critères applicables

- **7.1** : le choix de consentement est exposé par des contrôles natifs.
- **8.2** : le contenu détaillé est révélé par `details`/`summary`.
- **11.1** : le groupe de choix radio possède un libellé de section.

## Couverture automatisée

- DOM : `CookiesInformation.a11y.spec.ts` (axe) et `CookiesInformation.rgaa.a11y.spec.ts`.
- Cypress CNAM : `CookiesInformation.rgaa.cy.ts`.

## Limites

Le contraste réel, le zoom à 200 %, le reflow et l'utilisation avec un lecteur d'écran restent à vérifier en audit manuel.
