# package.json — vue-router déclaré en peerDependency optionnelle (non cassant)

`vue-router` est désormais déclaré en `peerDependencies` (`^4.4.0`), marqué optionnel dans `peerDependenciesMeta`.

Avant, il n'était déclaré nulle part pour les consommateurs, alors que :

- le bundle contenait un import `import "vue-router";` : un projet sans `vue-router` ne compilait pas. Cet import est supprimé : le design system n'utilise plus `vue-router` à l'exécution ;
- les fichiers de déclaration (`dist/**/*.d.ts`) utilisent ses types pour les props `to` (`RouteLocationRaw`, `RouteLocationAsPathGeneric`…). Ces deux derniers n'existent que depuis `vue-router` 4.4.0.

## Conduite à tenir

- Projet avec `vue-router` 4.4 ou plus récent (cas du starter kit, en 4.6.4) : aucune.
- Projet avec une version 4 antérieure à 4.4 : pnpm affiche un avertissement de version. Mettez `vue-router` à jour pour que les types des props `to` se résolvent.
- Projet sans routeur : aucune. Le design system fonctionne sans `vue-router` ; les props `to` ne sont alors pas typées.
