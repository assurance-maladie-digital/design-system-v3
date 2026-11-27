## Problème

Issue #2682 — Déclinaison d'une fonctionnalité : ajout d'une prop `density` sur un maximum de composants.

**Demande :** permettre de configurer la densité des composants, comme ce qui a été fait pour SyAlert (#2450) et Accordion (#2481). L'exemple cité est `PasswordField`, jugé « massif » par défaut dans les interfaces du Portail des Opérations (projet IPDO_X). Impact déclaré non bloquant.

**Cadrage du besoin :** la demande porte sur une prop **publique, typée et documentée**. Il faut noter que deux mécanismes offrent déjà une densité sur certains composants, sans constituer un contrat (voir « Ce qui fonctionne déjà »). La valeur ajoutée du ticket est donc autant dans la **contractualisation** (type, doc, stories) que dans l'implémentation elle-même.

## État actuel

### Convention en place

- Signature : `density?: 'default' | 'comfortable' | 'compact'`, valeur par défaut `'default'` (rétrocompatibilité totale).
- Deux modes d'implémentation :
  - **Passthrough Vuetify** : `:density="props.density"` sur le composant sous-jacent (SyTextField → VTextField, SySelect → VField, tables, etc.).
  - **Classes CSS maison** : `sy-accordion--density-*` + SCSS scopé, pour les composants sans équivalent Vuetify (Accordion).
- Documentation associée : control `density` (select) dans `argTypes` des stories + story de comparaison des trois densités (modèle SyAlert), mention dans le `.mdx`.

### Fragmentation des types — dette existante

Le même concept est déclaré trois fois, avec des définitions divergentes :

- `DensityType` dans `src/types/vuetifyTypes.ts` = `'comfortable' | 'compact'` — **sans `'default'`** (utilisé dans `FooterBar/config.ts`, `CopyBtn/config.ts` pour des options internes) ;
- un second `DensityType` local dans `src/components/LunarCalendar/types.ts` = `'default' | 'comfortable' | 'compact'` ;
- `TableDensityType` dans `src/components/Tables/common/types.ts` = `'default' | 'comfortable' | 'compact'` ;
- plus une dizaine de littéraux inline dans les props des composants (dont SyAutocomplete qui ajoute `| undefined`).

L'absence de `'default'` dans le type partagé explique vraisemblablement pourquoi tout le monde redéclare le littéral.

### Ce qui fonctionne déjà (sans prop déclarée)

Point important relevé en repasse : sur certains composants, la densité est **déjà configurable aujourd'hui**, par deux voies non contractuelles :

1. **Fallthrough d'attributs** : pour les wrappers à racine unique dont le composant racine déclare `density`, l'attribut passe naturellement. `<PasswordField density="compact">` fonctionne vraisemblablement déjà (racine = `SyTextField`, `inheritAttrs` par défaut). Non typé, non documenté, invisible dans Storybook.
2. **`vuetifyOptions`** : les composants utilisant `useCustomizableOptions` (dont PasswordField et RangeField) acceptent `vuetifyOptions` en *deep-merge* — `vuetifyOptions: { density: 'compact' }` ou `{ textField: { density: 'compact' } }` atteint déjà le champ sous-jacent.

⚠️ **Piège de régression** : déclarer `density` en prop **sans la binder explicitement** casserait le fallthrough actuel (les props déclarées sont consommées et ne redescendent plus). Tout ajout de prop doit donc être accompagné du `:density="props.density"` correspondant, sous peine de régression silencieuse pour les consommateurs utilisant déjà l'attribut.

Inversement, `SyTextArea` a `inheritAttrs: false` : aucune voie implicite aujourd'hui, l'ajout de la prop est un vrai travail.

### Composants exposant déjà `density`

| Composant | Implémentation |
|---|---|
| SyAlert | Passthrough VAlert + SCSS par densité (icône, marges) |
| Accordion | Classes CSS `sy-accordion--density-*` |
| SyTextField | Passthrough VTextField |
| SySelect | Passthrough VField |
| SyAutocomplete | Passthrough champ interne |
| SyCheckbox / SyCheckBoxGroup | Passthrough Vuetify |
| SyRadioGroup | Passthrough Vuetify |
| NirField, PeriodField | Propagation vers les champs enfants |
| MonthPicker | Via `useTextField` (props mappées vers SyTextField) |
| **DatePicker** | Prop sur `DatePickerCommonProps`, propagée aux inputs via `buildCalendarModeActivatorTextFieldProps`, `buildCalendarModeComplexDatePickerProps`, `buildComplexDatePickerMenuTextInputProps` — complète |
| SyTable, SyServerTable + filtres (Text, Number, Period, Select, Date, Autocomplete) | Passthrough VDataTable et champs de filtres |
| LunarCalendar | Prop typée par son `DensityType` local |

### Composants sans prop `density`

**Champs de formulaire** (cœur du cas d'usage) :

- **PasswordField** — demande explicite. Racine unique = SyTextField : la densité fonctionne déjà via fallthrough et `vuetifyOptions`. Travail = contractualiser (prop typée + bind explicite + doc/story). ⚠️ icônes `append-inner` dimensionnées en dur (voir vigilances).
- **PhoneField** — racine `<fieldset>`/`<div>`, pas de `vuetifyOptions` : rien ne fonctionne aujourd'hui. Vrai câblage requis vers le SySelect indicatif et le SyTextField numéro.
- **SyTextArea** — `inheritAttrs: false`, props forwardées via un computed `Partial<VTextareaProps>` : ajouter la prop et la forwarder.
- **RangeField** — VRangeSlider + deux SyTextField via `useCustomizableOptions` : `vuetifyOptions.textField.density` fonctionne déjà ; décision à prendre sur l'intérêt d'une prop dédiée + propagation au slider (VSlider supporte `density`).
- **SelectBtnField** — markup 100 % maison (boutons), aucun champ Vuetify : implémentation CSS type Accordion à créer.
- **SearchListField** — racine `<div>` ; champ de recherche + liste de SyCheckbox (déjà `density="compact"` en dur en interne).

**Composites :**

- **SyPagination** — composant maison (liens `<a>`) : implémentation CSS à créer.
- **PaginatedTable** — densités déjà fixées en interne (`compact`/`comfortable`) : n'exposer que si besoin réel.
- **SyInputSelect** — champ factice avec classes `v-btn--density-default` codées en dur + VList : faisable, effort moyen.
- **SyIconButton** — wrapper VBtn : densité pertinente pour un bouton icône, priorité basse.
- **DataList, ExternalLinks, CollapsibleList** — basés sur VList qui accepte `density` : passthrough possible, priorité basse.
- **FilterInline / FilterSideBar, DialogBox, ChipList, DiacriticPicker, UploadWorkflow, RatingPicker, TableToolbar, Captcha** — n'encapsulent que des VBtn/VCard/VDialog : densité marginale, la prop `size` couvre l'essentiel du besoin. À exclure sauf demande explicite.
- **Boutons** (BackBtn, CopyBtn, DownloadBtn, LangBtn, FranceConnectBtn, BackToTopBtn, UserMenuBtn) — idem : `size` suffit.
- **Amelipro** (~80 composants) — charte et système de tailles propres : hors périmètre, ticket dédié si besoin.

## Alternative à évaluer avec le demandeur

Avant de décliner la prop partout, vérifier le besoin réel d'IPDO_X : si l'objectif est « **tous les champs plus compacts** », une densité globale via `defaults` de leur instance Vuetify (ex. `VTextField: { density: 'compact' }`) répond au besoin **sans aucun développement DS** — les composants étant des passthroughs, la valeur par défaut Vuetify se propage. Si le besoin est **granulaire** (un champ compact dans un écran sinon dense), seule la prop par composant convient.

Réponse probable : les deux. Recommandation : livrer les lots ci-dessous **et** documenter la possibilité de surcharge globale côté consommateur dans la doc du starter.

## Solution proposée

### Convention cible

1. **Prop** : `density?: 'default' | 'comfortable' | 'compact'`, défaut `'default'` via `withDefaults`, **toujours bindée explicitement** au composant sous-jacent (cf. piège fallthrough).
2. **Type partagé** : étendre `DensityType` de `src/types/vuetifyTypes.ts` à `'default' | 'comfortable' | 'compact'`, et l'utiliser dans les nouvelles props. Harmonisation des déclarations existantes (LunarCalendar, TableDensityType, littéraux inline) dans un chantier distinct pour ne pas diluer le ticket — ou opportunistement sur les fichiers déjà touchés.
3. **Pas de densité globale dans `vuetifyConfig.ts`** : un `defaults.VTextField.density` côté librairie changerait le rendu par défaut de tous les consommateurs = cassure visuelle.
4. **`vuetifyOptions` inchangé** : la prop dédiée devient le contrat documenté ; le deep-merge reste disponible en dernier recours, la prop explicite prime par construction (bind direct).

### Découpage recommandé

| Lot | Composants | Effort | Justification |
|---|---|---|---|
| 1 — Champs | PasswordField, PhoneField, SyTextArea, SearchListField | Faible | Cœur du cas d'usage ; racines déjà prêtes ou câblage direct |
| 2 — Champs délégués | RangeField, SyInputSelect, SelectBtnField | Moyen | Arbitrage prop vs `vuetifyOptions` (RangeField) ; markup maison ou classes en dur à refactorer |
| 3 — Composites maison | SyPagination, PaginatedTable, SyIconButton, DataList/VList-based | Moyen/faible | Selon remontée réelle du besoin |
| Exclus | Boutons (`size` suffit), conteneurs de boutons (DialogBox, FilterSideBar…), Amelipro | — | Valeur ajoutée marginale |

### Travaux par composant

- Prop + défaut `'default'` + bind explicite.
- Stories : control `density` + story comparative des trois densités (modèle SyAlert) ; `.mdx` mis à jour (toute prop publique est documentée).
- Tests unitaires boîte noire : asserter la classe de densité (`v-input--density-compact`, `v-field--density-*`, classe maison) — test de régression particulièrement utile sur PasswordField qui fonctionne déjà par fallthrough.
- `*.a11y.spec.ts` uniquement si markup modifié ; baselines visuelles régénérées en CI/Ubuntu pour les rendus changés.
- `releasesAlerts/vX.X.X/` : ajout de props publiques = changement de contrat non cassant, note par lot.

### Points de vigilance

- **PasswordField** : bouton œil `size="26"` en dur et `padding-right: 48px` sur `.v-field__input` : vérifier l'alignement en `compact` (hauteur de champ 56 → 40 px), ajuster si nécessaire.
- **PhoneField** : densité unique appliquée au SySelect *et* au SyTextField — vérifier l'alignement vertical des deux champs à chaque densité (hauteurs identiques en théorie, à confirmer visuellement).
- **SelectBtnField / SyPagination / SyInputSelect** : conserver des cibles de clic raisonnables en `compact` (WCAG 2.2 §2.5.8 ≥ 24 px — hors RGAA 4.1.2 mais bonne pratique ; référence maison : `.v-selection-control` à 40 px dans `_forms.scss`).
- **SearchListField** : la checkbox interne est en `compact` en dur — décider si la prop la pilote ou reste interne.
- **Ne pas propager aveuglément** `density` aux enfants dans les composites sans validation visuelle (un slider ou une liste dense n'ont pas les mêmes effets qu'un champ).
- **Risque global faible** : props additives à défaut neutre ; risque concentré sur les éléments maison et les dimensions en dur.

## Changement de contrat

- Ajout d'une prop publique `density` : **non cassant** (défaut = rendu actuel).
- Extension du type partagé `DensityType` : non cassant.
- Harmonisation des types existants : reporter sur un chantier dédié ou limiter aux fichiers touchés.
- À documenter dans `releasesAlerts/vX.X.X/` avant la fin de la PR.


## Avant de demander la review

**Général**

- [ ] PR bien nommée (Composant : descriptif), pointe vers la bonne branche, issue liée
- [ ] Maquettes respectées (équipe design informée si évolution) et design tokens utilisés
- [ ] Aucun impact sur les usages existants (défaut `'default'` inchangé ; fallthrough existant préservé par le bind explicite), responsive vérifié
- [ ] Deploy + SKSN checks OK

**Documentation**

- [ ] Story créée ou mise à jour (control `density` + story comparative des trois densités)
- [ ] Prop documentée dans le `.mdx` de chaque composant modifié
- [ ] Changement de contrat documenté dans `releasesAlerts/vX.X.X/`

**Tests**

- [ ] Tests unitaires ajoutés ou mis à jour (classe de densité vérifiée via le DOM)
- [ ] Test `*.a11y.spec.ts` ajouté ou mis à jour si markup modifié

## Checklist Accessibilité obligatoire

- [ ] Pas d'erreurs axe-core sur la story
- [ ] Pas d'erreur Tanaguru
- [ ] Faux positifs documentés
- [ ] Page d'accessibilité mise à jour si nécessaire
- [ ] Tests mis à jour
- [ ] Snapshot visuel mis à jour (CI/Ubuntu) pour les rendus modifiés
- [ ] Tests manuels :
  - [ ] Restitution vocale des composants modifiés
  - [ ] Navigation clavier complète à chaque densité
  - [ ] Zoom texte 200 % (10.4) et viewport 320 px (10.11) : pas de perte de contenu ni de fonctionnalité en mode `compact`
