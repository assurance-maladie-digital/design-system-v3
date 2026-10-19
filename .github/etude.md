## Description du bug

<!-- Quel était le bug ? Comportement attendu vs réel. Ajoutez des captures d'écran avant/après si pertinent. -->

**Attendu :**

**Réel :**

## Cause racine

<!-- Qu'est-ce qui a causé ce bug ? Soyez précis sur la cause technique. -->

## Correction

<!-- Que change cette PR pour corriger le bug ? -->

## Reproduction / vérification

<!-- Étapes pour reproduire le bug (avant) puis vérifier la correction (après). -->

1.
2.
3.

## Impact

<!-- Sévérité : Faible (cosmétique) / Moyenne (contournable) / Élevée (fonctionnalité dégradée) / Critique (bloquant) -->

- **Sévérité :** Faible / Moyenne / Élevée / Critique
- **Introduit dans :** version ou commit à l'origine du bug
- **Utilisateurs concernés :** Tous / Sous-ensemble (décrire)
- **Zones à risque :** parties du code potentiellement impactées par la correction

## Checklist

- [ ] La correction traite la cause racine (pas seulement les symptômes)
- [ ] Un test a été ajouté pour prévenir la régression
- [ ] `pnpm vitest run <dossier>` passe sur le périmètre modifié
- [ ] Tests a11y passés si du markup a été modifié (`pnpm vitest run <fichier>.a11y.spec.ts`)
- [ ] Tests visuels Cypress passés / baselines à jour si le rendu change (`pnpm test:visual`)
- [ ] Aucun nouvel avertissement ou erreur de console

## Tickets liés

<!-- Liez le rapport de bug. Utilisez « Fixes #123 » pour fermer automatiquement. -->
