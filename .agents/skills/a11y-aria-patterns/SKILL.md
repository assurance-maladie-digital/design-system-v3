---
name: a11y-aria-patterns
description: Use when creating or modifying an interactive Synapse component or markup that behaves like a dialog, popover, menu, listbox, combobox, tabs, accordion, radio group, slider or toolbar, or when choosing ARIA roles, states, keyboard behaviour or focus handling in Vue/Vuetify code of this repository.
metadata:
  inspired-by: "num3robis/ai11y-copilot-prompts (aria-widget-patterns) — structure seulement, aucun contenu repris"
  target: "RGAA 4.1.2 / WCAG 2.1 AA"
---

# Motifs ARIA dans Synapse

Un motif interactif se **réutilise** avant de se réimplémenter. Le DS couvre déjà la plupart des motifs APG ; un nouveau composant compose ces briques ou suit leur implémentation.

## Démarche

1. Identifier le motif APG (tableau ci-dessous, détail clavier dans [references/patterns.md](references/patterns.md)).
2. Si un composant DS le couvre, l'utiliser ou l'étendre. Sinon, lire son implémentation de référence avant d'écrire.
3. Pour la gestion du focus, utiliser les directives du DS : `vLockFocus`, `vToolbar` ([doc/Directives/README.md](../../../doc/Directives/README.md)).
4. Couvrir le motif selon le skill `a11y-testing`.

## Correspondance motif → DS

| Motif APG | Composant DS de référence | Mécanisme |
|---|---|---|
| Dialog modal | `DialogBox` | VDialog + piège et restitution du focus internes : ne pas ajouter `vLockFocus` |
| Popover / panneau modal | `HeaderBurgerMenu`, `FilterSideBar` | `v-lock-focus` + `Escape` + retour du focus au déclencheur |
| Bouton + listbox | `SyInputSelect`, `LangBtn` | `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` (si ouvert) |
| Combobox | `SyAutocomplete` | VAutocomplete + `role="status"` pour le nombre de résultats |
| Tabs | `SyTabs` | `tablist`/`tab`, `tabindex` mobile, flèches, `Home`/`End` |
| Accordéon | `Accordion` | bouton `aria-expanded` + `aria-controls` |
| Radio group | `RatingPicker` (Stars/Number/Emotion) | `radiogroup`, `aria-checked`, flèches |
| Menu bouton | `SyBtnMenu` | `role="menu"`, `menuitem`, `<li role="presentation">` |
| Toolbar | `ExternalLinks` | `v-toolbar` |
| Slider | `RangeField` (`RangeSlider`) | `role="slider"`, `aria-valuenow/min/max` |
| Bouton icône | `SyIconButton` (`label` obligatoire) | — |
| Message dynamique | `CopyBtn`, `ChipList`, `SyTable` | `role="status"` (poli) ; `role="alert"` réservé aux erreurs bloquantes |

## Règles

- **ARIA dès le premier rendu** : `role` et états (`aria-expanded`, `aria-controls`…) sont déclarés dans le template, liés à l'état réactif (props du composant Vuetify ou `v-bind`). Si l'élément est généré par Vuetify et n'accepte pas l'attribut par ses props, le poser de façon **synchrone** dans `onMounted`, jamais dans `nextTick` / `setTimeout`. Un état invalide transitoire se corrige dans le composant, pas dans le test. Contre-exemple connu, à ne pas imiter : `SySelect` (ARIA posé en `nextTick` et `setTimeout`).
- `aria-controls` ne pointe que vers un id présent dans le DOM.
- Pas de `tabindex` > 0 ; `tabindex="-1"` seulement pour un focus programmatique ou un *roving tabindex*.
- Tout overlay modal : focus initial dedans, piège du focus, fermeture sur `Escape`, focus rendu au déclencheur (`nextTick(() => trigger.focus())`).
- Ids générés avec `useId()` de Vue, jamais en dur.
- Faux positifs Tanaguru connus (`DialogBox`, `RatingPicker`, `SyTabs`) : voir [doc/Accessibilite/README.md §5](../../../doc/Accessibilite/README.md#5-faux-positifs-connus-tanaguru) avant de « corriger » un motif conforme.

## Critères vérifiables

- [ ] Le motif est réalisé avec le composant DS correspondant, ou l'écart est justifié.
- [ ] Rôles, états et propriétés ARIA conformes au motif APG, présents dès le premier rendu.
- [ ] Toutes les touches du motif ([references/patterns.md](references/patterns.md)) sont gérées.
- [ ] Overlay modal : piège du focus (`DialogBox` ou `v-lock-focus`), `Escape`, focus restitué au déclencheur.
- [ ] Groupe de boutons d'action en barre : `v-toolbar`.
- [ ] Aucun `tabindex` positif ; ids issus de `useId()`.
- [ ] Chaque `aria-controls` / `aria-labelledby` référence un id existant.
