# TableHeader — périmètre RGAA

## Critères couverts

- **7.1 / 8.9** : le tri est porté par un bouton natif, nommé avec le titre de colonne.
- **10.7** : le bouton de tri et le séparateur de redimensionnement sont vérifiés au clavier dans le thème CNAM.
- **12.6** : le redimensionnement expose un séparateur vertical nommé et des valeurs ARIA lorsque l'annonce de largeur est activée.

## Automatisation

- DOM : `src/components/Tables/common/tests/TableHeader.rgaa.a11y.spec.ts`
- Audit navigateur CNAM : `src/components/Tables/common/tests/TableHeader.rgaa.cy.ts`

## Limites

La visibilité effective de l'indicateur de focus, le contraste réel, le redimensionnement à la souris, le zoom à 200 %, le reflow et les annonces lecteur d'écran doivent être vérifiés manuellement.
