# Theming — Architecture SCSS

## 1. Point d'entrée

`src/assets/themes.scss` est le fichier d'entrée principal importé par l'application. Il orchestre tous les overrides Vuetify dans l'ordre :

```scss
@use 'settings';        // Variables Vuetify (font, boutons…)
@use 'overrides/elevations';
@use 'overrides/radius';
@use 'overrides/typography';
@use 'overrides/spacers';
@use 'overrides/btns';
@use 'overrides/icons';
@use 'overrides/forms';
@use 'overrides/tables';
@use 'overrides/tooltips';
@use 'overrides/utilities';
@use 'overrides/otp';
```

`src/assets/settings.scss` configure Vuetify au niveau build (SASS variables, ne pas y mettre de styles CSS — ils seraient dupliqués).

---

## 2. Système multi-marques

Le Design System supporte trois marques/thèmes appliqués via des classes CSS sur un élément parent :

| Classe CSS | Marque | Fichier tokens |
|---|---|---|
| `.theme-cnam` | CNAM (Assurance Maladie) | Tokens via variables Vuetify |
| `.theme-pa` | PA (Professionnel de santé) | Tokens via variables Vuetify |
| `.theme-ap` | AmeliPro | `src/assets/amelipro/apTokens2026.scss` |

Les overrides (typography, radius, spacers…) utilisent ces trois classes pour appliquer des valeurs différentes par marque.

### Valeurs clés par marque

| Token | CNAM | PA | AmeliPro |
|---|---|---|---|
| Border radius base (`--radius-md`) | `4px` | `4px` | `12px` |
| Spacer base (`--spacing-N`) | `4px` | `4px` | `4px` |
| Couleur primaire | via thème Vuetify | via thème Vuetify | `#0084b2` |

---

## 3. Fichiers de overrides

Tous dans `src/assets/overrides/`. Chaque fichier surcharge un aspect précis de Vuetify avec les valeurs propres à chaque marque.

| Fichier | Ce qu'il surcharge |
|---|---|
| `_breakpoints.scss` | Points de rupture responsive partagés |
| `_radius.scss` | Arrondis (`sm`, `md`, `lg`, `xl`, `pill`, `circle`) |
| `_spacers.scss` | Échelle d'espacements (0 → 64, base `4px`) |
| `_typography.scss` | Tailles, graisses et interlignes des headings (`h1`→`h6`) et corps de texte |
| `_elevations.scss` | Ombres portées |
| `_btns.scss` | Styles de boutons |
| `_forms.scss` | Styles des champs de formulaire |
| `_icons.scss` | Taille et alignement des icônes |
| `_tables.scss` | Styles des tableaux |
| `_tooltips.scss` | Styles des infobulles |
| `_utilities.scss` | Classes utilitaires supplémentaires |
| `_otp.scss` | Styles du champ OTP |

---

## 4. Breakpoints

Définis dans `_breakpoints.scss`, à utiliser via `@use` :

```scss
@use '@/assets/overrides/breakpoints' as bp;

.my-component {
  @media #{bp.$up-md} { /* >= 960px */ }
  @media #{bp.$down-sm} { /* <= 959.99px */ }
}
```

| Variable | Valeur |
|---|---|
| `$up-sm` | `width >= 600px` |
| `$up-md` | `width >= 960px` |
| `$up-lg` | `width >= 1264px` |
| `$down-xs` | `width <= 599.99px` |
| `$down-sm` | `width <= 959.99px` |
| `$down-md` | `width <= 1263.99px` |
| `$sm-only` | `600px <= width <= 959.99px` |
| `$md-only` | `960px <= width <= 1263.99px` |
| `$up-dental` | `width >= 1240px` (AmeliproDentalChart) |
| `$up-tablet` | `width >= 768px` (SocialMediaLinks) |

---

## 5. Tokens AmeliPro (`apTokens2026.scss`)

`src/assets/amelipro/apTokens2026.scss` définit les variables SCSS propres à la marque AmeliPro :

- **Couleurs sémantiques** : `$ap-primary`, `$ap-secondary`, `$ap-error`, `$ap-succes`, `$ap-warning`…
- **Media queries** : `$media-up-sm`, `$media-down-md`… (même grille que `_breakpoints.scss` mais format legacy)

> ⚠️ **Problèmes connus** (voir [analyse tokens](../../.junie/AGENTS.md)) :
> - Duplication de couleurs primitives entre les fichiers de tokens des différentes marques
> - Mélange de nommages (`primary-darker`, `primary-base`, `ap-primary`)
> - Couleurs hardcodées dans les thèmes Storybook (`ApTheme.ts`, `CnamTheme.ts`) au lieu de référencer les tokens

---

## 6. Thèmes Storybook

Les thèmes visuels de Storybook sont définis dans `.storybook/` :

| Fichier | Marque |
|---|---|
| `CnamTheme.ts` | CNAM |
| `ApTheme.ts` | AmeliPro |
| `Ap2026Theme.ts` | AmeliPro 2026 |
| `PaTheme.ts` | PA |
