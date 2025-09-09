# Investigation : Famille Header

## Composants concernés

- HeaderBar
- HeaderLoading
- HeaderNavigationBar
- HeaderToolbar
- AmeliproHeader

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les headers.

## Synthèse des props, slots et événements

| Composant             | Props principales (extraits)                                                                 | Slots principaux           | Événements principaux           |
|-----------------------|---------------------------------------------------------------------------------------------|----------------------------|---------------------------------|
| HeaderBar             | sticky, hideWhenDown, homeLink, homeAriaLabel, serviceTitle, serviceSubtitle                | prepend, append, menu, logo, logo-brand-content, header-side | (aucun événement émis)          |
| HeaderLoading         | width, height, statusMessageId, standalone, ariaLabel                                       | (aucun slot nommé)         | (aucun événement émis)          |
| HeaderNavigationBar   | homeAriaLabel, serviceTitle, serviceSubtitle, homeLink, sticky, hideWhenDown, maxHorizontalMenuItems, items, confirmTabChange, confirmationMessage | logo, logo-brand-content   | confirm-tab-change              |
| HeaderToolbar         | leftMenu, rightMenu                                                                         | left-menu                  | update:model-value, click, keyboard events |
| AmeliproHeader        | ameliproHeaderInfos, backBtnHref, backBtnLabel, backBtnTo, backoffice, headerTitle, homeHref, homeTo, homeTarget, uniqueId | userMenu, structureMenu, signatureMenu | (aucun événement émis)          |

## Proposition de fusion/enrichissement

- **Fusionner la logique de header** : Créer un composant universel, paramétrable par props et slots pour couvrir les besoins Amelipro et génériques (menus, logo, titres, accessibilité, responsive, etc.).
- **Modulariser les fonctionnalités** : Utiliser des slots nommés et des props avancées pour permettre la personnalisation (menus, logo, toolbar, loader, etc.).
- **Supprimer les doublons** : Après migration des usages, supprimer les composants spécifiques devenus inutiles.
- **Documenter les cas d’usage spécifiques** : Si certains usages Amelipro sont très spécifiques, les intégrer comme options ou extensions du composant universel.

## Détails techniques, similitudes et différences

### HeaderBar

- **Props** : gestion du sticky, affichage conditionnel, personnalisation du logo et des titres
- **Slots** : nombreux slots pour enrichir le contenu (menu, logo, prepend, append, etc.)
- **Événements** : aucun événement émis
- **Fonctionnalités** : header personnalisable, responsive, gestion du menu

### HeaderLoading

- **Props** : largeur, hauteur, accessibilité, affichage autonome
- **Slots** : aucun slot nommé
- **Événements** : aucun événement émis
- **Fonctionnalités** : affichage d’un loader pour le header

### HeaderNavigationBar

- **Props** : gestion du menu horizontal, personnalisation, confirmation de changement d’onglet
- **Slots** : logo, logo-brand-content
- **Événements** : confirm-tab-change
- **Fonctionnalités** : navigation horizontale, responsive

### HeaderToolbar

- **Props** : gestion des menus gauche/droite
- **Slots** : left-menu
- **Événements** : update:model-value, click, gestion clavier
- **Fonctionnalités** : toolbar personnalisable, gestion des menus

### AmeliproHeader

- **Props** : gestion fine des infos header (menus, boutons, titres, etc.), personnalisation avancée
- **Slots** : userMenu, structureMenu, signatureMenu
- **Événements** : aucun événement émis
- **Fonctionnalités** : header complet, gestion des menus, responsive, accessibilité

---

### Synthèse des points communs

- Personnalisation avancée via props et slots
- Gestion du menu, du logo, des titres
- Responsive et accessibilité
- Structure modulaire

### Synthèse des différences

- AmeliproHeader propose une gestion fine des menus et des infos utilisateur
- Les slots et événements diffèrent selon les composants
- HeaderLoading est dédié au skeleton/loader
- Style et tokens propres à chaque famille

---

Historique :

- 05/09/2025 : Initialisation du rapport famille Header.
- 05/09/2025 : Extraction automatique des props/slots, synthèse tabulaire et analyse technique documentées.
