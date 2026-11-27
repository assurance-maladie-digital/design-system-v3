# HeaderBar — logo décoratif quand le lien d'accueil a un aria-label (non cassant)

Quand `homeLink['aria-label']` était fourni, le lien était nommé par ce libellé mais l'image gardait son `alt` renseigné (`homeAriaLabel`) : un `alt` devenu mort — le `aria-label` du lien l'écrase toujours dans le calcul du nom accessible — et un balisage trompeur.

Désormais, quand le lien d'accueil est un vrai lien et porte un libellé explicite, l'image reçoit `alt=""` (décorative). Sinon, le comportement est inchangé : l'image-lien conserve l'`alt` issu de `homeAriaLabel` qui exprime la destination.

`homeLink` accepte en outre les deux clés `ariaLabel` et `aria-label` (type `HomeLink` partagé avec `LogoBrandSection`).

**Changement de contrat :** comportement observable (attribut `alt` de l'image), non cassant pour l'API — les annonces des lecteurs d'écran sont identiques.

## Conduite à tenir

- Si vos tests vérifient l'`alt` du logo alors qu'un `aria-label` est fourni via `homeLink`, attendez-vous à `alt=""`. Aucune autre action requise.
