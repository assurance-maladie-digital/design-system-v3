# Rapport d’avancement — couverture RGAA des classeurs composants

Date : 27 novembre 2026  
Périmètre : classeurs `.xlsx` du dossier `.storybook/public/audits/` et tests du design system Synapse.

## Synthèse

Le périmètre contient **45 classeurs**. L’analyse croisée, la traçabilité et l’implémentation des contrôles exécutables sont terminées pour le périmètre des composants possédant un XLSX.

À ce stade :

- **45/45** classeurs inventoriés dans la matrice globale ;
- **45/45** composants disposent d’un rapport dédié croisant le XLSX et le code courant ;
- **45/45** composants disposent d’un test DOM RGAA dédié `*.rgaa.a11y.spec.ts` ;
- **45/45** composants disposent d’un contrôle navigateur dédié `*.rgaa.cy.ts` ;
- les contrôles de zoom 200 %, lecteur d’écran et restitution restent explicitement manuels.

## Couverture globale hors Amelipro

L’inventaire automatisé du dépôt couvre désormais **138/138 composants non-Amelipro** avec une paire de fichiers dédiée :

- `*.rgaa.a11y.spec.ts` pour les contrats DOM RGAA exécutables en test ciblé ;
- `*.rgaa.cy.ts` pour les contrôles navigateur d’audit sous thème CNAM.

Les quatre exemples DatePicker sont comptés comme intégrations documentaires : leurs tests vérifient la structure et la présence des contrôles documentés, tandis que les contrats détaillés du DatePicker sont portés par les trois variantes réelles.

## Composants traités en détail

### Avec tests DOM et navigateur

| Composant | Tests DOM | Tests navigateur | Résultat principal |
|---|---:|---:|---|
| Accordion | Oui | Oui | Contrats sémantiques et clavier validés ; anciennes alertes 7.1/8.2/9.1/10.8 documentées |
| BackBtn | Oui | Oui | 10.11 en échec avec un libellé long à 320 px |
| BackToTopBtn | Oui | Oui | 3.2 validé ; 3.3/10.7 en échec, ring de focus non détecté |
| CopyBtn | Oui | Oui | Contrastes et focus ciblés validés |
| DownloadBtn | Oui | Oui | Contrastes et focus ciblés validés |
| FranceConnectBtn | Oui | Oui | Contraste du lien d’information et focus validés |
| SocialMediaLinks | Oui | Oui | Contrastes et focus ciblés validés |
| SyAlert / Alert | Oui | Oui | Contraste, rôle d’alerte et fermeture ciblés validés |
| DataList | Oui | Oui | Espacement du texte validé |
| DialogBox | Oui | Oui | Modal, fermeture et focus ciblés validés |
| ExternalLinks | Oui | Oui | Contraste et ouverture du menu validés |

Les 34 autres composants disposent également d’un test DOM et d’un scénario Cypress dédié. Le niveau de profondeur varie selon le composant : les scénarios contrôlent le contrat RGAA le plus pertinent (nommage, landmark, formulaire, clavier, état dynamique ou reflow), tandis que les situations non automatisables restent manuelles.

## Validation exécutée

- Suite a11y CI : **99 fichiers, 444 tests réussis**. Les tests RGAA dédiés sont exclus de cette suite.
- Suite d’audit RGAA DOM : **45 fichiers, 77 tests réussis**.
- Contrôles navigateur RGAA : **45 fichiers, 59 scénarios ; 57 réussissent et 2 écarts produit restent reproduits**.

Les deux écarts navigateur sont conservés comme tests d’audit en échec afin de rendre les non-conformités visibles :

1. BackBtn — critère 10.11 : débordement horizontal avec un libellé long à 320 px.
2. BackToTopBtn — critères 3.3/10.7 : indicateur de focus non détectable.

## Classeurs à normaliser

Les fichiers suivants ne suivent pas encore le format d’extraction commun ou ne possèdent pas de résumé v2 exploitable :

- Cookies ;
- FooterBar ;
- HeaderLoading ;
- HeaderNavigationBar ;
- SkipLink ;
- SySelect ;
- SyTextField.

Leur contenu historique est conservé dans l’analyse globale, mais il ne doit pas être converti automatiquement en verdict actuel sans relecture.

## Architecture CI / audit mise en place

Les deux niveaux sont séparés :

- `pnpm test:a11y:ci` : garde-fou rapide, sans les tests RGAA dédiés ;
- `pnpm test:a11y:audit` : contrats RGAA détaillés, exécutés séparément ;
- `pnpm test:visual:audit` : scénarios Cypress RGAA navigateur.

Cette séparation permet de conserver des scénarios complets pour l’audit sans alourdir ni fragiliser la CI quotidienne.

## Reste à faire

1. Corriger puis revalider BackToTopBtn sur les critères 3.3/10.7.
2. Corriger puis revalider BackBtn sur le critère 10.11.
3. Rejouer les vérifications de zoom à 200 %, lecteur d’écran, clavier complet et combinaisons de contexte qui ne sont pas entièrement simulables par Cypress.
4. Corriger les deux écarts produit et supprimer les écarts uniquement après une nouvelle exécution réussie.

## Limite du statut actuel

Le périmètre automatisable est maintenant couvert composant par composant. Cela ne constitue pas une déclaration de conformité RGAA : les critères visuels, zoom 200 %, lecteur d’écran, restitution et dépendances d’intégration doivent encore être vérifiés manuellement.
