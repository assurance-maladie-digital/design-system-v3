# Investigation : Famille Dialog

## Composants concernés

- DialogBox (générique)
- AmeliproDialog

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les dialogs.

## Synthèse des props, slots et événements

| Composant      | Props principales (extraits)                                                                 | Slots principaux           | Événements principaux           |
|----------------|---------------------------------------------------------------------------------------------|----------------------------|---------------------------------|
| DialogBox      | title, width, cancelBtnText, confirmBtnText, hideActions, persistent, autofocusValidateBtn   | default, title, actions    | cancel, confirm, update:modelValue |
| AmeliproDialog | attach, cancelBtnLabel, eager, fullscreen, hiddenCancelBtn, labelledby, mainContentMaxHeight, mainContentMinHeight, modelValue, noClickOutside, noFooter, persistent, title, uniqueId, validationBtnLabel, width | header, default, footer    | change, confirm, update:model-value |

## Proposition de fusion/enrichissement

- **Fusionner la logique de dialog** : Créer un composant universel, paramétrable par props pour couvrir les besoins Amelipro et génériques (options d’affichage, accessibilité, personnalisation, responsive, etc.).
- **Modulariser les fonctionnalités** : Utiliser des slots nommés et des props avancées pour permettre la personnalisation (header, footer, actions, contenu principal).
- **Supprimer les doublons** : Après migration des usages, supprimer les composants spécifiques devenus inutiles.
- **Documenter les cas d’usage spécifiques** : Si certains usages Amelipro sont très spécifiques, les intégrer comme options ou extensions du composant universel.

## Détails techniques, similitudes et différences

### DialogBox

- **Props** : titre, largeur, textes des boutons, options d’affichage/actions, personnalisation via CustomizableOptions
- **Slots** : `default`, `title`, `actions`
- **Événements** : `cancel`, `confirm`, `update:modelValue`
- **Fonctionnalités** : gestion du focus, accessibilité, personnalisation avancée, actions custom, responsive

### AmeliproDialog

- **Props** : gestion fine de l’affichage (fullscreen, attach, eager, etc.), accessibilité (`labelledby`, `uniqueId`), personnalisation des boutons, gestion du contenu principal (hauteur min/max), options d’affichage (footer, persistent, etc.)
- **Slots** : `header`, `default`, `footer`
- **Événements** : `change`, `confirm`, `update:model-value`
- **Fonctionnalités** : gestion du focus, accessibilité, personnalisation avancée, actions custom, responsive

---

### Synthèse des points communs

- Gestion du focus et de l’accessibilité
- Personnalisation des boutons et du contenu
- Slots pour le contenu, le header et les actions
- Événements pour la validation, l’annulation et la mise à jour de l’état

### Synthèse des différences

- AmeliproDialog propose plus d’options d’affichage (fullscreen, attach, eager, etc.)
- DialogBox utilise des options de personnalisation via CustomizableOptions
- Les noms d’événements diffèrent légèrement (`update:modelValue` vs `update:model-value`)
- Les slots sont similaires mais pas identiques (`actions` vs `footer`)
- Style et tokens propres à chaque famille

---

Historique :

- 05/09/2025 : Initialisation du rapport famille Dialog.
- 05/09/2025 : Extraction automatique des props/slots, synthèse tabulaire et analyse technique documentées.
