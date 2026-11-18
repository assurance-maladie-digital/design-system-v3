# SyAutocomplete — correctif non cassant : libellé de la sélection absent des `items`

En sélection simple, le champ n’affichait le libellé de la valeur sélectionnée que si l’item correspondant figurait dans les `items` courants. Deux cas affichaient donc un champ vide alors qu’une valeur restait sélectionnée :

- une valeur initiale dont les `items` sont chargés plus tard (formulaire pré-rempli, options chargées par API) : le libellé n’apparaissait jamais ;
- une recherche côté serveur dont les résultats ne contiennent plus l’item sélectionné.

Le libellé est désormais résolu à l’arrivée des `items`, sans écraser une recherche en cours de saisie. Si l’item reste absent, le champ affiche le dernier libellé connu de la valeur, ou, avec `returnObject`, celui de l’objet sélectionné.

## Conduite à tenir

- Aucune.
