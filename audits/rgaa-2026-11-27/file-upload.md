# FileUpload — périmètre RGAA

- **7.1 / 10.7** : la zone de dépôt possède `role="button"`, un `tabindex` et ouvre le sélecteur via Entrée/Espace.
- **8.2 / 11.1** : les instructions et le titre de téléversement donnent un contexte textuel au contrôle.

Tests : `src/components/FileUpload/tests/FileUpload.rgaa.a11y.spec.ts` et `FileUpload.rgaa.cy.ts`.

Le contraste réel, le zoom à 200 %, le reflow, le glisser-déposer et les annonces d’erreur restent à auditer manuellement.
