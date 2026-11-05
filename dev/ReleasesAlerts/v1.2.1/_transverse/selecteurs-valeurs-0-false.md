# Sélecteurs — valeurs `0` et `false` (#2683)

Les valeurs `0` et `false` sont désormais traitées comme des choix valides, et non plus comme une absence de valeur.

| Composant | Changement observable |
|---|---|
| `SyAutocomplete` (sélection simple) | Une option de valeur `0` ou `false` s'affiche dans le champ et est marquée sélectionnée (le champ restait vide). |
| `SyAutocomplete`, `SySelect`, `SyRadioGroup`, `SelectBtnField`, `SyCheckBoxGroup` avec `required` | `false` est accepté : le message « Le champ … est requis. » ne s'affiche plus quand l'utilisateur choisit une option de valeur `false`. |
| `SelectBtnField` | Une sélection de valeur `0` n'est plus remplacée quand le focus clavier passe sur une autre option. |
| `SySelect` | Des items booléens bruts (`:items="[true, false]"`) s'affichent (`'true'` / `'false'`) et émettent leur valeur booléenne. |

Types élargis (non cassant) : `SelectValue` et `SelectArray` (`SyAutocomplete`), `modelValue` et `items` de `SySelect`, `modelValue` et `options[].value` de `SyRadioGroup`, `SelectBtnValue` et `SelectBtnItem.value` (`SelectBtnField`), ainsi que `modelValue` et `options[].value` de `SyCheckBoxGroup` acceptent `boolean`. Le contournement par cast (`as unknown as …`) n'est plus nécessaire.

La règle `required` accepte une nouvelle option `allowFalse`. **Son comportement par défaut ne change pas** : une règle `required` passée dans `customRules` refuse toujours `false`, ce qui garde obligatoires les cases du type « J'accepte » (`SyCheckbox`). Pour une liste booléenne validée par `customRules` plutôt que par la prop `required`, ajoutez l'option :

```ts
const rules = [{ type: 'required', options: { message: 'Choix obligatoire', allowFalse: true } }]
```

À noter : `''` reste une absence de valeur, comme `null` et `undefined` (comportement inchangé). Un modèle initialisé à `''` n'affiche aucune sélection et reste invalide pour `required`.

## Conduite à tenir

Si votre projet convertissait `0` / `false` en texte (`"0"`, `"false"`) pour contourner ces défauts, vous pouvez repasser les valeurs typées directement.
