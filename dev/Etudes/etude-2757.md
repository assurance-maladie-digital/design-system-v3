# Étude — SyAutocomplete (Issue #2757)

## Problème

Après avoir sélectionné une valeur dans `SyAutocomplete` en mode sélection unique, la liste reste filtrée sur le texte de cette valeur.

**Exemple :** avec les choix « rouge », « vert » et « vert clair », après avoir sélectionné « vert », la réouverture de la liste affiche « vert » et « vert clair », mais pas « rouge ».

L’utilisateur doit effacer le texte pour retrouver toutes les propositions.

## Comportement attendu

Après une sélection, la réouverture du menu doit afficher toute la liste, comme dans `VAutocomplete` de Vuetify.

Le filtrage doit commencer uniquement lorsque l’utilisateur saisit un nouveau texte. Le nombre de résultats annoncé aux lecteurs d’écran doit correspondre aux éléments affichés.

## Analyse du code

Dans `SyAutocomplete.vue` :

- `syncSearchFromValue()` recopie le libellé de la valeur sélectionnée dans le champ `search`.
- `filteredItems` applique le filtre uniquement lorsque `isPristine` est faux (et conserve le comportement du mode multiple).
- Après une sélection ou une synchronisation, `isPristine` repasse à `true` ; le libellé affiché n’est donc pas utilisé comme filtre à la réouverture.
- `resultsLiveText` utilise déjà le nombre d’éléments de `filteredItems` pour annoncer les résultats.
- `suppressMenuOpen` n’est positionné que si la synchronisation ou la sélection va réellement modifier `search`. Cela évite qu’une écriture identique laisse le flag actif et absorbe la prochaine frappe ainsi que son événement `search`.

**Cause identifiée :** le composant ne distinguait pas le texte affiché après une sélection du texte saisi pour effectuer une recherche.

## Correctif envisagé

L’état `isPristine` distingue le texte affiché après une sélection d’une recherche saisie.

- Après une sélection ou une synchronisation de la valeur, remettre `isPristine` à `true`.
- Tant que cet état est vrai, afficher toutes les propositions.
- Dès que l’utilisateur saisit du texte, passer `isPristine` à `false` et appliquer le filtrage habituel.
- Lors d’une reprise de focus après blur, remettre `isPristine` à `true`, conformément au comportement de Vuetify : la liste complète réapparaît.
- Conserver le comportement actuel du mode multiple.

Le flag `suppressMenuOpen` n’est armé que lorsque `search` va changer. La première frappe suivant une sélection peut ainsi émettre normalement `search` (avec le debounce configuré).

## Fichier concerné

| Fichier | Modification |
|---|---|
| `src/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue` | Distinguer texte sélectionné et recherche saisie, réinitialiser l’état au focus après blur et éviter de laisser `suppressMenuOpen` actif si `search` ne change pas. |
| `src/components/Customs/Selects/SyAutocomplete/tests/SyAutocomplete.spec.ts` | Couvrir la liste complète après synchronisation/sélection, la re-filtration après une frappe, l’émission de `search` après sélection et le reset au focus. |

Les fichiers de tests et les stories concernés restent à identifier dans le dépôt.

## Vérifications à réaliser

- Sélectionner une valeur puis rouvrir la liste : toutes les propositions doivent apparaître.
- Saisir quelques lettres : la liste doit être filtrée.
- `resultsLiveText` reste calculé à partir de `filteredItems` ; le test unitaire vérifie le nombre d’options affichées après réinitialisation et re-filtration.
- Vérifier que le mode multiple n’est pas impacté.
- La suite a11y axe du composant n’a pas été relancée pour cette modification ; la navigation clavier et les annonces avec un lecteur d’écran restent à vérifier manuellement.

Vérifications exécutées : les tests unitaires ciblés de `SyAutocomplete.spec.ts` passent (76 tests) et ESLint passe sur le composant et son fichier de tests. Un premier run avant l’ajustement du scénario focus a révélé un test existant qui saisissait sans focus ; ce scénario a été aligné sur une interaction avec focus, puis la suite est passée.

## Décisions

- Le comportement s’applique par défaut ; aucune prop de configuration n’a été ajoutée.
- Au focus initial, la liste complète est disponible. Après une recherche suivie d’un blur, la reprise de focus réinitialise aussi le filtre et montre toutes les propositions, conformément à Vuetify.

## Statut

Le correctif est implémenté dans `SyAutocomplete.vue` et couvert par des tests unitaires ciblés. Les tests axe existants n’ont pas été relancés pour ce changement ; aucune validation manuelle avec lecteur d’écran n’est revendiquée.

Aucun critère RGAA précis n’est indiqué dans l’issue. Les vérifications d’accessibilité ci-dessus sont des points de contrôle proposés, et non une validation RGAA.
