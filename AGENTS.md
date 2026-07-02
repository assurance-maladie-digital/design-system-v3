# AGENTS.md — @cnamts/synapse (Design System v3)

> Guide opérationnel pour les agents IA travaillant sur ce dépôt.
> Objectif : produire des contributions correctes, accessibles et cohérentes avec les conventions existantes, du premier coup.

---

## 1. Le projet en une phrase

`@cnamts/synapse` est la **librairie de composants Vue 3** du Design System de l'Assurance Maladie (CNAM), **publiée publiquement sur npm** et consommée par le starter kit `sksn_x`. Ce n'est **pas une application** : c'est une bibliothèque buildée en module ES avec ses types `.d.ts`.

- Marques supportées : **CNAM / PA (Portail Agents) / AmeliPro**.
- Fort engagement **accessibilité (RGAA)** : c'est un critère de qualité non négociable.

---

## 2. Stack & environnement

| Élément | Détail |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| UI | Vuetify 3 (surchargé, voir `composantsVuetify/`) |
| Langage | TypeScript strict |
| Styles | SCSS **scopé** par composant (`<style scoped lang="scss">`), en réutilisant au maximum les **variables CSS générées par Vuetify** (`--v-*`) plutôt que des valeurs en dur |
| Doc/Dev UI | Storybook |
| Runtime | Node `>=20.11.0` |
| Package manager | **pnpm uniquement** |

> `vue` et `vuetify` sont des **peerDependencies / externals** : ils ne doivent **jamais** être inclus dans le bundle.

---

## 3. Commandes essentielles

Utiliser **pnpm** exclusivement.

```bash
pnpm dev                 # Serveur de dev (Vite)
pnpm build               # Type-check (vue-tsc) + build de la librairie
pnpm storybook           # Storybook (doc + dev des composants)

pnpm test:unit           # Tests unitaires Vitest (exclut les *.a11y.spec.ts)
pnpm test:a11y           # Tests d'accessibilité (vitest-axe)
pnpm test:visual         # Tests visuels Cypress (Electron headless)
pnpm test:visual:open    # Tests visuels en mode interactif
pnpm test:visual:update  # Met à jour les baselines visuelles

pnpm lint                # ESLint (src/**/*.{ts,vue})
pnpm lint:style          # Stylelint (CSS/SCSS/Vue)
pnpm lint:fix            # ESLint --fix + Stylelint --fix
```

### ⚡ Itérer vite : cibler, ne pas tout relancer

`pnpm build` et `pnpm test:unit` (suite complète) sont **lents** : à réserver à la validation finale ou à la CI. Pendant le développement, **cibler** le périmètre modifié.

```bash
# Tests unitaires ciblés (un fichier ou un dossier de composant)
pnpm vitest run src/components/SyAlert                 # tout le dossier
pnpm vitest run src/components/SyAlert/tests/SyAlert.spec.ts
pnpm vitest run -t "nom du test"                        # filtrer par titre

# A11y ciblé sur un composant
pnpm vitest run src/components/SyAlert/tests/SyAlert.a11y.spec.ts

# Lint ciblé sur les fichiers touchés
pnpm exec eslint src/components/SyAlert

# Vérif de types SANS build complet (rapide)
pnpm vue-tsc -p tsconfig.app.json --noEmit

# Test visuel d'un seul composant
pnpm test:visual --spec "src/components/SyAlert/**/*.cy.ts"
```

**Avant de considérer une tâche terminée** (validation finale, périmètre ciblé) :

```bash
pnpm exec eslint <fichiers modifiés> && pnpm vitest run <dossier concerné>
```

Ajouter le `*.a11y.spec.ts` du composant si du markup a été modifié.
Ne lancer `pnpm build` / `pnpm test:unit` complets que si le changement est transverse ou avant un commit important.

> Un hook **Husky** s'exécute au pre-commit : il lance `pnpm run lint:fix` **et** valide le **nom de branche** (voir §10). Le code doit passer lint/format.

---

## 4. Architecture de `src/`

```
src/
├── components/          # Composants publics du DS (1 dossier par composant)
├── composables/         # Composables réutilisables (useXxx)
├── composantsVuetify/   # Documentation succincte de composants Vuetify non couverts par un composant du design system
├── directives/          # Directives Vue réutilisables (a11y et utilitaires)
├── services/            # Services transverses
├── utils/               # Fonctions utilitaires
├── constants/           # Constantes partagées
├── designTokens/        # Design tokens (palettes de couleurs, thèmes, espacements...)
├── types/               # Types TypeScript partagés
├── modules/             # Modules autonomes (ex. notification)
├── common/              # Code commun interne
├── assets/              # SCSS (point d'entrée settings.scss), images
├── stories/             # Stories transverses / documentation Storybook
├── main.ts              # Point d'entrée de la librairie
└── vuetifyConfig.ts     # Config Vuetify exportée (./vuetifyConfig)
```

