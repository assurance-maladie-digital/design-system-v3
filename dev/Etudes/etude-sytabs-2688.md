## SyTabs : couleur des onglets non sélectionnés (#2688)

Issue : [#2688](https://github.com/assurance-maladie-digital/design-system-v3/issues/2688). PR : #2696.

### Constat

Les titres des onglets non sélectionnés sont bleus (couleur primaire) alors que la maquette Figma les montre gris.

### Cause

`src/components/Customs/SyTabs/config.ts` : `tab['base-color']` valait `rgb(var(--v-theme-primary))`, la même valeur que `active-color`. Les onglets actif et inactifs avaient donc la même couleur de texte ; seul le slider distinguait l'onglet actif.

La couleur est appliquée par `SyTabs.vue:627` (`color: v-bind("options.tab['base-color']")`). Le survol et le focus utilisent `active-color`, l'onglet désactivé `rgba(var(--v-theme-on-surface), 0.38)`.

### Valeur attendue

Mesurée sur la capture Figma de l'issue (pixels du texte) :

| Onglet | Couleur |
|---|---|
| Non sélectionné (« PAR ORGANISME », « PAR VILLE ») | `#545859` |
| Sélectionné (« PAR DÉPARTEMENT ») | `#0C419A` |
| Fond | `#F8F9FC` |

`#545859` correspond exactement au token `grey.base` (`--v-theme-grey-base`).

### Correctif de la PR #2696

`tab['base-color']` passe à `rgb(var(--v-theme-grey-base))`, et `SyTabs.mdx` documente la nouvelle valeur par défaut. `active-color` et `slider-color` ne changent pas.

Rendu mesuré dans Storybook (story `Default`, couleur calculée par le navigateur) :

| Thème | `--v-theme-grey-base` | Onglet actif | Onglets inactifs |
|---|---|---|---|
| cnam | `84,88,89` | `#0C419A` | `#545859` |
| pa | `84,88,89` | `#0C419A` | `#545859` |
| ap | `84,88,89` | `#006386` | `#545859` |

Dans les trois thèmes, le rendu correspond à la maquette.

### Recommandation

Correctif conforme : la valeur correspond au token `grey.base` et à la maquette, et seuls les onglets non sélectionnés changent. Reste à couvrir la couleur par un test et à signaler le changement de rendu (voir ci-dessous).

### Accessibilité

| Paire | Contraste | Seuil |
|---|---|---|
| `#545859` sur blanc | 7,2:1 | 4,5:1 (texte) |
| `#545859` sur `#F8F9FC` (fond Figma) | 6,84:1 | 4,5:1 |
| `#0C419A` sur blanc (actif cnam/pa) | 9,38:1 | 4,5:1 |
| `#006386` sur blanc (actif ap) | 6,71:1 | 4,5:1 |

- Entre gris et primaire, le contraste est faible (1,3:1 en cnam/pa, 1,07:1 en ap) : la couleur seule ne permet pas de repérer l'onglet actif. Ce n'est pas un défaut (RGAA 3.1 / WCAG 1.4.1) : l'onglet actif est aussi signalé par le slider de 3 px et par `aria-selected`. Avant la PR, la couleur ne distinguait pas du tout l'onglet actif.
- Survol et focus passent en couleur primaire : un retour visuel existe sur les onglets inactifs.

### Tests

- Les tests visuels Cypress passent sur la PR **sans mise à jour des baselines** : `sy-tabs-default` et `sy-tabs-second-active` changent de couleur de texte, mais l'écart reste sous le seuil `failureThreshold: 0.01` (1 % des pixels, `cypress/support/component.ts:102`). Ils ne protègent donc pas cette correction.
- Aucun test unitaire ne vérifie la couleur (happy-dom ne calcule pas les styles).
- Ajouté dans `SyTabs.visual.cy.ts` : « displays inactive tabs in grey and the active tab in primary (issue #2688) ». Il vérifie la couleur calculée (`have.css 'color'`) de l'onglet actif (`rgb(12, 65, 154)`) et des deux onglets inactifs (`rgb(84, 88, 89)`), sans dépendre du seuil des snapshots ni produire de baseline. Avec l'ancienne valeur (`--v-theme-primary`), il échoue.
- Régénérer les baselines via le workflow « Update Visual Test Snapshots » pour qu'elles reflètent le nouveau rendu.

### Contrat

Changement visuel du rendu par défaut, sans changement d'API. Les consommateurs qui surchargent `vuetifyOptions.tab['base-color']` ne sont pas concernés. Une ligne dans `dev/ReleasesAlerts/` est recommandée, car un consommateur qui comptait sur des onglets inactifs en couleur primaire verra le rendu changer.

### Décision

- [ ] Correctif cnam / pa / ap : conforme à la maquette.
- [x] Test Cypress sur la couleur calculée.
- [ ] Note dans `ReleasesAlerts`.
