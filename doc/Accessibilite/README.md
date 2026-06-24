# Accessibilité — Guide contributeur DS

Documentation orientée **développeur du Design System**. Pour la théorie RGAA, le kit de pré-audit et les résultats d'audit, voir Storybook (`Accessibilité/`).

---

## Checklist avant PR

Tout composant nouveau ou modifié doit satisfaire ces points avant PR :

- [ ] Un fichier `NomComposant.a11y.spec.ts` existe dans `tests/`
- [ ] `pnpm test:a11y` passe sans violation non justifiée
- [ ] Les icônes SVG passent par `SyIcon` (pas `v-icon` nu)
- [ ] Les composants toolbar utilisent `v-toolbar`
- [ ] Les popovers/modales piègent le focus avec `v-lock-focus`
- [ ] `pnpm a11y:report` a été exécuté et le rapport relu

---

## 1. Écrire un test axe

### Pattern de base

```ts
// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import MonComposant from '../MonComposant.vue'

describe('MonComposant – accessibility (axe)', () => {
  it('has no obvious axe violations', async () => {
    const wrapper = mount(MonComposant, {
      props: {
        label: 'Mon label',
        modelValue: '',
      },
    })

    const results = await axe(wrapper.element as HTMLElement)
    assertNoA11yViolations(results, 'MonComposant – default state')
  })
})
```

Nommer le fichier `MonComposant.a11y.spec.ts` dans le dossier `tests/` du composant.  
Le lancer seul : `pnpm test:a11y --reporter=verbose`.

### Plusieurs scénarios

Couvrir les états significatifs : état par défaut, état désactivé, état d'erreur, état chargement.

```ts
it('has no axe violations when disabled', async () => {
  const wrapper = mount(MonComposant, {
    props: { label: 'Label', modelValue: '', disabled: true },
  })
  const results = await axe(wrapper.element as HTMLElement)
  assertNoA11yViolations(results, 'MonComposant – disabled state')
})
```

---

## 2. Ignorer une règle axe : quand et comment

`assertNoA11yViolations` accepte un paramètre `ignoreRules` :

```ts
assertNoA11yViolations(results, 'MonComposant – default', {
  ignoreRules: ['region'],
})
```

### Règles ignorées couramment

| Règle | Pourquoi on l'ignore |
|---|---|
| `region` | axe exige que tout contenu soit dans un `<main>` ou `<section>` — non pertinent pour un composant isolé hors page |

### Règle à ne jamais ignorer sans justification écrite

- `color-contrast` — contraste insuffisant, c'est une violation RGAA réelle
- `label` — champ de formulaire sans label, toujours corriger
- `aria-*` — mauvais attribut ARIA, toujours corriger

> ⚠️ Si tu ajoutes une règle à `ignoreRules`, **commente pourquoi** dans le test.

---

## 3. Lire le rapport `pnpm a11y:report`

```bash
pnpm a11y:report
```

Génère `a11y-report.md` à la racine. Chaque section correspond à un composant.

```
## MonComposant
Fichier: src/components/MonComposant/tests/MonComposant.a11y.spec.ts
- Test: default state
  - [color-contrast] impact=serious – Elements must meet minimum color contrast ratio thresholds
    targets: .v-btn
```

**Interprétation** :
- `impact=critical` ou `impact=serious` → violation à corriger avant merge
- `impact=moderate` → à corriger, peut être différé si contexte documenté
- `impact=minor` → à noter, pas bloquant

---

## 4. Directives a11y disponibles

### `vRgaaSvgFix` — icônes SVG

**Ne pas utiliser directement.** Passer par `SyIcon` qui l'intègre déjà.

```vue
<!-- ✅ Toujours utiliser SyIcon -->
<SyIcon icon="mdi-close" />                              <!-- décorative par défaut -->
<SyIcon icon="mdi-information" :decorative="false" label="Information" />

<!-- ❌ Ne pas faire -->
<v-icon>mdi-close</v-icon>
```

Si tu crées un composant bas niveau qui ne peut pas utiliser `SyIcon`, alors :

