# Étude — CopyBtn : `label` n'est plus une prop, nom accessible perdu dans les exemples

## Problème

Constats relevés lors de la revue du correctif des imports de l'extrait `SlotIcon` (branche `fix/copy-btn-story-imports`).

**Périmètre :** `src/components/CopyBtn/CopyBtn.stories.ts`, `src/components/CopyBtn/CopyBtn.mdx`, `src/components/CopyBtn/tests/CopyBtn.spec.ts`.

Aucun changement du composant de production n'est nécessaire.

| Point | Sévérité | Statut |
|---|---|---|
| P1 — `label` au lieu de `aria-label` dans les exemples | Moyenne | **Corrigé dans cette PR** |
| P2 — Controls `ariaLabel`, `textToCopy` et `tooltipDuration` sans effet | Basse | À traiter (ticket : *à créer*) |
| P3 — Extrait `SlotIcon` : `VIcon` plutôt que `SyIcon` | Basse, facultatif | À traiter (ticket : *à créer*) |
| P4 — Tests unitaires passant l'ancienne prop `label` | Basse | À traiter (ticket : *à créer*) |
| Coquille « personalisé » (`SlotTooltip`) | Basse | **Corrigé dans cette PR** |

### P1 — `label` n'est pas une prop de `CopyBtn` (corrigé)

**Constat :** les 7 extraits affichés (onglet *Template*), les 7 templates de `render` et l'exemple de `CopyBtn.mdx` (l. 48) passaient `label="…"` à `CopyBtn`.

`CopyBtn.vue` ne déclare pas de prop `label` ; le nom accessible du bouton est porté par `ariaLabel` (défaut : `'bouton de copie'`, `CopyBtn.vue:20`), lié sur le `VBtn` (`CopyBtn.vue:105`).

**Conséquence :**

- `label` tombait dans les attributs hérités et était posé sur la `<div class="sy-copy-btn">` racine (`CopyBtn.vue:90`) : attribut HTML sans signification.
- Le bouton gardait le nom accessible générique « bouton de copie ». Un consommateur qui recopiait l'exemple croyait fournir un intitulé explicite, jamais restitué par les technologies d'assistance (RGAA, critère 11.9 : intitulé de bouton pertinent).

**Correctif :** `label="…"` remplacé par `aria-label="…"` dans les 7 extraits, les 7 `render` et `CopyBtn.mdx`.

### P2 — Controls sans effet

**Constat :** les `render` codent en dur des valeurs que les `args` définissent, au lieu de les lier :

| Arg | Stories où le Control n'a aucun effet |
|---|---|
| `ariaLabel` | les 7 stories (valeur statique `aria-label="…"` dans `render`) |
| `textToCopy` | `Default`, `NoTooltip`, `SlotIcon`, `SlotTooltip` |
| `tooltipDuration` | les 7 stories (`2000` dans `args`, jamais passé au composant : la durée effective est le défaut `5000`) |

**Correctif proposé :** lier `:aria-label="args.ariaLabel"`, `:text-to-copy="args.textToCopy"` et `:tooltip-duration="args.tooltipDuration"`, ou utiliser `v-bind="args"` en retirant les attributs statiques. Vérifier que l'extrait affiché reste aligné sur les `args` (notamment `tooltip-duration`).

### P3 — Extrait `SlotIcon` : `VIcon` plutôt que `SyIcon` (facultatif)

**Constat :** le contenu par défaut du slot `icon` est un `SyIcon decorative` (`CopyBtn.vue:110-114`), alors que l'exemple propose `VIcon` (`CopyBtn.stories.ts:218`).

**Conséquence :** aucune en accessibilité (`VIcon` sans gestionnaire de clic rend `aria-hidden="true"`). Simple cohérence avec le Design System ; non bloquant.

**Correctif proposé :** `import { CopyBtn, SyIcon } from '@cnamts/synapse'` et `<SyIcon :icon="duplicateIcon" decorative />`.

### P4 — Tests unitaires utilisant l'ancienne prop `label`

**Constat :** `CopyBtn.spec.ts` monte le composant avec `label: 'test'` (l. 28 à 162) ; le snapshot `__snapshots__/CopyBtn.spec.ts.snap:7` fige `label="test"` sur la `div` racine.

**Conséquence :** pas d'impact consommateur, mais les tests entretiennent l'ancienne API et le snapshot valide un attribut invalide.

**Correctif proposé :** remplacer `label` par `ariaLabel` dans les props de montage et mettre à jour le snapshot.

## Cause racine

Vérifiée dans l'historique Git :

- `d4592f02a` (#81, 2024-09-27, création du composant) : `CopyBtn` déclare une prop `label: string`, utilisée par les stories et la doc.
- `30ce91e56` (#87, 2024-09-27, « fix CopyBtn accessibility ») : la prop `label` est remplacée par `ariaLabel`, sans mise à jour des stories, de `CopyBtn.mdx` ni des tests unitaires.

Les exemples sont donc un reliquat de l'API d'origine. Les templates de `render` ayant été écrits en recopiant l'extrait plutôt qu'en liant les `args` (P2), aucun Control ne révélait l'écart.

`analyzeSnippet` ne le détectait pas : il vérifie la résolution des composants et identifiants, pas la correspondance entre attributs et props déclarées.

## Vérification (P1 et coquille)

- [x] Test de régression dans `CopyBtn.stories.spec.ts` (14 tests, tous en échec avant correctif) :
  - chaque extrait affiché ne passe à `<CopyBtn>` que des props déclarées par le composant, dont `aria-label` ;
  - chaque story montée nomme le bouton avec `args.ariaLabel` (avant : « bouton de copie ») et ne pose pas d'attribut `label` sur la racine.
- [x] `pnpm vitest run src/components/CopyBtn` : 3 fichiers, 36 tests passés, aucun avertissement Vue.
- [x] `pnpm exec eslint src/components/CopyBtn`
- [x] `pnpm vue-tsc -p tsconfig.app.json --noEmit` : aucune erreur sur `CopyBtn`.
- [ ] Storybook : vérifier le nom accessible du bouton de chaque story et l'absence d'erreur de console.
- [ ] Tests visuels Cypress : aucune baseline modifiée attendue (changement d'attributs uniquement, `CopyBtn.visual.cy.ts` n'utilise pas les stories).

## Impact

Documentation et stories uniquement : aucun changement de contrat du composant, donc pas de note dans `releasesAlerts/`. Les consommateurs ayant recopié l'exemple avec `label` ont un bouton nommé « bouton de copie » ; une mention dans la note de version invitant à passer à `aria-label` peut être envisagée.

## Suite

P2, P3 et P4 restent à traiter. Ticket de suivi : *à créer, lien à reporter ici et dans la PR*.
