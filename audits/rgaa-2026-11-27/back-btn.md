# Audit RGAA 4.1.2 — BackBtn

**Date :** 27/11/2026  
**Périmètre :** `src/components/BackBtn/`, tests existants et tests RGAA ajoutés.  
**Référence :** `.storybook/public/audits/BackBtn.xlsx`, version corrigée `0.0.14-alpha`.

## Résultat croisé

Le classeur déclare **14 critères conformes** et **92 non applicables** après les corrections historiques des critères **3.3** et **8.2**. L’audit actuel confirme **13 critères** et relève **1 non-conformité supplémentaire** sur le reflow à 320 px.

L’implémentation actuelle confirme le périmètre suivant : bouton natif via `VBtn`, nom accessible, icône décorative via `SyIcon`, activation clavier native et focus visible. Les tests ajoutés couvrent les contrats structurels et les scénarios navigateur du thème CNAM.

L’audit ajoute toutefois une non-conformité au critère **10.11** : avec un libellé long à 320 px, le document déborde horizontalement (`scrollWidth = 452` pour une largeur disponible de `320`). Le classeur historique ne testait pas cette variante.

## Critères repris du classeur

**1.2, 3.2, 3.3, 7.1, 7.3, 8.2, 10.1, 10.2, 10.3, 10.4, 10.7, 10.11, 10.12, 12.9.**

## État de couverture

| Critères | État |
|---|---|
| 1.2, 7.1, 7.3, 8.2, 10.1, 12.9 | Contrats Vitest dédiés |
| 3.2 | Contraste texte testé dans le navigateur pour les contextes CNAM clair, sombre et primaire |
| 3.3, 10.7 | Focus visible testé dans le navigateur ; le ratio exact de la bordure/focus reste à calculer séparément |
| 10.4 | Zoom navigateur 200 % à confirmer manuellement |
| 10.11 | Scénario de libellé long à 320 px exécuté, mais en échec : débordement horizontal constaté |
| 10.12 | Espacement RGAA injecté dans le navigateur et contenu vérifié |
| 10.2, 10.3 | Présence et ordre du contenu confirmés par axe et inspection DOM ; désactivation réelle des CSS à compléter manuellement |

## Non-conformité détectée

### [NC] 10.11 — Reflow à 320 px

- **Élément :** `.sy-back-btn` avec le libellé personnalisé long utilisé par `BackBtn.rgaa.cy.ts`.
- **Constat :** à une largeur de viewport de 320 px, `document.documentElement.scrollWidth` atteint 452 px.
- **Impact :** un utilisateur doit faire défiler horizontalement pour accéder à l’intégralité de la page ou du composant.
- **Correction à étudier :** permettre le retour à la ligne du libellé, vérifier la largeur minimale appliquée par `VBtn` et contrôler le comportement avec les libellés longs réels.
- **Priorité :** 🟠 Majeur.

## Comparaison avec le classeur

- **3.3** : le classeur signale une non-conformité historique corrigée en `0.0.14-alpha`. Le code actuel applique un focus visible distinct en mode clair et sombre.
- **8.2** : l’attribut historique `outlined` n’est plus émis directement sur le bouton ; le test dédié protège cette correction.
- **7.1 et 7.3** : l’usage de `VBtn` fournit un bouton natif, nommé et activable au clavier.
- **1.2** : `SyIcon decorative` masque l’icône de retour aux technologies d’assistance.

## Limites

Le résultat porte sur le composant isolé et le thème CNAM. Les attributs transmis par `$attrs`, le contenu fourni par un slot, le contexte du lien `href` et la page consommatrice doivent être audités dans leur contexte réel. Le zoom navigateur à 200 % et la restitution par lecteur d’écran restent des vérifications manuelles.
