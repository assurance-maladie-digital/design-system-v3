# Investigation : Famille Card

## Composants concernés

- [AmeliproCard](../../../src/components/Amelipro/AmeliproCard/AmeliproCard.vue) [Amelipro]
- [AmeliproMultipleFoldingCard](../../../src/components/Amelipro/AmeliproMultipleFoldingCard/AmeliproMultipleFoldingCard.vue) [Amelipro]
- [AmeliproNumberedCard](../../../src/components/Amelipro/AmeliproNumberedCard/AmeliproNumberedCard.vue) [Amelipro]
- [VCard (usage générique)](../../../src/components/Tables/common/organizeColumns/OrganizeColumns.vue) [Générique]

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement entre ces composants.

## Synthèse des props, slots et événements

| Composant                        | Chemin relatif                                                                 | Type        | Props principales                                                                                   | Slots principaux         | Événements principaux |
|----------------------------------|-------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------------|--------------------------|----------------------|
| [AmeliproCard](../../../src/components/Amelipro/AmeliproCard/AmeliproCard.vue)                     | ../../../src/components/Amelipro/AmeliproCard/AmeliproCard.vue                         | Amelipro    | borderColor, bordered, cardColor, cardTitle, classes, contentClasses, divider, headerRightWidth, noCardHeader, rightPart, rightPartClasses, rightPartWidth, titleColor, titleLevel | default, header, right   | —                    |
| [AmeliproMultipleFoldingCard](../../../src/components/Amelipro/AmeliproMultipleFoldingCard/AmeliproMultipleFoldingCard.vue)      | ../../../src/components/Amelipro/AmeliproMultipleFoldingCard/AmeliproMultipleFoldingCard.vue | Amelipro    | borderColor, bordered, cardColor, defaultItemOpened, headerRightWidth, manualValidation, tabs, title, titleLevel, titleUppercase, uniqueId | default, header, tab     | tab-clicked          |
| [AmeliproNumberedCard](../../../src/components/Amelipro/AmeliproNumberedCard/AmeliproNumberedCard.vue)             | ../../../src/components/Amelipro/AmeliproNumberedCard/AmeliproNumberedCard.vue         | Amelipro    | borderColor, bordered, cardColor, contentClasses, items, itemsPerLine, uniqueId                      | default, item            | —                    |
| [VCard (usage générique)](../../../src/components/Tables/common/organizeColumns/OrganizeColumns.vue)          | ../../../src/components/Tables/common/organizeColumns/OrganizeColumns.vue (exemple)    | Générique   | min-width, ... (props Vuetify)                                                                      | default, title, list     | —                    |

## Détails techniques, similitudes et différences

### [AmeliproCard](../../../src/components/Amelipro/AmeliproCard/AmeliproCard.vue)

- Props : ...
- Slots : ...
- Événements : ...
- Fonctionnalités : ...

### [AmeliproMultipleFoldingCard](../../../src/components/Amelipro/AmeliproMultipleFoldingCard/AmeliproMultipleFoldingCard.vue)

- Props : ...
- Slots : ...
- Événements : ...
- Fonctionnalités : ...

### [AmeliproNumberedCard](../../../src/components/Amelipro/AmeliproNumberedCard/AmeliproNumberedCard.vue)

- Props : ...
- Slots : ...
- Événements : ...
- Fonctionnalités : ...

### [VCard (usage générique)](../../../src/components/Tables/common/organizeColumns/OrganizeColumns.vue)

- Props : ...
- Slots : ...
- Événements : ...
- Fonctionnalités : ...

---

### Synthèse des points communs

- Tous les composants sont des cartes visuelles, souvent basées sur VCard (Vuetify).
- Props de personnalisation fréquentes : couleur, bordure, titre, contenu.
- Slots pour personnaliser le contenu, le header, les items.
- Les composants Amelipro sont spécialisés pour des usages métier (multi-pli, numérotation, etc.).

### Synthèse des différences

- Les composants AmeliproCard, AmeliproMultipleFoldingCard et AmeliproNumberedCard sont tous dans le dossier Amelipro.
- VCard est utilisé comme base générique dans plusieurs composants, mais n’a pas de logique métier propre.
- Seul AmeliproMultipleFoldingCard expose un événement métier (tab-clicked).

---

Historique :

- 05/09/2025 : Synthèse technique famille Card, ajout des chemins et types.
