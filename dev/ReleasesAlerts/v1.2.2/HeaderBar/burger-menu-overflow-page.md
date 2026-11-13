# HeaderBurgerMenu — correctif non cassant : `overflow` de la page préservé (#2759)

`HeaderBurgerMenu` écrivait `overflow: auto` sur `html` et `body` dès son montage, à chaque fermeture du menu et à son démontage. Un `overflow` défini par la page (par exemple `hidden`, `scroll` ou `clip`, en style inline ou dans une feuille de style) était donc écrasé, et la page pouvait redevenir scrollable sans aucune interaction.

Le composant ne modifie désormais `overflow` que pendant que le menu est ouvert : il mémorise les valeurs inline de `html` et `body` à l’ouverture, puis les restaure à la fermeture et au démontage. Le blocage du défilement pendant l’ouverture du menu est inchangé.

## Conduite à tenir

- Aucune, sauf si le projet comptait sur ce `overflow: auto` forcé pour rétablir le défilement de la page : définir alors `overflow` explicitement dans le projet.
