# Clavier et ARIA attendus par motif

Résumé opérationnel des motifs [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/), limité à ce qu'exige le RGAA 4.1.2 (critères 7.1, 7.3, 12.8, 12.9, 12.11). En cas de doute, l'APG et l'implémentation du composant DS de référence font foi.

| Motif | Rôles / attributs | Clavier | Focus |
|---|---|---|---|
| Dialog modal (`DialogBox`) | `role="dialog"`, `aria-modal="true"`, nom via `aria-labelledby` (titre) | `Tab`/`Shift+Tab` confinés, `Escape` ferme | Focus initial dans la modale ; rendu au déclencheur à la fermeture |
| Popover modal (`v-lock-focus`) | `role="dialog"` nommé ; déclencheur `aria-expanded` + `aria-controls` | `Escape` ferme (à coder : la directive ne le fait pas) | Idem dialog |
| Popover non modal | Déclencheur `aria-expanded` + `aria-controls` | `Escape` ferme | Pas de piège ; focus rendu au déclencheur si le focus était dedans |
| Bouton + listbox (`SyInputSelect`) | Déclencheur `aria-haspopup="listbox"`, `aria-expanded` ; liste `role="listbox"`, options `role="option"` + `aria-selected` | `Enter`/`Espace` ouvre, flèches parcourent, `Enter` choisit, `Escape` ferme | Focus rendu au déclencheur à la fermeture |
| Combobox (`SyAutocomplete`) | `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant` si focus virtuel | Flèche bas ouvre/parcourt, `Enter` choisit, `Escape` ferme | Le focus reste dans le champ |
| Tabs (`SyTabs`) | `tablist` > `tab` (`aria-selected`, `aria-controls`) ; `tabpanel` (`aria-labelledby`) | `←`/`→`, `Home`, `End` | Un seul onglet à `tabindex="0"`, les autres à `-1` |
| Accordéon (`Accordion`) | `<button>` dans un titre, `aria-expanded`, `aria-controls` | `Enter`/`Espace` bascule ; `↑`/`↓`/`Home`/`End` optionnels | — |
| Radio group (`RatingPicker`) | `radiogroup` nommé > `radio` + `aria-checked` | Flèches déplacent et sélectionnent | `tabindex` mobile sur l'élément coché |
| Menu bouton (`SyBtnMenu`) | Déclencheur `aria-haspopup`, `aria-expanded` ; `role="menu"` > `menuitem` | `Enter`/`Espace`/`↓` ouvre, `↑`/`↓` parcourent, `Escape` ferme | Premier item focalisé à l'ouverture ; rendu au déclencheur |
| Toolbar (`v-toolbar`) | `role="toolbar"` (posé par la directive), nommé si plusieurs | `←`/`→`/`↑`/`↓`, `Home`, `End` | `Tab` entre et sort ; mémoire du dernier élément |
| Slider (`RangeSlider`) | `role="slider"`, `aria-valuenow/min/max`, `aria-valuetext` si l'unité compte | Flèches ±1 pas, `Home`/`End` | — |
| Message dynamique | `role="status"` (poli) ou `role="alert"` (erreur bloquante) ; conteneur présent **avant** l'injection du texte | — | Le focus ne bouge pas |
