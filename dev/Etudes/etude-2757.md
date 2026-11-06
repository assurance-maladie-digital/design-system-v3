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
- `filteredItems` utilise directement `search` pour filtrer les propositions.
- À la réouverture, le texte de la sélection est donc utilisé comme filtre, même si l’utilisateur n’a pas commencé une nouvelle recherche.
- `resultsLiveText` utilise déjà le nombre d’éléments de `filteredItems` pour annoncer les résultats.

**Cause identifiée :** le composant ne distingue pas le texte affiché après une sélection d’un texte saisi pour effectuer une recherche.

## Correctif envisagé

Ajouter un état `isPristine` pour savoir si l’utilisateur a commencé à saisir une recherche.

- Après une sélection ou une synchronisation de la valeur, remettre `isPristine` à `true`.
- Tant que cet état est vrai, afficher toutes les propositions.
- Dès que l’utilisateur saisit du texte, passer `isPristine` à `false` et appliquer le filtrage habituel.
- Conserver le comportement actuel du mode multiple.

## Fichier concerné

| Fichier | Modification |
|---|---|
| `src/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue` | Distinguer le texte issu de la sélection du texte saisi par l’utilisateur et adapter le filtrage. |

Les fichiers de tests et les stories concernés restent à identifier dans le dépôt.

## Vérifications à réaliser

- Sélectionner une valeur puis rouvrir la liste : toutes les propositions doivent apparaître.
- Saisir quelques lettres : la liste doit être filtrée.
- Vérifier que le nombre de résultats annoncé correspond à la liste affichée.
- Vérifier que le mode multiple n’est pas impacté.
- Vérifier la navigation au clavier et les annonces avec un lecteur d’écran.

## Points à confirmer

L’issue évoque deux possibilités : appliquer le nouveau comportement par défaut ou ajouter une prop pour le rendre configurable. Ce choix reste à décider.

Le comportement exact lors de la prise de focus doit également être confirmé.

## Statut

L’issue #2757 est en étude. Ce document présente l’analyse et le correctif envisagé ; il ne confirme pas que le développement ou les tests ont été réalisés.

Aucun critère RGAA précis n’est indiqué dans l’issue. Les vérifications d’accessibilité ci-dessus sont des points de contrôle proposés, et non une validation RGAA.
