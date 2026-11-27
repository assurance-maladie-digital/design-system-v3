# ChipList — nom accessible du bouton de suppression sans guillemets simples (non cassant)

Le nom accessible du bouton qui supprime un filtre entourait le nom du filtre de guillemets simples : « Supprimer le filtre 'Paris' ». Selon leur réglage de ponctuation, les lecteurs d'écran pouvaient vocaliser ces guillemets.

Le nom devient « Supprimer le filtre Paris ». La chaîne est désormais définie dans `locales.ts` (`removeFilter`).

**Changement de contrat :** comportement observable (attribut `aria-label` du bouton de suppression), non cassant. L'API de `ChipList` ne change pas.

## Conduite à tenir

- Si vos tests sélectionnent le bouton par son nom accessible (par exemple `getByRole('button', { name: "Supprimer le filtre 'Paris'" })`), retirez les guillemets simples.
