# Analyse croisée des classeurs RGAA

Date : 27 novembre 2026  
Périmètre : les classeurs `.xlsx` présents dans `.storybook/public/audits/`.

## Conclusion

Les classeurs couvrent 45 composants. Ils constituent une bonne source de critères historiques, mais leurs lignes « conformes » ne prouvent pas la conformité actuelle : elles documentent un état corrigé au moment de la production du classeur. L'audit indépendant doit donc rejouer les contrôles sur le composant rendu, dans le thème CNAM et dans les états pertinents.

L'inventaire distingue :

- 38 classeurs avec un résumé v2 exploitable ;
- 5 classeurs sans résumé v2 standardisé ;
- 2 classeurs dont la structure ne permet pas une extraction fiable avec le format commun.

Dans les 38 résumés v2, le statut historique est `C` sans `NC`. Cela ne doit pas être interprété comme une preuve actuelle : le contrôle navigateur du BackBtn a déjà révélé une non-conformité 10.11 sur un libellé long.

## Matrice historique extraite

Les critères ci-dessous sont les critères signalés dans les premières feuilles d'analyse des classeurs, avant toute revalidation indépendante.

| Composant | Résumé v2 | Critères historiques signalés |
|---|---:|---|
| Accordion | C17 / NC0 | 1.2, 8.2 |
| Alert | C17 / NC0 | 1.2, 3.2, 3.3, 7.1, 7.5, 8.7, 10.7 |
| BackBtn | C14 / NC0 | 3.3, 8.2 |
| BackToTopBtn | C14 / NC0 | 1.2, 3.2, 3.3, 8.2, 10.7 |
| ChipList | C18 / NC0 | 1.2, 3.3, 7.1, 8.2, 9.3, 10.4, 10.7, 10.10 |
| CollapsibleList | C18 / NC0 | 3.2, 3.3, 10.7 |
| ContextualMenu | C19 / NC0 | 7.1, 9.2, 10.3, 10.9, 10.10 |
| Cookies | — | 1.2, 3.3, 7.1, 7.3, 8.2, 10.11, 10.12, 11.10, 12.8 |
| CopyBtn | C16 / NC0 | 3.3, 7.1, 7.5, 8.2, 13.8 |
| DataList | C15 / NC0 | 1.2, 3.3, 7.1, 8.2, 9.3, 10.7, 10.12 |
| DataListGroup | C8 / NC0 | 9.3 |
| DialogBox | C21 / NC0 | 1.2, 3.3, 7.1, 7.3, 8.2, 9.1, 10.7, 10.12, 12.8 |
| DownloadBtn | C14 / NC0 | 3.2, 3.3, 7.1 |
| ErrorPage | C14 / NC0 | aucun critère spécifique extrait |
| ExternalLinks | C21 / NC0 | 1.2, 3.2, 3.3, 7.1, 7.3, 8.2, 9.3, 10.3, 10.7, 10.9, 10.10, 12.9 |
| FilterSideBar | C19 / NC0 | 1.2, 3.3, 7.1, 7.3, 7.5, 8.2, 9.2, 9.3, 10.1, 10.7, 10.11 |
| FooterBar | — | 1.2, 3.2, 3.3, 9.1, 10.7, 10.12, 12.8 |
| FranceConnectBtn | C17 / NC0 | 1.2, 3.3, 6.1 |
| HeaderBar | C20 / NC0 | 1.2, 1.3, 6.1, 7.1, 9.1, 9.2, 10.11 |
| HeaderBurgerMenu | C21 / NC0 | 1.2, 7.1, 7.3, 8.2, 9.1, 9.2, 9.3, 10.3, 12.9 |
| HeaderLoading | — | structure non standard, extraction à reprendre |
| HeaderNavigationBar | — | structure non standard, extraction à reprendre |
| HeaderToolbar | C19 / NC0 | 3.1, 7.1, 7.3, 8.2, 9.2, 10.4, 10.11 |
| LangBtn | C17 / NC0 | 3.2, 3.3, 7.1, 7.3, 8.2, 8.7 |
| Logo | C9 / NC0 | aucun critère spécifique extrait |
| LogoBrandSection | C19 / NC0 | 1.2, 1.3, 6.1, 8.2, 10.1, 10.11 |
| MaintenancePage | C0 / NC0 | 1.2, 8.2 (résumé à requalifier) |
| NirField | C22 / NC0 | 3.3, 7.1, 8.2, 11.7, 11.10, 11.11 |
| NotFoundPage | C15 / NC0 | aucun critère spécifique extrait |
| NotificationBar | C13 / NC0 | 7.1, 7.5, 10.11 |
| PageContainer | C9 / NC0 | 3.2 |
| PasswordField | C19 / NC0 | 1.2, 7.1, 11.10, 11.11, 11.13 |
| PhoneField | C31 / NC0 | 1.2, 3.2, 7.1, 7.3, 7.5, 8.7, 8.8, 10.1, 11.5, 11.6, 11.7, 11.10, 11.11, 11.13 |
| RangeField | C14 / NC0 | 3.3, 7.1, 8.2, 10.1, 10.7 |
| RatingPicker | C20 / NC0 | 1.2, 3.3, 7.1, 7.3, 7.5, 8.2, 10.7, 10.8 |
| SearchListField | C20 / NC0 | 7.1, 7.5, 8.2, 10.11, 11.2, 11.5, 11.6, 11.7, 11.10 |
| SelectBtnField | C16 / NC0 | 1.2, 3.3, 7.1, 7.3, 8.2, 10.7, 10.11, 10.12 |
| SkipLink | — | extraction standard indisponible |
| SocialMediaLinks | C21 / NC0 | 1.2, 3.3, 9.1, 10.7, 10.12 |
| SubHeader | C18 / NC0 | 1.2, 3.2, 7.1, 9.2, 9.3, 10.11, 10.12 |
| SyBtnMenu | C19 / NC0 | 1.2, 3.3, 7.1, 8.2, 9.3, 10.7, 10.11 |
| SyCheckbox | C19 / NC0 | 1.2, 3.3, 7.1, 7.3, 8.2, 9.3, 10.7, 11.10 |
| SySelect | — | extraction standard indisponible ; lignes à normaliser |
| SyTextField | — | extraction standard indisponible |
| ToolbarContainer | C11 / NC0 | 1.2, 3.3, 7.1, 7.3, 10.7 |

