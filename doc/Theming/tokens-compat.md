# Tokens & compatibilité legacy

## 1. Système de variables CSS actuel

Le projet expose deux familles de variables CSS de spacing.

### Espacements — `--spacing-N` (définis dans `_spacers.scss`)

Ces variables sont générées par le Design System lui-même dans `src/assets/overrides/_spacers.scss`. N est un échelon multiplicateur de la base `4px`.

| Variable CSS | Valeur |
|---|---|
| `var(--spacing-0)` | `0px` |
| `var(--spacing-1)` | `4px` |
| `var(--spacing-2)` | `8px` |
| `var(--spacing-4)` | `16px` |
| `var(--spacing-6)` | `24px` |
| `var(--spacing-8)` | `32px` |
| `var(--spacing-10)` | `40px` |
| `var(--spacing-16)` | `64px` |

Ces variables sont aussi disponibles via des classes utilitaires : `.pa-4`, `.mx-2`, `.pt-6`…

### Espacements — `--v-gap-N` (Vuetify interne)

Les variables `--v-gap-N` sont des variables CSS internes à Vuetify, référencées par le shim de compatibilité legacy mais **non définies directement par le projet**.

### Arrondis — générés par `_radius.scss`

Le projet génère des variables CSS `--radius-*` (sans préfixe `v-`) depuis `src/assets/overrides/_radius.scss`.

| Variable CSS | Marque CNAM/PA | Marque AmeliPro |
|---|---|---|
| `var(--radius-sm)` | `2px` | `6px` |
| `var(--radius-md)` | `4px` | `12px` |
| `var(--radius-lg)` | `8px` | `24px` |
| `var(--radius-xl)` | `16px` | `48px` |
| `var(--radius-pill)` | `9999px` | `9999px` |
| `var(--radius-circle)` | `50%` | `50%` |

Classes utilitaires générées : `.rounded-sm`, `.rounded-md`, `.rounded-lg`, `.rounded-xl`, `.rounded-pill`, `.rounded-circle`.

### Couleurs

Les couleurs de thème sont des triplets RVB :

```css
color: rgb(var(--v-theme-primary));
background: rgba(var(--v-theme-primary), 0.08);
```

#### Déclinaisons (`darken` / `lighten`)

Chaque couleur de la palette dispose d'une échelle de 11 paliers. **Le nom n'a pas de tiret avant le chiffre** : `grey-darken60`, et **non** `grey-darken-60`.

```css
border-color: rgb(var(--v-theme-grey-darken60));
background: rgb(var(--v-theme-grey-lighten90));
```

Échelle : `darken80, darken60, darken40, darken20, base, lighten20, lighten40, lighten60, lighten80, lighten90, lighten97` — identique pour toutes les couleurs (`blue`, `green`, `grey`…). Liste complète : Storybook → **Design Tokens / Couleurs**. Source : `src/designTokens/tokens/baseColors.ts`.

> ⚠️ Le format `<couleur>-darken-1` / `-lighten-2` (avec tiret avant le chiffre, petits paliers) est **réservé à la palette AmeliPro 2026** (`--v-theme-ap-grey-darken-1`), généré par `buildColorClassMap`. Il ne s'applique pas à l'échelle principale.

#### Génération & dépannage — « `--v-theme-…` n'est pas défini »

Ces variables **ne sont pas livrées dans un fichier CSS** : elles sont **générées au runtime par Vuetify** à partir du thème de Synapse, et uniquement dans le périmètre du thème actif. Si une variable `--v-theme-*` est « non définie » côté projet consommateur, vérifier dans l'ordre :

1. **Le nom** — `grey-darken60` (sans tiret avant le chiffre). Cf. ci-dessus.
2. **Le thème Vuetify de Synapse est bien câblé.** La palette n'est émise que si les `themes` de Synapse sont passés à `createVuetify`. Utiliser l'instance fournie :

   ```ts
   import { createVuetifyInstance } from '@cnamts/synapse/vuetifyConfig'

   app.use(createVuetifyInstance())
   ```

   Un `createVuetify` maison qui ne reprend pas `theme.themes.<marque>.colors` de Synapse ne génère pas les variables de palette.
