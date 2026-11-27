# Audit RGAA 4.1.2 — BackToTopBtn

Périmètre : `src/components/BackToTopBtn/` et classeur `BackToTopBtn.xlsx`. Les critères historiques sont 1.2, 3.2, 3.3, 8.2 et 10.7.

Les contrats ajoutés vérifient le nom de l'action, l'icône décorative, le bouton natif et l'absence de doublon d'id. Le contraste et le focus doivent être vérifiés dans le navigateur sur les thèmes CNAM clair, sombre et les états visible/masqué. Le composant étant affiché avec `v-show` après dépassement du seuil, le scénario doit aussi vérifier que le bouton n'est pas atteignable lorsqu'il est masqué et qu'il revient au premier plan après un scroll.

Non-conformité reproduite : le scénario navigateur CNAM observe `outline-style: none` et `outline-width: 0` sur le bouton visible lorsqu'il reçoit le focus clavier. Les critères 3.3 et 10.7 sont donc à corriger.
