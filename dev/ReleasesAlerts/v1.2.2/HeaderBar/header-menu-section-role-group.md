# HeaderMenuSection — correctif non cassant : retrait de `role="group"` sur la liste interne

La liste interne de `HeaderMenuSection` (`ul.header-menu-section-list`) portait `role="group"`. Ce rôle retirait au `ul` sa sémantique de liste : les `HeaderMenuItem` (`<li>`) placés dedans n’avaient plus de liste parente valide, ce que les outils d’audit signalent (axe : `listitem`), et les lecteurs d’écran n’annonçaient plus la liste ni son nombre d’éléments.

Le rôle est retiré. Le regroupement reste porté par la `<section>`, étiquetée par le titre de la section quand il est fourni.

## Conduite à tenir

- Aucune, sauf pour les tests ou sélecteurs qui ciblent `[role="group"]` dans le menu : cibler plutôt `.header-menu-section-list`.
