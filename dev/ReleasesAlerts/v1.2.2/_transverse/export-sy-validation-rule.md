# Nouvel export de type `SyValidationRule` (non cassant)

`@cnamts/synapse` exporte désormais le type `SyValidationRule`, qui décrit une règle de validation Synapse sous forme d'objet `{ type, options }`. C'est le type attendu par les props `customRules`, `customWarningRules` et `customSuccessRules` des champs de formulaire.

Jusqu'ici, ce type n'était accessible que via l'alias interne `@/composables/unifyValidation/useValidation`, inutilisable dans un projet consommateur : les règles ne pouvaient pas être typées explicitement.

À ne pas confondre avec `ValidationRule`, déjà exporté par la librairie (`useFieldValidation`) : c'est une **fonction** `(value: unknown) => ValidationResult`, et non une règle déclarative `{ type, options }`.

```ts
import type { SyValidationRule } from '@cnamts/synapse'

const customRules: SyValidationRule[] = [
  {
    type: 'custom',
    options: {
      validate: (value: unknown) => value === 'A',
      message: 'Sélectionnez l’option A.',
    },
  },
]
```

## Conduite à tenir

- Aucune : l'export est un ajout, le code existant n'est pas affecté.
- Pour typer les règles passées à `customRules`, `customWarningRules` ou `customSuccessRules`, importez `SyValidationRule` depuis `@cnamts/synapse` (et non `ValidationRule`, qui désigne la fonction de `useFieldValidation`).
