
# Validation compatible Vuetify

Le système unifié permet aussi d'utiliser le mode de validation natif Vuetify.

Le point d'entrée reste :

- [`src/composables/unifyValidation/useValidation.ts`](src/composables/unifyValidation/useValidation.ts)

avec `useVuetifyValidation: true`.

---

## Props spécifiques

| Prop | Type | Description |
|---|---|---|
| `useVuetifyValidation` | `boolean` | Active le mode Vuetify |
| `rules` | `VuetifyValidationRule[]` | Règles synchrones Vuetify |

---

## Fonctionnement

```mermaid
flowchart LR
    Entry["Component.vue"] --> Unified["useValidation.ts"]
    Unified -->|useVuetifyValidation: true| Vuetify["useVuetifyValidation.ts"]
```

Le mode Vuetify est utile quand le composant doit s'aligner sur des règles simples au format natif Vuetify.

Le mode Synapse reste préférable si le composant doit exposer :

- erreurs
- warnings
- succès
- règles async
- messages injectés et états forcés

---

## Exemple

```ts
import { useValidation } from '@/composables/unifyValidation/useValidation'

const { validate, errors } = useValidation({
	modelValue,
	readonly,
	disabled,
	required,
	isValidateOnBlur,
	showSuccessMessages,
	disableErrorHandling,
	label,
	focused,
	useVuetifyValidation: true,
	rules: computed(() => [
		(v) => !!v || 'Champ requis',
		(v) => /.+@.+\\..+/.test(v) || 'Email invalide',
	]),
})
```

---

## Cas DatePicker

Le DatePicker supporte désormais aussi `useVuetifyValidation` + `rules`.

Il conserve néanmoins un bridge métier dédié :

- [`src/components/DatePicker/composables/useDatePickerValidation.ts`](src/components/DatePicker/composables/useDatePickerValidation.ts)

Ce bridge porte encore des règles métier qui dépassent le simple contrat Vuetify :

- plage de dates
- `required` conditionnel
- flow `CalendarMode`
- soumission `SyForm`

Le mode Vuetify est donc possible sur DatePicker pour s'aligner avec les autres champs migrés, mais le mode Synapse reste le plus adapté dès qu'une règle dépend du métier date.
