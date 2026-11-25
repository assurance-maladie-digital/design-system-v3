# AmeliproPagination — `to` accepte un objet de route (non cassant)

Dans les éléments de `items` (type `PaginationTypes`), la propriété `to` était typée `string`. Elle est désormais typée `RouteLocationRaw` (`vue-router`), comme les props `to` des autres composants : elle accepte une chaîne ou un objet de route, par exemple `{ name: 'resultats', query: { page: 2 } }`.

## Conduite à tenir

- Aucune : une chaîne reste acceptée.
