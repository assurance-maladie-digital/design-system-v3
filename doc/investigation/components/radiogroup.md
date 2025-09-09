# Investigation : Famille RadioGroup

## Composants concernés

- [AmeliproRadioGroup](../../../src/components/Amelipro/AmeliproRadioGroup/AmeliproRadioGroup.vue) [Amelipro]

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les groupes de boutons radio.

## Synthèse des props, slots et événements

| Composant           | Lien vers le composant                                                                                  | Type        | Props principales                                                                                                   | Slots principaux         | Événements principaux |
|---------------------|--------------------------------------------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------------------------|--------------------------|----------------------|
| [AmeliproRadioGroup](../../../src/components/Amelipro/AmeliproRadioGroup/AmeliproRadioGroup.vue) | Amelipro    | ariaRequired, disabled, error, fullHorizontal, groupLabel, hiddenLabel, horizontal, horizontalLabel, modelValue, pills, requiredErrorMessage, uniqueId | groupLabel, labelInfo, append, subItem, append-N, subItem-N | update:model-value, change:selected |

## Détails techniques, similitudes et différences

### AmeliproRadioGroup

- **Props** : ariaRequired, disabled, error, fullHorizontal, groupLabel, hiddenLabel, horizontal, horizontalLabel, modelValue (tableau d’items), pills, requiredErrorMessage, uniqueId
- **Slots** : groupLabel, labelInfo, append, subItem, append-N, subItem-N
- **Événements** : update:model-value, change:selected
- **Fonctionnalités** : Groupe de boutons radio métier, gestion de l’accessibilité (aria, label, erreurs), affichage horizontal/vertical, support des sous-items, personnalisation du rendu (pills/classic), gestion des erreurs via AmeliproMessage.

---

### Synthèse des points communs

- Un seul composant métier, aucune redondance détectée.
- Gestion complète de l’accessibilité et de la validation.

### Synthèse des différences

- N/A

---

Historique :

- 05/09/2025 : Synthèse technique famille RadioGroup, ajout des liens et détails techniques.
