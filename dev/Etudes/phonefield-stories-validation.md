# Étude — Stories PhoneField Validation : controls écrasés, descriptions inexactes, nommage

## Description du bug

**Périmètre :** `src/components/PhoneField/validation/validation.stories.ts` (8 stories), renommé `src/components/PhoneField/validation/Validation.stories.ts`.

**Attendu :** chaque control exposé modifie la prop visée, les descriptions correspondent aux composants utilisés et au comportement réel de la validation, les imports sont nécessaires et les textes sont sans faute.

**Réel (vérifié sur le dépôt) :**

| Story | Constat audit | Confirmé ? | Détail vérifié |
|---|---|---|---|
| `SyFormValidation` | I4 `required` | Oui | `v-bind="args"` suivi de `required` sur le même `PhoneField` : le control `required` (exposé via `getValidationDocumentation`) est écrasé. Test : `Story({ required: false })` rendait toujours `aria-required="true"` et `Numéro de téléphone *`. |
| `VFormValidation` | I4 `required` | Oui | Même cause, même instance `PhoneField`. |
| `VFormAndVuetifyValidation` | I4 `display-asterisk` | Oui | `display-asterisk` après `v-bind="args"` : `Story({ displayAsterisk: false })` affichait toujours l'astérisque. `required` et `:use-vuetify-validation="true"` étaient aussi écrasés (même défaut, non relevé par l'audit). |
| `SyFormVuetifyValidation` | — (non relevé) | Oui | `required`, `display-asterisk` et `use-vuetify-validation` écrasés de la même façon. Corrigé dans la même passe (même cause racine). |
| `SyFormVuetifyValidation` | Medium : description VForm, import VForm | Oui | La description présentait `SyForm` **et** `VForm` alors que le rendu et l'extrait n'utilisent que `SyForm`. `VForm` était déclaré dans `components` du render et importé dans le Script affiché sans être utilisé. |
| `DisableErrorHandling` | Medium : « les règles d'erreur sont évaluées » | Oui | Faux : voir « Comportement vérifié » ci-dessous. |
| `VFormValidation` | Low : « Preferable » | Oui | Paragraphe `<p>` codé en dur dans le rendu (absent de l'extrait affiché) : c'est une recommandation documentaire, pas un élément de la démonstration. |
| Fichier | I5 nommage | Oui | `validation.stories.ts` : seuls PhoneField et Captcha utilisent la minuscule ; 17 fichiers suivent `Validation.stories.ts`. |

## Faux positifs (vérifiés instance par instance)

Le ticket demande de distinguer les vrais conflits `args` / attribut des simples présences d'attributs. Chaque attribut placé après `v-bind="args"` a été relevé, puis comparé aux args **sur la même instance** de `PhoneField`. N'est un conflit qu'une prop exposée en control et écrasée par un attribut sur ce même composant.

| Story | Attribut après `v-bind="args"` | Verdict | Justification |
|---|---|---|---|
| `WithError` | `:customRules` | Faux positif | `customRules` contient des fonctions (`validate`), qu'un control Storybook (JSON) ne peut pas éditer : c'est une valeur fixe du scénario. |
| `WithWarning` | `:customWarningRules` | Faux positif | Idem (fonctions). |
| `WithSuccess` | `:customSuccessRules` | Faux positif | Idem (fonctions). `showSuccessMessages` est déjà fourni par les args, sans surcharge. |
| `NoValidateOnBlur` | `:custom-rules`, `:custom-success-rules` | Faux positif | Idem (fonctions). `isValidateOnBlur` et `showSuccessMessages` sont déjà fournis par les args. |
| `DisableErrorHandling` | `:custom-rules` | Faux positif | Idem (fonctions). `disableErrorHandling` est déjà fourni par les args. |
| `SyFormValidation` | `:custom-rules` | Faux positif | Idem. L'astérisque visible sans attribut `display-asterisk` vient de la valeur par défaut du composant (`displayAsterisk: true`, `PhoneField.vue:27`), pas d'une surcharge. |
| `VFormValidation` | `ref`, `:custom-rules` | Faux positif | `ref` n'est pas une prop. `customRules` : fonctions. |
| `SyFormVuetifyValidation` | `class`, `:rules` | Faux positif | `class` n'est pas une prop exposée. `rules` contient des fonctions. |
| `VFormAndVuetifyValidation` | `use-vuetify-validation`, `:rules` | Surcharge **volontaire** | `useVuetifyValidation` est figé : retiré des args, control désactivé avec explication (voir « Correction »). `rules` : fonctions. |

**Autres faux positifs :**

- **Attributs sur un autre composant** : `type="submit"`, `color` et `class` sur `VBtn`, `class="pa-4"` et `@submit` sur `SyForm`/`VForm`. Ils ne portent pas sur l'instance `PhoneField`, donc pas de conflit avec ses args.
- **Code affiché (`parameters.sourceCode`)** : les occurrences de `required`, `display-asterisk` et `use-vuetify-validation` dans les onglets Template sont des chaînes de documentation, pas des bindings. Elles décrivent l'état initial de la story et ne surchargent rien. Une recherche textuelle les fait remonter à tort.
- **`v-model="phone"` et `ref` (sauf `VFormValidation`)** : ils sont placés avant `v-bind="args"`. `v-model` lie une valeur locale, qui n'est pas exposée en control, et `ref` n'est pas une prop. Pas de conflit.

**Limite connue, hors périmètre** : les controls `customRules`, `customWarningRules`, `customSuccessRules` et `rules` restent affichés dans le panneau Controls, alors qu'ils sont sans effet dans ces stories. C'est le même choix que l'étude SelectBtnField. Les désactiver relèverait d'un ticket transverse sur les règles de validation dans les stories.

**Comportement vérifié de `disableErrorHandling` (mode Synapse) :**

- `useCustomValidation.validateValue()` sort immédiatement et vide l'état (`src/composables/unifyValidation/useCustomValidation.ts`, garde `readonly || disabled || disableErrorHandling`) ; `validateSilently()` et les watchers de saisie et de blur ne valident pas. **Les règles ne sont donc pas exécutées.**
- `useValidation.validate()` vide les messages et renvoie `!hasExternalErrors && !hasErrorProp` (`src/composables/unifyValidation/useValidation.ts`) : seules une erreur injectée ou un `hasError` forcé font échouer `validateOnSubmit()`.
- Les computed `errors` / `warnings` / `successes` ne gardent que les messages injectés (`errorMessages`, `warningMessages`, `successMessages`).
- En mode Vuetify, le validateur Vuetify ne reçoit pas `disableErrorHandling` : ses messages sont masqués, mais rien ne prouve que ses règles ne s'exécutent pas. La description se limite donc au mode Synapse, celui de la story.

## Cause racine

- **I4** : avec Vue 3, quand un même vnode reçoit `v-bind="args"` puis un attribut explicite, l'attribut placé après l'emporte. Les valeurs de démonstration figées dans le template prenaient donc le pas sur les args.
- **I5** : aucune convention écrite. Convention retenue (validée) : dossier `validation/`, fichier `Validation.stories.ts`, comme `SySelect`, `SyAutocomplete`, `NirField` et `DatePicker`.
- **Descriptions** : copiées d'une version antérieure qui montrait `SyForm` et `VForm` côte à côte, et rédigées sans vérifier le court-circuit de `disableErrorHandling`.

## Correction

- **Args** : `required`, `displayAsterisk` et `useVuetifyValidation` sont passés dans les `args`, et les attributs qui les écrasaient sont supprimés. L'état initial ne change pas, et les controls agissent maintenant sur le rendu (convention de l'étude SelectBtnField).
- **État figé, `VFormAndVuetifyValidation`** : `useVuetifyValidation` reste un attribut du template, sort des `args`, et son control est désactivé (`argTypes.useVuetifyValidation.control: false`) avec une explication. Rendre ce control actif produisait un résultat faux : en mode Synapse, les `rules` sont ignorées et le `VForm`, qui ne prend pas en compte la validation Synapse, déclarait valide un champ requis vide (vérifié : alerte « Le formulaire est : valide »). Dans `SyFormVuetifyValidation`, le control reste actif : le `SyForm` intègre la validation Synapse, et le champ requis vide bloque bien la soumission dans les deux modes (vérifié).
- **`SyFormVuetifyValidation`** : la description présente l'intégration automatique des règles Vuetify à la validation du `SyForm`. `VForm` est retiré des `components` du render et de l'import du Script affiché. L'import `VForm` en tête de fichier reste nécessaire pour `VFormValidation` et `VFormAndVuetifyValidation`.
- **`DisableErrorHandling`** : la description suit maintenant le comportement vérifié (règles non exécutées, aucun message issu des règles, messages injectés conservés, `hasError` et erreurs injectées toujours bloquants) et explique comment comparer avec le control.
- **`VFormValidation`** : le paragraphe codé en dur est retiré du rendu et sa recommandation passe dans la description, corrigée (« Il est préférable d'utiliser `SyForm`… »). La description précise que la story valide le champ via `validateOnSubmit()`.
- **I5** : `git mv` du fichier en `validation/Validation.stories.ts`, en deux étapes pour le système de fichiers insensible à la casse de macOS. Aucune référence à mettre à jour : aucun import, `title` explicite, et le glob Storybook `src/components/!(ComponentStatusTable)/**/*.stories.*` couvre le nouveau nom.

## Reproduction / vérification

1. Test de régression `src/components/PhoneField/tests/PhoneField.validationStories.spec.ts` (`composeStories`) : pour les 4 stories, `required` vaut `true` par défaut et le control `required: false` retire `aria-required` et l'astérisque ; pour les 2 stories Vuetify, `displayAsterisk: false` retire l'astérisque. **Avant correction : 6 échecs sur 10** (les 4 `required` et les 2 `displayAsterisk`). **Après correction : 10/10.** Deux tests ajoutés après la revue pour `VFormAndVuetifyValidation` : le control `useVuetifyValidation` est désactivé (catégorie `props` conservée), et avec `useVuetifyValidation: false` en args, un champ requis vide soumis reste invalide (alerte « invalide » et message « requis »). Avant correction : 2 échecs ; après : 12/12. Quatre tests ajoutés après la seconde revue : `SyFormVuetifyValidation` bloque la soumission d'un champ requis vide avec `useVuetifyValidation` à `true` comme à `false` ; `DisableErrorHandling` n'affiche aucune erreur après focus puis blur, mais l'erreur de longueur apparaît quand le control est désactivé. Ces tests ont été validés par mutation (`disableErrorHandling: false` dans la story, `rules` vidées dans `SyFormVuetifyValidation` : chaque mutation fait échouer le test attendu). Total : 16/16. Les composants montés sont démontés après chaque test (`enableAutoUnmount`).
2. `pnpm vitest run src/components/PhoneField` → 5 fichiers, 90/90 (dont `PhoneField.a11y.spec.ts`).
3. `pnpm exec eslint src/components/PhoneField` → 0 erreur ; `pnpm vue-tsc -p tsconfig.app.json --noEmit` → 0 erreur.
4. Aucun avertissement de console pendant le test de régression.
5. Storybook (à rejouer manuellement en revue) : `DisableErrorHandling`, entrer puis sortir du champ (aucune erreur), désactiver le control puis recommencer (l'erreur de longueur intégrée s'affiche : « Le numéro de téléphone doit contenir 10 chiffres. »).

## Impact

- **Sévérité :** moyenne (controls trompeurs, descriptions inexactes) ; faible pour la faute de frappe. Aucun impact sur le composant de production.
- **Introduit dans :** commit `0623c3185` « [PhoneField] Fixe et ajout de la validation (#2205) », première version publiée qui le contient : **v1.1.1** (`git tag --contains`).
- **Utilisateurs concernés :** développeurs qui consultent la documentation Storybook de PhoneField.
- **Zones à risque :** fichier de stories uniquement, plus un nouveau spec. Les tests Cypress (`PhoneField.visual.cy.ts`, `PhoneField.reset.cy.ts`) montent directement le composant ou une fixture, pas les stories : baselines non concernées.

## Checklist

- [x] Cause racine traitée : les surcharges après `v-bind="args"` sont supprimées et les valeurs passent dans les args.
- [x] Test de régression ajouté (`PhoneField.validationStories.spec.ts`), en échec avant la correction.
- [x] Controls `required` et `display-asterisk` opérants ; `useVuetifyValidation` figé et son control désactivé, avec une explication, dans `VFormAndVuetifyValidation`.
- [x] Conflits confirmés instance par instance ; faux positifs documentés dans la section « Faux positifs (vérifiés instance par instance) ».
- [x] Description de `SyFormVuetifyValidation` conforme à l'usage de `SyForm`.
- [x] Plus d'import `VForm` inutile dans `SyFormVuetifyValidation`, ni dans le render ni dans le Script affiché.
- [x] Description de `DisableErrorHandling` conforme au comportement vérifié.
- [x] « Preferable » corrigé ; le texte est passé dans la description.
- [x] Convention de nommage appliquée ; aucune référence affectée.
- [x] `pnpm vitest run src/components/PhoneField` → 90/90.
- [x] Tests a11y passés (inclus dans le run ci-dessus) ; markup du composant inchangé.
- [x] `pnpm test:visual` : non requis (les specs Cypress ne montent pas les stories).
- [x] Aucun nouvel avertissement ni erreur de console pendant les tests unitaires.
- [ ] Vérification manuelle dans Storybook (controls, console) : à faire en revue.
