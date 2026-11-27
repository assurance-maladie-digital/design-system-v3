# Étude ciblée — overlays, Escape et focus

Date : 26/11/2026. Branche : `fix/locales-hardcoded-strings`.
Base : `586976034d961e7e0540da8dbe7d50dcc882a5fb`, arbre initial propre.

## Objectif

Déterminer si l'harmonisation proposée dans `dev/Issues/06-a11y-overlays-focus-escape.md` est nécessaire et sûre pour l'accessibilité.

**Conclusion : ne pas appliquer systématiquement `v-lock-focus`.** L'issue mélange navigation de page, menus non modaux et dialogues modaux. Il faut harmoniser les contrats clavier selon ces motifs, pas imposer un mécanisme unique. Aucun fichier de production ni test n'a été modifié pendant cette étude.

Cette étude prolonge B7/R4 de `dev/Etudes/inventaire-defauts-transverse.md` et en corrige le diagnostic : absence de gestion clavier propre ne prouve pas absence de gestion clavier effective.

## Protocole et limites

- Lecture des composants listés dans l'issue, de la directive, des tests associés et des guides Directives / Accessibilité.
- Vérification des sources amont au tag exact Vuetify `v3.12.2`, version déclarée dans `package.json:151`. Les dépendances locales existent et les tests fonctionnent, mais leur lecture directe est bloquée par les règles d'exclusion de l'outil, même après demande de portée ; elles n'ont pas été inspectées ni modifiées.
- Sources amont effectivement consultées :
  - https://raw.githubusercontent.com/vuetifyjs/vuetify/v3.12.2/packages/vuetify/src/components/VMenu/VMenu.tsx
  - https://raw.githubusercontent.com/vuetifyjs/vuetify/v3.12.2/packages/vuetify/src/components/VOverlay/VOverlay.tsx
  - https://raw.githubusercontent.com/vuetifyjs/vuetify/v3.12.2/packages/vuetify/src/components/VDialog/VDialog.tsx
  - https://raw.githubusercontent.com/vuetifyjs/vuetify/v3.12.2/packages/vuetify/src/composables/focusTrap.ts
- Exécution des tests existants, sans mise à jour de snapshots ni génération du rapport a11y.
- Aucun parcours réel de tabulation dans un navigateur ni essai VoiceOver/NVDA. Les défauts déduits du code sont distingués des résultats exécutés. Aucun taux de conformité RGAA global : étude limitée au clavier et au focus, pas audit des 106 critères. Les thèmes hors périmètre ne sont pas déclarés NA.

## Résultats exécutés

```sh
pnpm vitest run src/components/ContextualMenu src/components/Tables/common/organizeColumns src/components/DialogBox src/components/CookieBanner src/components/SyBtnMenu src/components/DiacriticPicker src/components/MonthPicker src/components/FilterSideBar src/components/HeaderBar/HeaderBurgerMenu src/components/SyNavListPanel --exclude='**/*.snippets.spec.ts' --coverage.enabled=false
pnpm vitest run src/components/SyNavList --coverage.enabled=false
```

- Première commande : **28 fichiers, 219 tests réussis**. Le chemin `src/components/SyNavListPanel` n'existe pas ; la seconde commande couvre son vrai dossier parent.
- Deuxième commande : **5 fichiers, 89 tests réussis**, dont les snippets de SyNavList.
- Total : **33 fichiers, 308 tests réussis**. Avertissements Vue d'injection `registerHeaderMenu` et de fournisseurs Vuetify redéclarés ; pas d'échec.
- Aucun test dédié d'OrganizeColumns trouvé/exécuté. Sa présence parmi les filtres de la première commande ne constitue donc pas une validation de ce composant.
- Axe passe sur les scénarios existants exécutés, pas nécessairement sur tous les états ouverts. Axe ne valide pas à lui seul Escape, l'ordre réel de tabulation ou le retour du focus.

## Responsabilités exactes de Vuetify 3.12.2

