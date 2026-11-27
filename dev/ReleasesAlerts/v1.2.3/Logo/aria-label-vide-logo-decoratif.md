# Logo — `ariaLabel` explicitement vide rend le logo décoratif (non cassant)

La prop `ariaLabel` n'était prise en compte que si elle était non vide : passer `''` retombait sur le libellé de marque par défaut.

Désormais, une valeur **explicitement fournie** l'emporte toujours :

- `ariaLabel="…"` : libellé personnalisé (inchangé) ;
- `ariaLabel=""` : le SVG porte `aria-label=""` **et** `aria-hidden="true"` — le logo sort de l'arbre d'accessibilité, comme une image décorative. Utile quand le logo vit dans un lien déjà nommé par `aria-label` (motif lien-image DSFR, appliqué dans `LogoBrandSection`) ;
- `ariaLabel` non fourni (`undefined`) : libellé de marque par défaut (inchangé).

**Changement de contrat :** comportement observable uniquement si `ariaLabel=""` était passé — le logo n'est alors plus annoncé (il l'était via le libellé par défaut). Aucun impact sinon.

## Conduite à tenir

Aucune. Si `ariaLabel=""` était utilisé pour « désactiver » un libellé tout en comptant sur le repli par défaut, passer `undefined` à la place.
