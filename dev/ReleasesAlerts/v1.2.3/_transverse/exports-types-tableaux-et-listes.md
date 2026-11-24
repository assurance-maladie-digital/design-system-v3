# SyTable, SyServerTable, PaginatedTable, CollapsibleList, SearchListField — nouveaux exports (non cassant)

`@cnamts/synapse` exporte désormais :

- `StateEnum` : états de chargement d'un tableau (`IDLE`, `PENDING`, `RESOLVED`, `REJECTED`) ;
- les types `DataOptions` et `FilterOption` de SyTable et SyServerTable ;
- le type `PaginatedTableDataOptions` : options de PaginatedTable, qui ont leur propre type `DataOptions` ;
- le type `CollapsibleListItem` : un élément de CollapsibleList (`ListItem` dans le code source) ;
- le type `SearchListItem` : un élément de SearchListField.

Avant, ils n'étaient accessibles que par un sous-chemin, par exemple `@cnamts/synapse/src/components/Tables/common/constants/StateEnum`, comme le montrait la documentation. Ce chemin ne fonctionne pas : l'export `"./*"` du paquet ajoute déjà `src/`. Le chemin sans `src/` fonctionne avec Vite, mais pas au typecheck : TypeScript ne complète pas l'extension d'un chemin issu de `exports`.

## Conduite à tenir

- Aucune action obligatoire.
- Si votre projet importe l'un de ces éléments par un sous-chemin, remplacez l'import :

```ts
import { StateEnum } from '@cnamts/synapse'
import type { DataOptions, FilterOption } from '@cnamts/synapse'
```
