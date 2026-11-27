# Audit RGAA 4.1.2 — FranceConnectBtn

Périmètre : `src/components/FranceConnectBtn/` et classeur `FranceConnectBtn.xlsx`. Critères historiques : 1.2, 3.3 et 6.1.

Les contrats ajoutés vérifient que le SVG de marque est décoratif, que les deux liens sont nommés et que le lien d'information ouvrant une nouvelle fenêtre porte `target` et `rel="noopener noreferrer"`. Le contraste du texte du lien d'information est mesuré dans le navigateur ; le logo SVG doit être contrôlé comme objet graphique, car un calcul de contraste de texte sur le lien de marque ne mesure pas correctement ses chemins SVG.

Statut : aucune non-conformité actuelle reproduite par les contrats DOM ; contraste et focus navigateur à compléter.
