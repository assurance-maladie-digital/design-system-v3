## Description

<!--
  Écrivez un résumé du changement, du bug résolu ou de la fonctionnalité ajoutée.
  Expliquez également le contexte si cela est pertinent.
-->

## Stories

<!-- Lien de la/les stories pour cette fonctonnalitée -->

## Type de changement

<!-- Supprimez les options non pertinentes. -->

- Nouvelle fonctionnalité
- Correction de bug
- Changement cassant
- Refactoring
- Maintenance
- Documentation
- Ce changement nécessite une mise à jour de la documentation

## Definition of Done

Avant de proposer une review, vérifiez chaque point de la checklist qui vous concerne et cochez-le s'il est appliqué.

### Nouveau composant/template

**Bonne Pratique**

- [ ] Ma Pull Request est bien nommée (Composant/template: descriptif du composant/template)
- [ ] Ma Pull Request pointe vers la bonne branche
- [ ] Linker la demande de création du composant/template et PR

**Design**

- [ ] Le composant/template respecte les maquettes validées
- [ ] Les design tokens sont utilisés

**Fonctionnel**

- [ ] Le composant/template est fonctionnel dans les cas d’usage définis
- [ ] Le composant/template est responsive (mobile, tablet, desktop)

**Accessibilité spécifique au composant/template**

- [ ] La navigation clavier couvre tous les éléments interactifs
- [ ] La restitution lecteur d’écran est correcte
- [ ] Les règles a11y spécifiques sont documentées
- [ ] Les tests a11y automatisés sont présents

**Documentation & Storybook**

- [ ] Une story est créée avec exemples d’usage
- [ ] L’onglet A11Y Storybook est présent et sans erreur
- [ ] Une page de documentation accessibilité est créée

**Tests**

- [ ] Des tests prouvent le bon fonctionnement du composant/template
- [ ] Deploy + SKSN Checks

---

### Evolution ou correctif de composant/template

**Bonne Pratique**

- [ ] Ma Pull Request est bien nommée (Composant/template: descriptif issue)
- [ ] Ma Pull Request pointe vers la bonne branche
- [ ] Linker issue et PR

**Design**

- [ ] L'évolution du composant/template respecte les maquettes validées (et l'équipe design est informée des changements)
- [ ] Les design tokens sont utilisés

**Fonctionnel**

- [ ] Le correctif résout le problème identifié
- [ ] Aucun impact sur les usages existants

**Accessibilité spécifique au composant/template**

- [ ] Navigation clavier vérifiée
- [ ] Restitution lecteur d’écran vérifiée
- [ ] Tests a11y mis à jour si nécessaire
- [ ] Page accessibilité mise à jour si impact / crée si n’existe pas

**Documentation & Storybook**

- [ ] Storybook mis à jour si nécessaire
- [ ] Onglet A11Y sans erreur
- [ ] La page de documentation accessibilité mise à jour si nécessaire

**Tests**

- [ ] Tests mis à jour ou ajoutés pour couvrir le correctif
- [ ] Deploy + SKSN Checks

**Fusion de composant/template**

- [ ] Le composant/template n'induit pas de régression dans le composant/template Synapse, Portail Agent ou AmeliPro
- [ ] Ajout des stories propre au thème (penser à filter le menu/props si nécessaire)
- [ ] Ajouter un message dans le composant/template déprécié avec un lien vers le nouveau