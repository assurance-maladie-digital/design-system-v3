# Étude #2692 : tri multiple, chiffre d'ordre non aligné avec la flèche

## Problème

Issue #2692 (version 1.2.0, Portail des Opérations / IPDO_X, anomalie graphique mineure, non bloquante) : dans l'en-tête d'un tableau en tri multiple, le chiffre d'ordre de tri s'affiche **sous** la flèche au lieu d'être à côté.

Story concernée : `Composants/Tableaux/SyTable/Tri`, story `MultiSort`. Le composant partagé `TableHeader` est utilisé par SyTable et SyServerTable : les deux tableaux sont concernés.

## Cause

`src/components/Tables/common/TableHeader.vue:244-247` :

```html
<div
	v-if="header!.sortable"
	class="sort-container align-center"
>
```

Le commit `5c8c30d8` (#2595, « TableHeader : Bug de décalage lors du filter », 29/09/2026) a retiré `d-flex` de ce conteneur. Sans `display: flex`, la classe `align-center` n'a plus d'effet. Les deux enfants s'empilent :

- le bouton de tri (`inline-flex`) ;
- l'indicateur `.sort-order-indicator`, qui est un `<div>` en `display: block`, donc passe à la ligne.

Ce retrait corrigeait un vrai défaut (voir plus bas). Le simple retour de `d-flex` le réintroduit.

## Mesures

Mesures faites sur la story déployée (`cnam-design-system.netlify.app`, version 1.2.0), dans Chrome headless (1280 × 800). Positions en pixels CSS (`getBoundingClientRect`). Les variantes sont simulées en injectant le CSS correspondant dans la page.

### Défaut constaté (état actuel)

| Colonne | Flèche (haut, hauteur) | Chiffre (haut, hauteur) |
|---|---|---|
| Nom (tri 1) | 70, 21 | **97**, 12 |
| Prénom (tri 2) | 70, 21 | **97**, 12 |
| Ville (non triée) | **76**, 21 | — |

Deux défauts visibles :

- le chiffre est sous la flèche (27 px plus bas) ;
- la flèche d'une colonne triée est 6 px plus haute que celle d'une colonne non triée, car son conteneur est plus haut.

### Pourquoi #2595 a retiré `d-flex`

Story `MultiSort`, largeur des colonnes avant puis après l'ajout d'un 3ᵉ tri sur « Ville » (même jeu de données dans les deux cas) :

| Variante | Nom | Prénom | Email | Ville | Alignement |
|---|---|---|---|---|---|
| Actuelle (sans `d-flex`) | 207 → 207 | 254 → 254 | 570 → 570 | 207 → 207 | non |
| `d-flex` rétabli | 228 → 223 | 273 → 267 | 541 → 529 | 196 → **218** | oui |

Avec `d-flex`, le chiffre s'ajoute à la largeur du conteneur. Le tableau est en mise en page automatique : à chaque ajout ou retrait d'un tri, toutes les colonnes changent de largeur (jusqu'à 22 px), et les titres se déplacent. Sans `d-flex`, le chiffre passe à la ligne et ne change pas la largeur : c'est ce que #2595 a obtenu, au prix du défaut de #2692.

En tri simple, `d-flex` change aussi les largeurs : l'élément vide `<div v-else-if="isColumnSorted" class="mr-2" />` (lignes 270-273) ajoute 8 px à la colonne triée (Nom : 249 px actuellement, 266 px avec `d-flex`).

**Point de vigilance pour les tests :** en tri simple, les largeurs changent déjà au clic, quelle que soit la variante (Nom : 249 → 285 px). Ce n'est pas lié à l'en-tête : le tri réordonne les lignes de la page, et la mise en page automatique recalcule les colonnes d'après le contenu des cellules. Il faut donc comparer les variantes à données égales, comme ci-dessus.

## Pistes étudiées

| Piste | Alignement | Largeurs stables à l'ajout d'un tri | Tri simple identique à l'actuel | Inconvénient |
|---|---|---|---|---|
| A. Rétablir `d-flex` | oui | **non** (jusqu'à 22 px) | non (+8 px) | Réintroduit #2595 |
| B. `d-flex` + largeur minimale réservée au conteneur (`min-width: 40px`) | oui | oui | non | Place réservée sur toutes les colonnes triables, même en tri simple ; `TableHeader` ne reçoit pas `multiSort` (absent des paramètres du slot `headers` de Vuetify), il faudrait ajouter une prop pour limiter la réserve au tri multiple |
| **C. `d-flex` + chiffre positionné en absolu à droite de la flèche** | oui | oui | oui (mesures identiques à l'actuel) | Le chiffre déborde du conteneur dans la marge intérieure de la cellule (16 px) |

Mesures de la piste C, story `MultiSort` :

| Colonne | Largeur avant → après le tri sur Ville | Flèche (haut) | Chiffre (haut) |
|---|---|---|---|
| Nom | 207 → 207 | 78 | 83 |
| Prénom | 254 → 254 | 78 | 83 |
| Email | 570 → 570 | — | — |
| Ville | 207 → 207 | 78 | 83 (après tri) |

Centres verticaux : flèche 88,5 px, chiffre 89 px. Toutes les flèches sont à la même hauteur, triées ou non. Le chiffre (7 px de large) reste dans la cellule : il se termine 9 px avant le bord droit pour Nom et Ville.

Mesures de la piste B, story `MultiSort` : alignement correct et largeurs stables (Nom 224, Prénom 267, Email 529, Ville 218, avant comme après), mais les largeurs de départ diffèrent de l'actuel.

## Correctif proposé (piste C)

Dans `TableHeader.vue` :

1. Remettre `d-flex` sur `.sort-container` et lui ajouter `position: relative`.
2. Sortir l'indicateur du flux :

   ```scss
   .sort-order-indicator {
   	position: absolute;
   	top: 50%;
   	left: 100%;
   	transform: translateY(-50%);
   	margin-left: 2px;
   }
   ```

   et retirer les classes `ml-0 mr-2` du template.
3. Supprimer l'élément vide `v-else-if="isColumnSorted" class="mr-2"` (lignes 270-273), qui ne sert qu'à compenser l'ancienne mise en page et ajoute 8 px en flex.
4. Remplacer le `<div>` de l'indicateur par un `<span>` : c'est un contenu en ligne.

Aucun changement de prop, d'événement ni de slot.

## Points à vérifier pendant la correction

- **Colonnes redimensionnables** (`resizable-columns`) : la poignée suit le conteneur de tri (`margin-left: auto`, décalée de `left: calc(24px - 1rem / 2)`). D'après le calcul, elle commence environ 20 px après la flèche, et le chiffre occupe 2 à 9 px. À vérifier par une mesure sur un tableau à la fois redimensionnable et en tri multiple (pas de story de ce type aujourd'hui).
- **Ordre à deux chiffres** (10 colonnes triées ou plus) : le chiffre fait environ 14 px et reste dans la marge de 16 px. Cas limite, à vérifier.
- **En-tête aligné à droite ou centré** (`align: 'end'`, `align: 'center'`) : vérifier que le chiffre ne chevauche pas le titre.
- **Titres sur plusieurs lignes** (`wrapTitle`) : vérifier le centrage vertical.
- **Zoom 200 % (RGAA 10.4)** : le chiffre ne doit pas être coupé.
- **SyServerTable** : même rendu (story `ServerMultiSort`).

## Tests

- Test visuel Cypress ajouté : `sy-table-multi-sort` dans `SyTable/tests/SyTable.visual.cy.ts` (SyTable en tri multiple sur deux colonnes). La baseline est générée en CI sur Linux (workflow `Update Visual Test Snapshots`), pas sous macOS ni WSL.
- happy-dom ne calcule pas la mise en page : un test unitaire ne peut pas vérifier l'alignement. Un test unitaire dans `common/tests/TableHeader.spec.ts` peut vérifier que l'indicateur est rendu dans `.sort-container`, à côté du bouton, avec le bon chiffre et son `title`.
- Vérifier sur la deploy preview, comme ci-dessus : alignement des centres, et largeurs identiques avant et après l'ajout d'un tri.

## Vérification du correctif appliqué

Storybook local, Chrome headless (1280 × 800), mêmes mesures que ci-dessus :

| Story | Résultat |
|---|---|
| SyTable `MultiSort` | Centres de la flèche et du chiffre identiques (88,5 px) ; toutes les flèches à la même hauteur ; largeurs inchangées à l'ajout d'un tri sur Ville (207 / 254 / 570 / 207). Le chiffre se termine 7 à 8 px avant le bord de la cellule. |
| SyServerTable `ServerMultiSort` | Même alignement (88,5 px). |
| SyTable `SortBy` (tri simple) | Largeurs identiques à la version déployée à chaque clic (249/305/684, 285/294/659, 265/300/673). |
| SyTable `ResizableColumns` avec `multiSort` (via les args de l'URL) | Chiffre aligné ; 11 px entre le chiffre et la poignée de redimensionnement, pas de chevauchement. |

Le retrait d'un tri change encore les largeurs (Nom 207 → 239 px) : c'est l'effet des lignes réordonnées, mesuré à l'identique sur la version déployée.

Ordre à deux chiffres (Playground, 12 colonnes triées) : le chiffre (13 px de large) se termine à 1 px du bord droit de la cellule ; il reste dans la cellule, sans être coupé (`overflow: visible`), mais la marge est quasi nulle. Avec un chiffre, la marge est de 7 px.

Non vérifiés : en-têtes alignés à droite ou centrés, `wrapTitle`, zoom 200 % (cas réglables dans le Playground).

## Changement de contrat

Aucun changement d'API. Changement visuel uniquement (position du chiffre, hauteur de la flèche d'une colonne triée) : à signaler dans `dev/ReleasesAlerts/` si le projet le demande pour un changement purement visuel.

## Fichiers concernés

| Fichier | Modification |
|---|---|
| `src/components/Tables/common/TableHeader.vue` | `d-flex` et `position: relative` sur le conteneur, indicateur en absolu (`span`), suppression de l'élément vide `mr-2`. |
| `src/components/Tables/common/tests/TableHeader.spec.ts` | Rendu de l'indicateur dans le conteneur de tri. |
| `src/components/Tables/SyTable/tests/SyTable.visual.cy.ts` | Capture `sy-table-multi-sort` (tri multiple sur deux colonnes). |
