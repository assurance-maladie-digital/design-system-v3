# Investigation : Famille Accordion

## Composants concernés

- [Accordion](../../../src/components/Accordion/Accordion.vue) [Générique]
- [AmeliproAccordion](../../../src/components/Amelipro/AmeliproAccordion/AmeliproAccordion.vue) [Amelipro]
- [AmeliproAccordionList](../../../src/components/Amelipro/AmeliproAccordionList/AmeliproAccordionList.vue) [Amelipro]
- [AmeliproAccordionGroup](../../../src/components/Amelipro/AmeliproAccordionGroup/AmeliproAccordionGroup.vue) [Amelipro]
- [AmeliproAccordionResult](../../../src/components/Amelipro/AmeliproAccordionResult/AmeliproAccordionResult.vue) [Amelipro]
- [AmeliproAccordionResultList](../../../src/components/Amelipro/AmeliproAccordionResultList/AmeliproAccordionResultList.vue) [Amelipro]

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement entre ces composants.

## Synthèse des props, slots et événements

| Composant        | Lien vers le composant                                                                                  | Type        | Props principales                                                                                                   | Slots principaux         | Événements principaux |
|------------------|--------------------------------------------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------------------------|--------------------------|----------------------|
| [Accordion](../../../src/components/Accordion/Accordion.vue) | Générique    | items, headingLevel, groupId, vuetifyOptions, CustomizableOptions                                                   | default, item, header    | click, keydown       |
| [AmeliproAccordion](../../../src/components/Amelipro/AmeliproAccordion/AmeliproAccordion.vue) | Amelipro    | accordionTitle, borderColor, bordered, cardColor, headerRightWidth, hideSeparator, isOpen, titleLevel, titleUppercase, uniqueId | default, headerRight     | open-close           |
| [AmeliproAccordionList](../../../src/components/Amelipro/AmeliproAccordionList/AmeliproAccordionList.vue) | Amelipro    | counterLabel, defaultItemOpened, groupBorderColor, groupBordered, groupColor, hiddenLabels, hideSeparator, items, itemsToDisplayDesktop, itemsToDisplayMobile, noResultListInfos, paginationSelectLabel, paginationSelectPlaceholder, sortSelectItems, sortSelectLabel, sortSelectPlaceholder, title, titleLevel | default, template        | pagination, ouverture|
| [AmeliproAccordionGroup](../../../src/components/Amelipro/AmeliproAccordionGroup/AmeliproAccordionGroup.vue) | Amelipro    | defaultItemOpened, groupBorderColor, groupBordered, groupColor, groupTitleLevel, groupTitleUppercase, headerRightWidth, hideSeparator, items, uniqueId | default, template        | change               |
| [AmeliproAccordionResult](../../../src/components/Amelipro/AmeliproAccordionResult/AmeliproAccordionResult.vue) | Amelipro    | borderColor, bordered, cardColor, hideSeparator, isOpen, uniqueId                                                   | headingContent, accordionContent | open-close           |
| [AmeliproAccordionResultList](../../../src/components/Amelipro/AmeliproAccordionResultList/AmeliproAccordionResultList.vue) | Amelipro    | counterLabel, defaultItemOpened, groupBorderColor, groupBordered, groupColor, hiddenLabels, hideSeparator, items, itemsToDisplayDesktop, itemsToDisplayMobile, noResultListInfos, paginationSelectLabel, paginationSelectPlaceholder, sortSelectItems, sortSelectLabel, sortSelectPlaceholder, title, uniqueId | default, template        | pagination, ouverture|

## Détails techniques, similitudes et différences

### [Accordion](../../../src/components/Accordion/Accordion.vue)

- **Props** : items, headingLevel, groupId, vuetifyOptions, CustomizableOptions
- **Slots** : default, item, header
- **Événements** : click, keydown
- **Fonctionnalités** : Accordéon générique, personnalisable, gestion du focus, navigation clavier, support de groupes, options Vuetify.

### [AmeliproAccordion](../../../src/components/Amelipro/AmeliproAccordion/AmeliproAccordion.vue)

- **Props** : accordionTitle, borderColor, bordered, cardColor, headerRightWidth, hideSeparator, isOpen, titleLevel, titleUppercase, uniqueId
- **Slots** : default, headerRight
- **Événements** : open-close
- **Fonctionnalités** : Accordéon métier Amelipro, personnalisation visuelle, gestion ouverture/fermeture, slot header personnalisé.

### [AmeliproAccordionList](../../../src/components/Amelipro/AmeliproAccordionList/AmeliproAccordionList.vue)

- **Props** : counterLabel, defaultItemOpened, groupBorderColor, groupBordered, groupColor, hiddenLabels, hideSeparator, items, itemsToDisplayDesktop, itemsToDisplayMobile, noResultListInfos, paginationSelectLabel, paginationSelectPlaceholder, sortSelectItems, sortSelectLabel, sortSelectPlaceholder, title, titleLevel
- **Slots** : default, template
- **Événements** : pagination, ouverture
- **Fonctionnalités** : Liste d’accordéons paginée, tri, gestion des labels, personnalisation avancée.

### [AmeliproAccordionGroup](../../../src/components/Amelipro/AmeliproAccordionGroup/AmeliproAccordionGroup.vue)

- **Props** : defaultItemOpened, groupBorderColor, groupBordered, groupColor, groupTitleLevel, groupTitleUppercase, headerRightWidth, hideSeparator, items, uniqueId
- **Slots** : default, template
- **Événements** : change
- **Fonctionnalités** : Groupe d’accordéons, gestion de l’ouverture par défaut, personnalisation visuelle et structurelle.

### [AmeliproAccordionResult](../../../src/components/Amelipro/AmeliproAccordionResult/AmeliproAccordionResult.vue)

- **Props** : borderColor, bordered, cardColor, hideSeparator, isOpen, uniqueId
- **Slots** : headingContent, accordionContent
- **Événements** : open-close
- **Fonctionnalités** : Accordéon de résultat, personnalisation du header et du contenu, gestion ouverture/fermeture.

### [AmeliproAccordionResultList](../../../src/components/Amelipro/AmeliproAccordionResultList/AmeliproAccordionResultList.vue)

- **Props** : counterLabel, defaultItemOpened, groupBorderColor, groupBordered, groupColor, hiddenLabels, hideSeparator, items, itemsToDisplayDesktop, itemsToDisplayMobile, noResultListInfos, paginationSelectLabel, paginationSelectPlaceholder, sortSelectItems, sortSelectLabel, sortSelectPlaceholder, title, uniqueId
- **Slots** : default, template
- **Événements** : pagination, ouverture
- **Fonctionnalités** : Liste d’accordéons de résultats paginée, tri, gestion des labels, personnalisation avancée.

---

### Synthèse des points communs

- Tous les composants sont des accordéons, avec gestion de l’ouverture/fermeture, personnalisation visuelle et structurelle.
- Slots pour personnaliser le contenu, le header, les listes.
- Les composants Amelipro sont spécialisés pour des usages métier (pagination, tri, résultats, etc.).

### Synthèse des différences

- Accordion est générique et personnalisable, les autres sont spécialisés Amelipro.
- Les fonctionnalités avancées (pagination, tri, gestion des résultats) sont propres aux composants Amelipro.

---

Historique

- 05/09/2025 : Synthèse technique famille Accordion, harmonisation liens et détails techniques.