## Croisement avec les tests du dépôt

Les tests génériques existants sont utiles, mais ils ne couvrent pas uniformément les critères déclarés dans les classeurs. Les tests RGAA spécifiques et séparés CI/audit sont actuellement ajoutés pour Accordion et BackBtn :

- `*.rgaa.a11y.spec.ts` : contrats DOM/axe exécutables ;
- `*.rgaa.cy.ts` : contrôles navigateur dépendant du rendu, du thème CNAM, du contraste, du focus, du redimensionnement et de l'espacement du texte.

Contrôles indépendants déjà observés :

- BackBtn : 3.2, 3.3/10.7, 10.11, 10.12 ; 10.11 échoue avec un libellé long à 320 px ;
- Accordion : contrats sémantiques et clavier ; les contrôles de rendu sont séparés des assertions DOM.
- BackToTopBtn : 3.2 passe ; 3.3/10.7 échoue actuellement car aucun ring de focus n'est détecté ;
- CopyBtn, DownloadBtn, FranceConnectBtn et SocialMediaLinks : contrats DOM et contrôles navigateur ciblés ajoutés ; les scénarios exécutés sont verts ;
- Logo, LogoBrandSection, PageContainer, ErrorPage, NotFoundPage, LangBtn, SyBtnMenu, ContextualMenu, CollapsibleList et ChipList : contrats DOM dédiés ajoutés ; la revalidation navigateur reste à faire pour les critères de rendu.

La suite ne permet donc pas encore d'affirmer que les 45 composants ont été ré-audités. Ce fichier est la base de traçabilité ; la revalidation doit être faite par familles de composants et produire un fichier d'audit et un test ciblé par composant.

## Règle de lecture

Un critère est « couvert » uniquement si une preuve existe : test automatisé pertinent, observation manuelle documentée, ou résultat d'un outil de contraste/inspection reproductible. La simple présence du critère dans un classeur ne suffit pas.
