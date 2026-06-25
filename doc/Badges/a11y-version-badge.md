# Badge "Dernière mise à jour accessibilité" dans les docs

## Principe

Chaque page de documentation d'un composant (`NomComposant.mdx`) affiche automatiquement un badge :

```
Dernière mise à jour accessibilité : V1.0.24 - 22/04/2026
```

Ce badge est généré à partir de l'historique git du composant — il reflète la dernière version du package au moment où un commit lié à l'accessibilité a touché ce composant.

---

## Fichiers impliqués

| Fichier | Rôle |
|---|---|
| `scripts/a11y-history-report.mjs` | Analyse git et génère `a11y-history-data.json` |
| `scripts/inject-a11y-version.mjs` | Lit le JSON et injecte/met à jour le badge dans les `.mdx` |
| `scripts/a11y-update.mjs` | Orchestrateur : exécute les deux scripts en séquence |
| `a11y-history-data.json` | Cache des données : `{ ComponentName: { version, date, dateIso } }` |
| `.storybook/preview-head.html` | Style global du badge (appliqué à tous les `.mdx`) |

---

## Cas d'usage

### 1. Initialisation complète (première fois ou reset)

Génère tout depuis zéro. **Prend plusieurs minutes** (analyse tous les commits git de tous les composants).

```bash
pnpm a11y:update
```

### 2. Mettre à jour un ou plusieurs composants spécifiques

À utiliser après avoir mergé une PR qui touche l'accessibilité d'un composant précis. **Rapide** (quelques secondes).

```bash
pnpm a11y:update Accordion
pnpm a11y:update DatePicker SyCheckbox SyTextField
```

> Les noms de composants correspondent aux noms des fichiers `.vue` (ex: `SyCheckbox`, `DatePicker`, `HeaderBar`).

### 3. Vérifier sans modifier (dry-run)

Affiche les fichiers qui seraient mis à jour sans écrire quoi que ce soit.

```bash
pnpm a11y:inject:dry
pnpm a11y:inject:dry Accordion DatePicker
```

### 4. Regénérer uniquement le JSON (sans injecter)

```bash
pnpm a11y:history
pnpm a11y:history Accordion DatePicker
```

### 5. Injecter uniquement (JSON déjà à jour)

```bash
pnpm a11y:inject
pnpm a11y:inject Accordion DatePicker
```

---

## Workflow typique après une PR a11y

```bash
# 1. Identifier le(s) composant(s) modifiés dans la PR
# 2. Mettre à jour uniquement ceux-là
pnpm a11y:update NomComposant1 NomComposant2

# 3. Vérifier le résultat dans le .mdx concerné
# 4. Committer
git add src/components/NomComposant1/NomComposant1.mdx a11y-history-data.json
git commit -m "docs: update a11y version badge for NomComposant1"
```

---

## Détection des commits a11y

Un commit est considéré comme "a11y" s'il remplit au moins une des conditions :

- **Mot-clé** dans le message : `a11y`, `accessibility`, `accessibilité`, `wcag`, `aria`, `focus`, `tabindex`, `contraste`, `clavier`, etc.
- **Pattern ARIA** dans le diff : `aria-*`, `role=`, `tabindex=`
- **Label PR** : `a11y`, `accessibility`, `wcag`, `contrast`, `keyboard`, `focus`

Le niveau de confiance (`forte` / `moyenne` / `faible`) est indiqué dans `a11y-history-report.md`.

---

## Structure du JSON généré

```json
{
  "Accordion": {
    "version": "1.0.22",
    "date": "25/03/2026",
    "dateIso": "2026-03-25 14:30:00 +0100"
  },
  "DatePicker": {
    "version": "1.0.24",
    "date": "22/04/2026",
    "dateIso": "2026-04-22 10:15:00 +0200"
  }
}
```

---

## Format du badge dans les `.mdx`

Le badge est délimité par des marqueurs JSX pour permettre les mises à jour idempotentes (relancer le script ne crée pas de doublon) :

```mdx
{/* a11y-version-start */}
<p className="a11y-version-badge">Dernière mise à jour accessibilité : V1.0.22 - 25/03/2026</p>
{/* a11y-version-end */}
```

---

## Composants sans données a11y

Si un composant n'a aucun commit a11y détecté dans son historique git, **aucun badge n'est injecté** dans son `.mdx`. Le terminal affiche le compteur `X sans données a11y` en fin d'exécution.
