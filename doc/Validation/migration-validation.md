
## Migration : Legacy → Unifié

La migration cible consiste à faire disparaître l'usage direct du point d'entrée legacy dans les composants publics.

### Cible standard

```ts
import {
	useValidation,
	validationPropsDefaults,
	type FieldValidationProps,
} from '@/composables/unifyValidation/useValidation'
```

Un composant migré :

1. importe depuis `unifyValidation`
2. passe des refs au composable unifié
3. consomme `errors`, `warnings`, `successes`, `hasError`, `hasWarning`, `hasSuccess`
4. ne gère plus un état de validation parallèle

---

## Exception autorisée : bridge métier

Certains composants ont une logique métier qui ne doit pas être poussée dans le moteur générique.

Dans ce cas, la migration correcte n'est pas de supprimer toute couche intermédiaire, mais de :

1. garder un bridge dédié au domaine
2. faire reposer ce bridge sur le système unifié
3. limiter ce bridge à la logique métier résiduelle

### Exemple : DatePicker

Le DatePicker utilise :

- [`src/components/DatePicker/composables/useDatePickerValidation.ts`](src/components/DatePicker/composables/useDatePickerValidation.ts)

Ce bridge doit rester mince et ne porter que :

- required conditionnel
- validation de plage
- flow `CalendarMode`
- orchestration `SyForm`

Il ne doit pas recréer un moteur de validation générique.

---

## Checklist de migration

### 1. Basculer les imports

```ts
import {
	useValidation,
	validationPropsDefaults,
	type FieldValidationProps,
} from '@/composables/unifyValidation/useValidation'
```

### 2. Centraliser l'état de validation

Utiliser uniquement les sorties du système unifié :

- `errors`
- `warnings`
- `successes`
- `hasError`
- `hasWarning`
- `hasSuccess`
- `validate`
- `clearValidation`

### 3. Supprimer les états parallèles

Retirer les anciennes variables d'état du composant quand elles doublonnent le moteur unifié.

### 4. Garder un bridge seulement si nécessaire

Créer ou conserver un bridge uniquement si le composant porte une logique métier transversale qui ne doit pas être absorbée par `useValidation`.
