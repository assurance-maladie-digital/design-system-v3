# UploadWorkflow — couverture RGAA

## Critères applicables

- **8.2** : la zone d'import est structurée avec un titre de section.
- **11.1** : le parcours d'import repose sur des contrôles de formulaire accessibles fournis par les sous-composants.

## Couverture automatisée

- DOM : `UploadWorkflow.rgaa.a11y.spec.ts`.
- Cypress CNAM : `UploadWorkflow.rgaa.cy.ts`.

## Limites

Les scénarios fichier sélectionné, erreur, reprise, aperçu et dialogue de confirmation doivent être complétés par un audit manuel ou des tests ciblés des sous-composants FileUpload/FileList.
