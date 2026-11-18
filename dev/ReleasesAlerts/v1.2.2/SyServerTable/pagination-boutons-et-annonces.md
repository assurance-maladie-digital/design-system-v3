# SyServerTable — pagination en boutons et annonces accessibles

La pagination utilise désormais des `<button type="button">` à la place des liens `<a href="#">`. Les boutons référencent les résultats par `aria-controls`. Le nom de la pagination reprend la `caption` du tableau ; sans légende, il reste « Navigation de pagination ».

La zone de statut annonce les changements de page et de plage de résultats, de sélection, de filtres et de tri. Les colonnes techniques sont nommées, les filtres utilisent des cellules de données et les poignées de redimensionnement annoncent la largeur. Les commandes d’en-tête restent accessibles hors focus. Les conteneurs des filtres ne reçoivent plus de libellé « items per page » ni de tabulation supplémentaire ; les champs conservent leurs propres libellés et attributs ARIA. La balise `<table>` porte `aria-busy="true"` pendant le chargement (`loading`), puis `aria-busy="false"` lorsque les résultats sont disponibles.

Nouvelle prop, alignée sur `SyTable` :

| Composant | Prop | Type | Défaut | Rôle |
|---|---|---|---|---|
| `SyServerTable` | `hideCaption` | `boolean` | `false` | Masque visuellement la légende `caption`, tout en la conservant pour les lecteurs d’écran et le nom de la pagination. |

## Conduite à tenir

- La case « Sélectionner toutes les lignes » n’a plus d’`aria-label` : son nom vient de son `<label>`. L’`aria-label` doublait le nom de l’en-tête de colonne pour les lecteurs d’écran (« Sélectionner toutes les lignes Sélectionner toutes les lignes »). Les tests qui la ciblent par `[aria-label="Sélectionner toutes les lignes"]` doivent passer par son nom accessible (par exemple `getByRole('checkbox', { name: 'Sélectionner toutes les lignes' })`).
- Adapter les tests E2E ciblant les liens de pagination pour cibler les boutons (par exemple le bouton « Page 2 »).
- Adapter les surcharges CSS ciblant `.sy-pagination a` pour inclure `.sy-pagination button`.
- Donner une `caption` descriptive et distincte à chaque tableau présent sur une même page, y compris lorsqu’elle ne doit pas être affichée : utiliser alors `hideCaption`.
