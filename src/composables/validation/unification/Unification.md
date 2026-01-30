# Guide de migration vers la validation unifiée

## 1. Contexte
- Les composants délèguent désormais la validation à `useFieldValidationController` (règles, options, messages, triggers).
- `useValidation` reste le moteur : exécute règles, gère erreurs/avertissements/succès, respecte `disableErrorHandling`, ajoute un succès par défaut si pas de successRules custom.
- Modes : DS (custom rules gérées par le contrôleur) vs Vuetify natif (`useVuetifyValidation` → custom rules ignorées, warning).

## 2. Briques à réutiliser
- **Props de validation** via `useFieldValidationProps` : readonly, disabled, required, isValidateOnBlur, showSuccessMessages, disableErrorHandling, useVuetifyValidation, label, customRules/customWarningRules/customSuccessRules, errorMessages/warningMessages/successMessages.
- **Contrôleur** : `useFieldValidationController({ value, props, baseRules, validationOptions })`, priorité aux messages externes (même tableau vide), triggers blur/change/submit, skip si readonly/disabled/disableErrorHandling.
- **Base rules** : règle `required` + message contextualisé (label/fieldIdentifier).
- **Validation options** : showSuccessMessages, fieldIdentifier, disableErrorHandling.
- **Intégration formulaire** : `useValidatable(controller.validateOnSubmit, controller.clearValidation)` si non Vuetify natif.

## 3. Étapes de migration d’un composant
1) Ajouter/typer les props de validation ou les mapper (voir liste ci-dessus).
2) Créer `baseRules` (ex: required) et `validationOptions` (showSuccessMessages, fieldIdentifier, disableErrorHandling).
3) Mapper vers `useFieldValidationProps` → `fieldProps`.
4) Instancier le contrôleur : `useFieldValidationController({ value: model, props: fieldProps, baseRules, validationOptions })`.
5) Brancher les triggers : blur (`validateOnBlur`), change (`validateOnChange` si live), submit (`validateOnSubmit`), exposer au besoin.
6) Intégrer SyForm : si `!props.useVuetifyValidation`, appeler `useValidatable(...)`.
7) Afficher états & messages depuis le contrôleur (ou messages externes), en respectant `disableErrorHandling` et `showSuccessMessages`.
8) Règles Vuetify : ne passer `:rules` que si `useVuetifyValidation` est vrai; ajouter par défaut `validate-on="blur lazy"` quand validation sur blur + règles présentes.

## 4. Checklist
- [ ] Props de validation ajoutées/typées.
- [ ] `baseRules` & `validationOptions` définis.
- [ ] `useFieldValidationProps` + `useFieldValidationController` câblés sur le modèle.
- [ ] Triggers blur/change/submit raccordés et exposés si nécessaire.
- [ ] `useValidatable` branché (hors mode Vuetify).
- [ ] Messages/états issus du contrôleur, priorité aux messages externes.
- [ ] Règles Vuetify cloisonnées + `validate-on` ajouté si besoin.

## 5. Tests à couvrir
- Réactivité des options (`showSuccessMessages`, `fieldIdentifier`).
- `disableErrorHandling` réactif.
- Warning si `useVuetifyValidation` + custom rules (custom ignorées).
- Rendu composant : blur vs change, messages externes prioritaires, succès par défaut absent si successRules custom.

## 6. Points d’attention
- `useVuetifyValidation` + custom rules : combinaison à éviter (ignored + warn).
- readonly/disabled/disableErrorHandling : validation sautée et nettoyée.
- Valeur vide + non required + pas de règle required custom : on nettoie la validation (pas d’erreurs).
- Messages externes (y compris tableau vide) écrasent les internes.
- Succès par défaut uniquement si pas de successRules custom et `showSuccessMessages` actif.

## 7. Exemple minimal (pseudo-code)
```ts
const model = computed({ get: () => props.modelValue, set: v => emit('update:modelValue', v) })

const baseRules = computed(() => props.required
  ? [{ type: 'required', options: { message: `Le champ ${props.label || 'ce champ'} est requis.` } }]
  : [])

const validationOptions = computed(() => ({
  showSuccessMessages: props.showSuccessMessages,
  fieldIdentifier: props.label,
  disableErrorHandling: props.disableErrorHandling,
}))

const fieldProps = useFieldValidationProps(props)
const controller = useFieldValidationController({ value: model, props: fieldProps, baseRules, validationOptions })

if (!props.useVuetifyValidation) {
  useValidatable(controller.validateOnSubmit, controller.clearValidation)
}

const hasError = computed(() => !props.disableErrorHandling && (controller.hasError.value || props.hasError))
const errors = computed(() => controller.errors.value)
// Binder ensuite error/error-messages/messages/blur/change/submit dans le template
```
