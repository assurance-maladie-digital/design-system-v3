# Audit RGAA — CookiesSelection

Périmètre : `src/components/CookiesSelection/`. Les composants `Amelipro` et `AmeliproCaptcha` sont exclus.

## Critères applicables

| Critère | Application | Preuve automatisée | Vérification manuelle restante |
|---|---|---|---|
| 7.1 / 7.3 | Boutons d’acceptation, refus, sauvegarde, radios et `summary` | DOM/Cypress | Parcours clavier complet avec chaque combinaison de préférences |
| 8.2 | Titres des catégories de cookies et des groupes de choix | DOM/Cypress | Vérifier les niveaux de titres dans les pages hôtes |
| 9.1 | Structure des sections et groupes de préférences | DOM/Cypress | Vérifier la cohérence avec le contexte de la page d’intégration |
| 10.7 | Indicateur de focus sur radios, `summary` et boutons | Cypress partiel | Vérifier le rendu du focus dans tous les thèmes et états |
| 11.10 | Choix obligatoires des catégories non essentielles | DOM/Cypress : `aria-required` | Vérifier l’annonce de l’erreur après soumission incomplète |
| 12.8 | Absence de piège clavier dans le formulaire et les détails | DOM/Cypress partiel | Tester Tab/Shift+Tab avec les détails ouverts et fermés |

## Observations

- Les cookies essentiels sont affichés sans choix utilisateur, tandis que les catégories fonctionnelles et analytiques ont un groupe radio obligatoire.
- Les éléments `<summary>` sont nativement interactifs et disposent d’un style `:focus-visible` dédié.
- Les boutons sont des contrôles natifs Vuetify et restent atteignables au clavier.
- Les tableaux de détail sont rendus uniquement lorsque l’utilisateur ouvre un `<details>` ; leur lecture doit être vérifiée avec un lecteur d’écran.

## Tests ajoutés

- `src/components/CookiesSelection/tests/CookiesSelection.rgaa.a11y.spec.ts`
- `src/components/CookiesSelection/tests/CookiesSelection.rgaa.cy.ts`

Les tests sont dédiés à l’audit et séparés des tests a11y CI courants.

## Limites

L’automatisation ne confirme pas la compréhension du contenu des tableaux, l’ordre de lecture par lecteur d’écran, le comportement à 200 % de zoom ni la restitution dans la bannière qui porte le composant.
