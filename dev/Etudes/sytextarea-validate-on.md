## SyTextArea : la prop `validateOn` est sans effet

Point relevé lors de l'audit des stories de validation, non corrigé (changement d'API).

Suivi : [#2699](https://github.com/assurance-maladie-digital/design-system-v3/issues/2699).

### Problème

- [ ] **medium** — La prop publique `validateOn` est déclarée (`src/components/SyTextArea/types.ts:16`) avec la valeur par défaut `'eager input'` (`SyTextArea.vue:28`), mais n'est jamais lue.
- Elle figure dans `wrapperOnlyPropKeys` (`SyTextArea.vue:66`) : elle n'est donc pas non plus transmise au `VTextarea`.
- Le moment de validation est figé par `useValidation` (`src/composables/unifyValidation/useValidation.ts:167`) : `isValidateOnBlur ? 'blur' : 'input'`.
- Conséquence : `validate-on="submit"` / `"lazy"` / `"eager"` n'a aucun effet, la doc et l'autocomplétion TypeScript annoncent une API qui ne fonctionne pas.

### Origine

Régression introduite par `6ba17d94f` (#2415, « expose Vuetify props on SyTextArea and DialogBox ») :

- avant : `<VTextarea :validate-on="validateOn" :rules="props.useVuetifyValidation ? mergedVuetifyRules : undefined">` — la prop fonctionnait en mode Vuetify ;
- après : les règles sont évaluées par le pont `useValidation` → `useVuetifyValidation`, et `validateOn` a été ajoutée à `wrapperOnlyPropKeys` sans être recâblée.

Transmettre la prop au `VTextarea` ne suffirait pas : il ne reçoit plus de `rules`.

### Solution A — Transmettre la prop (mode Vuetify uniquement) — recommandée

1. `src/composables/unifyValidation/useVuetifyValidation.ts` : élargir le type du paramètre `validateOn` (`'input' | 'blur' | 'submit'`) à `VTextarea['validateOn']` (Vuetify 3.12 gère aussi `lazy`, `eager`, `invalid-input` et leurs combinaisons). Vuetify n'exporte pas son type `ValidateOn` : reprendre le type déjà utilisé par `types.ts:16`, en `import type`.
2. `src/composables/unifyValidation/useValidation.ts` : ajouter un paramètre **optionnel** `validateOn?: Ref<…>`, utilisé à la place de `isValidateOnBlur ? 'blur' : 'input'` lorsqu'il est défini ; repli sur le calcul actuel sinon. Le pont doit **toujours** transmettre une valeur explicite à Vuetify, jamais `undefined` (voir « Points de vigilance »).
3. `src/components/SyTextArea/composables/useSyTextAreaValidation.ts` : transmettre `computed(() => props.validateOn)`.
4. `SyTextArea.vue` : passer la valeur par défaut de `'eager input'` à `undefined`. Conserver `'eager input'` ferait passer le comportement par défaut actuel (validation au blur) à une validation à la saisie dès le montage.
5. Documenter : la prop ne s'applique qu'avec `use-vuetify-validation` et prime sur `isValidateOnBlur`. Ajouter une note dans `dev/ReleasesAlerts/` : un consommateur qui passe déjà `validate-on` (ignoré depuis #2415) verra son moment de validation changer.
6. Stories : retirer `validateOn` des `exclude` des controls (`Validation.stories.ts:14`, `SyTextArea.stories.ts:14` et `:18`), ajouter une story d'exemple, et inverser les tests « ne présente pas de validateOn sans effet » et « masque validateOn des Controls » (`SyTextArea.stories.spec.ts:123-134`), qui échoueront volontairement.
7. Tests : voir « Garde-fous ».

Impacts :

- Les 15 autres composants qui utilisent `useValidation` (SyTextField, SySelect, DatePicker, PhoneField…) ne passent pas le nouveau paramètre : aucun changement de comportement.
- Mode Synapse (par défaut) : non couvert. `useCustomValidation` ne connaît que blur / input via `isValidateOnBlur` ; gérer `lazy` / `eager` / `submit` imposerait de retravailler ce composable partagé par tous les champs.
- Le `validate-on` d'un `VForm` parent reste ignoré (le pont passe toujours une valeur explicite à Vuetify). Le corriger modifierait le comportement de tous les champs.

### Points de vigilance (solution A)

Comportement de Vuetify 3.12.2 (`node_modules/vuetify/lib/composables/validation.js`, `useValidation`) :

| `validateOn` | Au montage | À la saisie | Au blur |
|---|---|---|---|
| `input` | validation silencieuse | oui | oui |
| `blur` | validation silencieuse | non | oui |
| `submit` | validation silencieuse | non | non |
| `lazy` (= `input lazy`) | aucune (`isValid` vaut `null` tant que le champ est vierge) | oui | oui |
| `eager` (= `input eager`) | **validation visible** | oui | oui |
| `invalid-input` | validation silencieuse | seulement si le champ est invalide | oui |

`lazy` ne fait que supprimer la validation au montage : il ne retarde pas la validation jusqu'à la soumission.

1. **Valeur par défaut.** Garder `'eager input'` afficherait les erreurs dès le montage (`onMounted` → `validate(!eager)`) : c'est le risque principal, traité par l'étape 4. Un consommateur qui passe explicitement `validate-on="eager input"` obtiendra ce comportement, qui est celui de Vuetify.
2. **Consommateurs qui passent déjà `validateOn`.** La prop est ignorée depuis #2415 : avec `validate-on="submit"` ou `"lazy"`, ils voient aujourd'hui une validation au blur. Après le correctif, le comportement change. C'est le comportement attendu (celui d'avant #2415), mais il est observable : note `ReleasesAlerts` (étape 5).
3. **Ne jamais transmettre `undefined` à Vuetify.** Vuetify calcule `props.validateOn ?? form.validateOn ?? 'input'`. Si le pont passait `undefined` quand la prop n'est pas renseignée, le `validate-on` d'un `VForm` parent, ou à défaut `input`, s'appliquerait à **tous** les champs qui utilisent `useValidation`. Le repli sur `isValidateOnBlur ? 'blur' : 'input'` doit rester explicite.
4. **`submit`.** Au montage, la validation est silencieuse et le validator reste vierge (`isPristine`) : le watcher du pont (`useVuetifyValidation.ts:55-66`) vide les erreurs, ce qui est le comportement attendu. `validateOnSubmit()` du composant appelle `validate()` sans mode silencieux, et `VForm.validate()` appelle le `validate` enregistré par le validator : les deux devraient afficher les erreurs. À démontrer par test.
5. **Bascule de mode.** `customValidator` n'est `null` que si `useVuetifyValidation === true` (`useValidation.ts:171`). Passé en Ref, il est créé avec `enabled: isCustomMode` et des règles vides en mode Vuetify (`whenCustomMode`) : ses watchers de focus et de valeur (`useCustomValidation.ts:247-264`), qui lisent `isValidateOnBlur`, valident alors une liste vide sans effet. En mode Synapse, l'item Vuetify « fantôme » reçoit `rules: []` : même avec `eager`, rien n'est affiché. Risque faible, à couvrir par un test de bascule avec `validateOn` défini.
6. **Types.** Élargir le paramètre est sûr pour les appelants existants : le `computed(() => … ? 'blur' : 'input')` de `useValidation` reste assignable. L'import du type Vuetify doit être un `import type` (Vuetify est de toute façon externe au bundle).

### Garde-fous

- Non-régression sans `validateOn` : validation au blur par défaut, à la saisie avec `isValidateOnBlur: false`, et `validate-on` d'un `VForm` parent toujours sans effet.
- `validate-on="submit"` : ni la saisie ni le blur ne valident ; `validateOnSubmit()` et `VForm.validate()` affichent les erreurs.
- `validate-on="lazy"` : aucune erreur au montage, validation à la saisie.
- `validate-on="eager input"` : erreur visible au montage sur un champ requis vide.
- Bascule `useVuetifyValidation` true ↔ false avec `validateOn` défini.
- Relancer les tests de `useValidation` et `useVuetifyValidation`, ceux des composants qui les utilisent (SyTextField, SySelect, DatePicker, PhoneField…) et le test a11y de SyTextArea.

### Solution B — Déprécier la prop

1. `types.ts` : JSDoc `@deprecated` sur `validateOn`, renvoyant vers `isValidateOnBlur` (et `useVuetifyValidation`).
2. Doc (`SyTextArea.mdx`) et argTypes : mentionner la dépréciation.
3. Optionnel : `devWarn` en dev lorsque la prop est renseignée.
4. Suppression dans une version majeure.

Impacts :

- Strictement limité au composant.
- Le mode Vuetify perd définitivement les options `lazy` / `eager` / `submit`, qui existaient avant #2415.

### Décision

- [ ] À arbitrer : solution A (transmission en mode Vuetify) ou solution B (dépréciation). Solution A recommandée dans #2699.
