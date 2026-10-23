# Étude #2683 : valeurs `0` et `false` traitées comme une absence de valeur

## Problème

Issue #2683 : dans les composants de sélection, les valeurs `0` et `false` sont parfois traitées comme « aucune sélection », alors que ce sont des choix valides (liste numérique `0, 1, 2…`, choix « Vrai » / « Faux »).

**Signalement :** version 1.1.2, projet IPDO_X, impact déclaré bloquant. Le code en cause est identique sur `dev` (1.2.0, `b6203901`).

L'issue décrit trois défauts et liste des composants « à vérifier ». Cette étude reprend chaque point, le mesure, et tranche le périmètre du correctif.

## Constats mesurés

Mesures réalisées avec Vitest + happy-dom sur `dev` (`b6203901`), via un test temporaire non commité : montage du composant, valeur initiale du `v-model` ou sélection, lecture du DOM (`input.value`, `aria-selected`, cases cochées) et appel de `validateOnSubmit()`.

### Défaut 1 : `SyAutocomplete` en sélection simple n'affiche pas `0` / `false` (confirmé)

| `v-model` | Texte du champ | Option marquée (`aria-selected`) |
|---|---|---|
| `0` (valeur initiale) | vide | aucune |
| `0` (choisi via `selectItem`, émis `0`) | vide | — |
| `false` (valeur initiale) | vide | aucune |
| `false` (choisi via `selectItem`, émis `false`) | vide | — |
| `1` / `true` (témoins) | « Un » / « Vrai » | l'option correspondante |

Le `v-model` reçoit bien la valeur ; seul l'affichage est faux. Cause, `SyAutocomplete.vue` :

- `syncSearchFromValue` (ligne 147) : `if (!selected.value) { search.value = ''; return }` ;
- `isItemSelected` (ligne 229) : `if (!selected.value) return false`.

**Mode multiple non concerné (mesuré) :** avec `[0]` ou `[false]`, la puce et l'option sélectionnée s'affichent correctement, puisque le test porte sur le tableau.

**`SySelect` non concerné (mesuré) :** `0` et `false` s'affichent et l'option est marquée sélectionnée. Son `isItemSelected` teste déjà `null` / `undefined` (`SySelect.vue:595`). Les autres tests `!selectedItem.value` de `SySelect` (lignes 404 et 592) ne s'exécutent qu'en mode multiple, sur un tableau.

### Défaut 2 : la règle `required` refuse `false` (confirmé, périmètre plus large que l'issue)

`composables/rules/useFieldValidation.ts:133` n'accepte un booléen que s'il vaut `true`. Résultat de `validateOnSubmit()` avec la prop `required` :

