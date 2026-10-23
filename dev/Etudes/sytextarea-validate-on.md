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

1. `src/composables/unifyValidation/useVuetifyValidation.ts` : élargir le type du paramètre `validateOn` (`'input' | 'blur' | 'submit'`) à `VTextarea['validateOn']` (Vuetify 3.12 gère aussi `lazy`, `eager`, `invalid-input` et leurs combinaisons).
2. `src/composables/unifyValidation/useValidation.ts` : ajouter un paramètre **optionnel** `validateOn?: Ref<…>`, utilisé à la place de `isValidateOnBlur ? 'blur' : 'input'` lorsqu'il est défini ; repli sur le calcul actuel sinon.
3. `src/components/SyTextArea/composables/useSyTextAreaValidation.ts` : transmettre `computed(() => props.validateOn)`.
4. `SyTextArea.vue` : passer la valeur par défaut de `'eager input'` à `undefined`. Conserver `'eager input'` ferait passer le comportement par défaut actuel (validation au blur) à une validation à la saisie dès le montage.
5. Documenter : la prop ne s'applique qu'avec `use-vuetify-validation` et prime sur `isValidateOnBlur`.
6. Stories : retirer `validateOn` des `exclude` des controls, ajouter une story d'exemple, revoir le test « ne présente pas de validateOn sans effet » (`SyTextArea.stories.spec.ts`).
7. Tests de régression : `validate-on="submit"` ne valide ni à la saisie ni au blur ; sans `validateOn`, le comportement reste celui de `isValidateOnBlur`.

Impacts :

- Les 15 autres composants qui utilisent `useValidation` (SyTextField, SySelect, DatePicker, PhoneField…) ne passent pas le nouveau paramètre : aucun changement de comportement.
- Mode Synapse (par défaut) : non couvert. `useCustomValidation` ne connaît que blur / input via `isValidateOnBlur` ; gérer `lazy` / `eager` / `submit` imposerait de retravailler ce composable partagé par tous les champs.
- Le `validate-on` d'un `VForm` parent reste ignoré (le pont passe toujours une valeur explicite à Vuetify). Le corriger modifierait le comportement de tous les champs.

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
