# LunarCalendar — couverture RGAA

## Critères applicables

- **11.1** : le champ de saisie possède un nom accessible.
- **11.10** : l'état requis est exposé sur le champ natif.
- **13.3** : le format attendu est communiqué avec le placeholder.

## Couverture automatisée

- DOM : `LunarCalendar.rgaa.a11y.spec.ts`, complété par le test axe existant.
- Cypress CNAM : `LunarCalendar.rgaa.cy.ts`.

## Limites

La validité métier de la date lunaire, le contraste, le zoom et la compréhension du format par lecteur d'écran restent à auditer manuellement.
