# Audit RGAA — SyAutocomplete

Périmètre : `src/components/Customs/Selects/SyAutocomplete/`. Les composants `Amelipro` et `AmeliproAutoCompleteField` sont exclus.

## Critères applicables

| Critère | Application | Preuve automatisée | Vérification manuelle restante |
|---|---|---|---|
| 7.1 / 7.3 | Champ combobox, options, suppression et clavier | DOM/Cypress : rôles, noms et options | Parcours complet avec flèches, Entrée, Échap et Tab |
| 7.5 | Résultats, absence de résultat et chargement | Tests axe existants, contrats de structure | Vérifier les annonces avec lecteur d’écran |
| 8.2 | Libellé et structure du champ | DOM/Cypress : input nommé | Vérifier les niveaux de titres du contexte parent |
| 10.1 | Présentation du champ et des états | Tests visuels existants | Vérifier reflow et espacement accru |
| 10.7 | Focus du champ, des options et du bouton clear | Cypress : focus du clear button | Tester chaque état et thème CNAM |
| 11.10 / 11.13 | Champ obligatoire, erreurs et rôle combobox | DOM/Cypress : `aria-required`, `role=combobox` | Déclencher chaque erreur de validation |
| 12.8 / 12.9 | Ordre et mécanisme de navigation clavier | DOM/Cypress partiel | Vérifier qu’aucun état ouvert ne piège le focus |

## Observations

- Le champ utilise `role="combobox"` et référence le libellé via `aria-label` ou `aria-labelledby`.
- La liste utilise `role="listbox"`, les résultats `role="option"` et `aria-selected`.
- Le mode multiple expose `aria-multiselectable` et peut afficher des chips supprimables.
- Le bouton de suppression est natif, nommé et séparé du champ de recherche.
- Les résultats sont annoncés via une zone `role="status"` avec `aria-live="polite"`.

## Tests ajoutés

- `src/components/Customs/Selects/SyAutocomplete/tests/SyAutocomplete.rgaa.a11y.spec.ts`
- `src/components/Customs/Selects/SyAutocomplete/tests/SyAutocomplete.rgaa.cy.ts`

## Limites

Le test automatisé ne remplace pas le test manuel du pattern combobox avec lecteur d’écran, notamment la relation entre champ, option active, résultats annoncés et fermeture du menu.
