# SyServerTable — pagination en boutons et annonces accessibles

La pagination utilise désormais des `<button type="button">` à la place des liens `<a href="#">`. Les boutons référencent les résultats par `aria-controls`. Le nom de la pagination reprend la `caption` du tableau ; sans légende, il reste « Navigation de pagination ».

La zone de statut annonce les changements de page et de plage de résultats, de sélection, de filtres et de tri. Les colonnes techniques sont nommées, les filtres utilisent des cellules de données et les poignées de redimensionnement annoncent la largeur. Les commandes d’en-tête restent accessibles hors focus. Les conteneurs des filtres ne reçoivent plus de libellé « items per page » ni de tabulation supplémentaire ; les champs conservent leurs propres libellés et attributs ARIA. La balise `<table>` porte `aria-busy="true"` pendant le chargement (`loading`), puis `aria-busy="false"` lorsque les résultats sont disponibles.

## Conduite à tenir

- Adapter les tests E2E ciblant les liens de pagination pour cibler les boutons (par exemple le bouton « Page 2 »).
- Adapter les surcharges CSS ciblant `.sy-pagination a` pour inclure `.sy-pagination button`.
- Donner une `caption` descriptive et distincte à chaque tableau présent sur une même page.
