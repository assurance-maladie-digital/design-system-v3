# Étude — SyTextField : textes de moins de 24 px, non gras, au contraste inférieur à 4,5:1

## Description du bug

**Constat :** des textes visibles, sans graisse et de moins de 24 px, ont un contraste inférieur à 4,5:1 (RGAA 3.2, WCAG 1.4.3). Pour un texte normal, le seuil est 4,5:1. Le seuil de 3:1 ne s'applique qu'à un texte de 24 px ou plus, ou gras de 18,66 px ou plus.

**Périmètre mesuré :** les 25 stories `SyTextField` et `SyTextField/Validation`, dans le thème `cnam` (par défaut), sur les fonds Storybook `main` (`#e7ecf5`, fond par défaut des stories) et `surface` (`#ffffff`).

**Méthode :**

- Storybook lancé en local et rendu dans Chromium headless (Playwright). Les mesures portent sur les styles calculés réels.
- `axe-core` 4.13, règle `color-contrast`.
- Un script complémentaire calcule le contraste de chaque nœud de texte visible : couleur RGBA × opacités cumulées des ancêtres, mélangée au premier fond opaque. axe classe en « incomplete » (`bgOverlap`) les textes posés sur l'outline des champs : le script couvre ces cas.
- Calculs revérifiés à la main (formule WCAG).

**Constats confirmés :**

| # | Élément | Stories | Couleur rendue | Taille / graisse | Contraste `#e7ecf5` | Contraste `#fff` |
|---|---|---|---|---|---|---|
| C1 | Texte d'aide `helpText` (`.v-messages__message`, classe `help-text-as-hint`) | `HelpText`, `PatternValidation`, `EmailValidation` | `rgba(34, 35, 36, 0.6)` | 14 px / 400 | **3,99:1** (axe : violation) | **4,24:1** |
| C2 | Préfixe et suffixe (`.v-text-field__prefix`, `.v-text-field__suffix`) | `WithPrefixAndSuffix` | `rgba(34, 35, 36, 0.6)` | 16 px / 400 | **3,99:1** (fond du champ blanc : 4,24:1) | **4,24:1** |
| C3 | Libellé flottant, champ rempli à l'état neutre (`.v-field-label--floating`) | `WithPrefixAndSuffix` (valeur initiale `42`, pas encore validée) | `rgb(84, 88, 89)`, `opacity: 0.6` | 12 px / 400 | **2,61:1** | **2,80:1** |
| C4 | Texte d'aide sous le champ quand un message est affiché (`.help-text-below`) | toute story qui combine `helpText` et un message | même règle que C1 | `--v-fontSize-liensEtLibelles` / 400 | ≈ 3,99:1 (par calcul) | ≈ 4,24:1 (par calcul) |

**Faux positifs écartés :**

- `ExternalMessages` : les messages à 1,01:1 sont des messages **sortants**, pendant la transition `slide-y-transition-leave-active`. Ils ont disparu une fois l'animation finie.
- `<span class="d-sr-only">` pour le préfixe et le suffixe : texte réservé aux lecteurs d'écran, non visible.
- Boutons `VBtn` `error`, `warning`, `success`, `primary` et `black` : classés « incomplete » par axe, mais le calcul sur les couleurs du thème donne au minimum 5,73:1 (`error` `#B33F2E` sur `#FFFFFF`). Ils sont conformes, et leur texte est en gras.
- Libellé flottant d'un champ rempli qui a une couleur d'état (erreur, avertissement, succès) : `opacity` 1 et couleur d'état, conforme.
- Le libellé d'un champ vide, le placeholder et le texte saisi n'ont pas été relevés.

## Cause racine

- **C1, C2, C4 — opacité « medium emphasis » de Vuetify appliquée au texte.** `SyTextField.vue:1048` (`.help-text-as-hint`) et `:1054` (`.help-text-below`) fixent `color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))`. Pour le préfixe et le suffixe, la même couleur vient de la feuille de style de Vuetify (`VTextField.css:49`, `.v-text-field__prefix, .v-text-field__suffix`). Vuetify fixe `--v-medium-emphasis-opacity` à **0,60** pour un thème clair (`node_modules/vuetify/lib/composables/theme.js:40`), et le DS ne la surcharge pas. `on-surface` (`#222324`) à 60 % donne au mieux 4,24:1 sur blanc. Le seuil de 4,5:1 n'est donc atteint sur aucun fond.
- **C3 — opacité du libellé à l'état neutre.** Vuetify applique `.v-label { opacity: var(--v-medium-emphasis-opacity) }`. `SyTextField` remet l'opacité à 1 pour les états erreur, avertissement et succès (`--v-medium-emphasis-opacity: 1`, `SyTextField.vue:887` et `:948`), mais pas pour l'état neutre. Un champ rempli et pas encore validé (valeur initiale, champ réinitialisé, `disableErrorHandling`…) affiche son libellé flottant à 60 %. Le gras de `src/assets/overrides/_typography.scss:342` (`.v-field--active .v-label.v-field-label { font-weight: 700 }`) ne s'applique pas ici : la graisse mesurée est 400. Même en gras, un texte de 12 px reste soumis au seuil de 4,5:1.
- **Introduit dans :** le texte d'aide en `medium-emphasis` vient de `ef22b7662` « SyTextField: fix after audit rgaa v2 (#935) » (août 2025). Il a été repris pour `.help-text-as-hint` dans `ffd067620` (#2231). Le préfixe, le suffixe et le libellé neutre suivent le comportement par défaut de Vuetify depuis l'origine du composant.
- **Hors du périmètre des stories :** le défaut est dans le composant de production, pas dans les stories. Il ne vient pas des corrections de la branche, qui ne touchent ni le markup ni les styles du composant.

