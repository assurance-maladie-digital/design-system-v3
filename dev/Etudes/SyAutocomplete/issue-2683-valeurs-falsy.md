# Étude — Issue #2683 : les valeurs `0` et `false` sont traitées comme une absence de valeur

> Issue : [Anomalie fonctionnelle majeure — [SyAutocomplete][SyRadioGroup] Les valeurs 0 et false sont traitées comme une absence de valeur](https://github.com/assurance-maladie-digital/design-system-v3/issues/2683)
> Impact déclaré : 🔴 Bloquant
> Statut de l'étude : **les 3 défauts sont confirmés dans le code**, le périmètre réel est légèrement plus large que celui décrit.

## Résumé

Des tests de vérité de la forme `!value` (au lieu de `value == null`) traitent `0` et `false` comme une absence de sélection. Trois défauts identifiés par le rapporteur, tous vérifiés :

| # | Défaut | Localisation | Statut |
|---|---|---|---|
| 1 | `SyAutocomplete` : `0`/`false` ne s'affichent pas comme sélectionnés | `SyAutocomplete.vue` l.147 et l.229 | ✅ Confirmé |
| 2 | La règle `required` refuse `false` | `useFieldValidation.ts` l.133 | ✅ Confirmé |
| 3 | Les types n'acceptent pas `boolean` | `SyAutocomplete/types.ts`, `SyRadioGroup.vue`, + autres composants | ✅ Confirmé (périmètre élargi) |

---

## Défaut 1 — `SyAutocomplete` : valeur sélectionnée non affichée

### Cause

`src/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue` :

```ts
// ligne 144-153 — syncSearchFromValue
if (!selected.value) {        // ← 0 et false passent ici
    search.value = ''
    return
}
```

```ts
// ligne 228-236 — isItemSelected
if (!selected.value) return false   // ← idem : aria-selected reste false
```

Le `v-model` reçoit bien la valeur (l'émission est correcte dans `useSelectionLogic.ts`), mais :

- le champ texte reste vide (`syncSearchFromValue` vide `search`) ;
- l'option n'est pas marquée `aria-selected="true"` / classe `active` dans la liste.

### Référence interne

`SySelect.vue` (l.589) fait déjà le bon test :

```ts
if (selectedItem.value === null || selectedItem.value === undefined) return false
```

Et `SyAutocomplete` lui-même utilise déjà `selected.value != null` dans `hasSelectionToClear` (l.211). Les `!selected.value` sont donc des incohérences internes, pas un choix de conception.

### Correction

Remplacer les deux tests par `selected.value === null || selected.value === undefined` (cohérent avec `SySelect`).

Point annexe : `getItemKey` (l.238-242) ne retourne que `string | number` — une valeur `boolean` retombe sur l'index comme clé `:key`. Ça fonctionne mais la clé est moins stable ; à étendre avec `boolean`.

---

## Défaut 2 — la règle `required` refuse `false`

### Cause

`src/composables/rules/useFieldValidation.ts`, l.129-140 :

```ts
case 'required':
    return createValidationResult(
        (typeof value === 'string' && value.trim() !== '')
        || (typeof value === 'number' && !Number.isNaN(value))
        || (typeof value === 'boolean' && value === true)   // ← false refusé
        || (value instanceof Date)
        || (Array.isArray(value)
            ? value.length > 0
            : (typeof value === 'object' && value !== null)),
        ...
    )
```

La règle est **partagée** : elle est injectée par les composables de validation de `SyRadioGroup`, `SyAutocomplete`, `SySelect`, `SelectBtnField`, `SyCheckBoxGroup`, etc. (`type: 'required'` dans chaque `useXxxValidation`).

### Point clé : `SyCheckbox` a déjà contourné le problème

`src/components/Customs/SyCheckbox/composables/useSyCheckboxValidation.ts` utilise une règle `custom` (`value === true`) plutôt que la règle `required` générique. Son commentaire (l.21-25) documente même l'intention inverse du code actuel :

> *« On utilise donc une règle `custom` plutôt que la règle `required` générique, qui considère `false` comme une valeur valide. »*

→ Changer la règle partagée pour accepter `false` est **sûr** : le seul composant qui a besoin de refuser `false` (case « J'accepte ») ne passe déjà plus par cette règle.

### Correction

```ts
|| (typeof value === 'boolean')
```

---

## Défaut 3 — les types excluent `boolean`

### Confirmé dans l'issue

- `src/components/Customs/Selects/SyAutocomplete/types.ts` :
  ```ts
  export type SelectValue = Record<string, unknown> | string | number | null | undefined
  export type SelectArray = Array<Record<string, unknown> | string | number>
  ```
- `SyRadioGroup.vue` : `modelValue?: PropertyKey | null` et `options?: Array<{ label: string, value: PropertyKey }>` — or `PropertyKey = string | number | symbol`, pas `boolean`. `useSyRadioGroupValidation.ts` type aussi `model` en `Ref<PropertyKey | null>` et `getAriaChecked(value: PropertyKey)`.

### Non cités dans l'issue mais également concernés

| Composant | Type à corriger |
|---|---|
| `SelectBtnField` (`types.d.ts`) | `SelectBtnValue`, `SelectBtnItem.value` : `string \| number` uniquement |
| `SySelect` (`SySelect.vue` l.31) | `modelValue` : pas de `boolean` |
| `SyCheckBoxGroup` (`types.ts`) | `Option.value` et `modelValue` : `string \| number` uniquement |

---

## Défaut annexe — `SelectBtnField.vue` l.259 (soulevé dans l'issue, confirmé)

```ts
// handleInitFocus — auto-sélection au focus clavier en mode simple
if (!props.multiple && !internalValue.value && item) {
    toggleItem(item)
}
```

Avec `0` (ou `false`) sélectionné, `internalValue.value` est falsy → le focus clavier (Tab / flèches) sur une autre option la sélectionne automatiquement et **écrase la sélection existante**.

Correctif : `internalValue.value === null || internalValue.value === undefined` (ou `== null`).

Le reste du composant est sain : `isSelected` utilise `===`, `getCurrentIndex` se base sur `aria-selected`.

---

## Autres occurrences de `!value` recensées (probablement hors scope)

| Fichier | Ligne | Évaluation |
|---|---|---|
| `RangeField/RangeField.vue` | 39 | `!model.value` — plage de nombres, `0` n'est pas une valeur métier plausible mais à revérifier |
| `ContextualMenu/ContextualMenu.vue` | 83 | hash d'URL — hors scope |
| `DatePicker/DateTextInput/DateTextInput.vue` | 778 | dates — `0`/`false` invalides par nature |
| `DatePicker/utils/dateFormattingUtils.ts` | 127 | idem |
| `SySelect.vue` | 398, 586 | dans des branches `multiple` où la valeur est un tableau — `![]` est `false`, OK |

`SySelect` en runtime est déjà correct (tests `null`/`undefined` explicites l.420, 444, 589) ; seul son typage exclut `boolean`.

---

## Plan de correction proposé

1. **`SyAutocomplete.vue`** : remplacer les deux `!selected.value` par un test `null`/`undefined` explicite ; étendre `getItemKey` à `boolean`.
2. **`useFieldValidation.ts`** : accepter `false` dans la règle `required` (`typeof value === 'boolean'`).
3. **Types** : ajouter `boolean` à `SelectValue`, `SelectArray`, `SyRadioGroup` (`modelValue`, `options[].value`, `getAriaChecked`, `useSyRadioGroupValidation`), `SelectBtnValue` / `SelectBtnItem`, `SySelect.modelValue`, `Option` / `modelValue` de `SyCheckBoxGroup`.
4. **`SelectBtnField.vue`** : corriger le test l.259.
5. **Tests de régression** (boîte noire, cf. §7 AGENTS.md) :
   - `SyAutocomplete.spec.ts` : sélection d'une option `0` et `false` → champ affiche le libellé + `aria-selected="true"` ; valeur initiale `0`.
   - `SyRadioGroup.spec.ts` : `required` + choix `false` → pas d'erreur.
   - `useFieldValidation.spec.ts` : `required` accepte `false`, refuse `null`/`undefined`/`''`/`[]`.
   - `SelectBtnField.spec.ts` : focus clavier avec `0` sélectionné n'écrase pas la sélection.
6. **Changement de contrat** : documenter dans `releasesAlerts/vX.X.X/` avant la fin de la PR (§9 AGENTS.md). Comportement observable modifié : la règle `required` accepte désormais `false` — les consommateurs qui comptaient sur ce refus doivent utiliser une `customRule` (`value === true`), comme le fait déjà `SyCheckbox`.

### Validation ciblée (§4 AGENTS.md)

```bash
pnpm vitest run src/components/Customs/Selects/SyAutocomplete \
  src/components/Customs/SyRadioGroup \
  src/components/Customs/Selects/SelectBtnField \
  src/components/Customs/Selects/SySelect \
  src/components/Customs/SyCheckBoxGroup \
  src/composables/rules
pnpm vue-tsc -p tsconfig.app.json --noEmit
pnpm exec eslint <fichiers modifiés>
```

Ajouter les `*.a11y.spec.ts` des composants dont le markup change (a priori aucun markup modifié — seuls des attributs `aria-selected` changent de valeur, déjà couverts par les tests existants).
