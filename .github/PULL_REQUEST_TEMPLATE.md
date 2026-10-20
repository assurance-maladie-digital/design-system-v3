## Problème

<!--
  Décrivez le problème ou le besoin : bug, régression, fonctionnalité manquante.
  Liez l'issue concernée si elle existe.
-->

## Correctif

<!--
  Décrivez ce que fait la PR pour résoudre le problème.
  Mentionnez les choix techniques importants et la/les stories associées.
-->

## Changement de contrat

<!--
  Impact de la PR sur le contrat du composant ou de la librairie.
  Conservez uniquement la ligne pertinente.
  Si changement de contrat : documentez-le dans releasesAlerts/vX.X.X/
  (format : releasesAlerts/README.md). À fournir avant la fin de la PR.
-->

- Aucun changement de contrat
- Changement de comportement (non cassant, observable par le consommateur)
- Changement cassant : props/événements/slots renommés ou supprimés (détaillez ci-dessous)

## Avant de demander la review

<!-- Ne cochez que ce qui s'applique à votre PR. -->

**Général**

- [ ] PR bien nommée (Composant : descriptif), pointe vers la bonne branche, issue liée
- [ ] Maquettes respectées (équipe design informée si évolution) et design tokens utilisés
- [ ] Aucun impact sur les usages existants, responsive vérifié
- [ ] Deploy + SKSN checks OK

**Documentation**

- [ ] Story créée ou mise à jour (exemples d'usage, état d'erreur/vide)
- [ ] Changement de contrat documenté dans `releasesAlerts/vX.X.X/` (si applicable)

**Tests**

- [ ] Tests unitaires ajoutés ou mis à jour (test de régression pour un correctif)
- [ ] Test `*.a11y.spec.ts` ajouté ou mis à jour si markup modifié

## Checklist Accessibilité obligatoire

- [ ] Pas d'erreurs axe-core sur la story.
- [ ] Pas d'erreur Tanaguru.
- [ ] Faux positifs documentés.
- [ ] Page d'accessibilité mise à jour.
- [ ] Tests mis à jour.
- [ ] Snapshot visuel mis à jour si styles modifiés.
- [ ] Tests manuels :
  - [ ] Restitution vocale : intitulés des boutons, alertes.
  - [ ] Comportement des composants lors d'une navigation uniquement au clavier.
  - [ ] Zoom de la taille de texte à 200 % (10.4) et viewport 320 px (10.11) : pas de perte de contenu ou de fonctionnalité.
