# Scripts & Outillage

Documentation des scripts utilitaires disponibles dans le dossier `scripts/`.

> Pour les scripts liés aux **badges de version** (`a11y:update`, `func:inject`…), voir [doc/Badges/](../Badges/README.md).

---

## 1. Tests d'accessibilité — Rapport

**Script** : `scripts/a11y-report.mjs`  
**Commande** : `pnpm a11y:report`

Lance tous les tests `*.a11y.spec.ts` via Vitest et génère deux rapports :

| Fichier généré | Format | Contenu |
|---|---|---|
| `a11y-raw.json` | JSON brut Vitest | Résultats complets (non committer, gitignored) |
| `a11y-report.json` | JSON agrégé | Violations par composant |
| `a11y-report.md` | Markdown lisible | Rapport de synthèse par composant |

### Lecture du rapport

```
# Rapport a11y
- Composants affectés: 3

## NomComposant
Fichier: src/components/NomComposant/tests/NomComposant.a11y.spec.ts
- Test: renders without accessibility violations
  - Détails: ...violation message...
```

### Quand l'utiliser

- Après avoir modifié un composant pour vérifier qu'aucune régression a11y n'est introduite
- Pour obtenir une vue globale des violations actives sur tout le design system

---

## 2. Détection de fuites mémoire

Deux scripts complémentaires permettent de détecter les fuites mémoire dans les tests unitaires.

### Script ciblé (Node.js)

**Script** : `scripts/detect-memory-leaks.js`

Exécute les tests un par un, mesure la consommation mémoire avant/après chaque test et alerte si la différence dépasse le seuil.

```bash
# Tous les tests (pattern par défaut : **/*.spec.ts)
node scripts/detect-memory-leaks.js

# Un pattern vitest spécifique
node scripts/detect-memory-leaks.js "DatePicker"
```

Le script utilise `npx vitest ls <pattern>` pour lister les fichiers de test correspondants.

**Configuration** :
- Seuil d'alerte : `10 MB` (variable `MEMORY_THRESHOLD_MB` dans le script)
- Génère un rapport dans `memory-leak-report.json` (à la racine du projet)

### Script global (Bash — Linux/macOS/WSL)

**Script** : `scripts/detect-all-memory-leaks.sh`

Trouve tous les `*.spec.ts` dans `src/` et `tests/`, les exécute `2 fois` chacun isolément et compare la mémoire.

```bash
bash scripts/detect-all-memory-leaks.sh
```

**Configuration** :
- Seuil : `10 MB`
- Répétitions : `2` par fichier (pour confirmer la fuite)
- Rapport écrit dans `memory-leak-report.txt` (à la racine du projet)

> ⚠️ Ce script peut prendre plusieurs minutes selon le nombre de fichiers de test.

### Lire les rapports

- `memory-leak-report.json` (script Node.js) — rapport JSON structuré avec les tests suspects et leur delta mémoire
- `memory-leak-report.txt` (script Bash) — rapport texte avec les tests suspects et leur delta mémoire

---

## 3. Vérification des dossiers constants vides

**Script** : `scripts/check-empty-constants-folders.sh`

Vérifie qu'aucun dossier `constants/` dans les composants n'est resté vide (ce qui serait une erreur d'architecture).

```bash
bash scripts/check-empty-constants-folders.sh
```

Utilisé en pré-commit ou en CI pour maintenir la cohérence de la structure des composants.

---

## 4. Récapitulatif des commandes

| Commande | Script | Description |
|---|---|---|
| `pnpm test:a11y` | vitest | Exécute tous les tests `*.a11y.spec.ts` |
| `pnpm a11y:report` | `a11y-report.mjs` | Lance les tests a11y + génère le rapport Markdown |
| `node scripts/detect-memory-leaks.js` | — | Détection ciblée de fuites mémoire |
| `bash scripts/detect-all-memory-leaks.sh` | — | Détection globale (tous les specs) |
| `bash scripts/check-empty-constants-folders.sh` | — | Vérifie l'intégrité des dossiers constants/ |
