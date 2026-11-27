# SyTableFilter — périmètre RGAA

## Critères couverts

- **7.1** : le filtre peut être absent lorsque `filterable` vaut `false`.
- **8.2 / 11.1** : le scénario de filtre personnalisé vérifie l'association explicite entre label et champ.
- **11.10** : le scénario couvre une saisie pouvant être pilotée au clavier.

## Automatisation

- DOM : `src/components/Tables/common/tests/SyTableFilter.rgaa.a11y.spec.ts`
- Audit navigateur CNAM : `src/components/Tables/common/tests/SyTableFilter.rgaa.cy.ts`

Les filtres spécialisés (texte, nombre, date, période, sélection et autocomplete) restent couverts par leurs propres tests ; leur intégration complète doit être auditée dans le tableau hôte.

## Limites

Contraste, zoom à 200 %, reflow, messages de validation et compatibilité lecteur d'écran nécessitent un audit manuel ou d'intégration.
