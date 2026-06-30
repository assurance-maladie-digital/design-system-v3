# Dépendances & `peerDependencies`

Cette page documente les dépendances déclarées par `@cnamts/synapse` et, en
particulier, les **`peerDependencies`** : les paquets que le projet **consommateur**
doit installer lui-même, le Design System ne les embarquant pas dans son bundle.

---

## `peerDependencies` actuelles

| Paquet | Contrainte | Rôle |
|---|---|---|
| `vue` | `^3.5.18` | Framework. Une seule instance de Vue doit exister dans l'application. |
| `vuetify` | `3.12.2` | Bibliothèque de composants sous-jacente. Version **fixée** (pas de plage). |
| `@mdi/js` | `>=7.0.0` | Chemins SVG des icônes Material Design Icons utilisés par les composants. |

> Une `peerDependency` n'est **pas installée** par le Design System : c'est au
> projet consommateur de l'ajouter à son `package.json`. En contrepartie, une seule
> version est résolue dans l'application, ce qui évite les doublons (deux instances
> de Vue/Vuetify, duplication des icônes dans le bundle…).

---

## Changement : `@mdi/js` devient une `peerDependency`

Réf. PR [#2350](https://github.com/assurance-maladie-digital/design-system-v3/pull/2350).

Jusqu'ici, `@mdi/js` était une **dépendance directe** (`dependencies`) du Design
System : il était donc embarqué et figé à la version résolue par `@cnamts/synapse`.
Il est désormais déclaré en **`peerDependency`** et **externalisé du build**.

### Avant / Après

| Section `package.json` | Avant | Après |
|---|---|---|
| `dependencies` | `@mdi/js: ^7.4.47` | — (retiré) |
| `peerDependencies` | — | `@mdi/js: >=7.0.0` |
| `devDependencies` | — | `@mdi/js: ^7.4.47` *(pour le dev/les stories)* |

### Externalisation dans le build

`@mdi/js` est marqué `external` dans la configuration Rollup afin de **ne plus être
inclus dans le bundle publié** ; c'est la version du consommateur qui est utilisée à
l'exécution.

```ts
// vite.config.ts
build: {
  rollupOptions: {
    external: ['vue', /^vuetify/, '@mdi/js'],
    output: {
      globals: {
        // …
        '@mdi/js': 'mdi',
      },
    },
  },
}
```

---

## Pourquoi ce changement

- **Pas de duplication.** La quasi-totalité des applications consommatrices utilise
  déjà `@mdi/js` (et Vuetify le requiert). En faire une `peerDependency` garantit une
  **version unique** partagée, au lieu de deux copies dans le `node_modules` / le bundle.
- **Bundle plus léger.** Les chemins d'icônes ne sont plus embarqués dans le paquet
  publié `@cnamts/synapse`.
- **Contrôle de version côté consommateur.** La contrainte large `>=7.0.0` laisse
  l'application choisir/aligner sa version de `@mdi/js` (cohérente avec celle exigée
  par sa version de Vuetify).

---

## Impact pour les projets consommateurs

L'installation de `@mdi/js` devient **obligatoire** côté application. Les
gestionnaires de paquets **n'installent pas** automatiquement les `peerDependencies`
(npm ≥ 7 émet un avertissement ; pnpm/yarn peuvent échouer selon la configuration).

```bash
# npm
npm install @mdi/js

# pnpm
pnpm add @mdi/js

# yarn
yarn add @mdi/js
```

Aucun changement d'**API** : les imports d'icônes restent identiques.

```ts
import { mdiPencil, mdiDelete } from '@mdi/js'
```

> En cas d'avertissement `unmet peer dependency @mdi/js` lors de l'installation de
> `@cnamts/synapse`, ajoutez simplement `@mdi/js` aux dépendances de votre projet.
