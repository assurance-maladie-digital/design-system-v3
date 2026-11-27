# Matrice de couverture réelle — composants possédant un classeur RGAA

Cette matrice répond explicitement à quatre questions :

1. les critères ont-ils été extraits du classeur ?
2. existe-t-il un rapport dédié au composant ?
3. existe-t-il un test DOM/audit dédié ?
4. existe-t-il un test navigateur Cypress séparé de la CI ?

`Oui` signifie qu’un fichier dédié est présent dans le dépôt. `Partiel` signifie qu’une couverture existe dans les tests historiques du composant, mais pas encore dans un contrat RGAA dédié. `Non` signifie qu’il reste à créer ou à revalider.

| Composant / classeur | Critères extraits | Rapport dédié | Test DOM RGAA dédié | Cypress audit dédié | État réel |
|---|---|---:|---:|---:|---|
| Accordion | 1.2, 8.2 | Oui | Oui | Oui | Couverture détaillée ; écarts historiques documentés |
| Alert | 1.2, 3.2, 3.3, 7.1, 7.5, 8.7, 10.7 | Oui | Oui | Oui | Contrats et contrôles navigateur ajoutés |
| BackBtn | 3.3, 8.2 | Oui | Oui | Oui | 10.11 reproduit en audit navigateur |
| BackToTopBtn | 1.2, 3.2, 3.3, 8.2, 10.7 | Oui | Oui | Oui | 3.3/10.7 reproduit en audit navigateur |
| ChipList | 1.2, 3.3, 7.1, 8.2, 9.3, 10.4, 10.7, 10.10 | Oui | Oui | Oui | Contrat DOM et contrôle navigateur ajoutés |
| CollapsibleList | 3.2, 3.3, 10.7 | Oui | Oui | Oui | Contrat DOM et contrôle navigateur ajoutés |
| ContextualMenu | 7.1, 9.2, 10.3, 10.9, 10.10 | Oui | Oui | Oui | Landmark et navigation contrôlés |
| Cookies | 1.2, 3.3, 7.1, 7.3, 8.2, 10.11, 10.12, 11.10, 12.8 | Oui | Oui | Oui | Rapport et contrôles DOM/navigateur ajoutés ; structure historique à requalifier |
| CopyBtn | 3.3, 7.1, 7.5, 8.2, 13.8 | Oui | Oui | Oui | Contrats et contrôles navigateur ciblés |
| DataList | 1.2, 3.3, 7.1, 8.2, 9.3, 10.7, 10.12 | Oui | Oui | Oui | Contrat DOM et espacement du texte validés |
| DataListGroup | 9.3 | Oui | Oui | Oui | Groupes de définitions contrôlés |
| DialogBox | 1.2, 3.3, 7.1, 7.3, 8.2, 9.1, 10.7, 10.12, 12.8 | Oui | Oui | Oui | Modal, fermeture et focus ciblés |
| DownloadBtn | 3.2, 3.3, 7.1 | Oui | Oui | Oui | Contrats et contrôles navigateur ciblés |
| ErrorPage | aucun critère spécifique extrait | Oui | Oui | Oui | Titre et action de récupération contrôlés |
| ExternalLinks | 1.2, 3.2, 3.3, 7.1, 7.3, 8.2, 9.3, 10.3, 10.7, 10.9, 10.10, 12.9 | Oui | Oui | Oui | Contrats, contraste et ouverture du menu validés |
| FilterSideBar | 1.2, 3.3, 7.1, 7.3, 7.5, 8.2, 9.2, 9.3, 10.1, 10.7, 10.11 | Oui | Oui | Oui | Rapport, contrat DOM et déclencheur navigateur ajoutés |
| FooterBar | 1.2, 3.2, 3.3, 9.1, 10.7, 10.12, 12.8 | Oui | Oui | Oui | Landmark et contenu contrôlés ; détails visuels à compléter |
| FranceConnectBtn | 1.2, 3.3, 6.1 | Oui | Oui | Oui | Contrats, contraste texte et focus validés |
| HeaderBar | 1.2, 1.3, 6.1, 7.1, 9.1, 9.2, 10.11 | Oui | Oui | Oui | Titre, structure et rendu contrôlés |
| HeaderBurgerMenu | 1.2, 7.1, 7.3, 8.2, 9.1, 9.2, 9.3, 10.3, 12.9 | Oui | Oui | Oui | Dialogue et navigation contrôlés |
| HeaderLoading | structure non standard | Oui | Oui | Oui | Annonce de chargement contrôlée ; classeur atypique requalifié |
| HeaderNavigationBar | structure non standard | Oui | Oui | Oui | Landmark et liens contrôlés ; classeur atypique requalifié |
| HeaderToolbar | 3.1, 7.1, 7.3, 8.2, 9.2, 10.4, 10.11 | Oui | Oui | Oui | Navigation et contrôles ajoutés |
| LangBtn | 3.2, 3.3, 7.1, 7.3, 8.2, 8.7 | Oui | Oui | Oui | Contrôles du bouton de langue ajoutés |
| Logo | aucun critère spécifique extrait | Oui | Oui | Oui | Nom accessible contrôlé |
| LogoBrandSection | 1.2, 1.3, 6.1, 8.2, 10.1, 10.11 | Oui | Oui | Oui | Marque, titre et rendu contrôlés |
| MaintenancePage | 1.2, 8.2 | Oui | Oui | Oui | Titre et message contrôlés |
| NirField | 3.3, 7.1, 8.2, 11.7, 11.10, 11.11 | Oui | Oui | Oui | Libellage et saisie contrôlés |
| NotFoundPage | aucun critère spécifique extrait | Oui | Oui | Oui | Titre et action contrôlés |
| NotificationBar | 7.1, 7.5, 10.11 | Oui | Oui | Oui | Rôle status contrôlé |
| PageContainer | 3.2 | Oui | Oui | Oui | Contenu disponible contrôlé ; contraste réel à compléter selon contenu |
| PasswordField | 1.2, 7.1, 11.10, 11.11, 11.13 | Oui | Oui | Oui | Libellage et type contrôlés |
| PhoneField | 1.2, 3.2, 7.1, 7.3, 7.5, 8.7, 8.8, 10.1, 11.5, 11.6, 11.7, 11.10, 11.11, 11.13 | Oui | Oui | Oui | Type téléphone et libellage contrôlés |
| RangeField | 3.3, 7.1, 8.2, 10.1, 10.7 | Oui | Oui | Oui | Fieldset, légende et champs contrôlés |
| RatingPicker | 1.2, 3.3, 7.1, 7.3, 7.5, 8.2, 10.7, 10.8 | Oui | Oui | Oui | Groupe et options clavier contrôlés |
| SearchListField | 7.1, 7.5, 8.2, 10.11, 11.2, 11.5, 11.6, 11.7, 11.10 | Oui | Oui | Oui | Saisie et liste contrôlées |
| SelectBtnField | 1.2, 3.3, 7.1, 7.3, 8.2, 10.7, 10.11, 10.12 | Oui | Oui | Oui | Contrôle de sélection contrôlé |
| SkipLink | structure non standard | Oui | Oui | Oui | Lien d’évitement et focus contrôlés |
| SocialMediaLinks | 1.2, 3.3, 9.1, 10.7, 10.12 | Oui | Oui | Oui | Contrats, contraste et focus ciblés validés |
| SubHeader | 1.2, 3.2, 7.1, 9.2, 9.3, 10.11, 10.12 | Oui | Oui | Oui | Titre et structure contrôlés |
| SyBtnMenu | 1.2, 3.3, 7.1, 8.2, 9.3, 10.7, 10.11 | Oui | Oui | Oui | Bouton de menu contrôlé |
| SyCheckbox | 1.2, 3.3, 7.1, 7.3, 8.2, 9.3, 10.7, 11.10 | Oui | Oui | Oui | Association label/checkbox contrôlée |
| SySelect | 1.2, 7.1, 7.3, 8.2, 11.13 + lignes atypiques | Oui | Oui | Oui | Combobox contrôlée ; lignes atypiques requalifiées |
| SyTextField | structure non standard | Oui | Oui | Oui | Champ nommé contrôlé ; classeur atypique requalifié |
| ToolbarContainer | 1.2, 3.3, 7.1, 7.3, 10.7 | Oui | Oui | Oui | Toolbar et contrôles clavier contrôlés |

## Réponse factuelle

Les 45 composants ont maintenant le même socle de traçabilité : critères issus du XLSX, rapport dédié, test DOM RGAA et scénario Cypress d’audit. Ils n’ont pas exactement la même profondeur fonctionnelle, car un champ, une navigation, une image et une page d’erreur n’exposent pas les mêmes critères.

La suite Cypress complète a reproduit deux écarts produit connus : le débordement de `BackBtn` à 320 px et l’indicateur de focus non détectable de `BackToTopBtn`. Ces écarts restent volontairement rouges jusqu’à correction.

## Distinction CI / audit

- Tests CI : `pnpm test:a11y:ci`, qui exclut les fichiers `*.rgaa.a11y.spec.ts`.
- Tests d’audit DOM : `pnpm test:a11y:audit`, qui cible les fichiers `*.rgaa.a11y.spec.ts`.
- Tests d’audit navigateur : `pnpm test:visual:audit`, qui cible les fichiers `*.rgaa.cy.ts`.

Le zoom navigateur à 200 %, les lecteurs d’écran et certaines vérifications de restitution restent des contrôles manuels documentés dans les rapports.
