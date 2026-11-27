---
name: a11y-contrast
description: Use when choosing or changing colours, opacity, borders, focus outlines, disabled or placeholder styles in a Synapse component, when styling with SCSS or `--v-theme-*` variables, when a component must work across CNAM / PA / AmeliPro brands or the dark theme, or when an axe `color-contrast` or audit contrast issue is reported.
metadata:
  inspired-by: "num3robis/ai11y-copilot-prompts (color-contrast) — structure seulement, aucun contenu repris"
  target: "RGAA 4.1.2 / WCAG 2.1 AA"
---

# Contrastes et couleurs dans Synapse

Les couleurs viennent du **thème** (tokens → variables `--v-theme-*`), jamais d'une valeur en dur : c'est ce qui garantit le contraste sur les trois marques et en thème sombre. Référence tokens : [doc/Theming/tokens-compat.md](../../../doc/Theming/tokens-compat.md#couleurs) ; marques : [doc/Theming/architecture-scss.md](../../../doc/Theming/architecture-scss.md#2-système-multi-marques).

## Seuils (RGAA 3.2, 3.3 — WCAG 2.1 AA)

| Élément | Ratio minimal |
|---|---|
| Texte normal | 4,5:1 |
| Grand texte : ≥ 24 px, ou ≥ 18,66 px gras | 3:1 |
| Composant d'interface (bordure de champ, icône porteuse de sens, état coché) | 3:1 contre les couleurs adjacentes |
| Indicateur de focus | 3:1 contre le fond |
| Texte désactivé, logo, décoration | Pas d'exigence |

Le texte de placeholder et les messages d'aide **sont** du texte : 4,5:1. Les opacités se cumulent : `opacity: 0.6` sur un texte conforme peut le rendre non conforme.

## Règles

- Couleur : `rgb(var(--v-theme-<nom>))` ou `rgba(var(--v-theme-<nom>), <alpha>)` ; paliers `<couleur>-darken60` / `-lighten90` (sans tiret avant le chiffre, cf. doc). Prop `color` des composants Vuetify plutôt que du CSS.
- Texte sur fond coloré : utiliser la couleur `on-<nom>` associée (`on-primary`…).
- Marques : un rendu se vérifie sur `.theme-cnam`, `.theme-pa`, `.theme-ap` ; les palettes sont dans `src/designTokens/tokens/{cnam,pa,amelipro}/`, thèmes sombres `*DarkTheme.ts`.
- L'information ne passe jamais par la couleur seule (RGAA 3.1) : erreur = couleur + icône ou texte.
- Ne pas supprimer `outline` au focus sans le remplacer par un indicateur visible et contrasté.

## Vérifier

- **axe `color-contrast` en Vitest n'est pas fiable** (happy-dom / jsdom ne calculent pas les styles) : un test vert ne prouve rien.
- En Cypress, `getTextContrast(element)` de `cypress/support/contrast.ts` calcule le ratio réel (opacités et fond cumulés). Exemple : `SyTextField.visual.cy.ts` (`MIN_CONTRAST = 4.5`).

```ts
import { getTextContrast } from '../../../../cypress/support/contrast'

cy.get('.v-messages__message').should(($el) => {
	expect(getTextContrast($el[0]!)).to.be.at.least(4.5)
})
```

- Pour les couleurs non textuelles et le focus : capture `cy.matchImageSnapshot` par marque et mesure manuelle (Colour Contrast Analyser, outils du navigateur).

## Critères vérifiables

- [ ] Aucune couleur en dur (`#xxxxxx`, `rgb(…)` littéral) ajoutée dans le SCSS ou le template.
- [ ] Texte ≥ 4,5:1 (3:1 si grand texte), composants et focus ≥ 3:1, y compris placeholder, aide et opacités cumulées.
- [ ] Contraste vérifié sur CNAM, PA et AmeliPro, et en thème sombre si le composant le supporte.
- [ ] Aucune information portée par la seule couleur.
- [ ] Indicateur de focus visible et contrasté.
- [ ] Contraste du texte contrôlé par `getTextContrast` en Cypress quand un style de texte change.