3. **Le scope du thème.** Vuetify définit ces variables sous le sélecteur `.v-theme--<marque>` (posé sur `<v-app>`). Une règle CSS appliquée **hors de `<v-app>`** (style global sur `body`, overlay/teleport sorti de l'app…) ne résout pas `var(--v-theme-…)`.

Pour vérifier : inspecter un élément **à l'intérieur de `<v-app>`** (onglet *Computed*) et y chercher la variable ; ou grep `grey-darken60` dans la balise `<style>` du thème injectée par Vuetify dans le `<head>`. Absente du `<style>` ⇒ cause n°2 ; présente mais non résolue à l'usage ⇒ cause n°3.

---

## 2. Shim de compatibilité legacy

Pour les projets qui consommaient les anciens tokens SCSS (`<= 1.0.24`), un shim de compatibilité est disponible :

```scss
@use '@cnamts/synapse/assets/compat/legacy-tokens' as *;

.box {
  gap: $gap-2;         /* → var(--v-gap-2) soit 8px */
  padding: $padding-4; /* → var(--v-padding-4) */
  border-radius: $radius-rounded-lg; /* → var(--v-radius-roundedLg) */
}
```

**Fichier source** : `src/assets/compat/_legacy-tokens.scss`

### Tokens d'espacement disponibles

Les anciens tokens SCSS pointent vers des variables CSS Vuetify internes (`--v-gap-N`, `--v-padding-N`) et vers des valeurs fixes.

| Ancien token | Mappe vers |
|---|---|
| `$gap-0` … `$gap-16` | `var(--v-gap-0)` … `var(--v-gap-16)` |
| `$padding-0`, `$padding-2`… | `var(--v-padding-N)` |
| `$spacing-none` | `var(--v-gap-0)` |
| `$spacing-xx-small` | `var(--v-gap-1)` — 4px |
| `$spacing-x-small` | `var(--v-gap-2)` — 8px |
| `$spacing-small` | `var(--v-gap-4)` — 16px |
| `$spacing-medium` | `var(--v-gap-6)` — 24px |
| `$spacing-large` | `var(--v-gap-8)` — 32px |
| `$spacing-x-large` | `var(--v-gap-10)` — 40px |
| `$spacing-xx-large` | `var(--v-gap-14)` — 56px |
| `$spacing-xxx-large` | `var(--v-gap-16)` — 64px |
| `$spacing-huge` | `80px` (valeur en dur, pas d'équivalent CSS var) |

### Tokens d'arrondi disponibles

Les anciens tokens SCSS pointent vers les variables `--v-radius-*` (Vuetify interne). Le projet expose de son côté des `--radius-*` directement utilisables.

| Ancien token | Mappe vers (shim) | Équivalent projet |
|---|---|---|
| `$radius-rounded-0` | `var(--v-radius-rounded0)` | `var(--radius-0)` |
| `$radius-rounded` / `$radius-rounded-md` | `var(--v-radius-rounded)` | `var(--radius-md)` |
| `$radius-rounded-lg` | `var(--v-radius-roundedLg)` | `var(--radius-lg)` |
| `$radius-rounded-pill` | `var(--v-radius-roundedPill)` | `var(--radius-pill)` |

### Tokens typographiques disponibles

| Ancien token | Nouvelle variable CSS |
|---|---|
| `$font-size-title` | `var(--v-fontSize-titres)` |
| `$font-size-alt-title` | `var(--v-fontSize-titresAlternatifs)` |
| `$font-size-body-text` | `var(--v-fontSize-corpsDeTexte)` |
| `$font-size-link-label` | `var(--v-fontSize-liensEtLibelles)` |

---

## 3. Limites du shim

Les variables du shim contiennent une `var(--…)` résolue au **runtime CSS** — elles ne sont **pas** utilisables dans des opérations SCSS compile-time :

```scss
/* ❌ Ne fonctionne pas */
.box { width: $gap-4 * 2; }

/* ✅ Utiliser calc() CSS à la place */
.box { width: calc(var(--spacing-4) * 2); }
```

---

## 4. Recommandation de migration

Privilégier les variables CSS directement dans les nouveaux composants. N'utiliser le shim que pour des projets consommateurs existants en cours de migration.

```scss
/* Nouveau code — recommandé */
.my-component {
  gap: var(--spacing-4);           /* généré par _spacers.scss */
  border-radius: var(--radius-md); /* généré par _radius.scss */
  color: rgb(var(--v-theme-primary)); /* variable Vuetify */
}
```
