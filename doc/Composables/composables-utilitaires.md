# Composables utilitaires

Référence des composables utilitaires exposés par le Design System.

---

## useWidthable

**Fichier** : `src/composables/widthable/index.ts`  
**Export** : `src/composables/index.ts`

Gère les props `width`, `minWidth`, `maxWidth` et les convertit en styles CSS inline via `convertToUnit`.

### Interface

```ts
export interface Widthable {
  maxWidth?: string | number
  minWidth?: string | number
  width?: string | number
}
```

### Usage

```ts
// Via l'export public du package
import { useWidthable } from '@cnamts/synapse'

// Via l'import interne
import { useWidthable } from '@/composables/widthable'

const { widthStyles } = useWidthable(props)
// widthStyles → ComputedRef<{ width, minWidth, maxWidth }>
```

```vue
<div :style="widthStyles">...</div>
```

### Comportement

- Les valeurs numériques sont automatiquement converties en `px` (`width: 200` → `width: '200px'`)
- Si `width` n'est pas fourni, la valeur par défaut est `'100%'`
- `minWidth` et `maxWidth` sont `undefined` si non fournis (aucun style injecté)

---

## useFilterable

**Fichier** : `src/composables/useFilterable/useFilterable.ts`

> ⚠️ Ce composable n'est **pas** dans `src/composables/index.ts` — il n'est pas exporté dans l'API publique `@cnamts/synapse`. À utiliser uniquement en import interne.

Gère un système de filtres avec chips. Utilisé par `FilterInline` et `FilterSideBar`.

### Type `FilterItem`

```ts
type FilterItem = {
  name: string          // identifiant du filtre
  value?: unknown       // valeur courante
  formatChip?: (value: unknown) => ChipItem[]  // formateur de chips personnalisé
  chipOverflowLimit?: number
  title?: string        // label affiché
}
```

### Usage

```ts
import useFilterable from '@/composables/useFilterable/useFilterable'
// Import interne uniquement — non exporté dans l'API publique

const model = ref<FilterItem[]>([
  { name: 'status', value: undefined },
  { name: 'date', value: undefined },
])

const {
  filters,
  removeChip,
  resetFilter,
  resetAllFilters,
  getChips,
  getFilterCount,
} = useFilterable(model)
```

### API retournée

| Propriété/Méthode | Type | Description |
|---|---|---|
| `filters` | `Ref<FilterItem[]>` | Copie réactive des filtres (deep copy du modèle) |
| `getChips(filter)` | `ChipItem[]` | Convertit la valeur d'un filtre en tableau de chips |
| `getFilterCount(filter)` | `number` | Nombre de chips actifs pour un filtre |
| `removeChip(filter, chip)` | `void` | Supprime un chip (retire la valeur correspondante) |
| `resetFilter(filter)` | `void` | Réinitialise un filtre à `undefined` |
| `resetAllFilters()` | `void` | Réinitialise tous les filtres |

### Gestion des types de valeurs

`getChips` supporte plusieurs formats de valeur :

| Type de `value` | Résultat |
|---|---|
| `string` / `number` | 1 chip avec le texte et la valeur |
| `Array` | 1 chip par élément |
| `{ from, to }` (PeriodField) | 1 chip "from – to" |
| Objet avec `title`/`text`/`label` + `value` (select) | 1 chip |
| Autre objet | 1 chip par clé |

---

## useHolidayDay

**Fichier** : `src/composables/date/useHolidayDay.ts`

> ⚠️ Ce composable n'est **pas** dans `src/composables/index.ts` — il n'est pas exporté dans l'API publique `@cnamts/synapse`. À utiliser uniquement en import interne.

Calcule les jours fériés français et vérifie si une date en est un.

### Fonctions exportées

```ts
import { useHolidayDay, getJoursFeries, isHolidayDay } from '@/composables/date/useHolidayDay'
// Import interne uniquement — non exporté dans l'API publique
```

#### `getJoursFeries(annee, format?)`

Retourne un `Set<string>` des 11 jours fériés français pour l'année donnée.

```ts
const feries = getJoursFeries(2026)
// Set { '01/01/2026', '06/04/2026', '01/05/2026', ... }

const feries = getJoursFeries(2026, 'YYYY-MM-DD')
// Set { '2026-01-01', '2026-04-06', '2026-05-01', ... }
```

**Jours calculés** : Jour de l'an, Lundi de Pâques, Fête du travail, Victoire des alliés, Ascension, Lundi de Pentecôte, Fête Nationale, Assomption, Toussaint, Armistice, Noël.

> La date de Pâques est calculée via l'**algorithme de Gauss** (méthode grégorienne).

#### `isHolidayDay(date, format?)`

```ts
isHolidayDay('01/05/2026')          // true
isHolidayDay('02/05/2026')          // false
isHolidayDay(new Date(2026, 0, 1))  // true
isHolidayDay('2026-01-01', 'YYYY-MM-DD') // true
```

