# Investigation : Famille Menu

## Composants concernés

- ContextualMenu
- UserMenuBtn
- AmeliproMenu
- UserMenu

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les menus.

## Synthèse des props, slots et événements

| Composant        | Props principales (extraits)                                                                 | Slots principaux           | Événements principaux           |
|------------------|---------------------------------------------------------------------------------------------|----------------------------|---------------------------------|
| ContextualMenu   | ariaLabel, items                                                                            | (aucun slot nommé)         | (aucun événement émis)          |
| UserMenuBtn      | menuItems, additionalInformation, fullName, hideLogoutBtn, isMobileView, hideUserIcon, logoutText | default                   | logout                          |
| AmeliproMenu     | homeHref, homeTo, items, menuHeader, uniqueId                                               | (aucun slot nommé)         | escape                          |
| UserMenu         | icon, lastConnexion, uniqueId, userMenuInfos                                                | default, complementaryInfo, structureMenu | click:account, click:logout |

## Proposition de fusion/enrichissement

- **Fusionner la logique de menu** : Créer un composant universel, paramétrable par props et slots pour couvrir les besoins Amelipro et génériques (items, header, actions, accessibilité, responsive, etc.).
- **Modulariser les fonctionnalités** : Utiliser des slots nommés et des props avancées pour permettre la personnalisation (contenu, actions, navigation, etc.).
- **Supprimer les doublons** : Après migration des usages, supprimer les composants spécifiques devenus inutiles.
- **Documenter les cas d’usage spécifiques** : Si certains usages Amelipro sont très spécifiques, les intégrer comme options ou extensions du composant universel.

## Détails techniques, similitudes et différences

### ContextualMenu

- **Props** : gestion des items, accessibilité
- **Slots** : aucun slot nommé
- **Événements** : aucun événement émis
- **Fonctionnalités** : menu contextuel, organisation des items, navigation

### UserMenuBtn

- **Props** : gestion des items, informations utilisateur, affichage mobile, personnalisation
- **Slots** : default
- **Événements** : logout
- **Fonctionnalités** : menu utilisateur, bouton de déconnexion, responsive

### AmeliproMenu

- **Props** : gestion des items, header, liens d’accueil, identifiant unique
- **Slots** : aucun slot nommé
- **Événements** : escape
- **Fonctionnalités** : menu latéral, navigation, gestion du focus, responsive

### UserMenu

- **Props** : icon, lastConnexion, uniqueId, userMenuInfos
- **Slots** : default, complementaryInfo, structureMenu
- **Événements** : click:account, click:logout
- **Fonctionnalités** : menu utilisateur, affichage des infos, gestion des boutons compte/déconnexion, responsive

---

### Synthèse des points communs

- Gestion des items de menu via props
- Personnalisation avancée
- Responsive

### Synthèse des différences

- UserMenuBtn propose un slot et un événement logout
- AmeliproMenu gère le focus et l’accessibilité, propose un événement escape
- UserMenu propose plusieurs slots et deux événements (compte/déconnexion)
- ContextualMenu organise les items en profondeur
- Style et tokens propres à chaque famille

---

Historique :

- 05/09/2025 : Initialisation du rapport famille Menu.
- 05/09/2025 : Extraction automatique des props/slots, synthèse tabulaire et analyse technique documentées.
- 05/09/2025 : Correction : fusion UserMenu/AmeliproUserMenu.
