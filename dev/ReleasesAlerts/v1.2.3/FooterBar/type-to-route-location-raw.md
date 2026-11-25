# FooterBar — type de la propriété `to` des liens corrigé (changement de typage)

Dans les éléments de `linkItems` (type `LinkItem`), la propriété `to` était typée `RawLocation`, un type de `vue-router` 3 absent de `vue-router` 4. Le type ne se résolvait pas : avec `skipLibCheck`, `to` acceptait n'importe quelle valeur.

`to` est désormais typé `RouteLocationRaw` (`vue-router` 4), comme les props `to` des autres composants.

## Conduite à tenir

- Aucune si `to` reçoit une chaîne ou un objet de route valide.
- Si le typecheck signale une erreur sur `to` après la mise à jour, la valeur passée n'est pas une route valide pour `vue-router` 4 : corrigez-la.
