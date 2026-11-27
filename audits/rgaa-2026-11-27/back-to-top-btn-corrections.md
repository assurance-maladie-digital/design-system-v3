# BackToTopBtn — corrections restantes

## Critères 3.3 et 10.7

Le test navigateur `BackToTopBtn.rgaa.cy.ts` reproduit l'écart dans le thème CNAM : le bouton visible reçoit le focus mais ne présente pas d'indicateur détectable (`outline-style: none`, largeur nulle).

Correction attendue : appliquer le ring de focus du design system au sélecteur `.vd-back-to-top-btn:focus-visible`, avec une variante visible sur fond sombre si nécessaire. Vérifier que l'anneau reste visible quand le bouton est positionné/sticky et qu'il n'est pas rogné par son conteneur.

Critères d'acceptation :

- focus clavier visible en thème CNAM clair ;
- focus clavier visible en thème CNAM sombre ;
- contraste du ring suffisant avec le fond ;
- bouton masqué non atteignable, bouton visible atteignable après le seuil de scroll ;
- absence de régression sur le retour en haut.
