# Passer & typer les props vers Vuetify

Nos composants « enveloppent » un composant Vuetify (ex. `SyTextField` enveloppe `VTextField`).
Ce guide explique comment **laisser passer davantage de props** vers ce composant Vuetify, et
comment les **typer**, **sans casser les projets qui utilisent déjà le Design System**.

> Contexte : demande [#2417](https://github.com/assurance-maladie-digital/design-system-v3/issues/2417).
> Voir aussi la doc [vuetifyOptions](./vuetify-options.md).

---

## L'essentiel

- On veut faire **2 choses** : **(1)** typer les props Vuetify sur le wrapper, **(2)** faire
  passer les props manquantes vers le composant Vuetify en dessous.
- **Typer = presque toujours sans risque.** On ajoute des props acceptées, on n'en retire aucune.
- **Faire passer les props = risqué** si on déplace où atterrissent `class` / `style` / `id`.
  Ça, **on n'y touche pas** en version mineure.

---

## Mini-glossaire

| Terme | En clair |
|---|---|
| **`$attrs`** | Tout ce que le parent passe et qui n'est **pas** déclaré comme prop : `class`, `style`, `id`, écouteurs (`@click`)… |
| **Fallthrough** | Comportement par défaut de Vue : les `$attrs` « tombent » automatiquement sur l'élément **racine** du template. |
| **`inheritAttrs: false`** | Désactive ce fallthrough → à nous de placer les `$attrs` où on veut avec `v-bind="$attrs"`. |
| **Passthrough** | Le fait de transmettre des props/attrs du wrapper vers le composant Vuetify en dessous. |

---

## La règle d'or

> **Là où atterrissent `class` / `style` / `id` aujourd'hui fait partie du contrat public.**

Un projet peut styliser notre composant via `class` en comptant sur l'élément qui la reçoit
actuellement. Si on déplace cet élément, **son CSS casse** — même si aucune prop n'a changé.
Donc : **on ne déplace jamais le point de chute des `$attrs` en version mineure.**

Où ça tombe dépend de la racine du template. Toujours vérifier avant de modifier :

| Wrapper | Racine du template | `class`/`style` tombe sur… |
|---|---|---|
| `BackBtn` | `<VBtn>` | le `VBtn` (déjà le bon endroit) |
| `SyCheckbox` | `<div>` | le `<div>` |
| `ChipList` | `<div>` | le `<div>` |
| `SyCheckBoxGroup` | `<fieldset>` | le `<fieldset>` |
| `SyTextArea` | `<div>` (+ `inheritAttrs:false`) | transmis proprement au `VTextarea` |

---

## Cas 1 — Ajouter le typage des props Vuetify

**Objectif** : que l'IDE connaisse les props Vuetify sur notre wrapper.

**À faire** : élargir `defineProps` avec le type Vuetify. C'est additif (on accepte plus, on
n'enlève rien).

```ts
// on garde nos props maison ET on ajoute celles de VBtn
const props = defineProps<OwnProps & Partial<VBtn['$props']>>()
```

**⚠️ Le piège à connaître** : en Vue, **une prop déclarée disparaît de `$attrs`**. Donc si le
wrapper comptait sur le fallthrough pour transmettre (ex. `color`), la déclarer coupe son passage.
La solution : **quand on type, on transmet aussi explicitement** avec `v-bind`.

```vue
<!-- la racine EST le VBtn : on lui passe nos props, le reste (class/style) tombe dessus tout seul -->
<VBtn v-bind="props"> … </VBtn>
```

Résultat : mêmes props qu'avant sur le `VBtn`, mais **typées**. Rien ne change côté comportement.

---

## Cas 2 — Faire passer des props qui manquent

Concerne surtout les wrappers dont la racine est un **conteneur** (`SyCheckbox`, `ChipList`,
`SyCheckBoxGroup`) : aujourd'hui `class`/`style` tombent sur le `<div>`/`<fieldset>`.

**❌ À ne PAS faire** (ça casse) :

- Passer `inheritAttrs: false` puis renvoyer les `$attrs` vers le composant Vuetify interne
  → `class`/`style` **changent d'élément** → CSS des projets cassé.
- Ajouter `v-bind="$attrs"` sur l'enfant **sans** `inheritAttrs: false` → les attrs sont
  appliqués **deux fois** (id et classes en double).

**✅ À faire** : ajouter des **props explicites et typées** qui transmettent vers l'enfant, en
laissant `class`/`style` continuer de tomber sur la racine comme avant. C'est purement additif.

---

## Cas 3 — Typer la prop `vuetifyOptions`

Elle est typée aujourd'hui `Record<string, unknown>` (tout est accepté). La resserrer en
`{ VBtn?: … }` **casse** les projets qui passent d'autres formes.

**✅ À faire** : typer **et** rester permissif :

```ts
vuetifyOptions?: { VBtn?: Partial<VBtn['$props']> } & Record<string, unknown>
```

→ autocomplétion sur `VBtn`, tout le reste compile encore, aucun changement à l'exécution.

---

## Les 4 règles à retenir

1. **On ajoute, on ne retire jamais** une prop existante (et on ne la rend pas plus stricte).
2. **On ne déplace jamais** `class` / `style` / `id` d'un élément à un autre (contrat DOM).
3. **Typer ⇒ transmettre** : les deux vont toujours ensemble (sinon la prop ne passe plus).
4. **On déprécie, on ne supprime pas** : pour remplacer un ancien mécanisme, garder les deux le
   temps d'une transition (`@deprecated`).

Et on **verrouille par des tests** : une prop Vuetify arbitraire atteint bien le composant réel,
et `class`/`style` restent sur la racine actuelle (+ snapshots visuels).

---

## Récapitulatif des composants à migrer

Inventaire des wrappers **hors Amelipro**, recoupé avec la story Storybook *Accessibilité /
Design System / Avancement* (77 composants suivis). Les sous-composants internes et les
composants non concernés sont listés en fin de section. Légende :

- **Passthrough** : ✅ transmis · 🟡 uniquement via `vuetifyOptions` · ❌ absent
- **Typage** : ✅ basé sur le composant Vuetify · ❌ non typé / redéfini à la main
- **Cat.** : **A** = wrapper fin transparent · **B** = champ **à API restreinte** (n'expose
  volontairement qu'une partie des props Vuetify, pour protéger sa validation / son thème) ·
  **C** = composite (plusieurs composants Vuetify)

> **« API restreinte » / « liste blanche »** : le wrapper ne transmet pas *toutes* les props du
> composant Vuetify, seulement une liste choisie de props sûres. Les autres restent gérées en
> interne (ex. `SyTextField` garde la main sur la validation plutôt que de laisser passer les
> `rules` de Vuetify).

### A — Wrappers fins « transparents »

| Composant | Vuetify | Passthrough | Typage | Ce qui manque |
|---|---|:--:|:--:|---|
| `BackBtn` | `VBtn` | ✅ (`$attrs`) | ❌ | Typage `VBtn` (+ retirer le `v-bind="$attrs"` redondant) |
| `SyAlert` | `VAlert` | ✅ | ❌ | Typage `VAlert` |
| `SyTabs` | `VTabs` | ✅ | ❌ | Typage `VTabs` |
| `SyTable` | `VDataTable` | ✅ | ❌ | Typage `VDataTable` |
| `SyServerTable` | `VDataTableServer` | ✅ | ❌ | Typage `VDataTableServer` |
| `PaginatedTable` | `VDataTable` | ✅ | ❌ | Typage `VDataTable` |
| `HeaderLoading` | `VSkeletonLoader` | ✅ (`$attrs`) | ❌ | Typage `VSkeletonLoader` |
| `DownloadBtn` | `VBtn` | ✅ + `vuetifyOptions` | ❌ | Typer `vuetifyOptions.VBtn` |
| `BackToTopBtn` | `VBtn` | 🟡 | ❌ | Typer `vuetifyOptions.VBtn` (type importé mais inutilisé) |
| `CopyBtn` | `VBtn` | 🟡 | ❌ | Typer `vuetifyOptions` |
| `DataListItem` | `VChip` | 🟡 | ❌ | Typer `vuetifyOptions.VChip` |
| `PasswordField` | `SyTextField` | 🟡 | ❌ | Typer `vuetifyOptions` |
| `UserMenuBtn` | `VBtn` / `VListItem` | 🟡 | ❌ | Typer `vuetifyOptions` |
| `ChipList` | `VChip` | ❌ | ❌ | Transmettre les props au `VChip` + typage |
| `SyRadioGroup` | `VRadioGroup` | ❌ | ❌ | Passthrough + typage |
| `SocialMediaLinks` | `VBtn` | ❌ | ❌ | Passthrough + typage |
| `SyIconButton` | `VBtn` | ❌ | ❌ | Passthrough + typage |
| `SyForm` | `VForm` | ❌ | ❌ | Passthrough + typage (`VForm` : `disabled`, `readonly`…) |
| `PageContainer` | `VSheet` | ❌ | ❌ | Passthrough + typage |
| `CollapsibleList` | `VExpansionPanels` | ❌ | ❌ | Passthrough + typage |

### B — Champs de formulaire à API restreinte

| Composant | Vuetify | Passthrough | Typage | Ce qui manque |
|---|---|:--:|:--:|---|
| `SyTextArea` | `VTextarea` | ✅ | ✅ | *(rien — modèle de référence)* |
| `SyTextField` | `VTextField` | ✅ (restreint) | ❌ | Baser le typage sur `VTextField` (liste blanche) |
| `SySelect` | `VSelect` | ✅ (restreint) | ❌ | Typage `VSelect` (liste blanche) |
| `SyInputSelect` | `VSelect` / `VList` | 🟡 | ❌ | Typage `VSelect` |
| `SyAutocomplete` | `VAutocomplete` | ❌ | ❌ | Passthrough + typage |
| `SyCheckbox` | `VCheckbox` | ❌ | ❌ | Passthrough (liste blanche) + typage |
| `SyCheckBoxGroup` | `SyCheckbox` | ❌ | ❌ | Transmettre les props vers chaque case |
| `NirField` | `VTextField` ×2 | ❌ | ❌ | Passthrough + typage |

### C — Composites (customisation par sous-composant via `vuetifyOptions`)

| Composant | Vuetify principal | Passthrough | Typage | Ce qui manque |
|---|---|:--:|:--:|---|
| `DialogBox` | `VDialog` (+ `VBtn`…) | ✅ + `vuetifyOptions` | ❌ | Typer `vuetifyOptions` par sous-composant |
| `DatePicker` | `VMenu` + `VTextField` | ✅ | ❌ | `vuetifyOptions` typé par sous-composant |
| `ComplexDatePicker` | `VMenu` + `VTextField` | ✅ | ❌ | idem |
| `SyBtnMenu` | `VMenu` + `VBtn` | ✅ | ❌ | idem |
| `TableToolbar` | `VToolbar` | 🟡 | ❌ | Typer `vuetifyOptions` |
| `FooterBar` | composite | 🟡 | ❌ | `vuetifyOptions` par sous-composant |
| `SubHeader` | composite | 🟡 | ❌ | idem |
| `ExternalLinks` | `VBtn` / `VList` | 🟡 | ❌ | Typer `vuetifyOptions` |
| `LangBtn` | `VMenu` / `VListItem` | 🟡 | ❌ | idem |
| `CookieBanner` | composite | 🟡 | ❌ | idem |
| `DiacriticPicker` | `VBtn` (grille) | 🟡 | ❌ | idem |
| `FilterInline` | `VMenu` | ❌ | ❌ | Passthrough + typage |
| `FilterSideBar` | composite | ❌ | ❌ | Passthrough + typage |

### Non concernés

- **Couverts *via* leurs enfants `Sy*`** — ils ne rendent aucun composant Vuetify directement,
  mais composent des wrappers DS et leur transmettent déjà la config (ex. `RangeField` →
  `v-bind="options.textField"` sur ses deux `SyTextField`). Le passthrough/typage Vuetify se
  règle **dans l'enfant** (déjà listé ci-dessus), pas ici : `RangeField`, `PhoneField`,
  `PeriodField`, `SelectBtnField`, `SearchListField`, `ContextualMenu`, `MonthPicker`,
  `RatingPicker`, `LunarCalendar`, `UploadWorkflow`, `FileUpload`, `FileList`, `FilePreview`,
  `DateTextInput`, `CalendarMode`, `DataListGroup`, `NotificationBar` (→ `Notification`).
- **Markup natif / aucun composant Vuetify à configurer** : `Accordion` (`<component :is>`),
  `SyPagination` (`<nav>`), `FranceConnectBtn`, `SkipLink`, `Logo`, `LogoBrandSection`,
  `SyHeading`, `SyIcon`.
- **Pages** : `ErrorPage`, `MaintenancePage`, `NotFoundPage`, `DeclarationAccessibilityPage`.
- **Structure / composites d'en-tête** : `HeaderBar`, `HeaderToolbar`, `HeaderNavigationBar`,
  `ToolbarContainer`.
- **Sous-composants internes** : `Notification`, `TableHeader`, `TableBulkActions`,
  `OrganizeColumns`, `Pagination`, `MonthPickerVisual`, `HorizontalNavbar`, `IconSlot`,
  `DataList`, `Captcha*`, `Cookies*`, `StatusPage`, `Usages` *(démo)*.

> ⚠️ **Cas particulier — `Accordion`** : il expose une prop `vuetifyOptions`, mais elle est
> **détournée de son sens**. Accordion ne rend aucun composant Vuetify ; le contenu sert
> uniquement à des couleurs CSS (`vuetifyOptions.accordion.{backgroundColor, titleColor,
> hoverColor…}`), appliquées en classes/variables. Ce ne sont donc pas des props Vuetify, et la
> clé `accordion` n'est pas un composant Vuetify (contrairement à la convention `vuetifyOptions`
> — voir [vuetifyOptions](./vuetify-options.md)). À terme : renommer la prop (`colors` / `theme`)
> ou la faire passer par les tokens, plutôt que `vuetifyOptions`. *(Pas du code mort : les valeurs
> sont bien lues.)*

---

## Dans quel ordre migrer (du plus sûr au plus risqué)

| Ordre | Quoi | Risque |
|:--:|---|:--:|
| 1 | Typer les wrappers dont la racine **est** déjà le composant Vuetify (`BackBtn`…) | aucun |
| 2 | Typer `vuetifyOptions` en gardant le `Record` permissif | aucun |
| 3 | Ajouter des props explicites qui transmettent, sur les wrappers conteneurs (`ChipList`…) | aucun |
| 4 | Tout ce qui oblige à **déplacer les `$attrs`** | **à garder pour une version majeure** |

**En résumé** : l'essentiel de #2417 se fait **sans rien casser** (cas 1, 2 et 3). Le seul vrai
breaking — déplacer les `$attrs` sur les wrappers conteneurs — attend une version majeure.

> Tous les wrappers ne sont pas concernés : certains sont des composites, ou restreignent
> volontairement l'API (validation, thème). Voir la catégorisation dans l'audit #2417.