#### `useHolidayDay()` (composable)

```ts
const { getJoursFeries, isHolidayDay, calculPaquesGregorienne } = useHolidayDay()
```

Retourne les trois fonctions suivantes :

| Fonction | Description |
|---|---|
| `getJoursFeries` | Calcule les jours fériés de l'année |
| `isHolidayDay` | Vérifie si une date est un jour férié |
| `calculPaquesGregorienne` | Retourne `{ jour, mois }` de Pâques pour une année (usage interne) |

---

## usePagination

**Fichier** : `src/composables/usePagination.ts`  
**Export public** : `src/composables/index.ts` → `@cnamts/synapse`

Pagination responsive pour les listes AmeliPro. S'adapte automatiquement entre desktop et mobile via `useDisplay()` de Vuetify.

### Usage

```ts
import { usePagination } from '@cnamts/synapse'

const {
  currentPage,
  currentPageItems,
  itemToDisplay,
  pageTotal,
  paginationTable,
  paginationSelectItems,
  setDefaultItemsPerPage,
  updatePagination,
} = usePagination(
  list,              // IDataListItem[] — liste complète
  20,                // itemPerPageDefault (desktop, défaut: 10)
  5,                 // itemPerPageDefaultMobile (défaut: 10)
  'mdAndUp',         // breakpoint Vuetify (défaut: 'mdAndUp')
)
```

### API retournée

| Propriété/Méthode | Type | Description |
|---|---|---|
| `currentPage` | `Ref<number>` | Page courante (commence à 1) |
| `itemToDisplay` | `Ref<number>` | Nombre d'items affichés par page |
| `pageTotal` | `Ref<number>` | Nombre total de pages (implémenté en `computed` mais typé `Ref` dans l'interface publique) |
| `paginationTable` | `Ref<PaginationTypes[]>` | Tableau des pages `[{ key: 1 }, { key: 2 }, ...]` |
| `paginationSelectItems` | `SelectItem[]` | Options du sélecteur : `[5, 10, 20, 30, 50, 100]` |
| `currentPageItems(list)` | `IDataListItem[]` | Tranche de la liste pour la page courante |
| `setDefaultItemsPerPage()` | `void` | Réinitialise le nombre d'items selon le breakpoint actuel |
| `updatePagination(list, n)` | `void` | Met à jour la liste et recalcule la pagination |

### Comportement responsive

Le breakpoint est surveillé via un `watch`. Quand on passe de mobile à desktop (ou inversement), `setDefaultItemsPerPage()` est appelé automatiquement pour recalculer le nombre d'items par page.

---

## useFormFieldErrorHandling

**Fichier** : `src/composables/useFormFieldErrorHandling.ts`

> ⚠️ Ce composable n'est **pas** exporté dans `src/composables/index.ts` — il n'est pas dans l'API publique `@cnamts/synapse`. Usage interne uniquement.

Composable legacy de gestion des erreurs de champs de formulaire. **Encapsule le système de validation legacy** (`src/composables/validation/`).

> ⚠️ Pour les nouveaux composants, préférer `useValidation` depuis `src/composables/unifyValidation/`. Voir [Guide de migration](../Validation/migration-validation.md).

### Usage

```ts
import { useFormFieldErrorHandling } from '@/composables/useFormFieldErrorHandling'

const {
  hasError,
  hasWarning,
  hasSuccess,
  errors,
  warnings,
  successes,
  validateField,
  validateOnSubmit,
  checkErrorOnBlur,
} = useFormFieldErrorHandling(props, modelValue)
```

### Props acceptées (`UseFormFieldErrorHandlingProps`)

| Prop | Type | Description |
|---|---|---|
| `errorMessages` | `string[] \| null` | Messages d'erreur externes (injectés par le parent) |
| `warningMessages` | `string[] \| null` | Messages de warning externes |
| `successMessages` | `string[] \| null` | Messages de succès externes |
| `hasError` | `boolean` | Force l'état d'erreur |
| `hasWarning` | `boolean` | Force l'état de warning |
| `hasSuccess` | `boolean` | Force l'état de succès |
| `customRules` | `ValidationRule[]` | Règles d'erreur personnalisées |
| `customWarningRules` | `ValidationRule[]` | Règles de warning |
| `customSuccessRules` | `ValidationRule[]` | Règles de succès |
| `required` | `boolean` | Ajoute automatiquement une règle `required` |
| `label` | `string` | Nom du champ (utilisé dans les messages d'erreur) |
| `isValidateOnBlur` | `boolean` | `true` = valide au blur, `false` = valide à chaque changement |
| `showSuccessMessages` | `boolean` | Affiche les messages de succès |
| `disableErrorHandling` | `boolean` | Désactive toute validation |

### Intégration SyForm

Ce composable appelle automatiquement `useValidatable(validateOnSubmit, clearValidation)` — le champ est donc enregistré auprès du `SyForm` parent sans action supplémentaire.
