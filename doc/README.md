# Documentation interne — Design System Synapse

Ce dossier contient la documentation technique interne du design system. Elle est destinée aux développeurs contribuant au projet.

---

## Sommaire

### 📋 [Validation](./Validation/README.md)

Documentation du système de validation des champs de formulaire.

| Fichier | Contenu |
|---|---|
| [Vue d'ensemble](./Validation/validation-overview.md) | Architecture globale, props, niveaux de feedback |
| [Mode Synapse](./Validation/validation-synapse.md) | Flux sync/async, règles disponibles, gestion des race conditions |
| [Mode Vuetify](./Validation/validation-vuetify.md) | Intégration avec la validation native Vuetify |
| [Guide de migration](./Validation/migration-validation.md) | Migration Legacy → Système unifié |

---

### 🧩 [Composables](./Composables/README.md)

Composables utilitaires réutilisables dans les projets consommateurs et les composants internes.

| Fichier | Contenu |
|---|---|
| [vuetifyOptions](./Composables/vuetify-options.md) | Mécanisme `useCustomizableOptions` — deep merge des props Vuetify sous-jacentes |
| [Composables utilitaires](./Composables/composables-utilitaires.md) | `useWidthable`, `useFilterable`, `useHolidayDay`, `usePagination`, `useFormFieldErrorHandling` |

---

### 📅 [DatePicker](./DatePicker/README.md)

Documentation du composant le plus complexe du Design System.

| Fichier | Contenu |
|---|---|
| [Architecture & composables](./DatePicker/architecture.md) | Les 3 modes, carte des 27 composables, flux de données, formats |
| [Audit & dette technique](./DatePicker/audit.md) | Analyse critique, bugs potentiels, recommandations Lead Tech |

---

### 🎨 [Theming & Tokens](./Theming/README.md)

Documentation du système de styles et tokens multi-marques.

| Fichier | Contenu |
|---|---|
| [Architecture SCSS](./Theming/architecture-scss.md) | Point d'entrée, overrides Vuetify, marques CNAM/PA/AmeliPro, breakpoints |
| [Tokens & compatibilité legacy](./Theming/tokens-compat.md) | Variables CSS `--v-*`, shim de migration depuis les anciens tokens SCSS |

---

### 🔧 [Scripts & Outillage](./Scripts/README.md)

Documentation des scripts utilitaires (`scripts/`).

| Sujet | Contenu |
|---|---|
| [Rapport a11y](./Scripts/README.md#1-tests-daccessibilité--rapport) | Générer `a11y-report.md` depuis les tests vitest-axe |
| [Détection fuites mémoire](./Scripts/README.md#2-détection-de-fuites-mémoire) | Scripts Node.js et Bash pour surveiller la mémoire des tests |
| [Dossiers constants vides](./Scripts/README.md#3-vérification-des-dossiers-constants-vides) | Vérification de cohérence structurelle |

---

### 🏷️ [Badges de version](./Badges/release-workflow.md)

Documentation du système de badges automatiques affichés sur les pages de composants.

| Fichier | Contenu |
|---|---|
| [Workflow de release](./Badges/release-workflow.md) | Procédure complète de mise à jour des badges lors d'une release |
| [Badge accessibilité](./Badges/a11y-version-badge.md) | Fonctionnement, scripts, cas d'usage du badge a11y |
| [Badge fonctionnel](./Badges/functional-version-badge.md) | Fonctionnement, scripts, cas d'usage du badge fonctionnel |
| [Logique date/version](./Badges/version-logic.md) | Comment la version et la date sont déterminées depuis git |

---
