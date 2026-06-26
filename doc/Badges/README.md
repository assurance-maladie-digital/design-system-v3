# Index — Badges de version

Chaque page de composant affiche deux badges générés automatiquement depuis l'historique git :

- 🟢 **Badge fonctionnel** — dernier commit touchant le code source du composant
- 🔵 **Badge accessibilité** — dernier commit lié à l'accessibilité

---

## Pages

### 1. [Workflow de release](./release-workflow.md)
Procédure à suivre lors d'une release (ou d'une PR ciblée) pour mettre à jour les badges. Contient les commandes `pnpm` à exécuter dans l'ordre.

### 2. [Badge accessibilité](./a11y-version-badge.md)
Détail du badge a11y : fichiers impliqués, cas d'usage, détection des commits, structure du JSON, format MDX.

### 3. [Badge fonctionnel](./functional-version-badge.md)
Détail du badge fonctionnel : fichiers impliqués, cas d'usage, critères d'exclusion, structure du JSON, format MDX.

### 4. [Logique date / version](./version-logic.md)
Explique comment la version (tag git ou `package.json`) et la date sont calculées pour chaque commit analysé.
