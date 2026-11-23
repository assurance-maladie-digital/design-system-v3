# FooterBar — correction du thème Amelipro et mise à jour du visuel téléphonique

Le composant `FooterBar` bénéficie d'une correction graphique pour le thème Amelipro (`ap`).

La couleur de fond du footer a été modifiée pour utiliser le token `cyan-darken60`, afin de correspondre à la couleur attendue (`#004259`) et d'améliorer le contraste avec le texte blanc.

Le visuel du numéro de téléphone Amelipro a également été remplacé. Le nouvel asset `numero_3608.svg` est un véritable SVG vectoriel, offrant un rendu plus net et une nouvelle mise en page. Ses dimensions passent de 229 × 30 px à 107 × 37 px.

**Changement de contrat :**

- Le changement de couleur du footer en thème `ap` est non cassant : il est visible par les consommateurs, sans modification de l'API du composant.
- Les thèmes `cnam`, `pa` et `ap2026` ne sont pas impactés.
- L'ancien asset `cartouche_nouveauTEL.svg` est supprimé et remplacé par `numero_3608.svg`. Ce changement est cassant pour les projets qui importent directement l'ancien fichier depuis `@cnamts/synapse`.

## Conduite à tenir

Aucune action n'est nécessaire si votre projet utilise uniquement le composant `FooterBar` sans importer directement l'ancien visuel téléphonique.

En revanche, si votre projet importe `cartouche_nouveauTEL.svg`, vous devez mettre à jour cet import pour utiliser le nouvel asset :

```ts
import imgUrl from '@cnamts/synapse/assets/amelipro/img/numero_3608.svg'
```

Si vous utilisez le slot `prepend` de `FooterBar` pour afficher le numéro de téléphone, pensez également à vérifier le rendu et les dimensions du visuel après cette mise à jour.

Relisez les notes de version à chaque mise à jour afin d'identifier les éventuelles adaptations nécessaires dans votre projet.