
# Validation compatible Vuetify

## Props spécifiques

| Prop                  | Type      | Description                                                                 |
|-----------------------|-----------|-----------------------------------------------------------------------------|
| `useVuetifyValidation`| boolean   | Active le mode validation Vuetify.                                          |
| `rules`        | array     | Tableau de fonctions synchrones au format Vuetify.                          |


## Mode Vuetify

Le système de validation unifié permet d'utiliser la validation native Vuetify ou la validation Synapse via l'option `useVuetifyValidation`.

- `useVuetifyValidation: true` → Validation Vuetify native (règles sous forme de fonctions retournant true ou un message d'erreur)
- `useVuetifyValidation: false` → Validation Synapse (recommandé pour la migration)

**Fichiers source :**
- [`useVuetifyValidation.ts`](src/composables/unifyValidation/useVuetifyValidation.ts) - Adapteur Vuetify
- [`useValidation.ts`](src/composables/unifyValidation/useValidation.ts) - Point d'entrée unifié

## Exemple d'intégration Vuetify

```typescript
import { useValidation } from '@/composables/unifyValidation/useValidation'

const { validate, errors } = useValidation({
  modelValue: model,
  useVuetifyValidation: true, // ← mode Vuetify
  vuetifyRules: [
    (v) => !!v || 'Champ requis',
    (v) => /.+@.+\..+/.test(v) || 'Email invalide'
  ]
})
```

## Migration des règles

- Pour la migration, privilégier les règles custom et la validation Synapse pour bénéficier des 3 niveaux de feedback.