---

## 5. Anatomie d'un composant (convention forte)

Chaque composant vit dans `src/components/<Nom>/` et suit ce patron :

```
src/components/SyAlert/
├── SyAlert.vue           # Implémentation
├── SyAlert.stories.ts    # Stories Storybook
├── SyAlert.mdx           # Documentation
├── Usages.stories.ts     # Exemples d'usage
├── Usages.mdx            # Doc des usages
├── locales.ts            # Chaînes i18n du composant
├── accessibilite/        # Ressources / déclaration a11y
└── tests/                # Tests unitaires + snapshots (+ *.a11y.spec.ts)
```

Règles :
- **Préfixe `Sy`** pour les composants « custom » maison (`SyAlert`, `SyHeading`, `SyBtnMenu`…).
- Tout composant public **doit être exporté** dans [src/components/index.ts](src/components/index.ts), rangé dans la bonne catégorie (Structure, Layout, Navigation, Boutons, etc.).
- Toujours prévoir : stories, tests unitaires, et couverture a11y.
- **Logique réutilisable → composable** : extraire l'état et la logique non triviale dans un composable `useXxx` (`ref`/`computed`/`watch`, typé, retournant un objet). Le placer dans `src/composables/` s'il est partagé (et l'exporter via [src/composables/index.ts](src/composables/index.ts)), ou dans le dossier du composant s'il lui est spécifique. Le `.vue` reste ainsi fin et la logique est testable isolément.
- **Réactivité** : un composable doit, dans la mesure du possible, gérer des éléments **réactifs**. Accepter les entrées en `ref`/`getter` (les normaliser avec `toRef`/`toValue`), exposer l'état dérivé en `computed`, et retourner des `ref`/`computed` (jamais des valeurs figées désynchronisées de la source). La réactivité doit être préservée de bout en bout.

  ```ts
  // src/composables/useDisclosure.ts
  import { type ComputedRef, type MaybeRefOrGetter, type Ref, computed, ref, toValue } from 'vue'

  export interface UseDisclosure {
    isOpen: Ref<boolean>
    canToggle: ComputedRef<boolean>
    open: () => void
    close: () => void
    toggle: () => void
  }

  // `disabled` accepté en ref/getter : la source reste réactive
  export function useDisclosure(disabled: MaybeRefOrGetter<boolean> = false, initial = false): UseDisclosure {
    const isOpen = ref(initial)
    const canToggle = computed(() => !toValue(disabled)) // état dérivé réactif

    const open = (): void => { if (canToggle.value) isOpen.value = true }
    const close = (): void => { isOpen.value = false }
    const toggle = (): void => { isOpen.value = canToggle.value && !isOpen.value }

    return { isOpen, canToggle, open, close, toggle }
  }
  ```

  ```vue
  <!-- SyAlert.vue -->
  <script setup lang="ts">
  import { useDisclosure } from '@/composables/useDisclosure'

  const props = defineProps<{ disabled?: boolean }>()

  // getter passé en entrée : la réactivité est préservée de bout en bout
  const { isOpen, close } = useDisclosure(() => props.disabled, true)
  </script>
  ```
- i18n : **aucune librairie** (pas de `vue-i18n`). Externaliser les chaînes dans `locales.ts` (ne jamais coder en dur), qui exporte un objet `locales` dont les valeurs sont :
  - soit des **constantes** string : `export const locales = { close: 'Fermer' }`, utilisées `{{ locales.close }}` ;
  - soit des **fonctions à paramètres** pour l'interpolation / le pluriel : `rowText: (lignes: string, plural: boolean): string => \`${lignes} ligne${plural ? 's' : ''}\``.
- **Personnalisation par le consommateur** : exposer les libellés en prop plutôt que de les figer. Importer l'objet sous alias (`import { locales as defaultLocales } from './locales'`), déclarer `locales?: typeof defaultLocales` et fournir le défaut via `withDefaults` (`locales: () => defaultLocales`). Le consommateur peut ainsi surcharger tout ou partie des chaînes.

---

## 6. Conventions de test

**Philosophie : tester en boîte noire.** Un test part des **props** et des **interactions utilisateur** (clic, saisie, clavier), puis vérifie le **rendu HTML** et les **événements émis**. On teste le composant tel que l'utilisateur / le consommateur le voit, pas son fonctionnement interne.

- ✅ Piloter via `props` / `slots`, déclencher des interactions (`trigger`, `setValue`, événements clavier), asserter sur le DOM rendu (`text()`, `find`, attributs ARIA, classes) et sur `emitted()`.
- ❌ Éviter d'accéder à l'état interne (`wrapper.vm.<data/ref>`, appel direct de méthodes internes) ou de dépendre de détails d'implémentation. Un refactor interne ne doit pas casser les tests.
- Préférer des sélecteurs stables (rôle, label, texte, `data-*`) plutôt que la structure DOM profonde.

| Type | Outil | Fichiers | Notes |
|---|---|---|---|
| Unitaire | Vitest + `happy-dom` | `*.spec.ts` | Sérialiseur `vue3-snapshot-serializer`, coverage `v8` |
| Accessibilité | `vitest-axe` | `*.a11y.spec.ts` | Exclus du run unitaire standard, lancés via `pnpm test:a11y` |
| Visuel | Cypress image snapshot | `*.cy.ts` | **Electron headless** pour la reproductibilité |

⚠️ **Tests visuels & WSL** : les snapshots diffèrent entre WSL et Linux natif.
Sur WSL, utiliser `test:visual:open` pour l'inspection seulement ; générer les **baselines officielles en CI (Ubuntu) ou sur Linux natif**. Ne pas committer de baselines produites sous WSL.

---

## 7. Accessibilité (RGAA) — non négociable

- Tout nouveau composant ou markup modifié doit disposer d'un test `*.a11y.spec.ts` (axe) et ne pas régresser `a11y-report.md`.
- Privilégier les **directives a11y** du DS (`vToolbar`, `vLockFocus`, `vRgaaSvgFix`, `clickOutside`) plutôt que du code ad hoc — détail dans [doc/Directives/README.md](doc/Directives/README.md).
- Respecter la sémantique HTML, les labels, le contraste et la navigation clavier.
- Voir [doc/Accessibilite/README.md](doc/Accessibilite/README.md) pour le pattern de test, `ignoreRules` et les faux positifs Tanaguru documentés.

---

## 8. Patterns transverses & doc de référence

**Lire la doc du domaine concerné dans `doc/` avant de modifier le code associé.**

| Domaine | À savoir | Doc |
|---|---|---|
| Options Vuetify | `useCustomizableOptions` : *deep-merge* des props des composants Vuetify sous-jacents. L'utiliser plutôt que recâbler les props à la main. | [Composables](doc/Composables/vuetify-options.md) |
| Validation | Deux modes : `synapse` (sync/async, gestion des race conditions) et `vuetify` (natif). | [Validation](doc/Validation/README.md) |
| Theming & Tokens | Point d'entrée SCSS `src/assets/settings.scss`, overrides Vuetify, variables CSS `--v-*` (+ shim legacy). | [Theming](doc/Theming/README.md) |
| DatePicker | Composant le plus complexe (plusieurs modes, nombreux composables). À lire **impérativement** avant toute modif. | [Migration DatePicker](doc/Validation/migration-datepicker.md) |
| Badges de version | Générés par scripts (a11y / fonctionnel). Ne pas éditer à la main. | [Badges](doc/Badges/release-workflow.md) |
| Directives Vue | Directives a11y à privilégier (cf. §7). | [Directives](doc/Directives/README.md) |
| Scripts / Utils | Outillage et utilitaires publics. | [Scripts](doc/Scripts/README.md) · [Utils](doc/Utils/README.md) |

---

## 9. Garde-fous (rappel)

Règles à fort impact, non redites ailleurs :

- **pnpm uniquement** (jamais npm/yarn) ; `vue`/`vuetify` restent externes.
- Ne pas committer de baselines de tests visuels générées sous **WSL** (cf. §6).
- Ne pas créer de fichiers markdown de documentation « de changement » non demandés.

---

## 10. Commits & branches

Conventions **standard**, appliquées par le hook Husky de pre-commit ([.husky/pre-commit](.husky/pre-commit)) :

- **Nom de branche obligatoire** au format `type/description` ; sinon le commit est **rejeté**.
  - Types autorisés : `fix`, `feat`, `chore`, `hotfix`, `refactor`, `release`, `test`.
  - Description : lettres, chiffres et tirets uniquement (`[a-zA-Z0-9-]+`), ex. `feat/sy-alert-dismiss`.
- Le pre-commit lance `pnpm run lint:fix` : le code doit passer lint/format avant commit.
- **Aucune convention imposée sur le message de commit** ; rester clair et concis.
