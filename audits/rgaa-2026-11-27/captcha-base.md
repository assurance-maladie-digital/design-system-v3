# CaptchaBase — couverture RGAA

## Critères applicables

- **7.1** : le contenu de la modalité sélectionnée reste rendu dans le DOM.
- **8.2** : la structure HTML porte le contenu fourni par l'intégrateur.

## Couverture automatisée

- DOM : `CaptchaBase.rgaa.a11y.spec.ts`.
- Cypress CNAM : `CaptchaBase.rgaa.cy.ts`.

## Limites

Les critères liés au CAPTCHA complet (alternative, saisie, audio, erreurs et renouvellement) sont couverts par les tests de `Captcha`. Ce composant de base ne peut pas vérifier le contenu injecté par chaque slot consommateur.
