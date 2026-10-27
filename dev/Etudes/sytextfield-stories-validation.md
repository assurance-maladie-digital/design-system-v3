# Étude — Stories SyTextField : extraits non autonomes, args non liés, DisableErrorHandling non démonstratif

## Description du bug

**Périmètre :** `src/components/Customs/SyTextField/SyTextField.stories.ts` (13 stories) et `src/components/Customs/SyTextField/Validation/Validation.stories.ts` (12 stories), soit 25 stories.

**Attendu :** le code affiché (onglets Template / Script) est un SFC autonome qui reproduit l'état initial et le cycle de validation de la story. Les Controls modifient la prop visée, les événements alimentent les Actions, les états figés sont documentés.

**Réel (vérifié sur le dépôt) :** un test qui compile chaque extrait comme un SFC (`tests/helpers/storySnippets.ts`, introduit par #2680 pour SyTextArea) échoue sur **17 extraits sur 25** avant la correction. Trois autres (`WithError`, `WithWarning`, `WithSuccess`) compilent mais ne reproduisent pas le rendu, et trois autres encore (`WithCustomRules`, `VFormValidation`, `ValidateOnInput`) ont des Controls sans effet.

| Story | Constat audit | Confirmé ? | Détail vérifié |
|---|---|---|---|
| `SlotCustomIcon` | I1 `VIcon`, I2 `value` | Oui | Le Template utilise `VIcon` et `v-model="value"`. Le Script n'importe ni `VIcon` ni `ref` et ne déclare pas `value`. |
| `PatternValidation` | I4 `required` | Oui | `required` est écrit après `v-bind="args"` : il écrase l'arg, le Control est sans effet. Même chose pour `label`. L'extrait n'a ni `<template>` ni `<script>` (erreur de parsing). |
| `WithError`, `WithWarning`, `WithSuccess` | I3 | Oui | Le rendu pose `ref="fieldRef"` et appelle `validateOnSubmit()` dans `onMounted`. Ni la ref ni le hook ne sont dans l'extrait : le code copié affiche un champ neutre. Dans `WithError`, la règle affichée (`return false` + `message`) diffère de celle des args (retour d'une chaîne). |
| `WithCustomRules` | I4 `required` | Oui | `label`, `type` et `required` sont écrits après `v-bind="args"`. Les args du meta donnent `required: false` : le Control est sans effet. |
| `EmailValidation` | I4 `required`, extrait incomplet | Oui | Même conflit (`required`, `label`). L'extrait n'a ni `<template>` ni `<script>`. |
| `ExternalMessages`, `SyFormValidation`, `SyFormVuetifyValidation` | I1 `VBtn` | Oui | `VBtn` est utilisé dans le Template sans être importé. |
| `VFormVuetifyValidation` | I1 `VBtn`, `VForm` | Oui | `VBtn` et `VForm` ne sont pas importés. Le paramètre `e` de `handleSubmit` n'est pas typé. |
| `ValidateOnInput`, `ExternalMessages` | args non liés | Oui | Le `setup()` retourne `args`, mais le template ne les utilise pas (`v-bind="args"` absent). Les Controls et l'action `update:modelValue` du meta sont sans effet. |
| `DisableErrorHandling` | libellés, règle « requis » | Oui | L'extrait affiche « Avec validation » / « Sans gestion d'erreurs », le rendu affiche « Nom » / « Nom ». Le message « Ce champ est requis. » ne s'affiche jamais (voir Cause racine). |
| `VFormValidation` | coquille | Oui | « bénéficier de intégration » (texte du rendu). |

