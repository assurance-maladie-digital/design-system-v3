# SyBtnMenu — en-tête du menu et déplacement du focus

Le slot `menu-header` affiche du contenu au-dessus et en dehors de la liste d’options. À l’ouverture, le focus va maintenant au premier élément focusable du contenu du menu, y compris dans cet en-tête. Un menu contenant uniquement `menu-header` n’ajoute pas de liste vide. Le slot `footer-list-item` suffit désormais à rendre la liste lorsqu’il est utilisé seul.

## Conduite à tenir

Aucune. Placez dans `menu-header` les informations ou actions qui doivent précéder la liste; le focus suit l’ordre du DOM.