- `VOverlay` écoute Escape sur `window`, ferme uniquement l'overlay `globalTop` non `persistent`, et focalise son activateur si le focus était dans son contenu.
- `VMenu` active `captureFocus`, mais pas `retainFocus` par défaut. Aux limites de tabulation, son gestionnaire ferme le menu et focalise l'activateur, puis laisse l'action Tab se poursuivre. Ce n'est pas un confinement modal.
- `useFocusTrap` inscrit un overlay au registre de bouclage Tab **si `retainFocus` est vrai**. `captureFocus` n'est pas un remplacement de ce bouclage : il gère une capture initiale conditionnelle.
- `VDialog` met `retainFocus: true` par défaut et possède aussi un watcher de restitution vers son activateur à la fermeture.
- Un dialogue ouvert par un simple `@click` externe n'a pas nécessairement d'activateur enregistré auprès de Vuetify. Ne pas supprimer les restitutions maison sans tester ce chemin.
- `persistent` est une exception intentionnelle à la fermeture par Escape ; vérifier que les actions internes permettent toujours de terminer/quitter le dialogue.

## Analyse par composant

| Composant / scénario | Attendu | Observé dans le code | Décision |
|---|---|---|---|
| ContextualMenu | Navigation de page libre | `ContextualMenu.vue:112-127` : `nav > ul`, liens, aucun overlay | Faux positif de l'issue. Ni piège, ni Escape à ajouter. |
| OrganizeColumns | Dialogue non modal, interaction et sortie clavier cohérentes | `OrganizeColumns.vue:135-164` : VMenu, `role="dialog"`, pas d'`aria-modal`, activateur transmis via `v-bind` | Escape et sortie Tab délégués ; pas de défaut de trap établi. Tester avant de modifier. Ne pas rendre modal par défaut. |
| SyBtnMenu | Menu d'actions, pas une modale | `SyBtnMenu.vue:155-166,180-191` : focus initial/restauration maison et VMenu | Préserver les restitutions, tester Escape, Tab et navigation du menu. Pas de `v-lock-focus` systématique. |
| DiacriticPicker | Confinement d'un dialogue déclaré modal | `DiacriticPicker.vue:203-212` : VDialog + `aria-modal="true"` + `retain-focus="false"`, sans boucle Tab propre | Défaut de configuration confirmé par lecture croisée avec `useFocusTrap`. Priorité à un test navigateur puis au rétablissement du mécanisme Vuetify. |
| DialogBox | Confinement modal, restauration, variantes et slots préservés | `DialogBox.vue:38-57,66-101,116-126` : restauration et boucle Tab maison, `retain-focus=false` | Ne pas considérer sa boucle comme doublonnant le registre Tab Vuetify dans cette configuration. Une migration mérite une PR distincte et des tests de dialogues imbriqués. |
| CookieBanner | Comportement cohérent avec la modalité choisie, sans intercepter une autre interaction | `CookieBanner.vue:114-181,190-210` : focus imposé, boucle Tab, listener document Escape non conditionné par `active`, pas d'`aria-modal` | Défaut concret de portée du listener ; modalité à clarifier avant de conserver ou retirer le confinement. Pas de remplacement mécanique par la directive. |
| SyNavListPanel | Navigation non modale et fermeture du niveau pertinent | `SyNavList/SyNavListPanel.vue:109-119` et `escapeStack.ts` : pile Escape, exclusion des dialogues superposés | Conserver la pile : responsabilité différente d'un piège Tab. Pas de piège ajouté. |
| HeaderBurgerMenu | Dialogue modal avec focus initial, boucle et restitution | `HeaderBurgerMenu.vue:52-60,78-118` : directive + Escape sur keyup + focus aller/retour | Déjà harmonisé ; compléter les tests, notamment Escape avec sous-niveau ouvert. |
| FilterSideBar | Confinement uniquement en mode modal | `FilterSideBar.vue:142-155` : `aria-modal=modale`, directive conditionnée par `modale`, Escape local | Préserver impérativement le mode non modal. Tester le focus initial sur la racine hors du formulaire piégé et Shift+Tab depuis cette racine. |
| MonthPickerVisual | Sélection et restitution adaptées au champ/bouton externe | `MonthPickerVisual.vue:30-40,94-115` : VMenu non modal, restauration explicite sur le bouton | Garder la restauration jusqu'à preuve d'équivalence. La spec a11y ne prouve pas un retour réel du focus malgré l'affirmation de l'issue. |

