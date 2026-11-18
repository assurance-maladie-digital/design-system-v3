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

## Correctif

L’état `isPristine` distingue le texte affiché après une sélection d’une recherche saisie.

- Après une sélection ou une synchronisation de la valeur, remettre `isPristine` à `true`.
- Tant que cet état est vrai, afficher toutes les propositions.
- Dès que l’utilisateur saisit du texte, passer `isPristine` à `false` et appliquer le filtrage habituel.
- Au blur, comme `VAutocomplete` : abandonner la recherche non validée par une sélection. Le champ réaffiche le libellé de la valeur sélectionnée (ou se vide s’il n’y en a pas) et `isPristine` repasse à `true`, donc la liste complète est proposée à la prochaine ouverture. Un blur vers le menu (focus déplacé dans la liste) ne déclenche pas cette restauration.
- Conserver le comportement actuel du mode multiple.

Le flag `suppressMenuOpen` n’est armé que lorsque `search` va changer. La première frappe suivant une sélection peut ainsi émettre normalement `search` (avec le debounce configuré).

Le libellé affiché pour la valeur sélectionnée ne dépend plus uniquement des `items` courants. Avec une recherche côté serveur, l’item sélectionné peut en être absent : le dernier libellé connu (ou, avec `returnObject`, celui de l’objet sélectionné) est alors utilisé, au lieu de vider le champ alors qu’une valeur reste sélectionnée. Quand les `items` changent et qu’aucune recherche n’est en cours de saisie, le libellé est résolu de nouveau : une valeur initiale dont les `items` arrivent plus tard (formulaire pré-rempli) s’affiche à leur arrivée (bug présent aussi sur `dev`).

Correctif associé : au montage avec une valeur initiale, la synchronisation immédiate armait `suppressMenuOpen` avant la déclaration de `watch(search)`. Le drapeau n’était jamais consommé et avalait la première frappe et son événement `search` (bug présent aussi sur `dev`). Il est remis à zéro juste après cette synchronisation.

## Fichier concerné

| Fichier | Modification |
|---|---|
| `src/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue` | Distinguer texte sélectionné et recherche saisie, restaurer le libellé de la sélection au blur, le résoudre quand les `items` changent et éviter de laisser `suppressMenuOpen` actif si `search` ne change pas. |
| `src/components/Customs/Selects/SyAutocomplete/tests/SyAutocomplete.spec.ts` | Couvrir la liste complète après synchronisation/sélection, la re-filtration après une frappe, l’émission de `search` après sélection, la restauration du libellé (ou le vidage du champ) au blur, la conservation de la recherche quand le focus passe dans le menu, et le libellé de la sélection quand les `items` changent (chargement tardif, résultats serveur, `returnObject`). |

## Vérifications à réaliser

- Sélectionner une valeur puis rouvrir la liste : toutes les propositions doivent apparaître.
- Saisir quelques lettres : la liste doit être filtrée.
- `resultsLiveText` reste calculé à partir de `filteredItems` ; le test unitaire vérifie le nombre d’options affichées après réinitialisation et re-filtration.
- Vérifier que le mode multiple n’est pas impacté.
- La suite a11y axe du composant n’a pas été relancée pour cette modification ; la navigation clavier et les annonces avec un lecteur d’écran restent à vérifier manuellement.

Vérifications exécutées : les tests unitaires ciblés de `SyAutocomplete.spec.ts` passent (92 tests), ainsi que les suites `Selects`, `SyForm` et `Tables` (qui utilise `SyAutocomplete` dans `AutocompleteFilter`) et le test axe du composant. ESLint et `vue-tsc` passent.

## Décisions

- Le comportement s’applique par défaut ; aucune prop de configuration n’a été ajoutée.
- Au focus initial, la liste complète est disponible. Le cycle focus/blur est aligné sur `VAutocomplete` (Vuetify 3.12) : une recherche saisie puis abandonnée par un blur est effacée, le champ réaffiche le libellé de la sélection, et la liste complète réapparaît à la réouverture. Le texte visible et `resultsLiveText` restent ainsi cohérents avec la liste.
- Écart volontaire avec Vuetify : à la fermeture du menu par Échap sans quitter le champ, Vuetify réaffiche la liste complète alors que le texte saisi reste dans le champ. `SyAutocomplete` conserve le filtre saisi : la liste et `resultsLiveText` restent cohérents avec le texte visible, ce qui prime sur l’alignement avec Vuetify.
- Quand le focus quitte le composant, le menu se ferme, comme dans `VAutocomplete`, y compris quand le focus est déplacé par script ou par une aide technique.
- L’annonce du nombre de résultats (`role="status"`) est vide tant que le menu est fermé : le retour à la liste complète après une sélection ou un blur n’est pas annoncé hors contexte. Le nombre est annoncé à la réouverture.
- En sélection multiple, l’effacement de la recherche à la fermeture du menu relançait `watch(search)`, qui rouvrait le menu et reprenait le focus (Échap inopérant, focus ramené dans le champ ; bug présent aussi sur `dev`, aggravé par la fermeture du menu au blur). L’effacement est désormais protégé par `suppressMenuOpen`, et la recherche vide est émise explicitement.
- La logique de blur (recherche abandonnée, fermeture du menu) est portée par le handler `@blur` et non par `checkErrorOnBlur` : cette méthode exposée garde son comportement d’avant (validation seule), et un consommateur qui l’appelle pour forcer la validation ne perd pas la saisie en cours.
- Au blur après une recherche abandonnée, `search` est émis avec une chaîne vide, comme `update:search` dans `VAutocomplete`, et le debounce en cours est annulé. Un consommateur qui filtre côté serveur recharge ainsi la liste complète. On émet une chaîne vide et non le libellé restauré : ce dernier filtrerait la liste côté serveur sur la seule valeur sélectionnée.

## Statut

Le correctif est implémenté dans `SyAutocomplete.vue` et couvert par des tests unitaires ciblés. Les tests axe existants n’ont pas été relancés pour ce changement ; aucune validation manuelle avec lecteur d’écran n’est revendiquée.

Aucun critère RGAA précis n’est indiqué dans l’issue. Les vérifications d’accessibilité ci-dessus sont des points de contrôle proposés, et non une validation RGAA.
