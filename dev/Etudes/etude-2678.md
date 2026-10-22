## Problème

Issue #2678 — Accessibilité de SyServerTable : association du sélecteur « Lignes par page » à son libellé.

**Critère RGAA déclaré dans l’issue : 11.1 uniquement.**

**Signalement initial :** version 1.1.6, projet P1 Refonte Compte AS, impact déclaré bloquant.

**Constats complémentaires de notre analyse :** en étudiant le signalement et les extraits Tanaguru transmis ensuite, nous avons également relevé une référence ARIA invalide et une légende de tableau vide. Les signalements Tanaguru associés à 8.2 et 5.5 ne font pas partie des critères déclarés dans l’issue initiale ; ils sont distingués ci-dessous et traités dans le même correctif. Cela ne constitue pas une validation globale de conformité à ces critères.

**Story concernée :** https://cnam-design-system.netlify.app/iframe.html?id=composants-tableaux-syservertable--default&viewMode=story

### Signalement initial — association du sélecteur à son libellé (RGAA 11.1)

L’issue signale que le sélecteur « Lignes par page » n’est pas correctement associé à son libellé visible.

### Constat complémentaire — référence ARIA invalide (signalement Tanaguru 8.2)

Lors de notre analyse, l’extrait Tanaguru transmis en complément de l’issue a permis de préciser la référence ARIA invalide sur le champ :

```html
<input
  aria-labelledby="sy-select-p4c95-3-label"
  title="Lignes par page:"
  aria-label="Lignes par page:"
  role="combobox"
>
```

Le texte visible « Lignes par page » ne possède pas d’identifiant. La pagination passe un label interne vide à SySelect, mais VTextField génère malgré tout un `aria-labelledby` visant son label interne absent. La liste d’options de SySelect référence également cet identifiant sans vérifier l’existence du label.

Les valeurs de `title` et d’`aria-label`, y compris le caractère `:`, sont valides. Elles peuvent fournir un nom accessible, mais ne rendent pas valide la référence `aria-labelledby` cassée. L’absence totale de nom accessible n’est donc pas démontrée par cet extrait ; l’incohérence ARIA est confirmée.

### Constat complémentaire — légende vide du tableau (signalement Tanaguru 5.5)

Ce point a été étudié en complément de l’issue initiale. Tanaguru signale un titre non pertinent sur le tableau. L’extrait `<table aria-rowcount="16">…</table>` seul ne permet pas de qualifier ce défaut : `aria-rowcount` est un nombre de lignes, pas un titre.

L’étude du code révèle toutefois que SyServerTable et SyTable rendent systématiquement un `<caption>`, même lorsque la prop `caption` est vide. La story Default de SyServerTable utilise précisément une légende vide. Ce balisage crée une légende sans contenu permettant d’identifier le tableau.

**Périmètre partagé :** SyServerTable et SyTable utilisent tous deux SyTablePagination ; la gestion des références de label concerne aussi les autres usages de SySelect.

## Correctif

### Étiquetage du sélecteur

- Générer un identifiant unique par instance avec `useId()` dans SyTablePagination.
- Affecter cet identifiant au texte visible « Lignes par page ».
- Le transmettre à SySelect via `aria-labelledby`, en conservant le libellé explicite existant.
- Dans SySelect, privilégier une référence externe fournie par le consommateur ; sinon référencer le label interne uniquement lorsque la prop `label` n’est pas vide.
- Ne plus conserver la référence interne invalide sur l’input en l’absence de label.
- Appliquer la même association à la liste d’options ouverte ; utiliser un `aria-label` de repli lorsqu’aucune référence de label n’est disponible.
- Résoudre la référence pendant le rendu pour suivre les changements des attributs transmis, sans accès DOM supplémentaire dans le setup ni dépendance ajoutée.

### Légende du tableau

- Ne rendre le `<caption>` que si `caption.trim()` n’est pas vide, dans SyServerTable et SyTable.
- Conserver une légende renseignée comme enfant direct du `<table>`.
- Donner à la story Default de SyServerTable le titre « Liste des utilisateurs », également présent dans son extrait Template.
- Ne pas inventer de titre générique dans la bibliothèque : le consommateur reste responsable de fournir une légende pertinente pour ses données.

### Fichiers concernés

