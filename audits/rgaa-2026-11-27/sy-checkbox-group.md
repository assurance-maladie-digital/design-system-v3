# Audit RGAA — SyCheckBoxGroup

Périmètre : `src/components/Customs/SyCheckBoxGroup/`. Les composants `Amelipro` sont exclus.

## Critères applicables

| Critère | Application | Preuve automatisée | Vérification manuelle restante |
|---|---|---|---|
| 7.1 / 7.3 | Cases à cocher et navigation clavier | DOM/Cypress : contrôles natifs et labels | Tester Tab, Espace et l’ordre dans un formulaire réel |
| 7.5 | Messages d’erreur, succès, avertissement et aide | DOM/Cypress : zone de détails | Déclencher chaque état et vérifier l’annonce avec lecteur d’écran |
| 8.2 | Légende et structure du groupe | DOM/Cypress : `<fieldset>` et `<legend>` | Vérifier le niveau de titre du contexte parent |
| 9.1 | Regroupement des choix associés | DOM/Cypress : fieldset groupé | Vérifier la compréhension du groupe avec lecteur d’écran |
| 10.7 | Focus des cases à cocher | Cypress : contrôle focusable | Mesurer le contraste du focus dans tous les états |
| 11.10 | Groupe requis et indication associée | DOM/Cypress : aide requise | Vérifier l’annonce de l’erreur après validation vide |
| 12.8 | Absence de piège clavier | Contrôles natifs | Tester les états disabled, readonly et erreur |

## Observations

- Le groupe utilise un `<fieldset>` et une `<legend>` lorsque `label` est fourni.
- Chaque option est rendue par `SyCheckbox` avec un label et un identifiant optionnel.
- Le groupe expose une indication cachée lorsque `required` est actif et qu’aucun libellé ARIA alternatif n’est fourni.
- Les messages d’aide et de validation sont rendus dans une zone dédiée.

## Tests ajoutés

- `src/components/Customs/SyCheckBoxGroup/tests/SyCheckBoxGroup.rgaa.a11y.spec.ts`
- `src/components/Customs/SyCheckBoxGroup/tests/SyCheckBoxGroup.rgaa.cy.ts`

## Limites

La conformité du groupe dépend aussi des options fournies par le consommateur : labels, IDs, ordre des choix et messages d’erreur doivent être vérifiés dans l’usage réel.
