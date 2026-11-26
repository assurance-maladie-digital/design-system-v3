# Captcha — l'image s'adapte aux conteneurs étroits (changement visuel, non cassant)

L'image du captcha et son squelette de chargement avaient une largeur fixe de 311 px. Dans un conteneur plus étroit (petit écran, carte avec marges intérieures), l'image débordait et son bord droit était coupé.

L'image et le squelette occupent la même boîte de 311 × 64 px, qui ne dépasse plus la largeur de son conteneur et rétrécit en gardant ses proportions. Au-delà de 311 px de largeur disponible, le rendu ne change pas, et le contenu ne bouge plus quand l'image remplace le squelette. Si l'image renvoyée par l'API n'a pas le ratio 311 / 64, elle est contenue dans la boîte sans être déformée (`object-fit: contain`), alors qu'elle était étirée auparavant.

Dans un conteneur très étroit, les caractères de l'image sont plus petits (environ 46 px de haut au lieu de 64 px pour 224 px de large). Le captcha audio reste disponible comme alternative.

**Changement de contrat :** changement visuel, non cassant. L'API de `Captcha` ne change pas.

## Conduite à tenir

Aucune.
