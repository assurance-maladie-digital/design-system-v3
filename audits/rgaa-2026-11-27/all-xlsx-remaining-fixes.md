# Reste à corriger et à revalider — tous les classeurs

Ce fichier distingue les écarts reproduits des éléments seulement hérités des classeurs historiques.

## Écart reproduit

### BackBtn — critère 10.11

Le scénario Cypress CNAM avec un libellé long montre un document plus large que la fenêtre à 320 px (`scrollWidth` supérieur à `clientWidth`). Le composant doit rester utilisable sans perte d'information ni défilement horizontal de la page lorsque le texte est agrandi.

Fichier de détail : [back-btn-corrections.md](./back-btn-corrections.md).

Avant correction, conserver le test d'audit en échec afin que la non-conformité reste visible. Après correction, vérifier également le rendu de la story et le cas de libellé court.

## À confirmer par revalidation

### Accordion

- 1.2 et 8.2 sont issus du classeur historique ; les contrats DOM sont maintenant testés.
- Le contrôle navigateur doit confirmer les états ouvert/fermé, le focus visible, le contraste CNAM et le comportement à largeur réduite.
- Les critères 7.1, 7.3, 9.1, 12.8 et 12.9 doivent être traités comme dépendants du markup effectivement rendu et de l'usage du composant.

### 43 autres classeurs

Les critères historiques doivent être rejoués avant de créer un correctif. Une ligne `C` dans un fichier ne constitue pas un résultat actuel.

Priorité recommandée :

1. composants interactifs et champs : DialogBox, ContextualMenu, FilterSideBar, SelectBtnField, SyCheckbox, PasswordField, PhoneField, SearchListField, SySelect, SyTextField ;
2. navigation et structure : HeaderBar, HeaderBurgerMenu, HeaderToolbar, SkipLink, SubHeader, FooterBar, ToolbarContainer ;
3. boutons et liens : Alert, BackToTopBtn, CopyBtn, DownloadBtn, ExternalLinks, FranceConnectBtn, LangBtn, SocialMediaLinks, SyBtnMenu ;
4. contenus et pages : DataList, DataListGroup, ErrorPage, MaintenancePage, NotFoundPage, NotificationBar, PageContainer, Logo, LogoBrandSection ;
5. autres composants : ChipList, CollapsibleList, Cookies, NirField, RangeField, RatingPicker.

## Normalisation des classeurs

À traiter avant l'automatisation complète : Cookies, FooterBar, HeaderLoading, HeaderNavigationBar, SkipLink, SySelect et SyTextField. Leur structure ou leur résumé ne suit pas le format commun. Il faut conserver le contenu original et produire une table normalisée avec : composant, critère, statut historique, preuve, état testé, thème, outil et date.

## Format de sortie par composant

Pour chaque composant, produire :

- un rapport `audits/rgaa-2026-11-27/<composant>.md` ;
- un fichier `tests/<Composant>.rgaa.a11y.spec.ts` pour les contrats DOM/axe ;
- un fichier `tests/<Composant>.rgaa.cy.ts` pour les contrôles navigateur et les combinaisons visuelles pertinentes ;
- si un écart est reproduit, un fichier `<composant>-corrections.md` séparant le correctif du constat.

## Limites assumées

Le zoom navigateur à 200 % et certaines vérifications assistives ne sont pas entièrement simulables par Cypress. Les tests automatisés doivent couvrir les invariants mesurables ; le rapport doit conserver une section de vérifications manuelles pour le zoom, les lecteurs d'écran, le mode clavier et les combinaisons de contexte non reproductibles.
