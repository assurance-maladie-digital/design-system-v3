# Rapport : stories Synapse à ajouter à partir des exemples Vuetify

- **Référence Vuetify** : exemples de la documentation officielle `vuetifyjs/vuetify@v3.12.2` (`packages/docs/src/examples/`), version installée dans le projet. Vuetify n'a pas de Storybook : ces exemples jouent ce rôle.
- **Périmètre** : 31 composants Synapse qui encapsulent un composant Vuetify, ou en reprennent l'usage.
- **Critère de sélection** : un exemple Vuetify est retenu s'il n'est couvert par aucune story Synapse **et** s'il est réalisable avec les props, slots et événements disponibles sur le composant Synapse.
- **Résultat** : environ **75 stories** à ajouter.

## Sommaire

1. [Constats généraux](#1-constats-généraux)
2. [Synthèse des priorités hautes](#2-synthèse-des-priorités-hautes)
3. [Détail par composant](#3-détail-par-composant)
   - [Champs texte](#31-champs-texte)
   - [Selects](#32-selects)
   - [Choix et formulaires](#33-choix-et-formulaires)
   - [Tableaux](#34-tableaux)
   - [Feedback et overlays](#35-feedback-et-overlays)
   - [Navigation et boutons](#36-navigation-et-boutons)
   - [Dates, fichiers, chargement](#37-dates-fichiers-chargement)
4. [Props existantes jamais illustrées](#4-props-existantes-jamais-illustrées)
5. [Anomalies relevées](#5-anomalies-relevées)

---

## 1. Constats généraux

### Composants qui ne reposent pas sur leur équivalent Vuetify

Ces composants sont faits maison. La plupart des exemples Vuetify ne s'y appliquent donc pas, même en passant des attributs non déclarés :

| Composant Synapse | Équivalent Vuetify attendu | Implémentation réelle |
|---|---|---|
| SySelect | `v-select` | `VTextField` + `VMenu` + `VList` |
| SyAutocomplete | `v-autocomplete` | `VMenu` + `VList` maison |
| SyInputSelect | `v-select` | `VInput` + `VList` |
| SelectBtnField | `v-btn-toggle` / `v-chip-group` | entièrement maison |
| SyPagination | `v-pagination` | `<nav>`, `<ul>`, `<a>` natifs |
| SyTabs | `v-tabs` | `VSheet` + balisage natif |
| NotificationBar | `v-snackbar` | `TransitionGroup` + `Notification` maison |
| Accordion | `v-expansion-panels` | `div role="button"` / `role="region"` |
| RangeField | `v-range-slider` | curseur double maison |
| RatingPicker | `v-rating` | StarsPicker, NumberPicker, EmotionPicker |
| MonthPicker | `v-date-picker-month` | sélecteur maison |
| FileUpload | `v-file-upload` / `v-file-input` | zone de dépôt maison |

**FilterSideBar** utilise `VNavigationDrawer`, mais en fige toutes les props (`temporary`, `location="right"`, `rail`, `scrim=false`…).

### Composants dépréciés

**SyInputSelect** (remplacé par SySelect) et **PaginatedTable** (remplacé par SyTable) : aucune story à ajouter.

### Familles d'exemples Vuetify écartées

- **Contraires au DS** : couleurs, arrondis, élévations, transitions et variantes arbitraires.
- **Contraires à l'accessibilité** : ouverture au survol (WCAG 1.4.13), sous-menus non gérés au clavier, suppression du `thead`.
- **Sans prop correspondante** sur le composant Synapse.

### Lecture des tableaux

- **Passthrough** : les attributs non déclarés sont-ils transmis au composant Vuetify sous-jacent ? Une prop « en passthrough » fonctionne, mais n'est pas déclarée par Synapse.
- **Priorité** : haute, moyenne ou basse, selon l'intérêt pour un DS accessible.

---

## 2. Synthèse des priorités hautes

| Composant | Story à ajouter | Exemple Vuetify | Props / slots Synapse |
|---|---|---|---|
| SyTextField | Désactivé et lecture seule | `prop-disabled-and-readonly` | `disabled`, `readonly`, `allowIconButtonWhenReadonly` |
| SyTextField | Compteur de caractères | `prop-counter` | `counter`, `maxlength`, `counterValue`, `displayPersistentCounter` |
| SyTextField | Icônes cliquables et événements | `event-icons` | `disableClickButton=false`, `@prepend-icon-click`, `@append-icon-click`, `@clear` |
| SyTextArea | Compteur | `prop-counter` | `counter`, `customRules` |
| SyTextArea | Désactivé et lecture seule | équivalent v-text-field | `disabled`, `readonly` |
| PasswordField | Création de mot de passe | `v-textarea/misc-signup-form` | `autocompleteType="new-password"`, `customRules`, `helpText` |
| SySelect | Désactivé | `prop-disabled` | `disabled` |
| SySelect | Lecture seule | `prop-readonly` | `readonly` |
| SyAutocomplete | Recherche asynchrone côté serveur | `misc-asynchronous-items` | `@search`, `debounce`, `filter: false`, `loading`, `hideNoData` |
| SyCheckbox | Libellé avec lien (CGU) | `slot-label` | slot `label` |
| SyCheckBoxGroup | Options désactivées ou en lecture seule | `prop-states` | `options[].disabled`, `options[].readonly` |
| SyRadioGroup | Légende enrichie | `slot-label` | slot `label` |
| RangeField | Pas de saisie | `prop-step` | `step`, `min`, `max` |
| RatingPicker | Libellés personnalisés | `prop-item-labels` | `itemLabels`, `type` |
| RatingPicker | Libellés accessibles de chaque note | `prop-icon-label` | `locales` |
| SyTable, SyServerTable | **État vide** (exigé par le DS) | `slot-main` (`no-data`) | `items` vide, slot `#no-data` |
| SyServerTable | Recherche globale côté serveur | `server-search` | `search`, `v-model:options`, `loading`, `TableToolbar` dans `#top` |
| SyAlert | Les 4 types côte à côte | `prop-type` | `type` |
| SyAlert | Titre et texte | `prop-content` | slot `default` |
| DialogBox | Formulaire dans la boîte | `misc-form` | slot `default`, `@confirm`, `@cancel` |
| NotificationBar | Fermeture automatique | `prop-timeout` | `timeout` > 0 |
| ChipList | Puces synchronisées avec un select multiple | `misc-filtering`, `misc-in-selects` | `items`, `@remove`, `@reset`, `listAriaLabelledby` |
| CollapsibleList | Rendu mobile | `usage` | `listTitle`, `items`, `headingLevel` |
| Accordion | Section désactivée | `prop-disabled` | `items[].disabled` |
| SyPagination | Icônes avec nom accessible | `prop-icons` | slots `previous`, `next` |
| SyIcon | Icône décorative dans un bouton texte | `misc-buttons` | `icon`, `decorative` |
| SyIconButton | Bouton « Fermer » d'une boîte de dialogue | `v-icon-btn/misc-dialog` | `icon`, `label`, `@click-icon-button` |
| SyIconButton | Actions par ligne avec libellés uniques | `v-icon-btn/misc-table-actions` | `label`, `size` |
| SyIconButton | Activateur de menu avec `aria-expanded` | `v-icon-btn/prop-active` | `icon`, `label` (le reste en passthrough) |
| DatePicker | Lecture seule et désactivé | `prop-readonly` | `readonly`, `disabled` |
| MonthPicker | Lecture seule, désactivé, effaçable | `prop-readonly` | `readonly`, `disabled`, `clearable` |
| FileUpload | Formats et taille autorisés, avec erreurs | `v-file-input/prop-validation`, `prop-accept` | `allowedExtensions`, `fileSizeMax`, `@error` |
| FileUpload | Désactivé | `v-file-upload/usage` | `disabled` |
| HeaderLoading | Bascule chargement / contenu | `prop-loading` | `standalone`, `ariaLabel` |

---

## 3. Détail par composant

### 3.1 Champs texte

#### SyTextField ↔ v-text-field

- **Passthrough** : oui. `inheritAttrs: false`, puis les attributs sont transmis à `VTextField`, sauf `display-asterisk`, `direction` et `aria-controls`. Pas de prop `vuetifyOptions`.
- **Slots exposés** : `prepend`, `append`, `default`, `prepend-inner`, `append-inner`, `details`. Les slots `loader` et `label` ne sont pas exposés.
- **Stories existantes** :
  - `SyTextField.stories.ts` : Default, HelpText, Required, RequiredWithAsterisk, SlotPrepend, SlotAppend, SlotPrependInner, SlotPrependInnerDivider, SlotAppendInner, SlotCustomIcon, PatternValidation, WithTooltips, WithPrefixAndSuffix.
  - `Validation.stories.ts` : WithError, WithWarning, WithSuccess, WithCustomRules, DisableErrorHandling, ValidateOnInput, ExternalMessages, EmailValidation, et les quatre combinaisons SyForm / VForm.
  - `Usages.stories.ts` : UsagePage.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-disabled-and-readonly` | Champ désactivé ou en lecture seule, avec une valeur | `disabled`, `readonly`, `modelValue`, `allowIconButtonWhenReadonly` | haute |
| `prop-counter` | Compteur, limite, compteur personnalisé (en mots) | `counter`, `maxlength`, `counterValue`, `displayPersistentCounter`, `customRules` | haute |
| `event-icons` | Icônes cliquables avec nom accessible | `prependIcon`, `appendIcon`, `disableClickButton=false`, `@prepend-icon-click`, `@append-icon-click`, `@clear`, `isClearable` | haute |
| `prop-placeholder` / `prop-label` | Libellé et placeholder ensemble | `label`, `placeholder`, `displayPersistentPlaceholder`, `type="email"`, `autocomplete` | moyenne |
| `prop-hide-details` | Zone de messages masquée, ou affichée seulement en cas d'erreur | `hideDetails` (`true`, `'auto'`), `customRules` | moyenne |
| `slot-progress` (partiel) | État de chargement, barre avec `aria-label` | `loading` | moyenne |
| `prop-dense` | Champ de recherche compact | `density="compact"`, `isOnSingleLine`, `hideDetails`, `loading`, slot `append-inner` | moyenne |
| `prop-hint` / `prop-messages` | Hint au focus ou permanent | `hint`, `displayPersistentHint`, `messages` | basse |
| `prop-variant` (+ filled, outlined, contained) | Variantes visuelles | `variantStyle` | basse |
| `prop-single-line` | Libellé qui ne flotte pas | `isOnSingleLine` | basse |
| `prop-focused` | Champ affiché avec le focus | `isFocused` | basse |

**Non retenus** :
- `usage`, `prop-clearable`, `prop-icon`, `prop-prefixes-and-suffixes`, `slot-icons` : déjà couverts.
- `prop-rules`, `prop-validation`, `misc-custom-validation`, `misc-guide` : couverts par `Validation.stories.ts`.
- `prop-custom-colors` : contraire au DS.
- `slot-label` : slot non exposé.
- `slot-progress` avec loader personnalisé : slot `loader` utilisé en interne par Synapse.
- `misc-full-width-with-counter` : repose sur `v-combobox`.
- `misc-password`, `misc-login-form` : traités avec PasswordField.

#### PasswordField ↔ v-text-field (exemples mot de passe)

- **Passthrough** : indirect. Les attributs retombent sur le `SyTextField` racine, qui les transmet à `VTextField`. La prop `vuetifyOptions` ne s'applique réellement qu'aux boutons (clé `btn`).
- **Imposé par Synapse** : `type` (bascule afficher / masquer), slot `append-inner`, `disableErrorHandling=true` sur le champ interne.
- **Stories existantes** :
  - `PasswordField.stories.ts` : Default, Required, RequiredWithAsterisk, Disabled, ReadOnly, HelpText, HideDetails.
  - `Validation.stories.ts` : 12 stories de validation.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `v-textarea/misc-signup-form` (partie mot de passe) | Création de mot de passe : bon jeton `autocomplete`, règles de complexité (RGAA 11.13) | `autocompleteType="new-password"`, `customRules`, `helpText`, `required` | haute |
| `misc-login-form` | Connexion : e-mail + mot de passe | `label`, `autocompleteType="current-password"`, `placeholder` ; SyTextField `type="email"` | moyenne |
| `prop-clearable` | Bouton pour vider le mot de passe | `clearable` | moyenne |
| `prop-custom-colors` / `misc-guide` | Variante soulignée | `variantStyle="underlined"` | basse |

**Non retenus** :
- `misc-password`, `prop-messages` : déjà couverts.
- Couleurs arbitraires : contraires au DS.
- `density` et icônes `prepend-inner` : accessibles seulement en passthrough.

#### SyTextArea ↔ v-textarea

- **Passthrough** : oui. `inheritAttrs: false`, puis transmission à `VTextarea`. `rows`, `autoGrow`, `maxRows`, `noResize` et `autocomplete` passent sans être déclarés. Le `clearable` de Vuetify est remplacé par le bouton propre à Synapse.
- **Stories existantes** :
  - `SyTextArea.stories.ts` : Default, HelpText, Required, HideDetails, Clearable, AutoGrowCompact, Trim, ReplaceTabs, MaxLines, AutoWrap, Normalize.
  - `Validation.stories.ts` : 9 stories de validation.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-counter` | Compteur et longueur maximale | `counter`, `customRules` | haute |
| — (équivalent `v-text-field/prop-disabled-and-readonly`) | Désactivé et lecture seule | `disabled`, `readonly` | haute |
| `prop-auto-grow` | Agrandissement limité à N lignes | `autoGrow`, `maxRows` (passthrough), `helpText` | moyenne |
| `prop-browser-autocomplete` | Champ avec autocomplete (ex. `street-address`, RGAA 11.13) | `autocomplete` (passthrough) | moyenne |
| `prop-no-resize` | Poignée de redimensionnement désactivée | `noResize`, `rows` (passthrough) | basse |
| `prop-rows` | Hauteur initiale | `rows`, `rowHeight` (passthrough), `variant` | basse |

**Non retenus** :
- `usage`, `prop-clearable` : déjà couverts.
- `prop-background-color` : contraire au DS.
- `prop-icons` : conflit avec l'icône d'état et le bouton « vider », positionnés en absolu.
- `misc-signup-form` : couleurs arbitraires, et `type="password"` n'a pas de sens sur un textarea.

---

### 3.2 Selects

#### SySelect ↔ v-select

- **Passthrough** : partiel, vers le `VTextField` interne seulement. Le menu et la liste ne sont pas personnalisables. Pas de `vuetifyOptions`.
- **Slots** : `prepend`, `append`. **Événements** : `update:modelValue`, `prepend-icon-click`, `append-icon-click`.
- **Stories existantes** :
  - `SySelect.stories.ts` : Default, HelpText, Required, RequiredWithAsterisk, SlotPrepend, SlotAppend, WithTooltips, MultipleSelection, ChipsDisplay, WithCustomKey, Info, StringArray.
  - `Validation.stories.ts` : 9 stories de validation.
  - `Usages.stories.ts` : UsagePage.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-disabled` | Champ inactif | `disabled` | haute |
| `prop-readonly` | Valeur non modifiable, menu fermé | `readonly`, `modelValue` | haute |
| `prop-custom-title-and-value` | Clés personnalisées, objet complet renvoyé | `textKey`, `valueKey`, `returnObject`, `helpText` | moyenne |
| `prop-dense` | Les trois densités | `density` | moyenne |
| `slot-item` (partiel) | Options en texte enrichi (HTML filtré), texte brut dans le champ | `allowHtml`, `plainTextKey` | moyenne |
| `usage` (style de champ) | Contour ou souligné | `outlined`, `variantStyle` | basse |

**Non retenus** :
- `prop-menu-props`, `prop-list-props` : menu et liste figés.
- `prop-item-props` : pas de propriétés par option.
- `slot-item`, `prop-avoid-duplicate-text`, `slot-append-and-prepend-item`, `slot-selection`, `slot-menu-header-and-footer` : slots absents.
- `prop-multiple`, `prop-chips` : déjà couverts.

#### SyAutocomplete ↔ v-autocomplete (+ v-combobox)

- **Passthrough** : vers le `div` racine seulement. Pas de `vuetifyOptions`.
- **Slot** : `prepend-item`. **Événements** : `update:modelValue`, `search` (temporisé selon `debounce`).
- **Stories existantes** :
  - `SyAutocomplete.stories.ts` : Default, HelpText, Required, RequiredWithAsterisk, ReturnObjectWithCustomKeys, MultipleSelection, ChipsDisplay, ChipsWithCustomSelectionText, LoadingState, HideDetails, ReadonlyField, DisabledField, PrependItem, StringArray, WithCustomKeys.
  - `Validation.stories.ts` : 9 stories de validation.
  - `Accessibilite.stories.ts` : ComboboxKeyboardNavigation, LoadingAccessibility.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `v-autocomplete/misc-asynchronous-items` | Recherche côté serveur | `@search`, `debounce`, `filter: false`, `loading`, `hideNoData`, `placeholder`, `items` | haute |
| `v-combobox/slot-no-data` (version texte) | Message « aucun résultat », annoncé via la zone live | `noDataText` | moyenne |
| `v-autocomplete/prop-filter-keys` | Filtrage sur une autre propriété que le libellé | `plainTextKey`, `textKey` | moyenne |
| `prop-density` (les deux composants) | Les trois densités | `density` | moyenne |
| `v-combobox/prop-placeholder` | Texte indicatif dans le champ vide | `placeholder`, `multiple` | basse |

**Non retenus** :
- `prop-filter` : filtre fixe, pas de fonction personnalisée.
- `prop-items` : sous-titres et séparateurs non pris en charge.
- Slots `item`, `selection`, `menu-header`, `menu-footer` : absents.
- `misc-new-tab` : pas de `auto-select-first`.
- Exemples v-combobox (valeurs libres, chips personnalisées) : non supportés.
- `usage` (styles de champ) : aucune prop de style.

#### SyInputSelect ↔ v-select (déprécié)

Stories réalisables mais **déconseillées** vu la dépréciation : `prop-disabled` (`disabled`), `prop-readonly` (`readonly`), `usage` (`clearable`, `outlined`). Priorité basse.

#### SelectBtnField ↔ v-btn-toggle / v-chip-group

- **Passthrough** : vers le `div` racine seulement. Pas de `vuetifyOptions`.
- **Stories existantes** :
  - `SelectBtnField.stories.ts` : Default, Required, Multiple, Inline, ItemUnique, HelpText, Readonly.
  - `Validation.stories.ts` : 9 stories de validation.
  - `Usages.stories.ts` : UsagePage.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `v-chip-group/prop-column` | Beaucoup d'options en ligne avec retour à la ligne (ordre clavier) | `inline`, `items`, `multiple` | moyenne |
| `v-chip-group/prop-filter` + désactivé | Filtres multiples ; état désactivé jamais montré | `multiple`, `disabled` | moyenne |
| `v-chip-group/misc-toothbrush-card` | Choix unique dans une carte, nommé par un titre | `ariaLabelledby`, `items` | basse |

**Non retenus** :
- `prop-mandatory` : pas de prop, un nouveau clic désélectionne toujours.
- `prop-divided`, `prop-rounded`, `prop-variant` : contraires au DS.
- `misc-toolbar`, `misc-wysiwyg` : options en icônes seules non supportées (`text` obligatoire).
- `misc-reddit-categories` : purement décoratif.

---

### 3.3 Choix et formulaires

#### SyCheckbox ↔ v-checkbox

- **Passthrough** : non, les attributs arrivent sur le `div` racine.
- **Slots** : `label`, `default`. **Événements** : `update:modelValue`, `update:indeterminate`.
- **Stories existantes** : Default, Required, Indeterminate, HelpText, WithCycleIndeterminate, ValidationRules, DisabledState, ReadonlyState, DifferentDensities, CustomColors, Multiple.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `slot-label` | Libellé avec lien (CGU) | slot `label`, `v-model` | haute |
| `prop-states` | Grille des états (coché, non coché, indéterminé, chacun désactivé) | `modelValue`, `indeterminate`, `disabled` | moyenne |
| `prop-model-as-boolean` | Valeur du modèle en direct, valeurs personnalisées | `trueValue`, `falseValue`, `label` | moyenne |
| `misc-inline-textfield` | Case qui active un champ voisin | `v-model`, `ariaLabel` + `SyTextField :disabled` | basse |

**Non retenus** : `usage`, `prop-colors`, `prop-model-as-array` (déjà couverts).

#### SyCheckBoxGroup ↔ v-checkbox

- **Passthrough** : non, les attributs arrivent sur le `<fieldset>` racine. Aucun slot.
- **Stories existantes** : Default, Disabled, Required, RequiredWithAsterisk, Multiple, MultipleRequired, ListModel, CustomColors, DifferentDensities, Readonly, EventShowcase, HelpText, HideDetails.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-states` | Certaines options désactivées ou en lecture seule parmi des options actives | `options[].disabled`, `options[].readonly`, `multiple` | haute |
| `prop-model-as-boolean` (adapté) | Mode simple : une seule valeur ou `null` | `modelValue`, `multiple=false` | moyenne |

**Non retenus** :
- `slot-label` : aucun slot.
- `misc-inline-textfield` : sans objet pour un groupe.
- Autres exemples : déjà couverts.

#### SyRadioGroup ↔ v-radio-group

- **Passthrough** : oui. `inheritAttrs: false`, puis `v-bind="attrs"` sur `VRadioGroup`.
- **Slots** : `label`, `default`. **Événements** : `update:modelValue`, `change`.
- **Stories existantes** : Default, Required, RequiredWithAsterisk, CustomColors, DifferentDensities, Disabled, EventShowcase, Readonly, HideDetails, HelpText.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `slot-label` | Légende enrichie | slot `label` | haute |
| `prop-direction` | Radios en ligne | `inline` (passthrough), `options` | moyenne |
| `prop-model-group` | Radios écrits à la main (ex. une option désactivée) | slot `default`. **Attention** : `aria-checked` et le suivi du focus de Synapse sont alors perdus | moyenne |

**Non retenus** :
- `prop-model-radio` : radios seuls, hors groupe.
- `prop-colors`, `usage` : déjà couverts.

#### SyForm ↔ v-form

- **Passthrough** : implicite, `VForm` est la racine.
- **Stories existantes** : Basic, CustomValidation, MixedFields, SelectionFields, DateFields, VuetifyValidation, AsyncValidation, WarningAndSuccessRules, WithoutAutoValidation, ValidityState, FieldStates, ServerErrors, ExposedMethods.

**Stories à ajouter** : aucune.

**Non retenus** :
- `usage`, `rules-required`, `rules-async`, `misc-exposed` : déjà couverts.
- `prop-disabled`, `prop-fast-fail` : en passthrough seulement, et ignorés par la validation Synapse (résultat incohérent).
- `misc-vee-validate`, `misc-vuelidate` : bibliothèques tierces.

#### RangeField ↔ v-range-slider

- **Passthrough** : non. Personnalisation via `vuetifyOptions` (clés `rangeSlider` et `textField`).
- **Stories existantes** : Default, OtherRange, Customization.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `v-range-slider/prop-step` | Pas de 10, utile au clavier | `step`, `min`, `max` | haute |
| — (complément a11y) | Légende du groupe et libellés des champs et des poignées | `fieldsetLabel`, `textFieldMinLabel`, `textFieldMaxLabel`, `vuetifyOptions.rangeSlider.minLabel` / `maxLabel` | haute |

**Non retenus** :
- `prop-disabled`, `prop-strict`, `prop-vertical` : aucune prop.
- `slot-thumb-label` : aucun slot.
- Exemples `v-slider` : curseur simple, sans rapport.

#### RatingPicker ↔ v-rating

- **Passthrough** : non (sous-composants maison).
- **Slots** : `label`, `default`.
- **Stories existantes** : Default, TwoEmotions, Numbers, Stars, ReadOnly, HideAlert, DefaultSlot, AccessibilityBestPractices, NoLockAfterSelectionEmotion, NoLockAfterSelectionNumber, NoLockAfterSelectionStars.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-item-labels` | Libellés personnalisés | `itemLabels`, `type` | haute |
| `prop-icon-label` | Libellé accessible de chaque note | `locales` (`ratingAriaLabel`, `etoiles`, `thanks`…) | haute |
| `slot-item-label` (adapté) | Légende enrichie du groupe | slot `label` | moyenne |
| `misc-card` | Notation centrée dans une carte | `center`, `label`, `type` | basse |

**Non retenus** :
- `prop-color`, `prop-size`, `prop-density`, `prop-icons`, `prop-hover`, `prop-half-increments` : aucune prop, contraires au DS.
- `prop-clearable`, `prop-length`, `slot-item` : non supportés.
- `misc-card-overview`, `misc-advanced` : affichage d'une moyenne inexistant.

---

### 3.4 Tableaux

#### SyTable ↔ v-data-table

- **Passthrough** : oui, via `useTableProps` vers `VDataTable`. `inheritAttrs` n'est pas désactivé, donc les attributs arrivent aussi sur le `div` racine.
- **Imposé par Synapse** : `item-value`, `item-selectable`, `select-strategy`, `row-props`, `page`, `items-per-page`, `items`. Les slots `headers`, `colgroup`, `bottom` et `item.data-table-select` sont redéfinis.
- **Stories existantes** :
  - Default, ManyTables.
  - Colonnes (4), Filtres (9), FilterRules (4).
  - Lignes : ClickableRow, ExpandableRows.
  - Pagination (3), RowEditing (3), BulkActions (2), Sélection (2), Slots (4).
  - Tri : SortBy, MultiSort.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `slot-main` (partie `no-data`) | **État vide** | `items` vide, slot `#no-data` relayé, `caption` | haute |
| `misc-crud` | Ajout, modification, suppression via une boîte de dialogue | `#item.actions` (`edit`, `remove`), `@edit`, `@delete`, `#top` avec `TableToolbar` (`@add`) | moyenne |
| `slot-simple-checkbox` | Colonne booléenne avec case accessible | `#item.<key>` avec `SyCheckbox` | moyenne |
| `prop-dense` | Densité `compact` / `comfortable` | `density` | moyenne |
| `misc-external-paginate` | Pagination pilotée hors du tableau | `v-model:options`, `hide-default-footer` | basse |
| `misc-external-sort` | Tri piloté par des boutons externes | `v-model:options` (`sortBy`), `multi-sort` | basse |
| `prop-grouping`, `slot-group-header`, `slot-group-summary` | Lignes regroupées | `v-model:options` (`groupBy`), slots relayés. **À vérifier** avec l'en-tête maison | basse |

**Non retenus** :
- `headers-multiple` : une seule ligne d'en-têtes.
- `prop-item-selectable`, `prop-select-strategy`, `slot-item-data-table-select`, `prop-item-value`, `prop-return-object` : imposés ou interceptés par Synapse.
- `prop-search`, `prop-filter-keys`, `prop-custom-filter` : la pagination et l'annonce ARIA compteraient faux. Il faut filtrer en amont.
- `prop-hide-header-footer` (en-tête) : contraire au RGAA.
- `prop-sort-icon` : contraire au DS.
- `prop-headers-sort-raw` : absent du type.
- `prop-loading`, `slot-loading` : à faire après correction de la barre de chargement sans nom accessible (voir §5).
- `virtual*` : `VDataTableVirtual` non encapsulé.

#### SyServerTable ↔ v-data-table (exemples server)

- **Passthrough** : oui, vers `VDataTableServer`. `loading` et `search` passent bien. La barre de chargement est nommée (`locales.loading`).
- **Stories existantes** : mêmes catégories que SyTable, en version serveur.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `server-search` | Recherche globale côté serveur, retour en page 1 | `search`, `v-model:options`, `loading`, `server-items-length`, `#top` avec `TableToolbar` | haute |
| `slot-main` (partie `no-data`) | État vide ou réponse serveur vide | `items` vide, `server-items-length=0`, `#no-data` | haute |
| `slot-loading` | Chargement en squelette | `loading`, slot `#loading` | moyenne |
| `misc-crud` | CRUD avec rechargement serveur | `#item.actions`, `@edit`, `@delete`, `TableToolbar` (`@add`) | moyenne |
| `slot-simple-checkbox` | Colonne booléenne | `#item.<key>` avec `SyCheckbox` | basse |
| `prop-dense` | Densité | `density` | basse |

#### PaginatedTable ↔ v-data-table (déprécié)

Aucune story à ajouter : le composant est remplacé par SyTable / SyServerTable.

#### TableToolbar ↔ v-toolbar

- **Passthrough** : oui (`VToolbar` racine + `vuetifyOptions.toolbar`). `flat`, fond blanc, `height: auto` et `minHeight` sont imposés.
- **Slots** : `filters`, `search-left`, `search-right`.
- **Stories existantes** : Default, AddButton, Labels, Loading, NbFiltered, SlotFilters, OtherSlots, Customization.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `misc-tooltips-and-speed-dial` (infobulles seulement) | Boutons-icônes d'action avec nom accessible et infobulle | slot `#search-right` | moyenne |
| `v-data-table/server-search` | Barre avec un tableau serveur | `v-model:search`, `loading`, `nb-total`, `nb-filtered` (à mutualiser avec SyServerTable) | moyenne |

**Non retenus** :
- `prop-dense` : annulé par la hauteur imposée.
- `prop-collapse` : casse la mise en page.
- `prop-background` : contraire au DS.
- `prop-location` : hors usage.
- `prop-extended`, `slot-extension` : remplacés par le slot `filters`.
- `misc-contextual-action-bar` : doublon de `#bulk-actions`.
- Speed dial : pas d'équivalent DS.

---

### 3.5 Feedback et overlays

#### SyAlert ↔ v-alert

- **Passthrough** : oui, mais `type`, `closable`, `variant`, `density`, `color` et `border` sont imposés. `icon` et `close-label` sont remplacés par des slots.
- **Slots** : `default`, `icon`. **Événement** : `click:close`.
- **Stories existantes** : Default, Outlined, Density, SlotIcon, StatusMessage, UsagePage.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-type` | Les 4 types côte à côte (`error` jamais montré) | `type`, slot `default` | haute |
| `prop-content` | Titre et texte (exigé par la page Usages) | slot `default` | haute |

**Non retenus** :
- `prop-closable`, `prop-density`, `prop-variant`, `prop-outlined`, `prop-icon` : déjà couverts.
- `prop-border`, `prop-border-color` : imposés par Synapse.
- `prop-prominent`, `prop-rounded` : passthrough seulement, contraires au DS.

#### DialogBox ↔ v-dialog

- **Passthrough** : oui, mais `width` et `persistent` sont prioritaires. `vuetifyOptions` agit sur la carte et les boutons.
- **Slots** : `default`, `title`, `actions`. Le slot `activator` n'est pas exposé.
- **Stories existantes** : Default, ButtonTexts, HideActions, Persistent, ActionsSlot, TitleSlot, Width, VuetifyOptions, Scrollable, Draggable, Tutoriel, UsagePage.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `misc-form` | Formulaire dans la boîte (piège et retour du focus) | slot `default`, `title`, `confirmBtnText`, `cancelBtnText`, `@confirm`, `@cancel`, `v-model` | haute |
| `misc-nesting` | Boîtes imbriquées, restauration du focus en cascade | slot `default`, `v-model`, `title` | moyenne |
| `misc-loader` | Boîte de chargement non fermable | `persistent`, `hideActions`, `width`, `title` (obligatoire pour `aria-labelledby`) | moyenne |
| `misc-data-table` | Tableau dans une boîte large et scrollable | slot `default`, `width`, `scrollable` | basse |
| `misc-invite-dialog` | Contenu riche, actions personnalisées | slots `default`, `actions` | basse |

**Non retenus** :
- `usage`, `prop-model`, `misc-without-activator`, `prop-persistent`, `prop-scrollable`, `misc-overflowed` : déjà couverts.
- `prop-activator` : slot non exposé.
- `slot-default` : `isActive` non fourni.
- `prop-fullscreen`, `prop-transitions` : passthrough seulement, transitions contraires au DS.

#### NotificationBar ↔ v-snackbar / v-snackbar-queue

- **Passthrough** : non (implémentation maison). `vuetifyOptions` agit sur `icon` et `btn`.
- **Slots** : `default`, `action`, `action:<id>`.
- **Stories existantes** : Default, Success, Warning, Error, Bottom, CustomCloseBtnText, DefaultSlot, ActionSlot, Customization, WithClearQueue, ShowAll, UsagePage. Toutes utilisent `timeout: -1`.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-timeout` | Fermeture automatique (WCAG 2.2.1) | `timeout` > 0 | haute |
| `prop-multi-line` + `prop-vertical` | Message long (plus de 50 caractères) avec actions empilées | `message` long, slot `action` | moyenne |

**Non retenus** :
- `usage`, `v-snackbar-queue/usage` : déjà couverts.
- `prop-variants` : contraire au DS.

#### SyBtnMenu ↔ v-menu

- **Passthrough** : non. La prop `options` (`menu`, `btn`, `list`) est le seul accès aux props Vuetify.
- **Slots** : `prepend-icon`, `append-icon`, `content`, `header-list-item`, `default`, `footer-list-item`.
- **Stories existantes** : Default, MobileView, WithSlotPrependIcon, WithSlotAppendIcon, WithIconOnly, WithIdentityInList, WithLogoutItemSlot, WithCustomKeys, WithMultipleSlots, WithCustomStyles, WithStyledOptions.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `misc-popover` | Contenu libre à la place de la liste (la sémantique est alors à la charge du consommateur) | slot `content`, `primaryInfo` | moyenne |
| `prop-disabled` | Menu désactivé automatiquement quand il est vide | `hideLogoutBtn`, sans slot `default` (voir §5) | moyenne |
| `prop-location` | Position du menu | `options.menu.location` | basse |

**Non retenus** :
- `prop-rounded`, `misc-transition` : contraires au DS.
- `slot-activator-and-tooltip`, `misc-use-in-components` : activateur non exposé.
- `prop-absolute*`, `prop-positioningmenu` : menus contextuels, hors sujet.
- `prop-open-on-hover` : contraire au RGAA.
- `prop-submenu` : non géré au clavier.
- `prop-close-on-*` : peu d'intérêt.

#### ChipList ↔ v-chip / v-chip-group

- **Passthrough** : non. `vuetifyOptions` agit sur `chip`, `btn` et `icon`. Pas de `VChipGroup`, donc pas de sélection.
- **Événements** : `remove`, `reset`. Aucun slot.
- **Stories existantes** : Default, Success, Info, Warning, Error, ReadOnly, CustomResetText, WithOverflow, WithEvents, WithPrependStateIcon, WithAppendStateIcon, WithCustomIcon, Customization.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `misc-filtering` + `misc-in-selects` | Filtres actifs synchronisés avec un select multiple : retirer une puce désélectionne la valeur | `items`, `@remove`, `@reset`, `listAriaLabelledby` | haute |

**Non retenus** :
- `prop-colored`, `prop-outlined`, `prop-sizes` : contraires au DS, ou déjà couverts.
- `prop-label` : non typé.
- `prop-draggable`, `event-action-chips`, `misc-custom-list`, `misc-expandable` : comportements absents.
- Exemples v-chip-group : pas de sélection.

#### CollapsibleList ↔ v-expansion-panels

- **Passthrough** : implicite et non maîtrisé. Les attributs arrivent sur `VExpansionPanels` en mobile seulement, et sur un `div` en desktop.
- **Stories existantes** : Default (desktop uniquement).

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `usage` | Rendu mobile, seul cas où le panneau repliable est utilisé. Nécessite un viewport mobile Storybook, configuré nulle part | `listTitle`, `items`, `headingLevel` | haute |

**Non retenus** :
- `prop-variant` : imposé.
- `prop-disabled`, `prop-model`, `prop-readonly` : passthrough, en mobile seulement.
- `misc-advanced`, `misc-custom-icons` : aucun slot.

#### Accordion ↔ v-expansion-panels

- **Passthrough** : non (implémentation maison). `vuetifyOptions.accordion` règle les couleurs.
- **Slots** : `title`, `right-content`, `content`.
- **Stories existantes** : Default, IconPosition, CompactMode, WithObjectContent, CustomColors, CustomHeadingLevel, WithSlots, WithVModel, PreOpened, WithCustomContent, Density.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-disabled` | Section désactivée (`aria-disabled`, ni clic ni clavier) | `items[].disabled` | haute |
| `misc-advanced` | Formulaire dans le contenu, résumé de la saisie dans le titre | slots `title`, `content`, `v-model` | moyenne |
| `usage` | Une seule section ouverte à la fois, via `v-model` | `v-model`, `items` | basse |

**Non retenus** :
- `prop-model` : déjà couvert.
- `prop-variant`, `prop-readonly` : aucune prop.
- `misc-custom-icons` : chevron imposé, sa position est déjà couverte.

---

### 3.6 Navigation et boutons

#### SyPagination ↔ v-pagination

- **Passthrough** : non (balisage natif).
- **Slots** : `prepend`, `append`, `first-page`, `previous`, `next`, `last-page`, `page-number`.
- **Stories existantes** : Default, ManyPages, CustomButtons (emojis), Slots.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-icons` | Icônes précédent / suivant avec nom accessible (la story actuelle utilise des emojis) | slots `previous`, `next` avec `SyIcon` + texte masqué visuellement | haute |
| `prop-total-visible` | Effet du nombre de pages visibles | `pages`, `visible` | moyenne |

**Non retenus** :
- `prop-disabled` : aucune prop.
- `prop-rounded` : contraire au DS.
- `usage`, `prop-length` : déjà couverts.

#### SyTabs ↔ v-tabs

- **Passthrough** : vers `VSheet`. `vuetifyOptions` n'agit que sur les couleurs et la hauteur ; `tabs.showArrows` est typée mais inutilisée.
- **Slots** : `default`, `tabs-prepend`, `tabs-append`, `tab-prepend`, `tab-append`, `panel-N`.
- **Stories existantes** : Default, Disabled, WithVModel, WithTabsPrependSlot, WithTabsAppendSlot, WithTabPrependSlot, WithTabAppendSlot, WithCustomContent, ManyTabs, CustomTheme, NavigationMode, WithTabConfirmation.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `misc-dynamic` | Onglets ajoutés ou retirés dynamiquement (vérifie le focus) | `items` réactif, `v-model` | moyenne |
| `prop-align-tabs-title` | Titre de section avant les onglets | slot `tabs-prepend` avec titre sémantique | basse |
| `slot-tabs` | Icône et texte dans chaque onglet | `items`, slot `tab-prepend` avec `SyIcon` | basse |

**Non retenus** :
- `align-tabs-*`, `center-active`, `fixed-tabs`, `grow`, `stacked`, `spaced`, `direction`, `prop-icons`, `slider-transition`, `misc-overflow-to-menu` : aucune prop.
- `misc-mobile` : `label` obligatoire.
- `misc-content`, `misc-dynamic-height` : hors périmètre.
- `misc-pagination`, `misc-tab-items`, `usage` : déjà couverts.

#### SyIcon ↔ v-icon

- **Passthrough** : oui (`VIcon` racine), avec la directive `v-rgaa-svg-fix`.
- **Stories existantes** : Default, WithColor, WithSize, Decorative, WithRoleButton, ExplicitButtonRole, AutoDetectButtonRole, InformativeIcon, AccessibilityDemo.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `misc-buttons` | Icône décorative avant ou après le texte d'un bouton | `icon`, `decorative` dans un `VBtn` ; `start` / `end` en passthrough | haute |

**Non retenus** :
- `usage`, `event-click`, `prop-color` : déjà couverts.
- `misc-font-awesome`, `misc-md` : jeux d'icônes non utilisés par le DS.
- `misc-mdi-svg` : mode déjà utilisé partout.

#### SyIconButton ↔ v-icon-btn / v-btn

- **Passthrough** : oui (`VBtn` racine). Pas de `VIconBtn`, aucun slot.
- **Stories existantes** : Default, Disabled, WithColor, WithSize.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `v-icon-btn/misc-dialog` | Bouton « Fermer » d'une boîte de dialogue | `icon`, `label`, `@click-icon-button` | haute |
| `v-icon-btn/misc-table-actions` | Actions par ligne avec libellés uniques (RGAA) | `icon`, `label`, `size`, `@click-icon-button` | haute |
| `v-icon-btn/prop-active` | Activateur de menu avec `aria-expanded` | `icon`, `label` + passthrough (`aria-expanded`, `aria-haspopup`, `active`) | haute |
| `v-icon-btn/misc-markdown-editor` | Barre d'outils de boutons-icônes | `icon`, `label`, `size`, `variant` | moyenne |
| `v-btn/prop-variant` | Variantes (aucune story pour `variant`) | `variant` | moyenne |
| `v-btn/prop-icon` (density) | Densités | `density` (passthrough) | basse |

**Non retenus** :
- `prop-opacity`, `prop-rotate` : propres à `VIconBtn`.
- `misc-video-controls` : bascule avec `active-icon`, non supportée.

#### FooterBar ↔ v-footer

- **Passthrough** : oui (`VFooter` + `vuetifyOptions`).
- **Stories existantes** : Default, ChangeLinks, SlotPrepend, SlotAppend, ExtendedMode, SlotLogo, CollapsibleList, HideSectionLogo, HideSectionSocialMediaLinks, CustomSocialMediaLinks, LightTheme, CustomTheme, BackOffice, WithPhoneNumber.

**Stories à ajouter** : aucune. Tous les exemples réalisables sont déjà couverts ; les couleurs indigo et teal des exemples sont contraires au DS.

#### FilterSideBar ↔ v-navigation-drawer

- **Passthrough** : non. Toutes les props du drawer sont figées.
- **Stories existantes** : Default, ChipFormat, FilterCombination, Title, ZIndex.

**Stories à ajouter** : aucune parmi les exemples Vuetify. Voir les props manquantes en §4.

---

### 3.7 Dates, fichiers, chargement

#### DatePicker ↔ v-date-picker / v-date-input

- **Passthrough** : non vers Vuetify. `VDatePicker` reçoit des valeurs fixées par Synapse (`color="primary"`, `show-adjacent-months`, `first-day-of-week=1`).
- **Slots publics** : aucun (tous remplis en interne).
- **Stories existantes** : environ 60 stories réparties en CalendarMode, CombinedMode, DateInput (noCalendar), DateRange, GestionDesFormats, Validation, Accessibilité, Usages.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `v-date-picker/prop-readonly` + `v-date-input/usage` (désactivé) | Lecture seule et désactivé (aucune story CalendarMode ; `disabled` montré nulle part) | `readonly`, `disabled`, `modelValue`, `label` | haute |
| `v-date-picker/prop-events` | Marqueurs sur certains jours : fériés et week-ends | `displayHolidayDays`, `displayWeekendDays` | moyenne |
| `v-date-picker/usage` (actions) | Bouton « Aujourd'hui » | `displayTodayButton` | basse |
| `v-date-input/misc-passenger` | Date de naissance dans un vrai formulaire | `isBirthDate`, `required`, `displayAsterisk`, `hint`, `persistentHint` + SyForm | basse |

**Non retenus** :
- `usage`, `prop-model`, `misc-dialog-and-menu`, `prop-range`, `misc-birthday`, `misc-formatting*`, `prop-input-format`, `prop-prepend-icon`, `event-button-events` : déjà couverts.
- `prop-allowed-dates` (fonction), `prop-multiple` : non supportés.
- `prop-show-adjacent-months` : forcé par Synapse.
- `prop-show-current`, `prop-icons`, `prop-landscape`, `misc-orientation` : aucune prop.
- `slots-controls` : slot interne.
- `prop-colors`, `prop-elevation` : contraires au DS.
- `prop-width` : s'applique au champ, pas au calendrier.
- `misc-internationalization` : DS en français.

#### MonthPicker ↔ v-date-picker-month

- **Passthrough** : vers le champ texte seulement (c'est ainsi que passe `width`). Sélecteur maison.
- **Stories existantes** :
  - `MonthPicker.stories.ts` : Default, Required, CustomDisplayedYears.
  - Validation : 11 stories.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-readonly` (+ effaçable et désactivé) | Champ non modifiable, désactivé, effaçable (il existe un snapshot Cypress « disabled » mais aucune story) | `readonly`, `disabled`, `clearable` | haute |
| `usage` / `misc-birthday` | Ouverture sur la vue des années, ordre décroissant | `initialView="years"`, `yearsOrder="desc"`, `minYear`, `maxYear` | moyenne |
| `misc-internationalization` | Libellés et noms accessibles personnalisés | `locales` | basse |

**Non retenus** :
- `prop-allowed-months`, `prop-multiple`, `prop-show-current`, `prop-icons`, `misc-orientation` : aucune prop.
- `prop-colors` : contraire au DS.
- `usage`, `misc-dialog-and-menu`, `prop-width` : déjà couverts.

#### FileUpload ↔ v-file-upload / v-file-input

- **Passthrough** : aucun composant Vuetify. Les attributs sont appliqués deux fois (voir §5).
- **Slots** : `default`, `icon`, `action-text`, `or`, `button-text`, `info-text`. **Événements** : `update:modelValue`, `error`.
- **Stories existantes** : Default, MultipleFiles, Customization, WithFileList.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `v-file-input/prop-validation` + `prop-accept` | Formats et taille autorisés, erreurs affichées | `allowedExtensions`, `fileSizeMax`, `@error` (ex. dans une SyAlert) | haute |
| `v-file-upload/usage` (désactivé) | État désactivé, `aria-disabled` | `disabled` | haute |
| `v-file-upload/prop-content` + `v-file-input/prop-prepend-icon` | Textes et icône personnalisés sans tout remplacer | slots `icon`, `action-text`, `or`, `button-text`, `info-text` ; `locales` | moyenne |
| `v-file-input/prop-show-size` | Taille maximale avec d'autres unités | `fileSizeUnits`, `fileSizeMax`, slot `info-text` | basse |

**Non retenus** :
- `usage`, `prop-multiple`, `misc-list`, `slot-item` : déjà couverts (WithFileList).
- `prop-inset-file-list` : contrôles dans une zone `role=button`, problème d'accessibilité.
- `prop-scrim`, `prop-chips`, `slot-selection`, `misc-complex-selection`, `prop-counter`, `prop-dense` : non supportés.

#### HeaderLoading ↔ v-skeleton-loader

- **Passthrough** : oui (`v-bind="$attrs"` sur `VSkeletonLoader`). `type="heading"` est figé.
- **Stories existantes** : Default.

| Exemple Vuetify | Ce que ça montre | Props / slots Synapse | Priorité |
|---|---|---|---|
| `prop-loading` | Bascule chargement / contenu (`v-if` + `aria-busy` sur le parent), annoncé ou non | `standalone`, `ariaLabel`, `width`, `height` | haute |
| `misc-ice-cream` | Plusieurs titres factices de tailles différentes dans une carte | `width`, `height` (+ `tile` en attribut) | basse |

**Non retenus** :
- `prop-type` : type figé.
- `prop-elevation`, `prop-boilerplate` : sans intérêt pour le DS.

---

## 4. Props existantes jamais illustrées

Ces props, slots ou modes sont déclarés mais n'apparaissent dans aucune story. Ils sont sans équivalent Vuetify direct, mais utiles à documenter :

| Composant | Props / slots non illustrés |
|---|---|
| FilterSideBar | `modale` (focus bloqué, `aria-modal` : prioritaire RGAA), `locales`, `chipOverflowLimit` |
| ChipList | `listAriaLabel`, `listAriaLabelledby` |
| SyTabs | `lazy`, `modelValue` de type string |
| SyPagination | slot `page-number`, slot `append`, `ariaControls`, cas d'une seule page (le `<nav>` n'est pas rendu) |
| SyTextField | `type="number"` (boutons +/−, `areSpinButtonsHidden`), `type="tel"` |
| DatePicker | `showWeekNumber`, `textFieldActivator`, `headingLevel`, `title`, `density` |
| DialogBox | `headingLevel`, `autofocusValidateBtn` |
| SyBtnMenu | sélection avec `v-model` (`aria-current`), `iconKey`, slot `header-list-item` |
| NotificationBar | icône personnalisée ou supprimée (`icon: null`), `vuetifyOptions` |
| SyIcon | `width` |
| SyIconButton | `variant` |
| FooterBar | valeurs `partially-compliant` et `fully-compliant` de `a11yCompliance` |

---

## 5. Anomalies relevées

### Vérifiées dans le code

| Composant | Anomalie |
|---|---|
| RangeField | `thumbMinLabel` et `thumbMaxLabel` sont déclarées mais jamais transmises au curseur. Seul `vuetifyOptions.rangeSlider.minLabel` / `maxLabel` change les libellés des poignées. |
| HeaderLoading | `statusMessageId` est déclarée mais inutilisée. |
| SyCheckbox | `ariaDescribedby` est déclarée mais ignorée : l'`aria-describedby` réel est calculé à partir de `ariaLabelledby` et `helpText`. |
| SyBtnMenu | L'événement `logout` est déclaré mais jamais émis. |
| SyAlert | Aucune story pour le type `error`. |

### Signalées pendant l'analyse, à confirmer

| Composant | Anomalie |
|---|---|
| SyTable | La barre de chargement n'a pas de nom accessible, contrairement à SyServerTable. |
| SyTable | Les attributs non déclarés arrivent à la fois sur le `div` racine et sur le tableau : un écouteur `@keydown` se déclencherait deux fois. |
| SyTable | Une recherche passée via `search` fausse le pied de page et l'annonce du nombre de lignes. |
| FileUpload | Les attributs sont appliqués deux fois, sur le conteneur et sur la zone de dépôt. |
| CollapsibleList | Le `aria-label` vaut `item.text` en mobile et `item.ariaLabel` en desktop. |
| SyCheckBoxGroup | Le groupe écoute `focus` / `blur` sur des cases qui n'émettent pas ces événements. |
| SyBtnMenu | `hasListContent` ne tient pas compte de `menuItems` : avec `hideLogoutBtn` et sans slot, le menu est désactivé même s'il contient des éléments. |
| SyTabs | `vuetifyOptions.tabs.showArrows` est typée mais inutilisée. |
| NotificationBar | La clé `snackBar` de `config.ts` n'est utilisée nulle part. |
| RatingPicker | `freeTextLabel` est déclarée mais pas utilisée par le composant. |
| FooterBar | La prop `items` est déclarée mais jamais utilisée. |
