# Étude — CopyBtn : `label` n'est pas une prop, nom accessible perdu dans les exemples

## Problème

Constats relevés lors de la revue du correctif des imports de l'extrait `SlotIcon` (branche `fix/copy-btn-story-imports`), hors du périmètre de ce ticket.

**Périmètre :** `src/components/CopyBtn/CopyBtn.stories.ts`, `src/components/CopyBtn/CopyBtn.mdx`.

Aucun changement du composant de production n'est nécessaire.

### P1 — `label` n'est pas une prop de `CopyBtn` (sévérité : moyenne)

**Constat :** tous les extraits affichés (onglet *Template*), tous les templates de `render` et l'exemple de `CopyBtn.mdx` (l. 48) passent `label="…"` à `CopyBtn` :

```vue
<CopyBtn
	label="Copier le numéro de patient"
	text-to-copy="1970756541"
/>
```

`CopyBtn.vue` ne déclare pas de prop `label` ; le nom accessible du bouton est porté par `ariaLabel` (défaut : `'bouton de copie'`, `CopyBtn.vue:20`), lié sur le `VBtn` (`CopyBtn.vue:105`).

**Conséquence :**

- `label` tombe dans les attributs hérités et est posé sur la `<div class="sy-copy-btn">` racine (`CopyBtn.vue:90`) : attribut HTML sans signification.
- Le bouton garde le nom accessible générique « bouton de copie ». Un consommateur qui recopie l'exemple croit fournir un intitulé explicite, qui n'est jamais restitué par les technologies d'assistance (RGAA, critère 11.9 : intitulé de bouton pertinent).

**Stories concernées :** `Default`, `NoTooltip`, `SlotIcon`, `RemoveSeparators`, `MultiSeparators`, `RemoveSpaces`, `SlotTooltip`.

### P2 — Controls `ariaLabel` et `textToCopy` sans effet (sévérité : moyenne)

**Constat :** les stories `Default`, `NoTooltip`, `SlotIcon` et `SlotTooltip` définissent `args.ariaLabel` et `args.textToCopy`, mais leur `render` code ces valeurs en dur (`label="…"`, `text-to-copy="…"`) au lieu de les lier aux args.

**Conséquence :** modifier ces Controls dans Storybook ne change pas le rendu. `RemoveSeparators`, `MultiSeparators` et `RemoveSpaces` lient bien `textToCopy`, mais pas `ariaLabel`.

### P3 — Extrait `SlotIcon` : `VIcon` plutôt que `SyIcon` (sévérité : faible, facultatif)

**Constat :** le contenu par défaut du slot `icon` est un `SyIcon decorative` (`CopyBtn.vue:110-114`), alors que l'exemple propose `VIcon` (`CopyBtn.stories.ts:218`).

**Conséquence :** aucune en accessibilité (`VIcon` sans gestionnaire de clic rend `aria-hidden="true"`). Simple cohérence avec le Design System ; non bloquant.

## Cause racine

P1 et P2 ont la même origine : les exemples utilisent un attribut `label` qui ne correspond à aucune prop du composant (probable reliquat d'une ancienne API ou confusion avec d'autres composants). Les templates de `render` ont été écrits en recopiant l'extrait plutôt qu'en liant les args.

Le test `CopyBtn.stories.spec.ts` (`analyzeSnippet`) ne le détecte pas : il vérifie la résolution des composants et identifiants, pas la correspondance entre attributs et props déclarées.

## Correctif proposé

1. Dans les 7 extraits affichés et dans `CopyBtn.mdx`, remplacer `label="…"` par `aria-label="…"`.
2. Dans les templates de `render`, lier `:aria-label="args.ariaLabel"` et `:text-to-copy="args.textToCopy"` en supprimant les valeurs en dur ; aligner les `args` sur le texte affiché.
3. Facultatif : dans `SlotIcon`, remplacer `VIcon` par `SyIcon` (`import { CopyBtn, SyIcon } from '@cnamts/synapse'`) avec `decorative`.
4. Test de régression dans `CopyBtn.stories.spec.ts` :
   - pour chaque story composée, monter la story et vérifier que le bouton porte `aria-label` égal à `args.ariaLabel` et que la racine `.sy-copy-btn` n'a pas d'attribut `label` ;
   - vérifier que l'extrait affiché ne contient pas `label=` sur `<CopyBtn>` (ou, plus générique, que tout attribut statique de `<CopyBtn>` correspond à une prop de `CopyBtn.props`).

## Vérification à prévoir

- [ ] `pnpm vitest run src/components/CopyBtn`
- [ ] `pnpm vitest run src/components/CopyBtn/tests/CopyBtn.a11y.spec.ts`
- [ ] `pnpm exec eslint src/components/CopyBtn`
- [ ] Storybook : modifier les Controls `ariaLabel` et `textToCopy` de chaque story et vérifier le rendu et le texte copié ; aucune erreur ou avertissement de console
- [ ] Tests visuels Cypress : aucune baseline modifiée attendue (changement d'attributs uniquement)

## Impact

Documentation et stories uniquement : aucun changement de contrat du composant, donc pas de note dans `releasesAlerts/`. Les consommateurs ayant recopié l'exemple avec `label` gagneraient à passer à `aria-label` ; une mention dans la note de version peut être envisagée.
