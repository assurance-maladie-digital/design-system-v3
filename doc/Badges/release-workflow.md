# Mise à jour des badges de version lors d'une release

## Vue d'ensemble

Deux badges sont affichés sur chaque page de documentation de composant :

| Badge | Couleur | Signification |
|---|---|---|
| `Dernière mise à jour fonctionnelle : Vx.x.x - JJ/MM/AAAA` | Vert | Dernier commit touchant un `.vue`/`.ts` du composant (hors a11y, doc, CI) |
| `Dernière mise à jour accessibilité : Vx.x.x - JJ/MM/AAAA` | Bleu | Dernier commit avec mot-clé a11y/accessibilité |

---

## Workflow de release

### À chaque release (tous les composants)

Exécuter dans l'ordre après avoir mergé tous les commits de la release :

```bash
# 1. Regénérer les données depuis git (long — ~5-10 min selon l'historique)
pnpm func:history
pnpm a11y:history

# 2. Injecter dans tous les .mdx
pnpm func:inject
pnpm a11y:inject

# 3. Regénérer les données de la page « Suivi des composants »
#    À faire APRÈS les étapes 1 et 2 : ce script agrège les JSON produits ci-dessus.
pnpm info:components

# 4. Committer les changements
git add functional-history-data.json a11y-history-data.json src/components/**/*.mdx \
        src/stories/Demarrer/component-info.json
git commit -m "docs: update version badges for release vX.X.X"
```

> **Raccourci** : `pnpm docs:update` enchaîne les 6 étapes (analyses, injections, `a11y-status.json`
> et `component-info.json`) en une seule commande, mais prend plus de temps car il ré-analyse tout.

> ⚠️ **Ne pas oublier `pnpm info:components`** si la séquence est exécutée commande par commande :
> sans lui, la page [Suivi des composants](/?path=/docs/démarrer-suivi-des-composants--docs) continue
> d'afficher les versions et les commits de la release précédente.

---

## Workflow après une PR ciblée

Quand une PR touche un ou plusieurs composants précis :

```bash
# Met à jour les deux badges uniquement pour les composants modifiés
pnpm docs:update NomComposant1 NomComposant2

# Ou avec vérification préalable (ne met à jour que si un nouveau commit est détecté)
pnpm docs:check NomComposant1 NomComposant2
```

### Différence entre `docs:update` et `docs:check`

| Commande | Comportement |
|---|---|
| `pnpm docs:update Accordion` | Force la ré-analyse et la mise à jour du badge |
| `pnpm docs:check Accordion` | Vérifie d'abord s'il y a de nouveaux commits depuis la dernière MAJ, ne modifie que si nécessaire |

> `docs:check` est recommandé en CI ou quand on n'est pas sûr qu'il y a eu des changements.

---

## Exemple de release complète

```bash
# Après merge de la PR de release

# Option 1 : commande unique (recommandée si < 50 composants modifiés)
pnpm docs:update AccordionBtn SyCheckbox DatePicker SyTextField

# Option 2 : tout régénérer (recommandée pour une release majeure)
pnpm func:history && pnpm a11y:history
pnpm func:inject && pnpm a11y:inject
pnpm info:components

# Vérifier le résultat
pnpm func:inject:dry   # affiche ce qui serait modifié sans écrire

# Committer
git add .
git commit -m "docs: update version badges for vX.X.X release"
```

---

## Scripts disponibles (récap)

| Script | Description |
|---|---|
| `pnpm docs:update [composants]` | Analyse git + injection (fonctionnel + a11y) + `a11y-status.json` + `component-info.json` — force la mise à jour |
| `pnpm docs:check <composants>` | Vérifie s'il y a de nouveaux commits depuis la dernière MAJ, met à jour si nécessaire |
| `pnpm func:history [composants]` | Génère/met à jour `functional-history-data.json` |
| `pnpm func:inject [composants]` | Injecte les badges fonctionnels dans les `.mdx` |
| `pnpm func:inject:dry [composants]` | Dry-run du badge fonctionnel |
| `pnpm a11y:history [composants]` | Génère/met à jour `a11y-history-data.json` |
| `pnpm a11y:inject [composants]` | Injecte les badges a11y dans les `.mdx` |
| `pnpm a11y:inject:dry [composants]` | Dry-run du badge a11y |
| `pnpm info:components` | Génère `src/stories/Demarrer/component-info.json` (page « Suivi des composants ») |

---

## Fichiers générés à committer

| Fichier | À committer ? |
|---|---|
| `functional-history-data.json` | Oui — cache des données fonctionnelles |
| `a11y-history-data.json` | Oui — cache des données a11y |
| `src/components/**/*.mdx` | Oui — pages doc mises à jour |
| `src/stories/Demarrer/component-info.json` | Oui — données de la page « Suivi des composants » |
| `a11y-history-report.md` | Optionnel — rapport lisible par les humains |
