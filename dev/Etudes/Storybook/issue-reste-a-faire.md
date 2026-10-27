## Stories de validation : reste à faire

Suite de l'audit des stories de validation (PR #<pr>). Points relevés mais non corrigés dans la PR.

### Transverse (tous fichiers)

- [ ] **medium** — Code affiché incomplet : imports manquants (`VBtn`, `VForm`, `SyForm`, `LunarCalendar`), onglets Script absents, variables non déclarées.
- [ ] **medium** — MonthPicker `WithWarning` / `WithSuccess` : personne ne déclenche la validation au montage (rendu et code affiché).
- [ ] **medium** — `args` retournés mais non liés au template (Controls / Actions inopérants) : SelectBtnField (toutes), SyCheckbox `WithCustomRules`, SyCheckBoxGroup `CustomRules`, `ValidateOnInput` / `ExternalMessages` (SyTextField, MonthPicker, PasswordField), SyTextArea `SyForm*`.
- [ ] **low** — Code affiché : `ref(null)` non typé (`Ref<null>` casse `?.validateOnSubmit()` en TS strict), `handleSubmit(e)` non typé. Déjà corrigé dans LunarCalendar.
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
- [ ] **low** — SyRadioGroup : « Option A (recommandée) » dans le code affiché vs « Option A » au rendu ; paramètre `event` inutilisé.
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

- [ ] **high** — `Captcha/useCaptchaValidation.ts` : `params.required` est un `Ref` (toujours vrai) → le Captcha est toujours obligatoire, même avec `required: false`. Utiliser `params.required.value` + test de régression.
- [ ] **high** — Captcha `WithError` / `WithWarning` / `WithSuccess` / `ValidateOnInput` : `required` absent du rendu (appliqué uniquement grâce au bug ci-dessus) ; `show-success-messages` absent du code affiché ; `(v as string).length` sans garde.
- [ ] **medium** — Captcha `ExternalMessages` : pas d'onglet Script ; stories `SyForm*` / `VForm*` : `verifyCaptcha` absent ou vide dans le code affiché, imports manquants.
- [ ] **low** — Captcha : `width="400px"` n'est pas une prop ; `verifyCaptcha` inutilisé dans `ExternalMessages` ; `Meta` sans paramètre de type ; description citant `validate()` au lieu de `validateOnSubmit()`.
- [ ] **medium** — NirField `CustomRules` : règle affichée simplifiée par rapport aux args ; `successMessage` sans `showSuccessMessages`.
- [ ] **medium** — PhoneField `SyFormVuetifyValidation` : description parlant de `VForm` alors que la story n'utilise que `SyForm` ; `VForm` importé inutilement.
- [ ] **medium** — PhoneField `DisableErrorHandling` : description fausse (« les règles d'erreur sont évaluées »).
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
