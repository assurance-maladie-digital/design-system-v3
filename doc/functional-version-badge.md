# Badge "Dernière mise à jour fonctionnelle" dans les docs

## Principe

Chaque page de documentation d'un composant (`NomComposant.mdx`) affiche automatiquement un badge vert :

```
Dernière mise à jour fonctionnelle : V1.1.0 - 22/06/2026
```

Ce badge reflète la dernière version du package au moment où un commit **touchant le code source** du composant (`.vue`, `.ts`, `.scss`) a été mergé, hors commits a11y, doc, release et CI.

---

## Fichiers impliqués

| Fichier | Rôle |
|---|---|
| `scripts/functional-history-report.mjs` | Analyse git et génère `functional-history-data.json` |
| `scripts/inject-functional-version.mjs` | Lit le JSON et injecte/met à jour le badge dans les `.mdx` |
| `functional-history-data.json` | Cache des données : `{ ComponentName: { version, date, dateIso, message } }` |
| `.storybook/preview-head.html` | Style global du badge vert (appliqué à tous les `.mdx`) |

---

## Cas d'usage

### 1. Initialisation complète (première fois ou reset)

Génère tout depuis zéro. **Prend plusieurs minutes**.

```bash
pnpm func:history   # génère functional-history-data.json
pnpm func:inject    # injecte dans tous les .mdx
```

### 2. Mettre à jour quelques composants spécifiques

Après avoir mergé une PR fonctionnelle sur un composant précis.

```bash
pnpm docs:update Accordion DatePicker SyCheckbox
```

> `docs:update` exécute les deux flows (fonctionnel + a11y) en 4 étapes.

### 3. Vérifier sans modifier (dry-run)

```bash
pnpm func:inject:dry
pnpm func:inject:dry Accordion DatePicker
```

### 4. Regénérer uniquement le JSON (sans injecter)

```bash
pnpm func:history
pnpm func:history Accordion DatePicker
```

### 5. Injecter uniquement (JSON déjà à jour)

```bash
pnpm func:inject
pnpm func:inject Accordion DatePicker
```

---

## Détection des commits fonctionnels

Le script retient le **dernier commit** qui :

1. **Touche au moins un fichier source** du composant (`.vue`, `.ts`, `.js`, `.scss`, `.css`)
   - Les `.stories.ts`, `.spec.ts`, `.cy.ts` et fichiers de test sont ignorés
   - Les `.mdx` et `.md` sont ignorés
2. **N'est pas** un commit purement a11y :
   - Mots-clés exclus : `a11y`, `accessibilit`, `wcag`, `aria-`, `contraste`, `audit access`, `rgaa`
3. **N'est pas** un commit de release/CI/doc :
   - Préfixes exclus : `chore`, `docs`, `ci`, `build`, `release`, `bump`, `renovate`
   - Patterns exclus : `version badge`, `update changelog`, `run lint`

> Le repo n'utilise pas systématiquement les conventional commits — la détection est donc basée sur l'**exclusion** plutôt que sur l'inclusion de préfixes.

---

## Structure du JSON généré

```json
{
  "Accordion": {
    "version": "1.1.0",
    "date": "22/06/2026",
    "dateIso": "2026-06-22 10:00:00 +0200",
    "message": "feat(Accordion): add keyboard navigation"
  }
}
```

---

## Format du badge dans les `.mdx`

```mdx
{/* func-version-start */}
<p className="func-version-badge">Dernière mise à jour fonctionnelle : V1.1.0 - 22/06/2026</p>
{/* func-version-end */}
```

Le badge fonctionnel s'affiche **au-dessus** du badge a11y.
