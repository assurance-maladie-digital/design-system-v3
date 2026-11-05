# SyTable / SyServerTable — pied de tableau vide retiré du DOM

Le slot `bottom` contenait toujours un conteneur `div.d-flex.align-center.pa-2`, même sans contenu à afficher. Ce conteneur vide laissait une bande blanche de 16 px sous le tableau (#2736). Il n'est plus rendu que s'il contient la gestion des colonnes (`enableColumnControls`) ou la pagination.

Il disparaît donc dans ces cas, quand `enableColumnControls` est désactivé :

- `hideDefaultFooter` est activé ;
- le tableau n'a aucune ligne (état vide) ;
- `SyServerTable` est en cours de chargement et `items` n'est pas encore défini.

Les props, événements et slots ne changent pas.

## Conduite à tenir

- Si vos tests ou snapshots attendaient ce conteneur vide sous le tableau, mettez-les à jour.