## Correction proposée (non appliquée)

Il y a deux options, à arbitrer dans un ticket dédié. Les deux changent le rendu.

### Option A — Corriger `SyTextField` (recommandée)

1. `SyTextField.vue` : remplacer `rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))` par `rgb(var(--v-theme-on-surface))` dans `.help-text-as-hint` et `.help-text-below`. Le contraste passe de 4,24:1 à 15,74:1 sur blanc et 13,28:1 sur `#e7ecf5`. On peut aussi garder une opacité réduite à 0,75 ou plus (6,91:1 sur blanc, 6,28:1 sur `#e7ecf5`) pour conserver une hiérarchie visuelle.
2. Préfixe et suffixe : surcharge scopée `:deep(.v-text-field__prefix), :deep(.v-text-field__suffix) { opacity: 1; color: rgb(var(--v-theme-on-surface)); }` en état neutre.
3. Libellé neutre : appliquer `--v-medium-emphasis-opacity: 1` (ou `opacity: 1` sur `:deep(.v-label.v-field-label)`) à `.basic-field`, comme pour les états. Le gris `#545859` à 100 % donne 7,2:1 sur blanc. À 0,75, on reste sous le seuil (3,89:1).
4. Variables CSS du thème (`--v-theme-*`) uniquement, sans valeur en dur, conformément à `AGENTS.md`.

### Option B — Variable de thème globale

Surcharger `medium-emphasis-opacity` dans `vuetifyConfig.ts` pour les thèmes `cnam`, `pa`, `ap` et `ap2026`. Une valeur de 0,75 ou plus suffit pour C1, C2 et C4.

- Avantage : corrige d'un coup tous les composants qui utilisent le même pattern. Le dépôt en compte 7 : `SyTextField`, `SySelect`, `SelectBtnField`, `SyRadioGroup`, `SyCheckbox`, `SyCheckBoxGroup`, `NirField`.
- Inconvénients : change le rendu de tous les composants Vuetify et des projets consommateurs qui utilisent cette variable, et invalide de nombreuses baselines visuelles. Ne règle pas C3 à 0,75 (3,89:1) : il faudrait 1.

### Commun aux deux options

- **Test de régression en vrai navigateur :** happy-dom ne calcule pas les styles, donc les tests `vitest-axe` ne vérifient pas le contraste. Ajouter à `SyTextField.visual.cy.ts` (Cypress, Electron) une vérification axe `color-contrast` sur un champ avec `helpText`, avec `prefix` et `suffix`, et rempli à l'état neutre. `axe-core` est déjà dans les dépendances. À défaut, comparer `getComputedStyle` aux seuils.
- **Baselines visuelles :** mettre à jour au minimum `sy-text-field-with-value.snap.png` et les captures avec texte d'aide, après validation manuelle, sur Linux natif ou en CI (pas sous WSL).
- **`dev/ReleasesAlerts/` :** signaler le changement visuel (texte d'aide, préfixe, suffixe et libellé plus foncés).
- **Contrôle croisé :** mesurer les autres thèmes (`pa`, `ap`, `ap2026`) et, si l'option A est retenue, ouvrir des tickets pour les 6 autres composants.

## Reproduction / vérification

1. `pnpm storybook`, ouvrir `SyTextField / Help Text` sur le fond par défaut. Inspecter `.v-messages__message` : `color: rgba(34, 35, 36, 0.6)` sur le fond `#e7ecf5` donne 3,99:1.
2. `SyTextField / With Prefix And Suffix` : préfixe « € » et suffixe « TTC » à 4,24:1. Libellé flottant « Montant » : `opacity: 0.6`, 2,80:1 sur blanc.
3. Script d'audit (Playwright + axe, hors dépôt) : la règle `color-contrast` remonte une violation sur le texte d'aide de `HelpText`, `PatternValidation` et `EmailValidation`. Le calcul par nœud ajoute les cas C2 et C3.
4. Après correction : relancer l'audit sur les 25 stories et vérifier qu'aucun texte visible de moins de 24 px ne reste sous 4,5:1, sur les deux fonds.

## Impact

- **Sévérité :** moyenne. Non-conformité RGAA 3.2 sur des textes d'information : aide à la saisie, unités, libellé d'un champ rempli. Elle touche les utilisateurs malvoyants et tous les projets consommateurs.
- **Introduit dans :** `ef22b7662` (#935) pour le texte d'aide. Comportement par défaut de Vuetify pour le préfixe, le suffixe et le libellé neutre.
- **Utilisateurs concernés :** tous les projets qui utilisent `SyTextField` ou un composant construit dessus (`PhoneField`, `NirField`, `PasswordField`, `DatePicker`…). Probablement aussi les 6 autres composants qui ont le même pattern (à mesurer).
- **Zones à risque :** rendu visuel (baselines Cypress), contraste dans les autres thèmes, éventuelles surcharges de couleur côté consommateurs.

## Checklist

- [x] Constats mesurés sur le rendu réel (Chromium, styles calculés) et revérifiés à la main.
- [x] Faux positifs identifiés et écartés (transitions, `d-sr-only`, boutons).
- [x] Cause racine localisée (`SyTextField.vue:1048`, `:1054`, `VTextField.css:49`, `.v-label` de Vuetify, `theme.js:40`).
- [ ] Choix entre l'option A et l'option B (ticket dédié).
- [ ] Test de régression de contraste en vrai navigateur.
- [ ] Baselines visuelles et note `ReleasesAlerts`.
- [ ] Mesures sur les thèmes `pa`, `ap`, `ap2026` et sur les 6 composants qui ont le même pattern.
