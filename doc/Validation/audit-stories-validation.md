# Audit des stories de validation

> Audit réalisé le 16/10/2026 sur la branche `dev` (après #2648 → #2653).
> Corrections appliquées sur la branche `fix/validation-stories-audit`.

## Périmètre

Les 17 fichiers `*/[Vv]alidation/*.stories.ts` ajoutés entre mai et septembre 2026 :

| Groupe | Fichiers |
|---|---|
| DatePicker | `DatePicker/CalendarMode`, `DatePicker/ComplexDatePicker`, `DatePicker/DateTextInput` |
| Selects | `Customs/Selects/SySelect`, `Customs/Selects/SyAutocomplete`, `Customs/Selects/SelectBtnField` |
| Choix | `Customs/SyRadioGroup`, `Customs/SyCheckBoxGroup`, `Customs/SyCheckbox` |
| Texte | `Customs/SyTextField`, `SyTextArea`, `PasswordField` |
| Métier | `NirField`, `PhoneField`, `Captcha` |
| Calendriers | `MonthPicker`, `LunarCalendar` |

## Méthode

Chaque fichier a été lu intégralement et confronté au composant (`props`, `defineExpose`) et au moteur de validation
(`src/composables/unifyValidation`, `src/composables/validation`, `src/composables/rules`).

Points contrôlés :

1. Cohérence entre `parameters.sourceCode` (code affiché / copié par les consommateurs) et le rendu réel.
2. Props inexistantes ou booléens passés en chaîne.
3. Affichage effectif des messages de succès (`showSuccessMessages`).
4. Boutons « Réinitialiser » (méthodes exposées `reset()` / `clearValidation()`).
5. Valeurs initiales cohérentes avec le but de la story.
6. Combinaison `v-bind="args"` / `v-model`, `ref()` créées hors `setup()`.
7. Règles : clés de message (`message` / `warningMessage` / `successMessage`), robustesse de `validate`.
8. Câblage `SyForm` / `VForm`, `useVuetifyValidation` + `rules`.
9. Typage, styles en dur, accessibilité des démos, code mort, descriptions.

`pnpm exec eslint` et `vue-tsc` ne remontent aucune erreur sur ces fichiers
(`tsconfig.app.json` est en `noImplicitAny: false`, les paramètres non typés ne sont donc pas détectés).

Rappel utile à la lecture : au montage, la validation est **silencieuse** (`validateSilently`).
Une story pré-remplie n'affiche aucun message tant que l'utilisateur n'interagit pas,
sauf appel explicite à `validateOnSubmit()` (ex. `onMounted`) ou `play`.

---

## Corrections appliquées

| Sév. | Fichier | Story | Correction |
|---|---|---|---|
| high | `Captcha/useCaptchaValidation.ts` | — (composant) | `params.required` (objet `Ref`, toujours vrai) → `params.required.value`. Le Captcha était toujours obligatoire. Test de régression ajouté dans `Captcha.spec.ts`. |
| high | `Captcha/validation` | WithError, WithWarning, WithSuccess, ValidateOnInput | `required` ajouté au rendu (il n'était appliqué que grâce au bug ci-dessus) ; `show-success-messages` ajouté au code affiché ; `(v as string).length` → `String(v \|\| '').length`. |
| high | `SySelect/validation` | WithWarning, WithSuccess | `message` → `warningMessage` / `successMessage` (le message par défaut s'affichait). |
| high | `SyRadioGroup/validation` | WithWarning | `message` → `warningMessage`. |
| high | `SyCheckBoxGroup/validation` | WithWarning | `message` → `warningMessage`. |
| high | `SyCheckBoxGroup/validation` | CustomRules | `show-success-messages` ajouté (rendu + code affiché). |
| high | `SyRadioGroup/validation` | WithError | Valeur initiale `'b'` et label « Sélectionnez l'option A » alignés entre rendu et code affiché (aucune erreur n'était visible). |
| high | `SyRadioGroup/validation`, `ComplexDatePicker/validation` | WithError, VFormVuetifyValidation, CustomRules | Apostrophes non échappées dans le code affiché (code copié invalide). |
| high | `SyTextField/validation` | ValidateOnInput | Regex email sur-échappée (`\\\\s`) dans le code affiché : rejetait tous les emails. |
| high | `SyTextField/validation` | WithSuccess | `show-success-messages` ajouté au code affiché. |
| high | `PasswordField/validation` | WithSuccess | Logique inversée dans le code affiché (chaîne retournée pour un mot de passe fort) → retour booléen + `successMessage`. |
| high | `PasswordField/validation` | WithSuccessMessages | « `showSuccessMessages=true` (par défaut) » corrigé (la valeur par défaut est `false`) ; `show-success-messages` ajouté au code affiché. |
| high | `ComplexDatePicker/validation` | WithFormSubmission | `validateOnSubmit()` non attendu dans le code affiché (formulaire toujours « soumis ») ; import `VBtn` ; `success--text` (Vuetify 2) → `text-success`. |
| high | `ComplexDatePicker/validation` | WithValidation | `new Date('15/03/2024')` invalide → test sur `Date` ou suffixe `/2024` ; `showSuccessMessages` ajouté. |
| medium | `ComplexDatePicker/validation` | CustomWarningRules | `showSuccessMessages` ajouté (le `successMessage` ne s'affichait jamais). |
| high | `MonthPicker/validation` | WithCustomRules | Conseils de test réécrits : ils annonçaient des erreurs requis / avertissements / succès non configurés. |
| high | `PhoneField/validation` | VFormAndVuetifyValidation | Code affiché aligné sur le rendu (`@submit.prevent` + `onSubmit`) ; description corrigée. |
| medium | `PhoneField/validation` | SyFormValidation, VFormValidation | Description « bouton désactivé tant que… » corrigée (aucun `:disabled` câblé). |
| medium | 9 fichiers | — | Classes `gap-4` / `gap-6` (inexistantes dans Vuetify 3 et dans le projet) → `ga-4` / `ga-6`. |

---

## Reste à faire

### Transverse (tous fichiers)

- [ ] **medium** — Code affiché incomplet : imports manquants (`VBtn`, `VForm`, `SyForm`, `LunarCalendar`), onglets Script absents, variables non déclarées.
- [ ] **medium** — Stories `WithWarning` / `WithSuccess` : le rendu valide au montage (`onMounted(validateOnSubmit)`) mais pas le code affiché, ou personne ne déclenche la validation (SyRadioGroup, SyCheckBoxGroup, MonthPicker).
- [ ] **medium** — `args` retournés mais non liés au template (Controls / Actions inopérants) : SelectBtnField (toutes), SyCheckbox `WithCustomRules`, SyCheckBoxGroup `CustomRules`, `ValidateOnInput` / `ExternalMessages` (SyTextField, MonthPicker, PasswordField), SyTextArea `SyForm*`.
- [ ] **low** — Code affiché : `ref(null)` non typé (`Ref<null>` casse `?.validateOnSubmit()` en TS strict), `handleSubmit(e)` non typé.
- [ ] **low** — Code affiché : import de types via l'alias interne `@/composables/...` (inutilisable par un consommateur ; `ValidationRule` n'est pas exporté publiquement).
- [ ] **low** — Styles en dur : `color: #666`, `style="gap: 16px"`, `padding: 20px`, grilles inline, `color="black"`.
- [ ] **low** — `as Meta<typeof X>` redondant avec l'annotation de type.

### DatePicker

- [ ] **medium** — CalendarMode `NoValidateOnBlur` : la description ne dit pas que la validation devient temps réel.
- [ ] **low** — CalendarMode `NoValidateOnBlur` : `applyValue` appelle `validateOnSubmit()` avant propagation de la prop (`await nextTick()` manquant).
- [ ] **low** — CalendarMode `BidirectionalValidation` : `required` en double (prop + règle), revalidation en double (`@update` + `watch`/`setTimeout`), `<h1>`/`<h2>` dans la story, classes non stylées.
- [ ] **medium** — DateTextInput : `ref()` créées dans `render(args)` hors `setup()` ; code affiché sans Script (`CustomRules`, `WarningRules`, `WithErrorDisabled`).
- [ ] **medium** — DateTextInput `WithErrorDisabled` : `dateFormatReturn: 'YYYY/MM/DD'` absent du code affiché ; 2ᵉ champ codé en dur ; deux champs au même label.
- [ ] **low** — DateTextInput `CustomRules` : `successMessage` sans `showSuccessMessages`.
- [ ] **low** — ComplexDatePicker / DateTextInput : `args.modelValue` ignoré (le `v-model` local l'écrase) ; message « ne sont pas autorisées » pour un avertissement non bloquant ; `CustomRules` `ref(null)` vs `ref('')`.
- [ ] **low** — DateTextInput : `<h4>` isolés, `(value as string)` sans garde.

### Selects

- [ ] **high** — SySelect `WithWarning` / `WithSuccess` : code affiché avec `ref(null)` et sans `selectRef` / `onMounted`, alors que le template affiché référence `selectRef`.
- [ ] **medium** — SyAutocomplete `WithError` / `WithWarning` / `WithSuccess` : `filter: false` absent du code affiché.
- [ ] **medium** — SelectBtnField : scripts affichés sans `fieldRef` / `onMounted`, onglets Template manquants (`WithWarning`, `WithSuccess`), `VFormVuetifyValidation` sans template.
- [ ] **low** — SySelect / SyAutocomplete `NoValidateOnBlur` : « Réinitialiser » sans `clearValidation()` ; `VFormAndVuetifyValidation` sans branche « invalide ».
- [ ] **low** — SyAutocomplete `NoValidateOnBlur` : `isValidateOnBlur: false` est déjà la valeur par défaut, la story ne montre aucune différence.
- [ ] **low** — SelectBtnField `DisableErrorHandling` : aucune comparaison, la démo ne prouve rien.

### SyRadioGroup / SyCheckBoxGroup / SyCheckbox

- [ ] **medium** — SyCheckbox `WithCustomRules` : le `computed` ne lit aucune dépendance réactive, cocher le prérequis ne retire pas l'erreur.
- [ ] **medium** — SyCheckBoxGroup `WithError` : rendu `['a']` vs code affiché `[]`.
- [ ] **low** — SyRadioGroup : commentaire JSDoc orphelin (l.~355) ; « Option A (recommandée) » dans le code affiché vs « Option A » au rendu ; paramètre `event` inutilisé.
- [ ] **low** — SyCheckBoxGroup : `:multiple="true"` après `v-bind="args"` neutralise le contrôle `multiple`.

### SyTextField / SyTextArea / PasswordField

- [ ] **medium** — SyTextArea `SyFormVuetifyValidation` / `VFormVuetifyValidation` : `validateOn: 'submit'` sans effet (non transmis par `SyTextArea.vue`).
- [ ] **medium** — SyTextArea `NoValidateOnBlur` : `clearValidation()` appelé à chaque saisie, la démo annule ce qu'elle montre.
- [ ] **medium** — SyTextArea `WithWarning` / `WithSuccess` : pas d'onglet Script.
- [ ] **medium** — PasswordField `ExternalMessages` : description tronquée.
- [ ] **medium** — PasswordField `WithSuccessMessages` : les champs restent neutres au chargement alors que le texte annonce un succès visible.
- [ ] **low** — SyTextField `DisableErrorHandling` : labels différents (code affiché / rendu), règle « requis » custom jamais affichée.
- [ ] **low** — SyTextField `EmailValidation` : code affiché sans template ni script.
- [ ] **low** — PasswordField `SyFormValidation` : `ref="fieldRef"` non déclaré dans le script affiché ; `DisableErrorHandling` : backticks affichés tels quels.
- [ ] **low** — Coquille « bénéficier de intégration » (SyTextField, SySelect).

### NirField / PhoneField / Captcha

- [ ] **medium** — NirField `CustomRules` : règle affichée simplifiée par rapport aux args ; `successMessage` sans `showSuccessMessages`.
- [ ] **medium** — PhoneField `SyFormVuetifyValidation` : description parlant de `VForm` alors que la story n'utilise que `SyForm` ; `VForm` importé inutilement.
- [ ] **medium** — PhoneField `DisableErrorHandling` : description fausse (« les règles d'erreur sont évaluées »).
- [ ] **medium** — Captcha `ExternalMessages` : pas d'onglet Script ; stories `SyForm*` / `VForm*` : `verifyCaptcha` absent ou vide dans le code affiché, imports manquants.
- [ ] **low** — Captcha : `width="400px"` n'est pas une prop ; `verifyCaptcha` inutilisé dans `ExternalMessages` ; `Meta` sans paramètre de type ; description citant `validate()` au lieu de `validateOnSubmit()`.
- [ ] **low** — PhoneField `VFormValidation` : paragraphe en dur avec faute (« Preferable »).

### MonthPicker / LunarCalendar

- [ ] **medium** — MonthPicker `WithError` / `WithWarning` / `WithSuccess` : pas de `render`, messages visibles uniquement après `play`.
- [ ] **medium** — MonthPicker `WithSuccess` : valeur `'06/2026'` en dur alors que la règle dépend de l'année courante (cassera en 2027).
- [ ] **medium** — MonthPicker `DisableErrorHandling` : pas de Script, labels identiques pour les deux champs ; `ExternalMessages` : `VBtn` non importé.
- [ ] **low** — MonthPicker `SyForm*` : `v-bind="args"` après `v-model` écrase la valeur liée.
- [ ] **low** — MonthPicker `WithCustomRules` : `width="400px"` n'est pas une prop.
- [ ] **medium** — LunarCalendar : imports absents de tous les codes affichés, validation au montage non reproduite.
- [ ] **medium** — LunarCalendar `WithMinYearOnly` / `WithMaxYearOnly` : valeur dans les bornes, aucun message, la contrainte n'est pas démontrée.
- [ ] **low** — LunarCalendar `WithError` et `WithYearConstraints` identiques ; `WithWarning` : `value.split` sans garde.
