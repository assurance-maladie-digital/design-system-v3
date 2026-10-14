# Review détaillée — PR `feat/syform-tests` (validation unifiée)

Base de comparaison : `origin/dev` (`77381ab3`), merge-base `git diff origin/dev...HEAD`.
Périmètre : 52 fichiers modifiés, ~3 747 insertions / ~220 suppressions, 16 commits.
Sources de vérification : code de la branche, `vuetify@3.12.2` (`lib/composables/validation.js`, `lib/composables/form.js`), tests ajoutés dans la PR, `SyForm.mdx`.

---

## 0. Comportement Vuetify vérifié (fondements des constats)

Vérifié dans `node_modules/.pnpm/vuetify@3.12.2.../lib/composables/validation.js` :

- `useValidation()` **enregistre toujours** un item dans le `VForm` parent (`form.register` dans `onBeforeMount`), quelles que soient les `rules` — même avec un tableau vide.
- `isValid` est un `computed` : `false` si `props.error` ou `props.errorMessages?.length` ; `true` si `!props.rules.length` ; sinon dépend de `isPristine`/`internalErrorMessages`.
- `validate()` évalue les `rules` **sans exclure** `readonly` ni `disabled`.
- `reset()` (appelé par `VForm.reset()`) écrit `model.value = null` — donc écrit dans le `modelValue` proxifié.
- Le `uid` d'enregistrement = `props.name ?? unref(id)` ; il est lu **live** dans `form.update(uid.value, ...)`.

Vérifié dans `lib/composables/form.js` (`createForm`) :

- `items` expose `{ id, validate, reset, resetValidation, vm: markRaw(vm), isValid, errorMessages }` — **pas d'`isPristine`**.
- `register` : `if (items.some(item => item.id === id)) consoleWarn('Duplicate input name')` puis `push` quand même.
- `update` : `items.find(item => item.id === id)` — ne met à jour que le **premier** item portant cet `id`.
- `validate()` retourne `errors: [{ id, errorMessages }]` — uniquement les erreurs issues des `rules`.

Conséquence structurelle de la PR : quand `useVuetifyValidation` est passé en `Ref` (cas de quasi tous les composants : `toRef`/`computed`), la branche `params.useVuetifyValidation !== false` de `useValidation` (`useValidation.ts:135`) instancie **toujours** un validator Vuetify → chaque champ unifié ajoute un item dans le `VForm`, même en mode Synapse. C'est assumé par la PR (commentaire `useValidation.ts:136-138`) et c'est ce qui permet aux erreurs injectées (`error-messages`, `has-error` → prop `error`) de remonter dans `form.items[].isValid`.

---

## 1. Findings ordonnés par sévérité

### 1.1 [HIGH] `v-model` `false` alors que la soumission passe — champ `readonly` + erreur injectée

**Fichier** : `src/components/Customs/SyForm/SyForm.vue`

```ts
// l.23 — exclut disabled UNIQUEMENT
const enabledVuetifyItems = computed(() => form.value?.items.filter(({ vm }) => !vm.props.disabled) ?? [])

// l.29-30 — statut dérivé de ces items
if (enabledVuetifyItems.value.some(({ isValid }) => isValid === false)) return false

// l.49-51 — exclut disabled ET readonly
const hasBlockingVuetifyError = () => (form.value?.items ?? []).some(({ isValid, vm }) =>
	isValid === false && !vm.props.disabled && !vm.props.readonly,
)
```

**Mécanisme vérifié** :

