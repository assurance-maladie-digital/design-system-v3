# FooterBar — correction du thème Amelipro et nouveau visuel du numéro de téléphone

## Couleur de fond en thème `ap`

En thème `ap`, le fond de `FooterBar` utilise désormais le token `cyan-darken60` (`#004259`), au lieu de la couleur `primary` (`#006386`). Le contraste du texte blanc passe de 6,71:1 à 10,92:1.

Les thèmes `cnam`, `pa` et `ap2026` ne changent pas.

## Nouveau visuel du numéro de téléphone

Un nouveau visuel, `numero_3608.svg`, est disponible pour afficher le numéro 3608 dans le slot `prepend`. C'est un SVG vectoriel, plus net que l'ancien `cartouche_nouveauTEL.svg`, qui contenait une image PNG. Ses dimensions passent de 229 × 30 px à 107 × 33 px.

L'ancien visuel `cartouche_nouveauTEL.svg` est conservé : les imports existants continuent de fonctionner.

**Changement de contrat :** changement visuel, non cassant. L'API de `FooterBar` ne change pas.

## Conduite à tenir

Aucune action n'est nécessaire.

Pour utiliser le nouveau visuel, remplacez l'import de l'ancien fichier :

```ts
import imgUrl from '@cnamts/synapse/assets/amelipro/img/numero_3608.svg'
```

Le nouveau visuel est plus étroit et plus haut que l'ancien : vérifiez le rendu du slot `prepend` et ajustez l'espacement si besoin (la story « WithPhoneNumber » utilise la classe `mx-4`).
