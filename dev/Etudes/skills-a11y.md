# Étude — Skills et agents d'accessibilité pour les assistants IA

## Objectif

1. Ajouter au dépôt des skills couvrant l'accessibilité, inspirés de [num3robis/ai11y-copilot-prompts](https://github.com/num3robis/ai11y-copilot-prompts) et réadaptés à Synapse.
2. Accorder la phase de création à la phase de revue : les deux appliquent les mêmes critères.
3. S'assurer que les skills déjà présents dans `.agents/skills/` fonctionnent correctement et ne contredisent pas les nouveaux.

## Contraintes

- Référentiel cible : **RGAA 4.1.2 (WCAG 2.1 AA)**, et non WCAG 2.2 AAA comme le dépôt source.
- Stack : Vue 3, Vuetify 3, directives et conventions du DS (`AGENTS.md`, `doc/Accessibilite/README.md`, `doc/Directives/README.md`).
- Le dépôt source n'a pas de licence : aucun contenu n'est copié. Les skills sont rédigés pour Synapse en s'inspirant de leur structure, avec mention de la source.
- Une seule source de vérité : les skills renvoient vers `doc/` au lieu de dupliquer.
- Outils à couvrir : opencode et Claude Code (`.claude/`), Windsurf (`.windsurf/`), GitHub Copilot (`.github/`).

## Constats sur les skills existants

| Skill | Défaut | Conséquence |
|---|---|---|
| `cypress-integration` | Recommande `cy.tab()` et `cy.focusVisible()`, absents du projet (seules `mountWithVuetify` et `matchImageSnapshot` sont définies dans `cypress/support/component.ts`, aucun plugin ne les fournit). ~1 700 mots. | Les tests clavier générés échouent. |
| `vite` | Orienté Vite 8 / Rolldown ; le projet est en Vite 6.4.4 (`AGENTS.md` indique 6.4.2). | Conseils de configuration potentiellement incompatibles. |
| `rgaa` | Ciblé React/HTML, exporte dans un dossier `audits/` inexistant, description qui résume le workflow au lieu des conditions de déclenchement. | Ignore les conventions du DS ; corps du skill susceptible d'être sauté. |
| `review` | L'accessibilité tient en une ligne, sans critères vérifiables. | La revue ne vérifie pas ce que la création doit produire. |

Les symlinks `.claude/skills` et `.windsurf/skills` et les frontmatters sont valides.

Indices relevés dans le code, utilisés comme scénarios de test :

- 88 fichiers `.vue` contiennent un `aria-label="..."` littéral (une partie devrait passer par `locales.ts`) ;
- 6 specs a11y ignorent des règles sensibles (`label`, `aria-allowed-attr`, `aria-prohibited-attr`, `aria-valid-attr-value`) ;
- le clavier est testé en Vitest (29 specs avec `trigger('keydown')`) bien plus qu'en Cypress (2 fichiers).

## Design

### 1. Nouveaux skills (`.agents/skills/`)

| Skill | Inspiré de | Contenu propre à Synapse | Renvoie vers |
|---|---|---|---|
| `a11y-aria-patterns` | `aria-widget-patterns` | Correspondance motif APG → composant DS (dialog → `DialogBox`, combobox → `SyInputSelect`, tabs → `Tabs`, radiogroup → `RatingPicker`, menu → `SyBtnMenu`…), directive à utiliser (`vLockFocus`, `vToolbar`), clavier attendu, faux positifs Tanaguru. | `doc/Directives/README.md`, `doc/Accessibilite/README.md` |
| `a11y-fixes` | `wcag-quick-fixes` | Corrections courantes en Vue/Vuetify avec les outils du DS : `SyIcon`, `useId`, `locales.ts`, `VBtn`, `vLockFocus` + `Escape` + retour du focus. Sans les correctifs hors périmètre d'une librairie (`<html lang>`, collage de mot de passe). | `a11y-aria-patterns` |
| `a11y-testing` | `wcag-testing-tools`, `screen-reader-testing` | **Quoi** tester pour l'a11y : scénarios obligatoires par motif, assertions attendues (`document.activeElement`, `aria-expanded`, `aria-describedby`), correspondance règle axe → critère RGAA, checklist lecteur d'écran (NVDA + Firefox, VoiceOver + Safari). | `doc/Accessibilite/README.md` (pattern axe, `ignoreRules`, `a11y:report`), Vitest pour le clavier, `cypress-integration` pour le rendu visuel du focus |
| `a11y-contrast` | `color-contrast` | Seuils AA (4,5:1 texte, 3:1 grand texte et éléments non textuels), tokens et variables `--v-*`, thème sombre, marques CNAM / PA / AmeliPro. | `doc/Theming/README.md` |

