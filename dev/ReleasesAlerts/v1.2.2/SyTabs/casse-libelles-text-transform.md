# SyTabs — changement de comportement non cassant : casse des libellés gérée en CSS (#2770)

Les libellés des onglets étaient mis en majuscules dans le texte lui-même (`toUpperCase()`) : « Tous les virements » était rendu « TOUS LES VIREMENTS » dans le DOM. Il était impossible de conserver la casse d’origine.

Les libellés sont désormais rendus tels qu’ils sont fournis, et la mise en majuscules est appliquée par la règle CSS `text-transform`. Le rendu visuel par défaut ne change pas.

Nouvelle option : `vuetifyOptions.tab['text-transform']` (`'uppercase'` par défaut, `'none'`, `'capitalize'` ou `'lowercase'`). Avec `'none'`, les libellés s’affichent dans leur casse d’origine.

Conséquences : le texte présent dans le DOM, le texte copié-collé et le texte restitué par les lecteurs d’écran suivent maintenant la casse d’origine des libellés.

## Conduite à tenir

- Mettre à jour les tests qui recherchent le libellé d’un onglet en majuscules : par exemple `getByText('TOUS LES VIREMENTS')` devient `getByText('Tous les virements')`.
- Aucune autre adaptation : le rendu visuel par défaut est inchangé.
