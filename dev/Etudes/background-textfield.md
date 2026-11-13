# Étude — SyTextField : apparence en lecture seule

## Problème

Le fond blanc par défaut d’un champ en lecture seule ressemble à celui d’un champ modifiable. L’état doit disposer de couleurs dédiées sans diminuer l’opacité de tout le champ ni bloquer la sélection du texte ou le focus.

## Correction

En lecture seule (`readonly`) et hors état désactivé (`disabled`), les couleurs suivantes sont utilisées :

| Élément | Token CSS |
|---|---|
| Fond blanc par défaut | `--v-theme-surface-bright` |
| Bordure | `--v-theme-on-disabled` |
| Libellé à l’intérieur du champ | `--v-theme-on-surface` |
| Libellé flottant en haut | `--v-theme-grey-base` (`#545859`) |

La couleur du libellé flottant correspond au « on-surface-variant » de la maquette. Dans les thèmes actuels du dépôt, ce nom désigne un gris très clair ; `grey-base` fournit la valeur attendue `#545859`, sans modifier le token global.

Les valeurs sont utilisées avec `rgb(var(--v-theme-…))`. Le fond est opaque et ne dépend plus de la couleur de la page par mélange. Les tokens suivent le thème actif.

Un fond personnalisé via `bgColor` reste conservé. La bordure et le libellé utilisent néanmoins les couleurs de lecture seule. Les champs désactivés conservent leur présentation habituelle. Le texte reste sélectionnable, le champ peut recevoir le focus et sa valeur ne peut pas être modifiée.

Le fond est calculé réactivement dans `SyTextField`. La classe `sy-textfield-readonly` applique les couleurs de bordure et de libellé, avec une opacité pleine pour ces éléments. En état d’erreur, la bordure et le libellé conservent les couleurs de validation. Au focus, la bordure retrouve sa couleur habituelle (`primary` hors erreur), pour maintenir un repère visible au clavier.

## DatePicker en mode calendrier

Le champ interne du DatePicker est toujours `readonly` pour empêcher la frappe, même lorsque le calendrier permet de choisir une date. Ce cas ne doit pas prendre l’apparence d’un composant réellement en lecture seule.

- DatePicker utilisable : fond blanc opaque habituel, bordure et libellé habituels.
- DatePicker avec sa prop publique `readonly` active : les trois tokens de lecture seule sont appliqués.
- Fond personnalisé : conservé dans les deux états.

L’activateur transmet le blanc sous la forme `rgb(var(--v-theme-white-base))` lorsqu’il est utilisable. La classe interne `calendar-activator-editable`, transmise au `VTextField` interne, exclut également ce cas des styles de bordure et de libellé de lecture seule.

Les composants reposant sur `SyTextField` héritent de ces styles lorsqu’ils sont en lecture seule. `PeriodField`, qui compose deux DatePicker, conserve son apparence habituelle dans ses états utilisables `default`, `required` et `with-value`.

## Fichiers concernés

- `src/components/Customs/SyTextField/SyTextField.vue` : fond et styles de lecture seule.
- `src/components/Customs/SyTextField/SyTextField.mdx` : documentation des tokens et des fonds personnalisés.
- `src/components/Customs/SyTextField/tests/SyTextField.spec.ts` : fond, classe d’état, transitions et maintien des états personnalisés ou désactivés.
- `src/components/Customs/SyTextField/tests/SyTextField.visual.cy.ts` : couleurs de bordure au repos, au focus et après blur, maintien des couleurs de validation en erreur.
- `src/components/DatePicker/CalendarMode/props/buildCalendarModeActivatorTextFieldProps.ts` : distinction entre activateur utilisable et lecture seule.
- `src/components/DatePicker/CalendarMode/tests/DatePicker.spec.ts` : fond, classe de l’activateur et transitions.
- `dev/ReleasesAlerts/v1.2.2/SyTextField/champ-lecture-seule.md` : changement visuel observable et conduite à tenir.

## Vérifications

Les tests ciblés doivent vérifier le fond rendu, les transitions de `readonly`, les fonds personnalisés et le maintien des attributs natifs `readonly` / `disabled`.

À contrôler visuellement dans Storybook avec les thèmes CNAM, PA et AmeliPro :

- fond, bordure et libellé conformes aux tokens, sur fond blanc et coloré ;
- bordure et libellé au repos, au survol et au focus, dans les variantes outlined et underlined ;
- lisibilité, sélection du texte et navigation clavier, avec une bordure `primary` au focus ;
- bordure et libellé conservant les couleurs de validation en état d’erreur, au repos et au focus ;
- DatePicker utilisable conservant ses couleurs habituelles et DatePicker en lecture seule utilisant les nouveaux tokens ;
- composants dérivés en lecture seule et maintien des fonds personnalisés.

Les références visuelles readonly doivent être réexaminées avec ces nouvelles couleurs. Les références des états utilisables de DatePicker et PeriodField ne doivent pas être mises à jour pour un changement de fond readonly. Les baselines officielles doivent être générées sous Linux natif ou en CI, après inspection des diffs, jamais sous WSL.

## Impact consommateur

Changement visuel non cassant, sans nouvelle prop, événement ou slot public. Les surcharges CSS éventuelles de bordure et de libellé readonly sont à vérifier. Les captures précédemment acceptées pour le fond transparent doivent être réévaluées : elles ne représentent plus le rendu attendu.

## Suivi — harmonisation des autres champs

`SySelect` (qui utilise directement `VTextField`), `SyAutocomplete` et `SyTextArea` conservent leur ancien rendu en lecture seule. Leur harmonisation reste hors du périmètre de cette PR. Un ticket de suivi doit couvrir les tokens de fond, bordure et libellé, les fonds personnalisés, les états désactivés et en erreur ainsi que le focus clavier, avec des tests de régression et une validation visuelle CNAM / PA / AmeliPro.