DatePicker : son ordre logique de grille et son roving tabindex sont spécialisés (`DatePicker/composables/useDatePickerFocusTrap.ts`). Aucun remplacement proposé ; non revérifié dynamiquement dans cette étude. Amelipro hors périmètre de l'issue initiale et de la validation exécutée.

## Constats prioritaires et rattachement RGAA

### 1. DiacriticPicker — confinement modal désactivé

- Preuve statique : `src/components/DiacriticPicker/DiacriticPicker.vue:203-212` et condition d'inscription au registre dans `useFocusTrap` v3.12.2.
- Conséquence attendue du code : absence de bouclage Tab du dialogue, malgré `aria-modal=true`. Parcours navigateur restant à reproduire.
- Critères concernés : 7.1 (cohérence du comportement exposé aux technologies d'assistance), 12.8 (ordre de focus). Ne pas assimiler automatiquement fuite du focus et piège clavier au sens de 12.9.
- Piste : rétablir `retainFocus` natif plutôt qu'ajouter un deuxième mécanisme ; tester fermeture et restitution après Escape et après sélection. Le bouton ouvre via `@click` et n'est pas déclaré comme activateur du VDialog.

### 2. CookieBanner — Escape global hors contexte

- Preuve : `CookieBanner.vue:128,147-156,190-193`. Le listener ne disparaît qu'au démontage ; aucune garde `active` ni appartenance à l'overlay supérieur.
- Quand la bannière reste montée avec `active=false`, Escape appelle encore `reject()` et émet `reject` (`:71-74`). Quand elle est visible derrière un autre dialogue, elle peut réagir à son Escape.
- Défaut fonctionnel confirmé à la lecture ; non reproduit par un nouveau test pendant cette étude. Risque d'interférence clavier relevant de 7.1/7.3 ; ne pas attribuer une NC 12.9 sans établir l'impossibilité de sortir.
- Piste : restreindre le traitement à l'état actif et au contexte propriétaire d'Escape, puis décider séparément de la modalité. Aucun changement implicite de consentement ou d'événements à introduire.

### 3. Directive — pas prête pour une généralisation sans qualification

`src/directives/lockFocus.ts:17-56` assure uniquement le bouclage Tab aux deux extrémités des descendants sélectionnés.

- Pas de focus initial, restauration, Escape, gestion de pile ni désactivation du fond.
- Le sélecteur ne filtre pas la visibilité, les ancêtres `hidden`/`inert` ou tous les cas de désactivation ; `[tabindex]` peut réinclure un bouton désactivé.
- Le listener est local : aucune récupération d'un focus déjà hors de l'élément ; aucun traitement dédié d'une racine focalisée ou d'un contenu sans descendants tabulables.
- Les overlays enfants téléportés sont hors du sous-arbre DOM ; la directive n'a pas de notion d'overlay supérieur.
- Aucune spec dédiée `lockFocus` trouvée. Ces limites sont des risques techniques, pas autant de NC démontrées dans chaque composant consommateur.

Une extension implicite à Escape/restauration modifierait le contrat existant, notamment les deux consommateurs déjà équipés. Préférer garder des responsabilités explicites ; tout enrichissement devrait être opt-in et testé.

## Écart avec les déclarations et la documentation

- L'issue qualifie ContextualMenu d'overlay et déduit des défauts de l'absence de code propre : faux positif à corriger.
- `doc/Accessibilite/README.md:15` prescrit trop largement un piège pour les popovers. La référence `a11y-aria-patterns/references/patterns.md:9` distingue à raison les popovers non modaux, sans piège.
- `FilterSideBar/accessibilite/Accessibility.mdx:38-43,63` documente la distinction modale/non modale ; elle doit être conservée.
- `CookieBanner/accessibilite/Accessibility.mdx:42-46` déclare le bouclage, Escape et focus initial ; elle ne résout pas la modalité implicite ni la portée globale du listener. Elle ne déclare pas explicitement le composant non modal.
- `DialogBox.focus.spec.ts` et `FilterSideBar.focus.spec.ts` vérifient surtout structure, focusabilité et styles cibles, pas le parcours complet. Les tests de boucle existants de DialogBox ne remplacent pas la validation du comportement Tab natif dans un navigateur.
- `scripts/data/a11y-report.md:3-5` date du 25/02/2026 et liste 13 composants affectés. Ce rapport n'est pas une preuve actuelle du clavier et ne couvre pas les constats de cette étude ; il n'a pas été régénéré.

## Pistes numérotées, indépendantes

1. **Recadrer l'issue** : retirer ContextualMenu ; distinguer modal, menu et panneau non modal ; remplacer « absence de code propre » par des scénarios observables.
2. **Qualifier avant migration** : tests dédiés à `vLockFocus` (activation réactive, premier/dernier, racine, zéro/un élément, masqués, disabled/inert, enfant téléporté). Ne pas modifier son contrat pour corriger un autre composant.
3. **Corriger CookieBanner séparément** : tests de non-émission sur Escape après fermeture et de non-interférence avec un dialogue supérieur ; décider la modalité et préserver le contrat de consentement.
4. **Corriger DiacriticPicker séparément** : test Tab/Shift+Tab réel puis confinement natif ; Escape et sélection rendent le focus à une cible définie, sélection/caret conservés.
5. **Caractériser les menus** : OrganizeColumns, SyBtnMenu et MonthPicker — ouverture clavier, focus initial, Escape, Tab sortant, clic extérieur, navigation propre au motif ; pas de piège ajouté par défaut.
6. **Évaluer DialogBox après caractérisation** : variantes `persistent`, `draggable`, scrollable, slots, ouverture programmée et imbriquée. Comparer au confinement natif avant toute suppression du code actuel.
7. **Consolider les consommateurs existants** : FilterSideBar dans ses deux modes et avec un select téléporté ; HeaderBurgerMenu avec un sous-menu. Une pression complète keydown/keyup d'Escape doit fermer le bon niveau, pas plusieurs involontairement.

## Barrière de non-régression avant toute PR de correction

- Régression démontrée par un test qui échoue avant et réussit après.
- Tests DOM attachés au body, écouteurs et téléportations réels autant que possible ; assertions `document.activeElement`, pas seulement `.focus()` mocké.
- Parcours navigateur avec Tab/Shift+Tab réels, Escape complet, menus superposés, clic extérieur, réouverture, contenu dynamique, états disabled/inert et déclencheur disparu.
- Retour du focus adapté au motif : ne pas voler celui d'une cible extérieure cliquée, ni renvoyer vers un nœud masqué/supprimé.
- Vérification VoiceOver/Safari et NVDA/Firefox ou Chrome, plus visibilité du focus et absence de contenu de fond annoncé comme interactif pour les vraies modales.
- Axe sur états significatifs, tests ciblés, lint des fichiers modifiés. Zéro garantie de non-régression absolue avant ces vérifications ; aucun changement comportemental effectué ici.

## Proposition de PR d'étude

Titre : **Étude : qualifier Escape et le focus des overlays avant harmonisation**.

Problème : l'issue 06 propose une généralisation du piège de focus qui confond plusieurs motifs et pourrait régresser l'accessibilité.

Livrable : analyse statique, vérification des sources Vuetify au tag 3.12.2, 308 tests existants réussis, faux positifs et corrections ciblées identifiés. Aucun changement de contrat ; aucune correction de composant dans cette étude. Vérifications navigateur et lecteur d'écran non réalisées.
