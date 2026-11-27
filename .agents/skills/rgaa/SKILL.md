---
name: rgaa
description: >-
  Use when auditing RGAA 4.1.2 conformance of Synapse Vue/Vuetify components, stories or markup,
  when asked for an accessibility audit, a conformance report, a list of non-conformities or input
  for an accessibility statement, or when an accessibility finding must be tied to an RGAA criterion.
---

# RGAA 4.1.2 — Audit de conformité des composants Synapse

Référentiel d'accessibilité numérique français. 106 critères répartis en 13 thématiques. Basé sur WCAG 2.1 niveau AA.

Source : https://accessibilite.numerique.gouv.fr/

## Workflow d'audit

1. **Délimiter le périmètre** : composant(s) sous `src/components/` (éventuellement imbriqué : `Customs/`, `Tables/`…) (SFC `.vue`, props, slots, `locales.ts`, stories) ou diff.
2. **Collecter les preuves automatiques** si possible :
   - `pnpm vitest run /<Nom>.a11y.spec.ts --coverage.enabled=false` (filtre par sous-chaîne, sans glob ; vérifier `Test Files 1 passed`)
   - lire la section du composant dans `scripts/data/a11y-report.md` (régénéré par `pnpm a11y:report`, qui réécrit ce fichier suivi par git : ne le lancer que si l'on est autorisé à modifier le dépôt)
   - Rattacher chaque violation axe à son critère : `a11y-testing` → `references/axe-rgaa.md`.
3. **Appliquer les « Critères vérifiables »** des skills `a11y-aria-patterns`, `a11y-fixes`, `a11y-testing`, `a11y-contrast` : chaque case non cochée est une NC candidate.
4. **Parcourir les 13 thèmes RGAA** avec les fichiers de référence ci-dessous. Un composant de librairie rend la plupart des critères de page (titre, langue, liens d'évitement globaux) **NA** : les justifier en une ligne.
5. **Écarter les faux positifs connus** (Tanaguru : `DialogBox`, `RatingPicker`, `SyTabs`) : [doc/Accessibilite/README.md §5](../../../doc/Accessibilite/README.md#5-faux-positifs-connus-tanaguru).
6. **Attribuer un statut** à chaque critère :
   - **C** — Conforme : critère respecté
   - **NC** — Non conforme : critère violé (identifier l'élément et le problème)
   - **NA** — Non applicable : critère sans objet pour ce contenu (justifier)
7. **Produire le rapport** selon le format ci-dessous, dans la conversation.

## Format du rapport de conformité

```markdown
## Audit RGAA 4.1.2 — Rapport de conformité

**Date :** JJ/MM/AAAA
**Périmètre audité :** [description du code / page / composant]
**Résultat global :** X% conforme
(X critères applicables — X conformes, X non conformes, X non applicables)

---

### Tableau de synthèse

| Thème | C | NC | NA |
|-------|---|----|----|
| 1. Images | | | |
| 2. Cadres | | | |
| 3. Couleurs | | | |
| 4. Multimédia | | | |
| 5. Tableaux | | | |
| 6. Liens | | | |
| 7. Scripts | | | |
| 8. Éléments obligatoires | | | |
| 9. Structuration | | | |
| 10. Présentation | | | |
| 11. Formulaires | | | |
| 12. Navigation | | | |
| 13. Consultation | | | |
| **Total** | | | |

---

### Non-conformités détectées

**[NC] {ID} — {Intitulé du critère}**
- **Élément concerné :** `<code>` ou description de l'endroit dans la page
- **Problème :** description précise de la violation
- **Correction :** action concrète à mener
- **Priorité :** 🔴 Bloquant / 🟠 Majeur / 🟡 Mineur

---

### Critères conformes

{ID1}, {ID2}, {ID3}... (liste compacte)

### Critères non applicables

- **{ID}** — {justification courte}
```

## Restitution du rapport

Afficher le rapport **dans la conversation**. N'écrire un fichier que si l'utilisateur le demande, au chemin qu'il indique (aucun dossier d'audit n'est prévu dans le dépôt). Ne jamais modifier `scripts/data/a11y-report.md` à la main : il est généré par `pnpm a11y:report`.

## Grille de priorités

| Priorité | Définition | Exemples |
|----------|------------|---------|
| 🔴 **Bloquant** | Bloque l'accès au contenu ou à la fonctionnalité pour un utilisateur AT | Image sans `alt`, champ sans label, lien vide, piège au clavier |
| 🟠 **Majeur** | Impact fort sur l'expérience mais contournable par certains AT | Contraste insuffisant, focus non visible, hiérarchie de titres cassée, lien non explicite |
| 🟡 **Mineur** | Gêne légère, dégradation de l'expérience sans blocage | `autocomplete` manquant, `caption` de tableau absent, nouvelle fenêtre non signalée |

## Référence détaillée des critères

Chaque fichier de référence liste les critères avec leur condition, test de code, non-conformité type et priorité.

- **Images, Cadres, Couleurs** (thèmes 1–3, 14 critères) : [references/criteres-images-cadres-couleurs.md](references/criteres-images-cadres-couleurs.md)
- **Multimédia, Tableaux, Liens, Scripts** (thèmes 4–7, 28 critères) : [references/criteres-multimedia-tableaux-liens-scripts.md](references/criteres-multimedia-tableaux-liens-scripts.md)
- **Éléments obligatoires, Structure, Présentation** (thèmes 8–10, 28 critères) : [references/criteres-structure-presentation.md](references/criteres-structure-presentation.md)
- **Formulaires** (thème 11, 13 critères) : [references/criteres-formulaires.md](references/criteres-formulaires.md)
- **Navigation, Consultation** (thèmes 12–13, 23 critères) : [references/criteres-navigation-consultation.md](references/criteres-navigation-consultation.md)
