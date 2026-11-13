## SyTabs : casse des libellés et couleurs des onglets (#2770)

Issue : [#2770](https://github.com/assurance-maladie-digital/design-system-v3/issues/2770). PR : #2792.

### Constat

Un projet souhaite des libellés d’onglets avec seulement la première lettre en majuscule (« Tous les virements ») et des couleurs propres : onglets inactifs en `#545859`, onglet actif en `#006386`. L’issue indique qu’il est impossible de changer la casse et la couleur des onglets.

### Cause

- **Casse** : `SyTabs.vue` affichait `item.label.toUpperCase()` dans les cinq variantes du bouton d’onglet (lien de routeur, lien `href`, versions désactivées, bouton). Le texte était transformé avant le rendu : aucune classe ni règle CSS ne pouvait rétablir la casse d’origine.
- **Couleurs** : elles étaient déjà personnalisables via `vuetifyOptions.tab` (`base-color`, `active-color`, `slider-color`), appliquées en CSS par `v-bind()`. Cet usage n’était pas illustré dans la documentation.

### Correctif de la PR #2792

- Les libellés sont rendus tels qu’ils sont fournis (`{{ item.label }}`).
- La casse visuelle est portée par la règle CSS `text-transform` de `.sy-tabs__button`, alimentée par `v-bind("options.tab['text-transform']")`, comme les autres options d’onglet.
- Nouvelle option `vuetifyOptions.tab['text-transform']`, typée `'none' | 'capitalize' | 'uppercase' | 'lowercase'`. La valeur par défaut `uppercase` (`config.ts`) conserve le rendu existant, notamment dans `HorizontalNavbar`.
- Story `CustomTabStyles` : le cas de l’issue, avec `text-transform: 'none'` et les couleurs `#545859` / `#006386`. Contrastes sur fond blanc : 7,2:1 et 6,71:1 (AA).
- Documentation (`SyTabs.mdx`) : option ajoutée à l’exemple de `vuetifyOptions`, story `CustomTabStyles` affichée à côté de `CustomTheme`.

### Accessibilité

Mettre en majuscules par le CSS plutôt que dans le texte est la pratique recommandée : les lecteurs d’écran reçoivent le libellé d’origine et ne risquent plus d’épeler des mots écrits entièrement en capitales comme des sigles.

### Tests

- Unitaires (`SyTabs.spec.ts`, `HeaderNavigationBar.spec.ts`) : le texte rendu est le libellé d’origine.
- Composant dans le navigateur (`SyTabs.visual.cy.ts`) : `text-transform` calculé vaut `uppercase` par défaut et `none` avec l’option. Ces vérifications sont faites dans Cypress, car les styles scopés et leurs `v-bind()` ne sont pas appliqués dans l’environnement Vitest.

### Changement de contrat

Changement de comportement non cassant, décrit dans `dev/ReleasesAlerts/v1.2.2/SyTabs/casse-libelles-text-transform.md` : le texte du DOM suit désormais la casse d’origine, ce qui peut casser les tests des projets consommateurs qui recherchent le libellé en majuscules.
