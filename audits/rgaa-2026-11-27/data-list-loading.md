# DataListLoading — périmètre RGAA

- **1.2** : le squelette de chargement purement visuel est masqué avec `aria-hidden="true"`.
- **7.5** : aucune information de progression n’est annoncée par ce composant décoratif ; l’annonce doit être portée par le parent si nécessaire.

Tests : `src/components/DataList/DataListLoading/tests/DataListLoading.rgaa.a11y.spec.ts` et `DataListLoading.rgaa.cy.ts`.

Le comportement d’annonce pendant un chargement réel relève du composant parent et reste à auditer en intégration.
