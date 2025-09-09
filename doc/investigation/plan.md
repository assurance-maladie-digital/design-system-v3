# Plan d’investigation pour la réduction des redondances de composants

## Objectif

Réduire le nombre de composants similaires dans `src/components/Amelipro` et les autres dossiers, en fusionnant ou enrichissant les composants proches.

## Étapes

1. **Cartographie des composants**
   - Lister tous les composants par dossier (nom, utilité, props, événements).
   - Identifier les doublons ou similitudes, même si les noms diffèrent.

2. **Analyse fonctionnelle**
   - Comparer les fonctionnalités, props, slots, événements et styles des composants similaires.
   - Noter les différences et les points de convergence.

3. **Définition du composant cible**
   - Décider pour chaque doublon : fusionner, enrichir, ou supprimer.
   - S’assurer que le composant cible couvre tous les cas d’usage.

4. **Refactoring progressif**
   - Fusionner les fonctionnalités dans le composant cible.
   - Remplacer les usages du composant supprimé.
   - Supprimer l’ancien composant et ses tests.

5. **Validation**
   - Mettre à jour les tests unitaires et snapshots.
   - Vérifier la documentation et les stories Storybook.

6. **Documentation continue**
   - Documenter chaque étape et chaque composant analysé dans ce répertoire.
   - Créer un fichier par composant dans `doc/investigation/components/` si besoin.

---

## État d'avancement

- Toutes les familles ont été analysées et documentées.
- Les rapports pour Accordion, Badge, Select, RadioGroup sont harmonisés (liens directs, type, props, slots, événements, fonctionnalités).
- La mise à jour alphabétique des autres rapports est en cours (prochaine étape : Breadcrumb, Btn, Card, Checkbox, Chips, Dialog, Disclosure, Footer, Header, Icon, Liste-autres, Menu, Message).

---

## Historique

- 05/09/2025 : Initialisation du plan et du répertoire d’investigation.
