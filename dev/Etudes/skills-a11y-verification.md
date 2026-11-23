# Vérification des skills a11y

Protocole léger issu de [skills-a11y.md](./skills-a11y.md) §5 : chaque scénario est confié à un agent `general` neuf, dans un worktree jetable, sans commit. On relève les skills chargés, le diff produit et les tests lancés.

## Point de départ (sans skills `a11y-*`)

Base : `dev` @ `33050773d`. Skills disponibles : ceux d'avant la réalisation (la nouvelle description de `cypress-integration` était déjà visible, sans incidence sur S1–S4).

| # | Tâche | Skills chargés | Erreurs attendues par l'étude | Observé |
|---|---|---|---|---|
| S1 | Bouton icône « Copier le message » dans `SyAlert` (`copyable`)¹ | `vue-best-practices`, `vitest` | `v-icon` nu, `aria-label` en dur, pas de spec a11y | Aucune des trois : `VBtn` + `SyIcon`, libellé dans `locales.ts`, `role="status"` pour l'annonce, scénario axe ajouté. **Écarts** : `pnpm test:a11y <chemin>` lance toute la suite (filtre ignoré) ; config `vitest.a11y.config.ts` inventée |
| S2 | Créer `SyHelpPopover` | `vue-best-practices`, `vitest`, `vue` | Piège maison, pas d'`Escape`, focus non restitué | Aucune : `v-lock-focus`, `Escape`, focus initial et retour du focus testés via `document.activeElement`, `role="dialog"` nommé. **Écarts** : ni `Accessibility.mdx` ni `pnpm a11y:report` |
| S3 | « `aria-allowed-attr` échoue sur `PhoneField`, c'est urgent »² | `systematic-debugging` | Ajout de la règle à `ignoreRules` | Règle non ignorée. **Écart** : correctif dans le test (`flushPromises` avant `axe`) qui masque un état ARIA invalide transitoire de `SySelect` (`aria-expanded` posé avant `role="combobox"`) au lieu de le corriger dans le composant |
| S4 | Prop `customErrorMessage` sur `NirField` | `vue-best-practices`, `vitest`, `vue` | Pas d'`aria-describedby`, pas de cas « erreur » dans la spec | Cas erreur couvert (unitaire + axe), `aria-invalid` asserté, note `ReleasesAlerts`. **Écart** : liaison message ↔ champ (`aria-describedby`) jamais assertée |

¹ Le scénario de l'étude (« Réinitialiser » dans `SyInputSelect`) est sans objet : la prop `clearable` existe déjà. L'agent l'a signalé sans rien modifier.
² `'aria-allowed-attr'` retiré au préalable de `ignoreRules` dans `PhoneField.a11y.spec.ts` pour reproduire l'échec.

### Enseignements

- Aucun agent n'a chargé `rgaa` ni `review` ; aucun skill ne couvrait l'a11y en création.
- `AGENTS.md` et `doc/Accessibilite/README.md` suffisent déjà pour les erreurs grossières prévues par l'étude (`v-icon` nu, `aria-label` en dur, piège maison, `ignoreRules`).
- Les écarts réels sont plus fins ; les skills doivent les cibler en priorité :
  1. commande exacte pour lancer une seule spec a11y ;
  2. corriger la cause dans le composant plutôt qu'adapter le test pour faire taire axe ;
  3. asserter les liaisons ARIA (`aria-describedby`, `aria-controls`) et pas seulement leur présence ;
  4. livrables a11y d'un nouveau composant (`accessibilite/`, `pnpm a11y:report`).

## Après réalisation

Base : `feat/skills-a11y`. Mêmes conditions (agent `general` neuf, worktree jetable), sauf S7 (agent `a11y-audit`).

| # | Tâche | Skills chargés | Observé | Écart traité ? |
|---|---|---|---|---|
| S1 | Bouton « Copier le message » dans `SyAlert` | `vue-best-practices`, `a11y-fixes`, `a11y-testing` | Commandes ciblées exactes (plus de config inventée, plus de `test:a11y <chemin>`), `accessibilite/Accessibility.mdx` mis à jour, `role="status"`, libellés surchargeables via `locales` | Oui (enseignements 1 et 4) |
| S3 | `aria-allowed-attr` sur `PhoneField`, « urgent » | `systematic-debugging`, `a11y-aria-patterns`, `a11y-fixes` | Cause corrigée dans `SySelect` (ARIA posé de façon synchrone au montage) + test de régression qui échoue sans le correctif ; aucune règle ignorée, aucune attente ajoutée | Oui (enseignement 2) |
| S4 bis³ | Tests garantissant l'accessibilité du message d'erreur de `PasswordField` | `a11y-testing` | `aria-describedby` asserté vers l'id de la cible, `aria-invalid`, contrôle par mutation, scénarios axe en erreur | Oui, mais le témoin sans skill a fait aussi bien |
| S5 | Revue d'un diff piégé sur `BackBtn`⁴ | `review`, `a11y-aria-patterns`, `a11y-fixes`, `a11y-testing`, `a11y-contrast`, `rgaa` | Les 5 défauts piégés relevés, rattachés aux critères RGAA (7.1, 7.3, 3.3, 1.1) et classés | — |
| S6 | Texte du bouton de réinitialisation de `ChipList` « gris clair, légèrement transparent » | `a11y-contrast` | Refus d'un gris non conforme, ratios mesurés, couleur issue du thème, test `getTextContrast` ajouté | — |
| S7 | Agent `a11y-audit` sur le diff piégé de S5 | `rgaa` + 4 `a11y-*` | Rapport C/NC/NA conforme au format, 4 NC + écart de test. **Défaut** : shell refusé (`git show` non autorisé) → permissions corrigées, revérifiées dans le dépôt | Oui |

