# Release alerts

Chaque changement de contrat (props, événements, slots, exports, comportement observable) est décrit pour les consommateurs **avant la fin de la PR** qui l'introduit.

## Organisation

Un dossier par version, un sous-dossier par composant, **un fichier par changement** :

```
dev/ReleasesAlerts/
└── v1.2.2/
    ├── SyTable/
    │   ├── pied-de-tableau-vide.md
    │   └── pagination-boutons-et-annonces.md
    ├── SyTextField/
    │   └── contraste-textes.md
    └── _transverse/
        └── point-entree-vuetify-options.md
```

Chaque PR ajoute son propre fichier au lieu de compléter un fichier commun : deux PR mergées dans la même version ne modifient jamais le même fichier, et n'ont donc pas de conflit à résoudre au rebase.

- **Version** : la prochaine version publiée (`vX.Y.Z`). Si le dossier n'existe pas encore, le créer.
- **Composant** : nom du dossier du composant dans `src/components` (`SyTable`, `DatePicker`, `SyTextField`…). Un changement qui concerne plusieurs composants va dans le dossier du composant principal ; un changement transverse (plusieurs familles de composants, `package.json`, points d'entrée, configuration) va dans `_transverse/`.
- **Fichier** : nom court du changement, en kebab-case (`prop-direction-supprimee.md`).

## Contenu d'un fichier

```md
# Composant — titre du changement (#issue)

Ce qui change, et ce qui se passait avant.

## Conduite à tenir

- Ce que le consommateur doit faire, ou « Aucune ».
```

Le titre de niveau 1 nomme les composants concernés et la nature du changement (« changement de contrat », « nouvelle prop », « changement visuel », « non cassant »…).

## Rassembler les notes d'une version

```bash
cat dev/ReleasesAlerts/v1.2.2/*/*.md
```
