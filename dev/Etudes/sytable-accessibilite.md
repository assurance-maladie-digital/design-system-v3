# SyTable — étude des corrections d’accessibilité

## Périmètre

Cette étude décrit les modifications de la PR `fix/accessibility-sytable`, y compris les derniers ajustements de pagination et d’annonce du tableau vide. Elle est reconstituée à partir du diff de la branche et du code actuel ; la version initiale de la page n’a pas été retrouvée dans l’historique consulté.

Le périmètre principal est `SyTable`, ses stories et sa documentation. Des corrections concernent aussi les composants partagés `TableHeader`, `OrganizeColumns`, `SyTablePagination` et `SyPagination`. L’alignement complet de `SyServerTable` reste prévu dans une autre PR : le déplacement de `useTableStatus` dans `Tables/common` prépare sa réutilisation sans l’activer pour ce composant.

## Constats et corrections

### Structure et nom du tableau

- Les en-têtes de colonnes portent `scope="col"`. Les colonnes techniques de sélection et de dépliage disposent d’un libellé accessible, même sans titre visible.
- La ligne de filtres utilise des cellules `td`, plutôt que des `th` assimilables à des en-têtes supplémentaires. La colonne technique de dépliage ne reçoit plus de filtre.
- La légende reste le premier enfant du tableau et n’est rendue que si `caption.trim()` contient du texte.
- La nouvelle prop `hideCaption`, à `false` par défaut, permet de masquer visuellement cette légende avec `d-sr-only` en la conservant pour les lecteurs d’écran. Les stories utilisent des légendes descriptives plutôt que des légendes vides ; les tableaux d’une même page ont des noms distincts.

### Pagination et nombre de lignes

Les actions de pagination de `SyTable` modifient les données affichées : elles utilisent désormais des boutons natifs plutôt que des liens `href="#"`.

- `SyPagination` expose `buttonMode`, à `false` par défaut. Son usage autonome conserve les liens ; `SyTablePagination` active le mode boutons lorsqu’un identifiant de résultats lui est transmis.
- Chaque bouton référence la zone de résultats par `aria-controls`. Les pages numériques possèdent un nom explicite, par exemple « Page 2 ». Les points de suspension sont non interactifs.
- Le nom de la navigation reprend la légende du tableau. Sans légende, le nom de repli est « Navigation de pagination ».
- Pour `SyTable`, le sélecteur de nombre de lignes est associé au libellé visible par `aria-labelledby`, avec un identifiant propre à chaque instance. L’autre mode conserve son `aria-label`.
- Les styles de pagination prennent en compte les boutons, notamment leurs états et leur alignement. Un scénario visuel dédié couvre le mode boutons.

### Annonces de statut

`SyTable` utilise le composable réactif `common/useTableStatus.ts`. La région `role="status"`, avec `aria-atomic="true"`, reste vide au montage puis annonce uniquement les changements pertinents :

- la page et la plage de résultats visibles ;
- le nombre de lignes sélectionnées, sans énumérer leurs numéros ;
- le nombre de filtres actifs ;
- les colonnes triées et le sens du tri, ou la suppression du tri.

Les changements liés à une même interaction sont regroupés. Un changement de filtre peut être annoncé à nouveau même si le nombre de filtres reste identique. Lorsque le filtrage ne retourne aucune ligne, l’annonce utilise le message d’absence de données plutôt qu’une plage de résultats incohérente ; la suppression du filtre réannonce les résultats disponibles.

Le chemin d’accessibilité antérieur de `SyTable` est ajusté pour éviter les annonces concurrentes et conserver les commandes d’en-tête accessibles.

### Redimensionnement des colonnes

Dans `SyTable`, les poignées exposent un nom incluant le titre de colonne, une orientation verticale et une largeur numérique avec son unité via `aria-valuetext`. La largeur mesurée est suivie par `ResizeObserver` lorsque le redimensionnement est actif ; une valeur de repli permet de conserver des attributs numériques avant la mesure. Les flèches gauche et droite permettent le redimensionnement au clavier.

L’écouteur de redimensionnement de fenêtre est installé dans `onMounted`, afin d’éviter l’accès à `window` lors du setup côté serveur.

### Gestion des colonnes et exemples interactifs

Le panneau de gestion des colonnes est identifié comme un dialogue nommé. Le bouton expose `aria-haspopup="dialog"` et référence le panneau réel par `aria-controls` lorsqu’il est ouvert ; l’attribut `aria-owns` ajouté par `VMenu` est neutralisé.

Les stories sont également corrigées : les boutons de dépliage exposent leur état et ciblent des lignes identifiées de manière unique ; l’éditeur personnalisé possède un libellé accessible en mode édition. Les exemples et la documentation illustrent les nouveaux usages.

## Impacts

- `SyTable.hideCaption` et `SyPagination.buttonMode` sont des props optionnelles documentées et illustrées.
- Les tests E2E ciblant les liens de pagination de `SyTable` doivent cibler des boutons, avec un nom tel que « Page 2 ».
- Les surcharges CSS ciblant uniquement `.sy-pagination a` doivent couvrir les boutons si elles s’appliquent à `SyTable`.
- Une légende descriptive reste nécessaire, y compris lorsqu’elle est masquée ; utiliser des légendes distinctes pour plusieurs tableaux.
- Les changements de contrat et la conduite à tenir sont consignés dans `dev/ReleasesAlerts/v1.2.2.md`.