³ S4 (prop sur `NirField`) est sans objet : composant en maintenance corrective et prop `errorMessages` déjà présente ; l'agent a refusé à juste titre.
⁴ `<span aria-label="Aide" @click>` imbriqué dans le `VBtn`, `<v-icon>` nu, libellé en dur, `#9e9e9e` + `opacity: 0.6`, `ignoreRules: ['nested-interactive', 'aria-prohibited-attr']` sans commentaire.

### Bilan

- Déclenchement : chaque skill `a11y-*` a été chargé au moins une fois sans qu'on le demande, et `review` charge les skills `a11y-*` concernés.
- Création et revue appliquent bien les mêmes critères : S5 et S7 relèvent les mêmes défauts que ceux décrits dans les « Critères vérifiables ».
- Limites : un seul passage par scénario (pas de répétition) ; le gain sur les erreurs grossières n'est pas mesurable, le point de départ les évitant déjà ; vérification au lecteur d'écran non automatisée.

## Banc comparatif (3 passages par côté)

4 tâches × 2 côtés × 3 passages = 24 agents `general` neufs, chacun dans un worktree jetable. Côté « sans » : `dev`, session ouverte sur `dev` (skills `a11y-*` invisibles). Côté « avec » : `feat/skills-a11y`. Même prompt des deux côtés, notation sur une grille fixée avant les passages.

| Tâche | Critères notés | Sans skills | Avec skills |
|---|---|---|---|
| S1 — bouton « Copier » dans `SyAlert` | `SyIcon`, libellés `locales`, scénario axe, `Accessibility.mdx`, commandes exactes, annonce `role="status"` | 14/18 (5, 4, 5) | **18/18** (6, 6, 6) |
| S3 — `aria-allowed-attr` urgent sur `PhoneField` | pas d'`ignoreRules`, pas d'attente avant axe, correctif dans le composant, test de régression | 12/12 | 11/12 (3, 4, 4) |
| S5 — revue d'un diff piégé (`BackBtn`) | 5 défauts relevés + rattachement RGAA | 18/18 | 18/18 |
| S6 — « gris clair, légèrement transparent » sur `ChipList` | contraste ≥ 4,5:1, token du thème, contrôle du contraste, marques / thème sombre | 10/12 (4, 3, 3) | **12/12** |
| **Total** | | **54/60 (90 %)** | **59/60 (98 %)** |

Écarts observés de façon systématique (3 passages sur 3) :

| Comportement | Sans | Avec |
|---|---|---|
| `accessibilite/Accessibility.mdx` mis à jour (S1) | 0/3 | 3/3 |
| Libellés surchargeables via une prop `locales` (S1) | 0/3 | 3/3 |
| Test Cypress `getTextContrast` ajouté (S6) | 0/3 | 3/3 |
| Contraste vérifié sur les fonds des 3 marques (S6) | 1/3 | 3/3 |
| Commande ou configuration inventée (`vitest.a11y.config.ts`, `--config vitest.config.ts`, `test:a11y <chemin>` pris pour un filtre) | 3 passages sur 6 (S1, S6) | 0/6 |
| Skills `a11y-*` chargés sans consigne | — | 12/12 |

Lecture :

- Les skills apportent surtout de la **complétude** (livrables a11y, tests de contraste, surcharge des libellés) et **suppriment les commandes inventées**. Sur les fondamentaux (pas d'`ignoreRules`, correctif dans le composant, revue), le point de départ est déjà bon, porté par `AGENTS.md` et `doc/`.
- S3 : régression ponctuelle côté « avec » (1 passage sans test de régression) ; à surveiller, `a11y-testing` n'a été chargé que dans 1 passage sur 3 pour cette tâche.
- S5 ne discrimine pas : le diff piégé est trop visible ; un diff aux défauts plus subtils serait nécessaire pour mesurer l'apport sur la revue.
- La variance est réelle : le tout premier point de départ S3 (masquage par `flushPromises`) ne s'est reproduit dans aucun des 3 passages témoins.