**Constats supplémentaires, de même cause (hors liste de l'audit) :**

- `Default`, `HelpText`, `SlotPrepend`, `SlotAppend`, `SlotPrependInner`, `SlotPrependInnerDivider`, `SlotAppendInner` : `v-model="value"` sans déclaration de `value` (I2). Le `label` et `is-clearable` des args n'apparaissent pas dans l'extrait.
- `WithTooltips`, `WithPrefixAndSuffix` : pas de Script, `SyTextField` n'est pas importé et `value` n'est pas déclaré.
- `SyFormValidation`, `VFormValidation` : `required` et `label` écrits après `v-bind="args"`, même conflit qu'I4.
- `Required`, `RequiredWithAsterisk` : le libellé affiché (« Champ requis sans/avec astérisque ») diffère du rendu (« Label »).

**Faux positifs :** aucun. Dans chaque cas signalé, l'attribut écrasant est bien sur le même `SyTextField` que le `v-bind="args"`, placé après lui.

## Cause racine

- **I1 / I2 — Extraits écrits à la main, jamais compilés.** Rien ne vérifie que le Script déclare ce que le Template utilise. Exports réels vérifiés : `SyTextField` et `SyForm` sont exportés de `@cnamts/synapse` (`src/components/index.ts:63,65`), `VBtn`, `VForm` et `VIcon` de `vuetify/components`, `SubmitEventPromise` de `vuetify` (type). **Auto-import :** `vite.config.ts:36-37` active `vuetify({ autoImport: true })` dans le dépôt, ce qui masque l'oubli en développement. Un projet consommateur n'a pas forcément ce plugin : l'extrait doit importer explicitement les composants Vuetify. Les `render` des stories les déclarent dans `components`.
- **I3 — Cycle de validation absent de l'extrait.** Le rendu valide au montage (`onMounted` → `validateOnSubmit()`), l'extrait ne le montre pas.
- **I4 — Ordre des attributs.** Vue fusionne les props dans l'ordre d'écriture : un attribut écrit après `v-bind="args"` remplace la valeur de l'arg. Les Controls `required` et `label` deviennent sans effet.
- **Args non liés.** Retourner `args` depuis `setup()` les expose au template mais ne les transmet pas au composant : il faut `v-bind="args"`.
- **DisableErrorHandling — la règle « requis » ne pouvait pas s'afficher :**
  - avec la prop `required`, `useSyTextFieldValidation.ts:30-40` ajoute sa propre règle `required` **avant** les `customRules`. Son message « Le champ Nom est requis. » est le seul affiché (`maxErrors: 1`, `useValidation.ts` → `mergeMessages`) ;
  - sans la prop `required`, une règle `custom` ne s'exécute pas sur une valeur vide : `createRule` renvoie `{}` pour toute règle autre que `required` (`src/composables/rules/useFieldValidation.ts:105`) ;
  - avec `disableErrorHandling`, aucune règle ne s'exécute (`useValidation.ts`, `validate()` court-circuité) : l'absence de message à droite est le comportement attendu ;
  - aucune validation n'était déclenchée au chargement : il fallait cliquer dans le champ puis en sortir.
  Vérifié en montant `SyTextField` (valeur vide + règle custom « requis ») dans les 4 combinaisons `required` × `disableErrorHandling` : le message « Ce champ est requis. » n'apparaît dans aucune.
- **Introduit dans :** `cae900d3b` « [SyTextField] Ajout de stories concernant la validation (#2181) », première version publiée **v1.1.0** (`git tag --contains`). Les stories principales (`Slot*`) datent de `e39bb2110` (#261). La surcharge `fieldRef.value!` date de `df1579a5f` (#2599).

## Correction

Alignement sur la correction de SyTextArea (#2680). Aucun changement du composant de production.

- **Extraits autonomes :** chaque story a un Template et un Script `<script setup lang="ts">` qui importent tout ce qu'ils utilisent (`ref`, `onMounted`, `SyTextField`, `SyForm`, `VBtn`, `VForm`, `VIcon`) et déclarent chaque état avec sa valeur initiale. `SlotCustomIcon` importe `VIcon` et déclare `value`. `iconName` devient une constante dans le rendu, comme dans l'extrait.
- **Cycle de validation (`WithError`, `WithWarning`, `WithSuccess`) :** l'extrait montre `ref="fieldRef"`, `fieldRef` typé (`InstanceType<typeof SyTextField>`) et `onMounted(() => { fieldRef.value?.validateOnSubmit() })`. Le rendu passe de `fieldRef.value!` à `fieldRef.value?`. La règle de `WithError` est la même dans l'extrait et dans les args.
- **Args liés :** dans toutes les stories qui ont des args, les props du scénario (`label`, `required`, `customRules`, `rules`, `width`…) passent dans `args`. Le template devient `<SyTextField v-bind="args" v-model="value" />`. Cela supprime les attributs qui écrasaient les args (`PatternValidation`, `WithCustomRules`, `EmailValidation`, `SyFormValidation`, `VFormValidation`) et lie `ValidateOnInput`, `ExternalMessages` et `VFormVuetifyValidation`. L'action `update:modelValue` du meta devient active.
- **États figés documentés :**
  - `ExternalMessages` : `errorMessages`, `warningMessages` et `successMessages` sont pilotés par les boutons. Leurs Controls sont désactivés (`control: false`), la description de la story l'explique, et la documentation des props est conservée ;
  - `DisableErrorHandling` : la story compare deux configurations fixes. Ses Controls sont désactivés (`controls.disable`) et la description l'explique. La saisie dans les deux champs alimente quand même l'action `update:modelValue` ;
  - `ValidateOnInput` : `isValidateOnBlur` est le sujet de la story et son texte annonce `false`. Sa valeur est figée et son Control désactivé, pour que la description reste vraie.
- **`DisableErrorHandling` :** deux champs identiques (valeur vide, même règle `{ type: 'required', options: { message: 'Ce champ est requis.' } }`), sans la prop `required`, validés au montage via `validateOnSubmit()`. Seul le premier affiche « Ce champ est requis. ». Les libellés sont identiques dans l'extrait et le rendu. La description explique pourquoi la règle n'est pas une règle `custom` et pourquoi la prop `required` n'est pas utilisée.
- **`Required`, `RequiredWithAsterisk` :** l'arg `label` reprend le libellé de l'extrait.
- **Coquille :** « bénéficier de l'intégration » (`VFormValidation`, rendu et extrait). La même coquille dans `SySelect` relève de son propre ticket.
- **Types :** `type Story = StoryObj<SyTextFieldProps>` dans `Validation.stories.ts` (au lieu de `FieldValidationProps`), pour que les args `type`, `width`, `helpText` et `autocomplete` soient typés.

## Reproduction / vérification

1. **Test de régression** `src/components/Customs/SyTextField/tests/SyTextField.stories.spec.ts`. **Avant correction : 32 échecs sur 41. Après : 45/45** (4 tests ajoutés à la revue, voir plus bas). Les 9 tests qui passaient déjà portent sur des stories correctes avant la correction.
   - Pour les 25 stories : l'extrait se compile comme un SFC (`analyzeSnippet`), sans identifiant non déclaré, composant non importé ou ref non typée.
   - `WithError`, `WithWarning`, `WithSuccess` affichent leur message au chargement. L'extrait contient `ref="fieldRef"` et l'appel à `validateOnSubmit()` dans `onMounted`.
   - L'arg `required` pilote `aria-required` dans `PatternValidation`, `WithCustomRules`, `EmailValidation`, `SyFormValidation`, `VFormValidation` et `ValidateOnInput`.
   - `ValidateOnInput` et `ExternalMessages` : un `label` passé en arg est rendu, et la saisie appelle l'action `onUpdate:modelValue`.
   - `ExternalMessages` : les trois Controls de messages sont désactivés, et le bouton « Simuler une erreur » affiche le message.
   - `DisableErrorHandling` : les libellés de l'extrait et du rendu sont identiques, et seul le premier champ affiche « Ce champ est requis. ».
   - `VFormValidation` : la coquille est corrigée.
2. **Extraits recopiés dans des SFC réels :** les 25 extraits ont été écrits dans des fichiers `.vue` temporaires (`@cnamts/synapse` → `@/main`), puis vérifiés par `pnpm vue-tsc -p tsconfig.app.json --noEmit` : 0 erreur. Contrôle : un fichier volontairement faux est bien signalé.
3. `pnpm vitest run src/components/Customs/SyTextField` : 3 fichiers, 100 tests, tous passent. Test a11y `SyTextField.a11y.spec.ts` : 6/6.
4. `pnpm exec eslint src/components/Customs/SyTextField` : 0 erreur. `pnpm vue-tsc -p tsconfig.app.json --noEmit` : 0 erreur.
5. **Console :** les 25 stories ont été montées dans un test temporaire, avec saisie, perte de focus et clic sur chaque bouton. Aucun `console.warn` ni `console.error` (avertissements Vue compris). Storybook démarre sans erreur (`pnpm storybook`).

## Revue

Deux défauts trouvés en relisant la correction. Chacun a d'abord été reproduit par un test en échec, puis corrigé :

- `DisableErrorHandling` : le rendu n'utilisait pas les args, donc l'action `update:modelValue` n'était jamais appelée. Corrigé par `@update:model-value="args['onUpdate:modelValue']"` sur les deux champs.
- `ValidateOnInput` : basculer le Control `isValidateOnBlur` rendait faux le texte « La validation se déclenche à chaque frappe ». Corrigé en désactivant ce Control (`control: false`) et en le signalant dans la description.

Avertissement Storybook relevé ensuite : `Addon controls: Control of type color only supports string, received "other" instead`.

- **Cause :** le matcher `color` de `.storybook/controlMatchers.ts` (`/(background|color)$/i`) vise trois props de `SyTextField` : `color`, `baseColor` et `bgColor`. `inferControl` (`storybook/dist/_browser-chunks/chunk-5WKL7XVT.js:966-971`) n'accepte ce matcher que sur un `type.name === 'string'`. Or `vue-docgen-api` ne type pas ces props, qui viennent du type importé `SyTextFieldProps`, et aucun des deux metas ne déclare leur `type`. Le défaut existait avant cette correction. C'est le même que celui corrigé pour SyTextArea dans #2680.
- **Correction :** `type: { name: 'string', required: false }` sur `color`, `baseColor` et `bgColor` dans les deux metas. Ces trois argTypes sont ajoutés au meta de validation, avec les mêmes controls que le meta principal. Les controls explicites priment sur le matcher : `color` reste un select et `baseColor` un champ texte.
- **Test :** « le meta … type en string les props visées par le matcher color », repris du spec de SyTextArea. Il échouait avant la correction et passe maintenant.

Points résiduels, assumés :

- `ExternalMessages` : les args du meta contiennent toujours `errorMessages`, `warningMessages` et `successMessages` à `null`. Les bindings explicites écrits après `v-bind="args"` priment, et les Controls sont désactivés : aucun effet observable.
- `WithTooltips` partage un `ref` déclaré au niveau du module entre ses montages. Ce comportement existait avant et sort du périmètre du ticket.

## Impact

- **Sévérité :** élevée pour les extraits copiés (17 extraits sur 25 ne compilaient pas, 3 ne reproduisaient pas le rendu), moyenne pour les Controls et Actions sans effet, faible pour les libellés, la démonstration et la coquille. Le composant n'est pas touché.
- **Introduit dans :** `cae900d3b` (#2181, v1.1.0) pour les stories de validation ; `e39bb2110` (#261) pour les stories principales.
- **Utilisateurs concernés :** les développeurs et contributeurs qui consultent ou copient les stories SyTextField.
- **Zones à risque :** uniquement les fichiers `*.stories.ts`. `SyTextField.visual.cy.ts` monte le composant directement, pas les stories : les tests visuels ne sont pas concernés. Aucun changement de contrat : pas de note `ReleasesAlerts`.

## Checklist

- [x] Cause racine traitée : extraits complétés et vérifiés par compilation, args liés par `v-bind="args"` au lieu d'attributs écrasants.
- [x] Test de régression ajouté (`SyTextField.stories.spec.ts`), en échec avant la correction (32 sur 41).
- [x] Extraits avec tous leurs imports et états (25 stories, plus vérification `vue-tsc` sur des SFC réels).
- [x] `SlotCustomIcon` importe `VIcon` et déclare `value`.
- [x] `WithError`, `WithWarning`, `WithSuccess` reproduisent l'état initial et la validation au montage.
- [x] Control `required` opérationnel dans les stories signalées, plus `SyFormValidation`, `VFormValidation` et `ValidateOnInput`.
- [x] Conflits confirmés et faux positifs consignés (tableau ci-dessus ; aucun faux positif).
- [x] Args de `ValidateOnInput` et `ExternalMessages` liés au composant.
- [x] Action `update:modelValue` déclenchée (vérifiée par test).
- [x] Libellés de `DisableErrorHandling` identiques dans l'extrait et le rendu.
- [x] Règle « requis » de `DisableErrorHandling` vérifiable et expliquée.
- [x] `EmailValidation` a un Template et un Script complets.
- [x] Coquille « bénéficier de intégration » corrigée.
- [x] `pnpm vitest run src/components/Customs/SyTextField` passe (100/100).
- [x] Test a11y passé (6/6). Le markup du composant n'a pas changé.
- [x] `pnpm test:visual` : non requis, les tests visuels ne montent pas les stories.
- [x] Aucun nouvel avertissement ni erreur de console (25 stories montées et manipulées). Relecture visuelle dans Storybook à faire.