```vue
<!-- Icône décorative -->
<span v-rgaa-svg-fix="true"><svg>…</svg></span>

<!-- Icône fonctionnelle -->
<span v-rgaa-svg-fix="{ isDecorative: false, role: 'img' }" aria-label="Fermer">
  <svg>…</svg>
</span>

<!-- Bouton icône avec détection automatique -->
<span v-rgaa-svg-fix="{ isDecorative: false, autoDetectButton: true }" aria-label="Supprimer" @click="remove">
  <svg>…</svg>
</span>
```

**Ce que fait la directive** : sur le `<svg>` elle supprime `role="img"` et force `aria-hidden="true"`. Sur le conteneur elle applique `role="presentation"` (décorative) ou le rôle approprié + `aria-label` (fonctionnelle).

---

### `vToolbar` — navigation clavier dans une barre d'outils

À utiliser sur tout conteneur de type barre d'outils (groupe de boutons d'actions).

```vue
<div v-toolbar>
  <button>Action 1</button>
  <button>Action 2</button>
  <a href="#">Lien</a>
</div>
```

**Ce que ça donne à l'utilisateur clavier** :

| Touche | Comportement |
|---|---|
| `Tab` | Entre dans la toolbar (focus sur le dernier élément actif ou le premier) |
| `→` / `↓` | Élément suivant |
| `←` / `↑` | Élément précédent |
| `Home` | Premier élément |
| `End` | Dernier élément |
| `Tab` (depuis l'intérieur) | Sort de la toolbar |

**Éléments gérés** : `button:not([disabled])`, `a:not([disabled])`, `input:not([disabled])`.  
La directive ajoute `role="toolbar"` automatiquement (requis sur Firefox pour capturer les flèches).

---

### `vLockFocus` — piège focus pour modales et popovers

À utiliser sur tout overlay qui doit confiner le focus (modal, drawer, popover accessible).

```vue
<div v-lock-focus="isOpen">
  <button>Action 1</button>
  <button>Fermer</button>
</div>
```

- `v-lock-focus="true"` ou sans valeur → focus piégé
- `v-lock-focus="false"` → piège désactivé (listener retiré)

> ⚠️ Cette directive **ne gère pas l'échappement** (touche `Escape`). Le composant qui l'utilise doit gérer la fermeture sur `Escape` et libérer le focus vers l'élément déclencheur.

**Éléments focusables pris en compte** : `a[href]`, `button`, `input`, `select`, `textarea`, `[tabindex]:not([tabindex="-1"])`, `[contenteditable]`.

---

## 5. Faux positifs connus (Tanaguru)

Ces erreurs Tanaguru ont été analysées et ne sont **pas** de vraies violations :

| Composant | Catégorie Tanaguru | Explication |
|---|---|---|
| `DialogBox` | Éléments obligatoires | `aria-modal="true"` est requis sur une modale selon le pattern W3C — ce n'est pas une erreur |
| `RatingPicker` | Éléments obligatoires | `role="radiogroup"` + `aria-disabled` sont corrects selon le pattern W3C Rating |
| `Tabs` | Navigation | `tabindex="-1"` sur les onglets inactifs est conforme au pattern W3C Tabs (le focus revient à 0 sur l'onglet actif) |

---

## 6. Ressources internes

| Ressource | Lien |
|---|---|
| Storybook — Introduction RGAA | `Accessibilité/Audit et Contre-audit/RGAA` |
| Storybook — Kit de pré-audit | `Accessibilité/Kit de pré-audit/Introduction` |
| Storybook — Faux positifs Tanaguru | `Accessibilité/Kit de pré-audit/Outils/Tanaguru/Faux positifs` |
| Storybook — Avancement conformité DS | `Accessibilité/Design System/Avancement` |
| Rapport a11y automatique | `pnpm a11y:report` → `a11y-report.md` |
| Utilitaire axe | `tests/unit/accessibility/axeUtils.ts` |
| Contact accessibilité | valentin.becquet@assurance-maladie.fr |
