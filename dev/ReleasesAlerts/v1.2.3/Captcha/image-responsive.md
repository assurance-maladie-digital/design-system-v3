# Captcha — l'image s'adapte aux conteneurs étroits (changement visuel, non cassant)

L'image du captcha et son squelette de chargement avaient une largeur fixe de 311 px. Dans un conteneur plus étroit (petit écran, carte avec marges intérieures), l'image débordait et son bord droit était coupé.

L'image et le squelette ne dépassent plus la largeur de leur conteneur. L'image rétrécit en gardant ses proportions ; au-delà de 311 px de largeur disponible, le rendu ne change pas.

Dans un conteneur très étroit, les caractères de l'image sont plus petits (environ 46 px de haut au lieu de 64 px pour 224 px de large). Le captcha audio reste disponible comme alternative.

**Changement de contrat :** changement visuel, non cassant. L'API de `Captcha` ne change pas.

## Conduite à tenir

Aucune.
