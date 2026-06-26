# Directives Vue

Référence des directives Vue disponibles dans le Design System.

**Fichiers source** : `src/directives/`  
**Export public** : `src/main.ts` → `@cnamts/synapse`

---

## Sommaire

| Directive | Fichier | Usage |
|---|---|---|
| `vToolbar` | `Toolbar.ts` | Navigation clavier dans une barre d'outils (roving tabindex) |
| `vLockFocus` | `lockFocus.ts` | Piège le focus clavier dans un élément (modal, popover) |
| `vRgaaSvgFix` | `rgaaSvgFix.ts` | Attributs ARIA sur les icônes SVG — voir [doc/Accessibilite/README.md](../Accessibilite/README.md#4-directives-a11y-disponibles) |
| `clickOutside` | `clickOutside.ts` | Détecte un clic en dehors d'un élément |

---

## vToolbar

**Fichier** : `src/directives/Toolbar.ts`

Implémente le pattern **roving tabindex** pour les barres d'outils accessibles (RGAA / WAI-ARIA).

### Usage

```vue
<div v-toolbar>
  <button>Action 1</button>
  <button>Action 2</button>
  <a href="#">Lien</a>
</div>
```

Pas de valeur à passer — la directive s'active au montage.

### Ce que fait la directive

- Ajoute `role="toolbar"` sur le conteneur (requis sur Firefox pour capturer les flèches)
- Met tous les éléments enfants focusables à `tabindex="-1"`
- Gère la navigation clavier :

| Touche | Comportement |
|---|---|
| `Tab` | Entre dans la toolbar (focus sur le dernier élément actif, ou le premier) |
| `→` / `↓` | Élément suivant (cycle) |
| `←` / `↑` | Élément précédent (cycle) |
| `Home` | Premier élément |
| `End` | Dernier élément |
| `Tab` depuis l'intérieur | Sort de la toolbar |

**Éléments gérés** : `button:not([disabled])`, `a:not([disabled])`, `input:not([disabled])`.

### Mémoire du focus

La directive mémorise le dernier élément focusé dans la toolbar. Quand l'utilisateur y revient au Tab, le focus est restauré sur cet élément plutôt que sur le premier.

### Nettoyage

L'instance est stockée dans une `WeakMap` et supprimée automatiquement au `unmounted`.

---

## vLockFocus

**Fichier** : `src/directives/lockFocus.ts`  
**Export** : `export default vLockFocus`

Piège le focus clavier à l'intérieur de l'élément lié. À utiliser sur toute overlay qui doit confiner la navigation clavier : modal, drawer, popover accessible.

### Usage

```vue
<div v-lock-focus="isOpen">
  <input type="text" />
  <button>Valider</button>
  <button @click="close">Fermer</button>
</div>
```

- `v-lock-focus="true"` (ou sans valeur) → focus piégé, listener `keydown` actif
- `v-lock-focus="false"` → piège désactivé, listener retiré

La valeur est réactive : si `isOpen` passe à `false`, le piège est levé automatiquement.

### Comportement Tab / Shift+Tab

- `Tab` sur le **dernier** élément focusable → revient au premier
- `Shift+Tab` sur le **premier** élément focusable → va au dernier

**Éléments pris en compte** : `a[href]`, `area[href]`, `input:not([disabled])`, `select:not([disabled])`, `textarea:not([disabled])`, `button:not([disabled])`, `iframe`, `object`, `embed`, `[tabindex]:not([tabindex="-1"])`, `[contenteditable]`.

### ⚠️ Responsabilité du composant parent

Cette directive **ne gère pas l'échappement**. Le composant qui l'utilise doit :
1. Fermer l'overlay sur `Escape`
2. Remettre le focus sur l'élément déclencheur (`button`, lien…) après fermeture

```vue
<script setup>
const triggerRef = ref<HTMLElement | null>(null)

function close() {
  isOpen.value = false
  nextTick(() => triggerRef.value?.focus())
}
</script>
```

---

## clickOutside

**Fichier** : `src/directives/clickOutside.ts`

> ⚠️ Cette directive est enregistrée via `app.directive('click-outside', …)` dans son propre fichier — elle n'est **pas exportée** comme `vToolbar` ou `vLockFocus` et n'est pas dans l'API publique. Usage interne uniquement.

Détecte un clic en dehors de l'élément lié et appelle le handler fourni.

### Usage (interne)

```vue
<div v-click-outside="onClickOutside">
  Contenu du popover
</div>

<script setup>
function onClickOutside(event: Event) {
  isOpen.value = false
}
</script>
```

La valeur passée est un **handler** `(event: Event) => void`.

### Comportement

- Écoute `document.addEventListener('click', …)` au `beforeMount`
- Vérifie si `event.target` est l'élément ou un de ses descendants
- Si le clic est à l'extérieur, appelle `binding.value(event)`
- Retire le listener au `unmounted`

### Limitation connue

La directive crée une instance `createApp({})` dans le fichier source — c'est un artefact de développement. Elle ne devrait pas être utilisée en dehors du contexte de l'application principale.

---

## vRgaaSvgFix

Voir la documentation complète dans [doc/Accessibilite/README.md — section Directives a11y](../Accessibilite/README.md#4-directives-a11y-disponibles).

En résumé : corrige automatiquement les attributs ARIA des SVG (décoratif → `aria-hidden`, fonctionnel → `role` + `aria-label`). **Préférer `SyIcon`** qui intègre cette directive.
