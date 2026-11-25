# ServiceMenu — `to` accepte un objet de route (non cassant)

Dans les services (type `Service`), la propriété `to` était typée `string`. Elle est désormais typée `RouteLocationRaw` (`vue-router`), comme les props `to` des autres composants : elle accepte une chaîne ou un objet de route, par exemple `{ name: 'messagerie' }`.

## Conduite à tenir

- Aucune : une chaîne reste acceptée.
