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
| `@mdi/js` | `^7.4.47` | Chemins SVG des icônes Material Design Icons utilisés par les composants. |

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
| `peerDependencies` | — | `@mdi/js: ^7.4.47` |
| `devDependencies` | `@mdi/js: ^7.4.47` *(déjà présent)* | `@mdi/js: ^7.4.47` *(inchangé, pour le dev et les stories)* |

> Seule la ligne `dependencies → peerDependencies` change : `@mdi/js` était déjà présent
> en `devDependencies` et le reste (il sert au dev, aux stories et aux tests du Design
> System lui-même).

### Externalisation dans le build

`@mdi/js` est marqué `external` dans la configuration Rollup afin de **ne plus être
inclus dans le bundle publié** ; c'est la version du consommateur qui est utilisée à
l'exécution.

```ts
// vite.config.ts
build: {
  rollupOptions: {
    external: ['vue', 'vue-router', /^vuetify/, '@mdi/js'],
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
- **Version alignée et garantie.** La contrainte `^7.4.47` demande au consommateur une
  version au moins égale à celle contre laquelle le Design System est développé, tout en
  restant dans le major `7.x`. Cela garantit que **toutes les icônes utilisées par le DS
  existent** côté consommateur : une version antérieure pourrait exposer certains chemins
  d'icônes en `undefined` (icônes vides, sans erreur), et un saut de major non testé
  pourrait renommer ou supprimer des icônes.

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

---

## Patches appliqués via pnpm

Le projet utilise le mécanisme [`patchedDependencies`](https://pnpm.io/settings#patcheddependencies)
de pnpm pour modifier des paquets tiers sans maintenir un fork. Les patches vivent dans
le dossier [`patches/`](../../patches/) et sont déclarés dans
[`pnpm-workspace.yaml`](../../pnpm-workspace.yaml).

### Patch Vuetify `vuetify@3.12.2` — actif

**Fichier** : [`patches/vuetify@3.12.2.patch`](../../patches/vuetify@3.12.2.patch)
**Déclaration** : `pnpm-workspace.yaml` → `patchedDependencies: vuetify@3.12.2: patches/vuetify@3.12.2.patch`

#### Ce que fait le patch

Le patch modifie un seul fichier : `lib/components/VOtpInput/VOtpInput.sass`.

Il supprime le point-virgule final de la directive `@use 'sass:math';` :

```diff
-@use 'sass:math';
+@use 'sass:math'
```

#### Pourquoi

Dart Sass ≥ 1.45 émet un avertissement de déprécation (`@use` rules should not end
with a semicolon) pour les directives `@use` terminées par un point-virgule. Vuetify 3.12.2
ne corrige pas ce problème dans `VOtpInput.sass`. Le patch évite le bruit dans les logs
de build et garantit la compatibilité avec les versions futures de Dart Sass qui
supprimeront cette tolérance syntaxique.

#### Impact et maintenance

- **Impact** : aucun changement fonctionnel. Le rendu de `VOtpInput` est identique.
- **Risque de conflit** : très faible. Le patch ne touche qu'une ligne de SCSS.
- **Montée de version Vuetify** : lors d'une mise à jour de Vuetify, vérifier que le
  fichier `VOtpInput.sass` n'a pas été modifié upstream. Si Vuetify corrige le problème,
  le patch peut être supprimé. Sinon, régénérer le patch avec
  `pnpm patch vuetify@<nouvelle-version>`.
- **Procédure de mise à jour** :
  1. Mettre à jour la version dans `package.json` et `pnpm-workspace.yaml` (section
     `patchedDependencies`).
  2. Lancer `pnpm install`.
  3. Si le patch ne s'applique plus, utiliser `pnpm patch vuetify@<nouvelle-version>`,
     recréer le patch, et mettre à jour le fichier dans `patches/`.
  4. Valider avec `pnpm build` que le build passe sans avertissement Sass.

### Patch undici `undici@7.15.0` — inactif (orphelin)

**Fichier** : [`patches/undici@7.15.0.patch`](../../patches/undici@7.15.0.patch)
**Déclaration** : aucune (non déclaré dans `pnpm-workspace.yaml`).

#### Ce que fait le patch

Il ajoute un polyfill pour `globalThis.File` lorsque celui-ci est `undefined` dans
`lib/web/webidl/index.js` d'undici.

```js
if (typeof globalThis.File === 'undefined') {
  globalThis.File = class {
    constructor() {}
  }
}
```

#### Statut

Ce patch n'est **pas appliqué** par pnpm car il n'est pas déclaré dans
`patchedDependencies`. Il est probablement un vestige d'un fix temporaire pour un
problème de compatibilité Node.js / `happy-dom` dans les tests.

**Action recommandée** : supprimer ce fichier ou le déclarer dans
`pnpm-workspace.yaml` si le problème de `globalThis.File` refait surface. A discuter
