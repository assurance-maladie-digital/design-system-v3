# Audit RGAA — DataListItem

Périmètre : `src/components/DataListItem/`. Les composants `Amelipro` et `AmeliproCaptcha` sont exclus.

## Critères applicables

| Critère | Application | Preuve automatisée | Vérification manuelle restante |
|---|---|---|---|
| 1.2 | Icône facultative décorative | DOM/Cypress : `aria-hidden="true"` | Vérifier les icônes fournies par slot personnalisé |
| 7.1 / 7.3 | Action facultative | DOM/Cypress : bouton natif nommé | Tester l’événement et le parcours clavier dans le contexte parent |
| 8.2 | Structure et contenu du composant | DOM/Cypress : `<dt>` et `<dd>` | Vérifier le niveau de structure dans un `<dl>` réel |
| 9.3 | Donnée présentée comme paire terme/valeur | DOM/Cypress : description list | Vérifier les regroupements lorsque plusieurs items sont utilisés |
| 10.7 | Indicateur de focus de l’action | Cypress : focus atteignable | Vérifier le contraste et le rendu dans les thèmes CNAM sombre/clair |
| 10.11 | Disponibilité du contenu en largeur réduite | Tests visuels existants et scénario structurel | Vérifier le reflow à 320 px et avec espacement accru |

## Observations

- Le composant rend correctement un terme `<dt>` et une valeur `<dd>` ; il doit être placé dans un `<dl>` par le composant consommateur.
- L’icône facultative est explicitement décorative.
- Le bouton d’action est natif et n’est rendu que lorsqu’une action est fournie.
- La valeur personnalisée doit passer par le slot `value`; la prop historique `renderHtmlValue` est dépréciée.

## Tests ajoutés

- `src/components/DataListItem/tests/DataListItem.rgaa.a11y.spec.ts`
- `src/components/DataListItem/tests/DataListItem.rgaa.cy.ts`

Les tests sont dédiés à l’audit et séparés des tests a11y CI courants.

## Limites

Le composant seul ne permet pas de conclure sur l’organisation globale d’une liste de données : le `<dl>` parent, l’ordre des items, le reflow à 200 % et les contrastes dépendent aussi du contexte d’intégration.
