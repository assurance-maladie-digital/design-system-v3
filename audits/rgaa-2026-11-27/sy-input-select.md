# Audit RGAA — SyInputSelect

Périmètre : `src/components/Customs/Selects/SyInputSelect/`. Les composants `Amelipro` sont exclus.

## Critères applicables

| Critère | Application | Preuve automatisée | Vérification manuelle restante |
|---|---|---|---|
| 7.1 / 7.3 | Déclencheur, options et bouton d’effacement | DOM/Cypress : rôles, noms et boutons natifs | Tester Entrée, Espace, flèches, Échap et sélection |
| 8.2 | Libellé du champ et de la liste | DOM/Cypress : `aria-label` | Vérifier le contexte de titre dans le formulaire parent |
| 10.7 | Focus du déclencheur, des options et de l’effacement | Cypress : cibles focusables | Vérifier le contraste du focus dans tous les états |
| 11.10 | Champ requis et message d’erreur | DOM : prop required et structure de validation | Déclencher la soumission vide et vérifier l’annonce |
| 12.8 | Absence de piège clavier | Échap et retour du focus couverts par les tests existants | Vérifier le parcours avec liste ouverte et bouton clear visible |
| 12.9 | Ordre et comportement clavier | DOM/Cypress : tabindex du déclencheur et options | Tester l’ordre de tabulation dans une page réelle |

## Observations

- Le déclencheur est un élément `role="button"` avec `tabindex="0"` et `aria-haspopup="listbox"`.
- L’état d’ouverture est exposé avec `aria-expanded` et `aria-controls`.
- La liste utilise `role="listbox"`, les choix `role="option"` et `aria-selected`.
- Le bouton d’effacement est placé hors du déclencheur pour éviter un élément interactif imbriqué.
- Le composant dispose déjà de tests d’accessibilité axe et de tests de focus ; les nouveaux fichiers rendent les contrats RGAA explicitement traçables.

## Tests ajoutés

- `src/components/Customs/Selects/SyInputSelect/tests/SyInputSelect.rgaa.a11y.spec.ts`
- `src/components/Customs/Selects/SyInputSelect/tests/SyInputSelect.rgaa.cy.ts`

## Limites

Le composant custom ne remplace pas une vérification manuelle du pattern listbox avec lecteur d’écran, en particulier pour l’annonce de l’option active et le retour du focus après sélection ou fermeture.
