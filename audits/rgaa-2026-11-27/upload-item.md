# UploadItem — périmètre RGAA

- **1.2** : les états d’erreur et de succès ont un équivalent textuel.
- **7.1 / 10.7** : les actions d’import, de prévisualisation et de suppression sont des boutons natifs focusables.
- **8.2** : chaque action est nommée avec le document concerné.

Tests : `src/components/FileList/UploadItem/tests/UploadItem.rgaa.a11y.spec.ts` et `UploadItem.rgaa.cy.ts`.

Le contraste réel, le focus visible, les annonces de progression, le zoom à 200 % et le reflow restent à vérifier manuellement.