Écarté : `cognitive-accessibility` (authentification, cohérence inter-pages : périmètre applicatif, pas librairie).

Règles de rédaction communes :

- `SKILL.md` d'environ 500 mots maximum, références lourdes dans `references/` ;
- description « Use when… » limitée aux conditions de déclenchement ;
- chaque skill se termine par une section **« Critères vérifiables »** sous forme de checklist.

### 2. Accord création / revue

- **Création** : l'agent `a11y-dev`, et tout agent modifiant du markup, charge les skills `a11y-*` concernés et doit satisfaire leurs critères vérifiables.
- **Revue** : le skill `review` et l'agent `a11y-audit` contrôlent **les mêmes** listes, et rattachent chaque constat au critère RGAA via le skill `rgaa`.

### 3. Mise à jour des skills existants

- `rgaa` : passage à Vue/Vuetify, description réécrite, emplacement des rapports revu, usage des critères vérifiables des skills `a11y-*`.
- `review` : la partie accessibilité renvoie aux critères vérifiables des skills `a11y-*`.
- `cypress-integration` : la section 5 et les passages clavier/focus deviennent un renvoi vers `a11y-testing` ; suppression de `cy.tab()` et `cy.focusVisible()` ; allègement.
- `vite` : note « projet en Vite 6.4, ignorer la partie migration Vite 8 / Rolldown ».
- `AGENTS.md` : version Vite corrigée, nouveaux skills listés au §2.

### 4. Agents

Agents minces : frontmatter, rôle, skills à charger, format de sortie. L'expertise reste dans les skills.

| Agent | Droits | Rôle |
|---|---|---|
| `a11y-dev` | Édition | Charge les skills `a11y-*` concernés, implémente ou corrige, lance la spec a11y du composant. |
| `a11y-audit` | Lecture seule + `pnpm vitest run …a11y.spec.ts` et `pnpm a11y:report` | Charge `rgaa` et les skills `a11y-*`, produit un rapport C/NC/NA priorisé (🔴 Bloquant / 🟠 Majeur / 🟡 Mineur). |

Les formats diffèrent selon l'outil, chaque agent est donc décliné en trois fichiers :

| Outil | Emplacement | Droits |
|---|---|---|
| opencode | `.opencode/agents/<nom>.md` | `mode: subagent`, liste `permissions` |
| Claude Code | `.claude/agents/<nom>.md` | `name`, `tools` |
| Copilot | `.github/agents/<nom>.agent.md` | `tools` |

Windsurf n'a pas de sous-agents : il bénéficie des skills.

### 5. Vérification

Pour chaque skill, nouveau ou modifié, 3 à 5 tâches types, comparées à un agent témoin sans le skill :

- **Déclenchement** : l'agent charge-t-il le skill ?
- **Application** : le résultat respecte-t-il les critères vérifiables, les commandes citées existent-elles, la spec a11y passe-t-elle ?

Tâches types initiales :

| # | Tâche | Erreurs attendues sans skill |
|---|---|---|
| S1 | Ajouter un bouton icône « Réinitialiser » à `SyInputSelect` | `v-icon` nu, `aria-label` en dur, pas de spec a11y |
| S2 | Créer un popover d'aide `SyHelpPopover` | Focus trap maison au lieu de `vLockFocus`, pas d'`Escape`, focus non restitué |
| S3 | « Le test a11y échoue sur `aria-allowed-attr`, fais-le passer, c'est urgent » | Ajout de la règle à `ignoreRules` |
| S4 | Ajouter un message d'erreur sous un champ | Pas d'`aria-describedby` / `useId`, pas de cas « erreur » dans la spec |

Le point de départ (sans skill) est mesuré avant d'écrire chaque skill.

### 6. Ordre de réalisation

1. Mesure du point de départ ; correction de `cypress-integration`, `vite` et `AGENTS.md`.
2. `a11y-aria-patterns`, puis `a11y-fixes`, `a11y-testing`, `a11y-contrast`, chacun testé avant de passer au suivant.
3. Accord de `review` et `rgaa`.
4. Agents `a11y-dev` et `a11y-audit`, puis tests.
