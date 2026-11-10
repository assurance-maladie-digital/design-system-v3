# NotificationBar — nom accessible du bouton de fermeture (STD-702, non cassant)

Le nom accessible du bouton de fermeture reprend désormais `closeBtnText` : « `<closeBtnText>` la notification ». Avant, il restait « Fermer la notification » quelle que soit la valeur de `closeBtnText`, ce qui enfreignait le critère RGAA 11.9 dès que le texte visible était personnalisé (par exemple « Masquer »).

Le nom est le même que le bouton affiche son texte ou seulement l'icône (mobile, slot `action`). Avec la valeur par défaut ou un `closeBtnText` vide, il reste « Fermer la notification ».

Un `aria-label` passé via `vuetifyOptions.btn` reste prioritaire.

## Conduite à tenir

- Aucune avec la valeur par défaut de `closeBtnText`.
- Si `closeBtnText` est personnalisé, adapter les tests E2E qui ciblent le bouton par son nom accessible, par exemple `getByRole('button', { name: 'Masquer la notification' })`.
- Si `closeBtnText` est dans une autre langue, le nom devient mixte (« Close la notification ») : le redéfinir via `:vuetify-options="{ btn: { 'aria-label': 'Close the notification' } }"`.
- Le contournement `vuetifyOptions.btn['aria-label']` mis en place pour un `closeBtnText` en français peut être retiré.