| Fichier | Modification |
|---|---|
| `src/components/Customs/Selects/SySelect/SySelect.vue` | Résolution du label externe/interne et suppression des références internes absentes pour le champ et la liste. |
| `src/components/Tables/common/SyTablePagination.vue` | Identifiant unique sur le libellé visible et association au sélecteur. |
| `src/components/Tables/SyServerTable/SyServerTable.vue` | Rendu conditionnel de la légende non vide. |
| `src/components/Tables/SyTable/SyTable.vue` | Même correction de légende. |
| `src/components/Tables/SyServerTable/SyServerTable.stories.ts` | Titre explicite dans la story Default et l’extrait copiable. |
| `src/components/Customs/Selects/SySelect/tests/SySelect.a11y.spec.ts` | Régression sans label interne, association du label interne existant et ouverture réelle du menu au clavier. |
| `src/components/Tables/common/tests/SyTablePagination.a11y.spec.ts` | Nouveau test axe et tests des références ARIA, de deux instances et du changement de nombre de lignes. |
| `src/components/Tables/SyServerTable/tests/SyServerTable.a11y.spec.ts` | Absence de légende vide, ajout/retrait réactif d’une légende et association directe au tableau. |
| `src/components/Tables/SyTable/tests/SyTable.a11y.spec.ts` | Vérification de l’absence de légende vide ou composée d’espaces. |

### Vérifications réalisées

Deux tests de régression ont échoué avant le correctif : référence `aria-labelledby` interne présente sans label et `<caption>` rendu vide.

Validation ciblée :

```bash
pnpm vitest run src/components/Tables/SyServerTable src/components/Tables/SyTable src/components/Tables/common/tests src/components/Customs/Selects/SySelect --coverage.enabled=false
pnpm vue-tsc -p tsconfig.app.json --noEmit
```

- 381 tests réussis sur 27 fichiers, dont les tests d’accessibilité ciblés.
- Contrôles axe de la pagination fermée et ouverte, contenu téléporté inclus.
- Vérification de l’unicité des identifiants avec deux paginations dans une même application.
- Vérification de l’événement `update:items-per-page` après sélection.
- ESLint exécuté sur les neuf fichiers modifiés ou ajoutés : aucune erreur.
- `git diff --check` : aucune erreur.
- Après le dernier ajustement de résolution du label au rendu, les deux fichiers a11y du sélecteur et de la pagination ont été relancés : 4 tests réussis ; lint du composant réussi.

**Limites :** validation locale sous Node 24.22.0, avec avertissement car le dépôt attend Node 20–22. Tanaguru, lecteur d’écran, vérifications visuelles et tests sur le déploiement n’ont pas été exécutés. Ces tests ciblés ne constituent pas un audit RGAA complet.

## Changement de contrat

- Changement de comportement (non cassant, observable par le consommateur).

Aucune prop, aucun événement et aucun slot public ajouté, supprimé ou renommé. Le DOM et l’étiquetage accessible changent : les légendes vides ne sont plus rendues et les références ARIA sont cohérentes avec les labels disponibles. La story Default affiche désormais une légende visible.

Le dossier `releasesAlerts/` et son README, mentionnés dans le template, sont absents de ce checkout. La note de version reste à intégrer selon le circuit de publication du projet avant la fin de la PR.

## Avant de demander la review

**Général**

- [ ] PR bien nommée (Composant : descriptif), pointe vers la bonne branche, issue liée
- [ ] Maquettes respectées (équipe design informée si évolution) et design tokens utilisés
- [ ] Aucun impact sur les usages existants, responsive vérifié
- [ ] Deploy + SKSN checks OK

**Documentation**

- [x] Story créée ou mise à jour (exemples d’usage, état d’erreur/vide) — story Default mise à jour pour le titre
- [ ] Changement de contrat documenté dans `releasesAlerts/vX.X.X/` (si applicable)

**Tests**

- [x] Tests unitaires ajoutés ou mis à jour (test de régression pour un correctif)
- [x] Test `*.a11y.spec.ts` ajouté ou mis à jour si markup modifié

## Checklist Accessibilité obligatoire

- [ ] Pas d’erreurs axe-core sur la story — tests axe des composants réussis, story déployée à vérifier
- [ ] Pas d’erreur Tanaguru — à recontrôler après déploiement
- [ ] Faux positifs documentés — aucun faux positif déclaré pour contourner ces anomalies
- [ ] Page d’accessibilité mise à jour
- [x] Tests mis à jour
- [ ] Snapshot visuel mis à jour si styles modifiés — pas de styles modifiés ; ajout du titre de la story à contrôler visuellement
- [ ] Tests manuels :
  - [ ] Restitution vocale : intitulés des boutons, alertes et sélecteur « Lignes par page »
  - [ ] Comportement des composants lors d’une navigation uniquement au clavier
  - [ ] Zoom de la taille de texte à 200 % (10.4) et viewport 320 px (10.11) : pas de perte de contenu ou de fonctionnalité
