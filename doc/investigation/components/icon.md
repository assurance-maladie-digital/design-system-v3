# Investigation : Famille Icon

## Composants concernés

- AmeliproIcon
- AmeliproIconBtn

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les icônes.

## Synthèse des props, slots et événements

| Composant        | Props principales (extraits)                                                                 | Slots principaux           | Événements principaux           |
|------------------|---------------------------------------------------------------------------------------------|----------------------------|---------------------------------|
| AmeliproIcon     | icon, iconColor, iconBgColor, bordered, borderColor, size, large, medium, small, xLarge, widthAuto, uniqueId, label, mdiPadding | (aucun slot nommé)         | (aucun événement émis)          |
| AmeliproIconBtn  | icon, iconColor, iconBgColor, iconHoverColor, iconHoverBgColor, iconFocusColor, iconFocusBgColor, iconBorderColor, iconHoverBorderColor, iconFocusBorderColor, bordered, badge, badgeColor, badgeBgColor, btnLabel, btnTitle, href, to, uniqueId, large, medium, small, xLarge, size | icon (slot), prepend, append | (aucun événement émis)          |

## Proposition de fusion/enrichissement

- **Fusionner la logique d’icône** : Créer un composant universel, paramétrable par props et slots pour couvrir les besoins Amelipro et génériques (icône, bouton, badge, personnalisation, responsive, etc.).
- **Modulariser les fonctionnalités** : Utiliser des slots nommés et des props avancées pour permettre la personnalisation (icône, badge, actions, etc.).
- **Supprimer les doublons** : Après migration des usages, supprimer les composants spécifiques devenus inutiles.
- **Documenter les cas d’usage spécifiques** : Si certains usages Amelipro sont très spécifiques, les intégrer comme options ou extensions du composant universel.

## Détails techniques, similitudes et différences

### AmeliproIcon

- **Props** : gestion de l’icône, couleur, fond, bordure, taille, accessibilité
- **Slots** : aucun slot nommé
- **Événements** : aucun événement émis
- **Fonctionnalités** : affichage d’une icône personnalisée, gestion du style, responsive

### AmeliproIconBtn

- **Props** : gestion de l’icône, couleur, fond, bordure, hover/focus, badge, label, lien, taille, accessibilité
- **Slots** : `icon`, `prepend`, `append`
- **Événements** : aucun événement émis
- **Fonctionnalités** : bouton avec icône personnalisée, gestion du badge, personnalisation avancée, responsive

---

### Synthèse des points communs

- Personnalisation avancée via props
- Gestion du style, couleur, taille, bordure
- Responsive et accessibilité

### Synthèse des différences

- AmeliproIconBtn propose des slots pour enrichir le contenu (icon, prepend, append)
- AmeliproIconBtn gère les états hover/focus et le badge
- Style et tokens propres à chaque famille

---

Historique :

- 05/09/2025 : Initialisation du rapport famille Icon.
- 05/09/2025 : Extraction automatique des props/slots, synthèse tabulaire et analyse technique documentées.
