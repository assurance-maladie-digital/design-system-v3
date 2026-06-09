# Synapse

🗃️ Ce package contient les composants du Design System de l'Assurance Maladie réécrits en Vue 3.

## Changelog

Pour consulter les changements récents, veuillez consulter le [CHANGELOG](https://github.com/assurance-maladie-digital/design-system-v3/blob/dev/CHANGELOG.md).

## Prérequis

Pour utiliser ce Design System, vous devez avoir au moins les versions suivantes de Node :

-   Node : 20.11.0

## Stack Technique

-   Vue 3
-   Vuetify 3
-   Vue Router 4

## Outils Inclus

-   Typescript
-   Axios
-   Sass
-   Vitest pour les tests unitaires

## Installation et utilisation

### Starter kit

Pour utiliser ce package, vous pouvez installer le starter kit suivant :

-   [Starter Kit Synapse](https://gitlab.cnqd.cnamts.fr/human/developpement/sksn_x)

### Librairie uniquement

Vous pouvez également utiliser ce package en tant que librairie de composants dans votre projet.
Pour cela, vous pouvez l'installer via npm ou un autre gestionnaire de paquets :

```bash
npm i @cnamts/synapse
```

## Commandes disponibles

```bash
pnpm dev                      # Lancement du serveur de développement
pnpm build                    # Build du projet
pnpm preview                  # Lancement du serveur de prévisualisation
pnpm test:unit                # Lancement des tests unitaires
pnpm test:a11y                # Tests d'accessibilité
pnpm test:visual              # Tests visuels avec Cypress (Electron headless)
pnpm test:visual:open         # Tests visuels en mode interactif (Cypress Studio)
pnpm test:visual:update       # Mise à jour des snapshots visuels
pnpm lint                     # Lancement de l'analyseur de code
pnpm lint:style               # Analyse des styles (CSS/SCSS/Vue)
```

### Tests visuels

Les tests visuels utilisent **Electron headless** pour assurer une reproductibilité entre environnements.

- **Développement** : `pnpm test:visual:open` pour inspecter et créer des snapshots
- **Validation locale** : `pnpm test:visual` pour vérifier contre les baselines
- **Mise à jour des baselines** : `pnpm test:visual:update` si les changements sont intentionnels

**Tests visuels en CI** (sur demande pour économiser les GitHub Actions minutes) :
- Allez à **Actions** → **Run Visual Tests (Manual)** → **Run workflow** pour tester manuellement
- Ou déclenchez depuis **Actions** → **Update Visual Test Snapshots** pour mettre à jour les baselines

⚠️ **Important** : Les snapshots varient entre WSL et Linux natif. Si vous êtes sur WSL :
- Testez localement avec `test:visual:open` (inspection uniquement)
- Générez les baselines officielles en CI (Ubuntu) ou sur Linux natif
- Les diffs visuels sont téléchargeables dans les résultats CI

## Contribution

Nous encourageons les contributions de la communauté ! Si vous souhaitez contribuer à ce projet, veuillez suivre les étapes suivantes :

### Fork du dépôt

-   Créez une branche pour votre fonctionnalité ou correction de bogue
-   Effectuez les modifications nécessaires
-   Soumettez une pull request
-   Assurez-vous de suivre notre Guide de contribution pour plus de détails.

### Support

Si vous rencontrez des problèmes ou avez des questions, n'hésitez pas à ouvrir une issue.

## Licence

Ce projet est sous licence MIT. Veuillez consulter le fichier LICENSE pour plus d'informations.