1. Champ `readonly` (Synapse ou Vuetify, l'item fantôme existe dans les deux cas) avec `error-messages` ou `has-error` injectés.
2. Côté Vuetify (`validation.js`) : `isValid` du validator → `false` (prop `error`/`errorMessages`).
3. `form.update()` propage `isValid: false` dans `form.items`.
4. `enabledVuetifyItems` inclut l'item (readonly non filtré) → `vuetifyFieldsStatus` → `false` → `getFormValue` → **`v-model = false`**.
5. Au submit : `hasBlockingVuetifyError` ignore l'item (readonly exclu) ; `vuetifyValidateResult.errors` ne contient pas l'erreur injectée (erreurs de `rules` uniquement, cf. `form.js`) → **`isValid: true`**.

**Contradiction factuelle** : `SyForm.mdx` l. 121 et 131 affirme « Message affiché, ne bloque pas » pour les erreurs injectées sur champs `readonly` (Synapse et Vuetify). Or `v-model = false` grise un bouton `:disabled="valid !== true"` — la justification même de l'exclusion des `disabled` (`SyForm.mdx` l. 106-107) s'applique ici.

**Contrainte de correction** : ne pas exclure `readonly` naïvement de `enabledVuetifyItems` — les erreurs de **règles** d'un champ `readonly` doivent rester comptées (activateur `DatePicker` en mode calendrier, documenté `SyForm.mdx` l. 140-142). Il faut distinguer l'invalidité « injectée » de l'invalidité « règle » ; les items n'exposent pas `isPristine`, mais `item.errorMessages` vs `vm.props.errorMessages` permet de détecter une invalidité purement injectée (vacuité pour `has-error` seul).

**Tests manquants** : readonly + `error-messages`/`has-error` en observant `v-model` ET `submit`.

---

### 1.2 [HIGH] `SyInputSelect` : `disabled` non exclu — bloque la soumission

**Fichier** : `src/components/Customs/Selects/SyInputSelect/SyInputSelect.vue`

```ts
// l.198 — validateField court-circuite readonly mais pas disabled
if (props.readonly) { ... return true }

// l.253-258 — valide enregistré auprès du SyForm
computed(() => {
	if (props.readonly) return true
	if (localErrorMessages.value.length > 0) return false
	return !(props.required && !selectedItem.value)
}),
```

**Mécanisme vérifié** : `useValidatable` est appelé avec `active: true` (l. 264). Un `SyInputSelect` `disabled required` vide → `valide === false` dès le mount → `customComponentsValide` → `v-model` à `null` ; à la soumission `validateOnSubmit` → `validateField` (pas de garde `disabled`) → règle required en échec → **`isValid: false`**.

C'est exactement l'invariant que la PR fait respecter partout ailleurs (« Un champ désactivé ne bloque pas la soumission », `SyForm.mdx` l. 102-107) et qui est testé pour `SyTextField`/`VTextField` (`SyForm.disabledVuetifyFields.spec.ts`) — mais pas pour `SyInputSelect`.

**Correction** : ajouter `props.disabled` aux gardes de `validateField` et du `computed` `valide`. Ajouter un test `SyInputSelect disabled` dans `SyInputSelect.syForm.spec.ts`.

**Détail connexe** : `!selectedItem.value` (l. 257) est un test de vérité — une valeur d'item falsy (`0`, `false`) compterait comme « vide ». Préférer `selectedItem.value == null`.

---

### 1.3 [MEDIUM] État Vuetify périmé après bascule `useVuetifyValidation` `true → false`

**Fichier** : `src/composables/unifyValidation/useValidation.ts` (pas de watch sur `isCustomMode`)

**Contre-exemple dans la même PR** : `src/components/DatePicker/composables/useDatePickerValidation.ts:410` ajoute `watch(isCustomMode, () => clearValidation())` — le correctif n'est appliqué qu'au DatePicker, pas au socle.

**Mécanisme vérifié** : après bascule Vuetify → Synapse, `vuetifyErrors` n'est jamais vidé (`errors` computed l. 214-223 le fusionne quand même) et `item.isValid` du `VForm` garde sa dernière valeur (`form.update` n'est re-déclenché que par le watch interne du validator sur `isValid`/`errorMessages`, or le validator n'est pas réinitialisé). Un champ qui avait une erreur Vuetify affichée avant la bascule la conserve en mode Synapse, et `vuetifyFieldsStatus` peut rester `false` → `v-model` fantôme.

**Correction** : `watch(isCustomMode, () => clearValidation())` dans `useValidation` — `clearValidation()` appelle `vuetifyValidator?.resetValidation()` (l. 269), ce qui repasse `isPristine` à `true` et repousse `isValid` via le watch de `useVuetifyValidation.ts:55`.

---

### 1.4 [MEDIUM] Collision d'ids `VForm` sur labels identiques

**Fichier** : `src/composables/unifyValidation/useValidation.ts:139`

```ts
const vuetifyName = toValue(params.useVuetifyValidation) ? params.label?.value : undefined
```

Le figer au setup est correct (le `name` sert d'`id` d'enregistrement, `form.update` le lit live — cf. commentaire). Mais deux champs en mode Vuetify avec le **même label** produisent le même `id` :

- `consoleWarn('Duplicate input name')` (`form.js`), puis les deux items sont poussés ;
- `update(id)` ne met à jour que le **premier** item trouvé → `isValid` du second reste `null` → `vuetifyFieldsStatus` → `null` → **`v-model` bloqué à `null`** définitivement ;
- aggravé : `ignoreDisabledVuetifyFields` (`SyForm.vue:62`) compare les `id` — une erreur d'un champ actif peut être excusée par un champ `disabled` de même label.

Cas sans label : `name` undefined → `uid` unique Vuetify → pas de collision. Le risque est limité aux labels identiques non vides.

**Correction** : suffixer l'id (`label + '-' + useId()`), ou documenter la contrainte « labels uniques » en mode Vuetify.

---

### 1.5 [RÉTRACTÉ] `SyForm.reset()` et les `modelValue` readonly — pas de bug

Constat initial : `VForm.reset()` appelle `item.reset()` qui écrit `model.value = null` dans le modelValue proxifié → warning Vue « target is readonly » redouté sur les `modelValue` readonly (`DatePicker.vue:326`, `toRef(props, 'modelValue')`…).

**Réfuté par vérification du source Vuetify et par test** (`SyForm.resetReadonlyModelValue.spec.ts`, vert) : `useProxiedModel` (`lib/composables/proxiedModel.js`) écrit dans un `internal` ref puis appelle `vm.emit('update:modelValue', newValue)` — l'événement remonte au parent du champ via les listeners vnode, **sans jamais écrire dans le computed readonly** exposé en prop. Aucun warning, et le reset propage correctement `null` au `v-model` parent. Le test est conservé comme garde anti-régression.

---

### 1.6 [LOW] `has-error` ne bloque que via l'item VForm fantôme

**Fichier** : `src/composables/unifyValidation/useCustomValidation.ts:146-158`

`validateOnSubmit` vérifie `hasExternalErrors` mais pas `hasError`. Le blocage par `has-error` ne fonctionne que parce que le validator Vuetify (prop `error` → `isValid false`) est instancié dès que `useVuetifyValidation` est un `Ref` — invariant implicite et fragile : un appelant passant le littéral `false` (autorisé par l'union de types, `useValidation.ts:99-104`) obtient une erreur affichée mais une soumission qui passe, en contradiction avec `useValidation.validate()` (l. 195, 205, 210) et `SyForm.mdx` l. 152.

**Correction** : ajouter `hasError?: Ref<boolean>` aux `UseCustomValidationOptions` et le vérifier dans `validateOnSubmit` / `valide`.

---

### 1.7 [LOW] Points résiduels

- **`DatePicker.vue:678`** : `&& (props.errorMessages?.length ?? 0) === 0` ajouté au `validateOnSubmit` noCalendar ne vérifie pas `hasError` ; probablement redondant si `error-messages` est relayé au `DateTextInput` (le `useCustomValidation` sous-jacent vérifie déjà `externalErrors`).
- **`SyInputSelect`** : enregistrement `useValidatable` nouveau sans test `disabled`/`readonly`.
- **`useValidation.ts:116`** : le devWarn « required sans règle Vuetify » se ré-émet à chaque transition `false → true` de la condition — acceptable mais répétitif sur bascules répétées.
- **`SyForm.spec.ts:1099-1107`** : le test « VForm non monté » mutote `vm.$.setupState.form` — dépend de l'implémentation interne de `@vue/test-utils`, fragile.

---

## 2. Points vérifiés — corrects (pas d'action)

| Point | Vérification |
|---|---|
| `unregister` sans fallback `validateOnSubmit` (`useFormValidation.ts:47-54`) | `componentRef` est un `reactive` stable (`useValidatable.ts:65`) et `register` déduplique par `includes` → `indexOf` suffit. Le fallback ne pouvait matcher que si deux champs partageaient la même fonction — risque réel supprimé. |
| `emptyValidationResult` extrait (`unifyValidation/emptyValidationResult.ts`) | Déduplication propre via re-export dans `validationResultFactories.ts`. |
| `mergeMessages` + `.filter(Boolean)` (`messageUtils.ts:34`) | Les règles Vuetify renvoyant `false` produisent `''` — filtré correctement avant dédupe/limitation. |
| Message générique pour règle `false` (`useVuetifyValidation.ts:65`, `vuetifyRuleEvaluation.ts:16`) | Aligné sur les deux chemins (natif et pont) ; testé `SyTextField.spec.ts`. |
| Aliases `noWeekend`/`noBeforeToday` (`useFieldValidation.ts:184`, `206`) | Étaient documentés (`documentationValidationProps` avant la PR les listait) mais jamais implémentés → no-op silencieux corrigé. Types mis à jour (`useValidation.ts` legacy). |
| `parseDate` retourne une copie (`useFieldValidation.ts:42-43`) | Corrige une mutation réelle : les règles appellent `setHours()` sur l'objet `Date` du consommateur. `formatReferenceDate` en `fr-FR` OK SSR. |
| `vuetifyName` figé (`useValidation.ts:139-149`) | Nécessaire : `form.update` lit `uid` live ; un `name` réactif changerait l'`id` ciblé sans ré-enregistrement → état périmé. |
| `unregister`/`register` bascule `enabled` (`useCustomValidation.ts:206` + `useValidatable.ts:88-97`) | Le watch `active` enregistre/désenregistre correctement avec la même référence. |
| `ignoreDisabledVuetifyFields` (`SyForm.vue:58-63`) | `errors` contient les `id` des items en échec de règle (`form.js`) ; l'excuse par `id` + `resetValidation` des items disabled retire le message — conforme à la doc. |
| `await nextTick()` avant `hasBlockingVuetifyError` (`SyForm.vue:74`) | Le `watch(items)` du VForm est `flush: 'post'` et le watch interne du validator `flush: 'pre'` → un `nextTick` suffit à propager `isValid`. |
| `validate()` garde pré-mount (`SyForm.vue:68`) | Retourne `false` au lieu de lever `form.value!` — testé. |
| `NirField` `required && displayKey` (`useNirValidation.ts:213`) | La clé masquée n'est plus requise — correct sémantiquement. `isValidating` mort retiré. |
| `PasswordField` `alertMessage` deprecated (`usePasswordFieldValidation.ts:88`) | Jamais alimenté avant non plus — remplacer `ref` partagée par `ref('')` nouvelle conserve la compat sans faux signal. |
| `useSySelectValidation` `isValidateOnBlur ?? true` | Aligné sur `validationPropsDefaults` — corrige un vrai écart de défaut. |
| `SyRadioGroup` retrait du fallback `focused` | `focused: Ref<boolean>` est requis par la signature et fourni par `SyRadioGroup.vue:85` — pas de régression. |
| `PhoneField` `useVuetifyValidation: toRef` + `modelValue: phoneNumber` (ref writable) | Permet la bascule et la soumission Vuetify ; le test `PhoneField.vuetifyValidation.spec.ts` couvre les deux modes. |

---

## 3. Tests TDD écrits pour les findings — résultats mesurés

Specs ajoutées (commit à venir) : `SyForm.readonlyFields.spec.ts`, `SyForm.duplicateVuetifyNames.spec.ts`, `SyForm.resetReadonlyModelValue.spec.ts`, `useValidation.hasErrorFormSubmit.spec.ts`, + cas ajoutés dans `SyForm.useVuetifyValidationSwitch.spec.ts` et `SyInputSelect.syForm.spec.ts`.

Résultat sur le code actuel : **8 échecs / 14 réussites** — rouge confirmé pour les findings, vert pour les gardes.

| Finding | Test | Résultat actuel |
|---|---|---|
| 1.1 readonly + erreur injectée | `v-model` attendu `true` (×3 : Synapse, Vuetify, natif) | **ÉCHEC** (`false`) — submit passe déjà |
| 1.1 readonly + règle en échec | submit `false` + `v-model` `false` (×2) | vert (verrouillage du comportement documenté) |
| 1.2 `SyInputSelect` `disabled` | submit attendu `isValid: true` | **ÉCHEC** (`false`) |
| 1.3 bascule Vuetify→Synapse | erreur effacée + submit `true` + `v-model` `true` | **ÉCHEC** (erreur et `v-model` figés) |
| 1.4 labels identiques | submit bloqué par le champ actif + pas de « Duplicate input name » | **ÉCHEC** (×2 : submit passe, 2 warnings) |
| 1.5 reset + modelValue readonly | aucun warning `readonly` | vert → finding **rétracté** (cf. §1.5) |
| 1.6 `has-error` + `useVuetifyValidation: false` littéral | submit attendu `isValid: false` | **ÉCHEC** (`true`) |
