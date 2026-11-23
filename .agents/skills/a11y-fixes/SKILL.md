---
name: a11y-fixes
description: Use when fixing an accessibility defect in a Synapse Vue/Vuetify component — failing axe rule, missing accessible name, unlabelled icon or icon button, hard-coded aria-label, error message not linked to its field, focus lost after closing an overlay, silent dynamic message — or when an a11y spec, Tanaguru or RGAA audit reports a non-conformity.
metadata:
  inspired-by: "num3robis/ai11y-copilot-prompts (wcag-quick-fixes) — structure seulement, aucun contenu repris"
  target: "RGAA 4.1.2 / WCAG 2.1 AA"
---

# Corrections a11y courantes avec les outils du DS

Une correction a11y se fait **dans le composant**, avec les briques du DS. Adapter le test, ajouter une règle à `ignoreRules` ou attendre un tick avant `axe` pour faire taire une violation n'est pas une correction.

Motif interactif concerné (dialog, menu, listbox…) : appliquer aussi le skill `a11y-aria-patterns`.

**REQUIRED SUB-SKILL :** charger `a11y-testing` avant d'écrire le moindre test. Toute correction s'accompagne d'un **test de régression** qui échoue sans le correctif (le vérifier en retirant temporairement le correctif). Faire passer une spec existante ne suffit pas, même en urgence : la spec qui échouait ne prouve rien si elle redevient muette au prochain changement.

## Corrections

| Défaut | Correction DS | RGAA |
|---|---|---|
| `<v-icon>` / `<VIcon>` nu | `<SyIcon :icon="mdiX" />` (décorative par défaut) ; informative : `:decorative="false" :label="locales.x"` | 1.1, 1.2 |
| Bouton icône sans nom | `SyIconButton` (`label` obligatoire) ou `VBtn` + `:aria-label="locales.x"` + `SyIcon` décorative | 6.2, 11.9 |
| `aria-label="Fermer"` littéral | Chaîne dans `locales.ts`, prop `locales` surchargeable (AGENTS.md §6) | — |
| Nom accessible ≠ texte visible | Le nom commence par le texte visible (`Fermer` → `Fermer l'aide`) | 6.1, 11.9 |
| Message d'erreur/aide non relié | `const id = useId()` ; message `:id="id"` ; champ `:aria-describedby="id"` (+ `aria-invalid="true"` en erreur). Avec `VTextField`, passer par `error-messages` / `messages`, déjà reliés | 11.10 |
| Champ sans étiquette | `label` du composant DS, ou `<label :for>` ; `aria-label` en dernier recours | 11.1 |
| Focus perdu à la fermeture | `nextTick(() => triggerRef.value?.focus())` | 12.8 |
| Overlay sans `Escape` | `@keydown.esc="close"` sur le panneau ; `v-lock-focus` ne le gère pas | 7.3 |
| Message dynamique muet | Conteneur `role="status"` rendu **en permanence**, texte injecté ensuite | 7.5 |
| ARIA posé en différé (`nextTick`, `setTimeout`) | Déclarer `role` / `aria-*` dans le template ; si l'élément vient de Vuetify sans prop adéquate, les poser de façon synchrone dans `onMounted` | 7.1 |
| SVG brut | `SyIcon`, sinon `v-rgaa-svg-fix` ([doc/Accessibilite/README.md §4](../../../doc/Accessibilite/README.md#4-directives-a11y-disponibles)) | 1.1 |
| Couleur / contraste | skill `a11y-contrast` | 3.2, 3.3 |

Hors périmètre d'une librairie (`<html lang>`, titre de page, collage de mot de passe) : relève de l'application consommatrice.

## Exemple : bouton icône

```vue
<script setup lang="ts">
import { mdiContentCopy } from '@mdi/js'
import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
import { locales as defaultLocales } from './locales'

const props = withDefaults(defineProps<{ locales?: typeof defaultLocales }>(), {
	locales: () => defaultLocales,
})
</script>

<template>
	<VBtn icon variant="text" :aria-label="props.locales.copy" :title="props.locales.copy">
		<SyIcon :icon="mdiContentCopy" />
	</VBtn>
</template>
```

## Règle `ignoreRules`

Seule `region` s'ignore sans justification. Toute autre règle exige un commentaire dans le test qui explique pourquoi c'est un faux positif ([doc/Accessibilite/README.md §2](../../../doc/Accessibilite/README.md#2-ignorer-une-règle-axe--quand-et-comment)). L'urgence d'une release n'est pas une justification.

## Critères vérifiables

- [ ] Aucun `v-icon` / `VIcon` nu ajouté ; icônes via `SyIcon`.
- [ ] Tout bouton ou lien a un nom accessible ; aucun texte accessible littéral dans le template (tout vient de `locales`).
- [ ] Le nom accessible contient le texte visible.
- [ ] Chaque message d'erreur ou d'aide est relié à son champ (`aria-describedby` vers un id `useId()`).
- [ ] Le défaut est corrigé dans le composant ; aucune règle ajoutée à `ignoreRules` sans commentaire justificatif ; pas d'attente artificielle avant `axe`.
- [ ] Un test de régression ciblant le défaut a été ajouté, et on l'a vu échouer sans le correctif.
- [ ] La spec a11y du composant passe (commande dans `a11y-testing`).
