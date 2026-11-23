# Règles axe → critères RGAA 4.1.2

Correspondance indicative pour rattacher une violation axe à un critère RGAA (le skill `rgaa` détaille chaque critère). axe ne couvre qu'une partie des critères : un test axe vert ne vaut pas conformité.

| Règle axe | Critère(s) RGAA | Remarque Synapse |
|---|---|---|
| `image-alt`, `svg-img-alt`, `role-img-alt` | 1.1, 1.2 | Icônes : `SyIcon` |
| `color-contrast` | 3.2 | Peu fiable en happy-dom/jsdom (pas de styles calculés) : vérifier en Cypress (`a11y-contrast`) |
| `link-name` | 6.2 | |
| `button-name` | 11.9 | `SyIconButton` / `aria-label` depuis `locales` |
| `aria-allowed-attr`, `aria-prohibited-attr` | 7.1 | Souvent un `role` manquant ou posé trop tard |
| `aria-valid-attr`, `aria-valid-attr-value` | 7.1 | Id référencé absent, valeur hors liste |
| `aria-required-attr`, `aria-required-children`, `aria-required-parent` | 7.1 | Structure du motif APG incomplète |
| `aria-hidden-focus` | 7.1, 10.8 | Élément focalisable dans un conteneur `aria-hidden` |
| `duplicate-id-aria` | 8.2 | Ids en dur : utiliser `useId()` |
| `nested-interactive` | 7.1 | Bouton dans un bouton / lien |
| `heading-order`, `empty-heading` | 9.1 | `SyHeading` |
| `list`, `listitem` | 9.3 | |
| `label`, `label-title-only`, `form-field-multiple-labels` | 11.1, 11.2 | Ne jamais ignorer sans justification |
| `select-name` | 11.1 | |
| `tabindex` | 12.8 | `tabindex` > 0 |
| `frame-title` | 2.1 | |
| `td-headers-attr`, `th-has-data-cells` | 5.6, 5.7 | `SyTable` |
| `region` | — | Ignorée : composant isolé hors page |