| Composant | `false` | `0` | `true` / `1` |
|---|---|---|---|
| `SyRadioGroup` | refusé, « Le champ Debug est requis. » (bouton coché) | accepté | accepté |
| `SyAutocomplete` (simple) | refusé | accepté | accepté |
| `SySelect` (simple) | **refusé** (non testé dans l'issue) | accepté | accepté |

`0` n'est pas concerné par ce défaut : un nombre est accepté par la règle.

**Usages qui reposent sur le refus de `false` (à préserver) :**

- `SyCheckbox` avec la prop `required` n'utilise pas la règle partagée : il a sa propre règle `custom` (`value === true`, `SyCheckbox/composables/useSyCheckboxValidation.ts:38-47`). Mesuré : `false` refusé.
- `SyCheckbox` avec `customRules: [{ type: 'required' }]` utilise la règle partagée. Mesuré : `false` refusé, c'est ce qui rend la case « J'accepte » obligatoire. Le dépôt lui-même utilise ce cas (`SyForm/tests/IntegrationMixedForm.vue:28-30` et `51-55`, « Votre consentement est obligatoire ») ; des projets consommateurs peuvent faire de même.

**Conséquence :** modifier la règle partagée pour accepter `false` corrigerait les sélecteurs, mais rendrait facultative toute case de consentement validée par `customRules` `required`. C'est un changement cassant silencieux, à écarter.

### Défaut 3 : les types n'acceptent pas les booléens (confirmé par lecture)

- `SyAutocomplete/types.ts` : `SelectValue` (ligne 5) et `SelectArray` (ligne 7) n'incluent pas `boolean`.
- `SyRadioGroup.vue` : `modelValue?: PropertyKey | null` (ligne 28), `options?: Array<{ label: string, value: PropertyKey }>` (ligne 30), `getAriaChecked(value: PropertyKey)` (ligne 94) et `useSyRadioGroupValidation` (`model: Ref<PropertyKey | null>`).

À l'exécution, les booléens fonctionnent déjà (`SyRadioGroup` émet `false` et coche le bouton, mesuré) ; seule la compilation impose un cast.

### Composants listés « à vérifier » dans l'issue

| Composant | Constat |
|---|---|
| `SelectBtnField` | **Défaut confirmé (nouveau).** Avec `v-model` à `0`, un focus clavier sur l'option « Deux » émet `update:modelValue` à `2` : la sélection est remplacée sans action de l'utilisateur. Avec `1`, rien n'est émis. Cause : `SelectBtnField.vue:259`, `!internalValue.value`. Les valeurs sont typées `string \| number` (`types.d.ts`) : `false` n'est pas prévu, `0` l'est. |
| `SyCheckBoxGroup` | Sélection simple avec `0` : case cochée et `required` accepté (mesuré). `isOptionChecked` et `toggleOption` utilisent une égalité stricte. Les valeurs sont typées `string \| number` : `false` n'est pas prévu, donc le défaut 2 ne s'applique pas dans le contrat typé actuel. |
| `SySelect` | Affichage correct ; concerné par le défaut 2 (voir ci-dessus). |
| `SyInputSelect` | Hors périmètre : `modelValue` est typé `Record<string, unknown> \| string \| null` (ligne 14), sans nombre ni booléen. Ses tests `!selectedItem.value` (lignes 96, 147, 261) ne traitent comme vide que `''`, ce qui est cohérent avec la règle `required` pour une chaîne. |

## Correctif proposé

### 1. Affichage dans `SyAutocomplete`

Remplacer les deux tests `!selected.value` par `selected.value === null || selected.value === undefined`, comme dans `SySelect.isItemSelected`.

### 2. Focus clavier dans `SelectBtnField`

À la ligne 259, remplacer `!internalValue.value` par `internalValue.value === null || internalValue.value === undefined`.

### 3. Règle `required` des composants de sélection

Ne pas modifier le comportement par défaut de la règle partagée. Ajouter une option à `RuleOptions` (`useFieldValidation.ts`), sur le modèle de `ignoreSpace`, par exemple `allowFalse?: boolean` (nom à valider) : quand elle vaut `true`, `false` est accepté comme une valeur renseignée.

Les règles par défaut générées par la prop `required` de ces composants passent cette option :

- `SyRadioGroup` (`composables/useSyRadioGroupValidation.ts:66`) ;
- `SyAutocomplete` (`composables/useSyAutocompleteValidation.ts:21`) ;
- `SySelect` (`composables/useSySelectValidation.ts:18`).

`SyCheckbox` et toute règle `required` passée en `customRules` gardent le comportement actuel. Un consommateur qui écrit lui-même `customRules: [{ type: 'required' }]` sur un sélecteur booléen devra ajouter l'option : à indiquer dans la documentation de la règle.

**Alternative écartée :** accepter `false` dans la règle partagée. Plus simple, mais cassant pour les cases de consentement (voir défaut 2).

### 4. Types

- `SelectValue` et `SelectArray` : ajouter `boolean`.
- `SyRadioGroup` : typer `modelValue`, `options[].value`, `getAriaChecked` et le `model` de la validation avec `PropertyKey | boolean`.

Ces élargissements sont additifs pour la prop. `update:modelValue` est déclaré sans type de charge utile dans les deux composants (`defineEmits([...])`), donc les gestionnaires existants ne changent pas de type. À confirmer par `vue-tsc` sur un exemple consommateur avec `ref<number | null>` et `ref<boolean | null>`.

`SelectBtnField` et `SyCheckBoxGroup` ne prévoient pas de booléens aujourd'hui. Les étendre serait une évolution, hors de cette issue.

### Fichiers concernés

| Fichier | Modification |
|---|---|
| `src/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue` | Tests `null` / `undefined` dans `syncSearchFromValue` et `isItemSelected`. |
| `src/components/Customs/Selects/SyAutocomplete/types.ts` | `boolean` dans `SelectValue` et `SelectArray`. |
| `src/components/Customs/Selects/SyAutocomplete/composables/useSyAutocompleteValidation.ts` | Option `allowFalse` sur la règle `required` par défaut. |
| `src/components/Customs/Selects/SySelect/composables/useSySelectValidation.ts` | Idem. |
| `src/components/Customs/SyRadioGroup/SyRadioGroup.vue` | Types booléens. |
| `src/components/Customs/SyRadioGroup/composables/useSyRadioGroupValidation.ts` | Option `allowFalse` ; type du `model`. |
| `src/components/Customs/Selects/SelectBtnField/SelectBtnField.vue` | Test `null` / `undefined` à la ligne 259. |
| `src/composables/rules/useFieldValidation.ts` | Option `allowFalse` dans `RuleOptions` et dans le cas `required`. |
| Documentation (`*.mdx`) des trois sélecteurs et de la validation | Valeurs `0` / `false` acceptées ; option de la règle `required`. |

## Tests de régression à ajouter

Chaque test reprend un scénario mesuré ci-dessus et doit échouer sur `dev` :

- `SyAutocomplete` : `v-model` initial à `0`, puis à `false` → le champ affiche le libellé et l'option a `aria-selected="true"`. Même vérification après une sélection.
- `SyAutocomplete`, `SySelect`, `SyRadioGroup` avec `required` : `false` sélectionné → `validateOnSubmit()` renvoie `true`, aucun message.
- `SyCheckbox` avec `customRules: [{ type: 'required' }]` et `false` → toujours refusé (non-régression du consentement).
- `SyCheckbox` avec `required` et `false` → toujours refusé.
- `SelectBtnField` : `v-model` à `0`, focus clavier sur une autre option → aucun `update:modelValue`.
- Types : un exemple avec options `true` / `false` compile sans cast (`vue-tsc -p tsconfig.app.json`).

## Changement de contrat

- Changement de comportement observable, non cassant pour les usages actuels :
  - `0` et `false` s'affichent dans `SyAutocomplete` ;
  - la prop `required` de `SyRadioGroup`, `SyAutocomplete` et `SySelect` accepte `false` ;
  - `SelectBtnField` ne remplace plus une sélection à `0` au focus clavier.
- Ajout d'une option publique à la règle `required` et élargissement de types.

À documenter dans `dev/ReleasesAlerts/` avant la fin de la PR, en précisant que la règle `required` passée en `customRules` garde son comportement et refuse toujours `false`.

## Points ouverts

- Nom de l'option de la règle `required` (`allowFalse` proposé).
- Faut-il aussi accepter `false` pour une règle `required` passée en `customRules` à un sélecteur, en injectant l'option côté composant ? C'est plus pratique pour le consommateur, mais le comportement d'une même règle changerait selon le composant qui la reçoit.
- Les autres tests `!value` sur une valeur de `v-model` dans le reste de la bibliothèque n'ont pas été recherchés au-delà des composants de sélection listés dans l'issue.
