# Couverture RGAA des composants `src/components/Customs`

Audit technique ciblé — thème CNAM — 27/11/2026.

Les 15 composants et ressources Vue auditables du périmètre `Customs` sont maintenant rattachés à un contrat RGAA dédié.
Les deux fichiers `Integration*.vue` présents dans `SyForm/tests` sont des fixtures de test, pas des composants publics,
et sont volontairement exclus de l’inventaire.

| Composant | Critères ciblés | DOM | Cypress audit |
|---|---|---:|---:|
| SelectBtnField | 7.1, 8.2, 10.7, 11.1, 11.10 | oui | oui |
| SyAutocomplete | 7.1, 8.2, 10.7, 11.1, 11.10 | oui | oui |
| SyInputSelect | 7.1, 8.2, 10.7, 11.1, 11.10 | oui | oui |
| SySelect | 7.1, 8.2, 10.7, 11.1, 11.10 | oui | oui |
| SyCheckBoxGroup | 7.1, 8.2, 10.7, 11.1, 11.10 | oui | oui |
| SyCheckbox | 7.1, 7.3, 8.2, 9.3, 10.7, 11.10 | oui | oui |
| SyForm | 7.1, 8.2, 11.1, 11.10 | oui | oui |
| SyIcon | 1.2, 1.3, 10.1 | oui | oui |
| SyIconAccessibility | guide de démonstration ; critères délégués à SyIcon, SySelect et SyRadioGroup | existants | existants |
| SyIconButton | 7.1, 8.9, 10.7, 11.9 | oui | oui |
| SyPagination | 7.1, 8.9, 10.7, 12.6 | oui | oui |
| SyRadioGroup | 7.1, 8.2, 10.7, 11.1, 11.10 | oui | oui |
| SyTabs | 7.1, 8.9, 10.7, 12.6 | oui | oui |
| SyTextField | 7.1, 8.2, 10.7, 11.1, 11.10 | oui | oui |
| FieldState (support interne) | 1.2, 3.2, 10.1 | oui | oui |

Les tests vérifient des contrats observables (sémantique native, nom accessible, relations ARIA, état actif,
focusabilité et décoration des icônes). Ils ne remplacent pas les vérifications manuelles RGAA : contraste réel,
zoom navigateur à 200 %, reflow, lecteurs d’écran, ordre de tabulation complet et comportement dans les usages
consommateurs.

Le périmètre exclut explicitement `src/components/Amelipro/**`.

Validation au 27/11/2026 : 15 fichiers DOM dédiés, 23 tests DOM passants ; 15 specs Cypress, 22 tests passants.
