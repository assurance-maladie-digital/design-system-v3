# Investigation : Famille Select

## Composants concernés

- [AmeliproSelect](../../../src/components/Amelipro/AmeliproSelect/AmeliproSelect.vue) [Amelipro]
- [SyBtnSelect](../../../src/components/Customs/Selects/SyBtnSelect/SyBtnSelect.vue) [Customs]
- [SyInputSelect](../../../src/components/Customs/Selects/SyInputSelect/SyInputSelect.vue) [Customs]
- [SySelect](../../../src/components/Customs/Selects/SySelect/SySelect.vue) [Customs]

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les composants Select.

## Synthèse des props, slots et événements

| Composant        | Lien vers le composant                                                                                  | Type        | Props principales                                                                                                   | Slots principaux         | Événements principaux |
|------------------|--------------------------------------------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------------------------|--------------------------|----------------------|
| [AmeliproSelect](../../../src/components/Amelipro/AmeliproSelect/AmeliproSelect.vue) | Amelipro    | ariaRequired, classes, clearable, disabled, fullWidthErrorMsg, globalMaxWidth, globalMinWidth, globalWidth, hideErrorMessage, horizontal, inputMaxWidth, inputMinWidth, items, label, labelMaxWidth, labelMinWidth, modelValue, placeholder, readonly, rules, uniqueId, validateOn | labelInfo, append, message | update:model-value   |
| [SyBtnSelect](../../../src/components/Customs/Selects/SyBtnSelect/SyBtnSelect.vue)   | Customs     | modelValue, menuItems, label, required, menuId, textKey, valueKey, primaryInfo, secondaryInfo, hideIcon, hideLogoutBtn, isMobileView, iconOnly, options | append-icon, footer-list-item, default | —                    |
| [SyInputSelect](../../../src/components/Customs/Selects/SyInputSelect/SyInputSelect.vue) | Customs     | modelValue, items, textKey, valueKey, label, outlined, required, errorMessages, isHeaderToolbar, displayAsterisk, readonly, clearable, customRules, disableErrorHandling, bgColor, options | default, icon            | update:modelValue, update:errorMessages |
| [SySelect](../../../src/components/Customs/Selects/SySelect/SySelect.vue)            | Customs     | modelValue, items, label, errorMessages, required, disabled, menuId, outlined, textKey, valueKey, options          | default, icon, chip, menu, item, selection, append, prepend, message | update:modelValue, update:errorMessages |

## Détails techniques, similitudes et différences

### AmeliproSelect

- **Props** : ariaRequired, classes, clearable, disabled, fullWidthErrorMsg, globalMaxWidth, globalMinWidth, globalWidth, hideErrorMessage, horizontal, inputMaxWidth, inputMinWidth, items, label, labelMaxWidth, labelMinWidth, modelValue, placeholder, readonly, rules, uniqueId, validateOn
- **Slots** : labelInfo, append, message
- **Événements** : update:model-value
- **Fonctionnalités** : Sélecteur métier Amelipro, gestion de l’accessibilité (aria, suppression des labels natifs), validation personnalisée, affichage des erreurs via AmeliproMessage, personnalisation du rendu (horizontal/vertical, largeur, etc.), support des items complexes.

### SyBtnSelect

- **Props** : modelValue, menuItems, label, required, menuId, textKey, valueKey, primaryInfo, secondaryInfo, hideIcon, hideLogoutBtn, isMobileView, iconOnly, options
- **Slots** : append-icon, footer-list-item, default
- **Événements** : update:modelValue, logout
- **Fonctionnalités** : Sélecteur sous forme de bouton, menu déroulant, gestion mobile, personnalisation des items, support d’icône et d’informations additionnelles, bouton de déconnexion.

### SyInputSelect

- **Props** : modelValue, items, textKey, valueKey, label, outlined, required, errorMessages, isHeaderToolbar, displayAsterisk, readonly, clearable, customRules, disableErrorHandling, bgColor, options
- **Slots** : default, icon
- **Événements** : update:modelValue, update:errorMessages
- **Fonctionnalités** : Sélecteur type input, validation personnalisée, gestion des erreurs, personnalisation du rendu, support d’icône, affichage d’astérisque, gestion du mode lecture seule.

### SySelect

- **Props** : modelValue, items, label, errorMessages, required, disabled, menuId, outlined, textKey, plainTextKey, valueKey, displayAsterisk, returnObject, disableErrorHandling, options
- **Slots** : default, icon, chip, menu, item, selection, append, prepend, message
- **Événements** : update:modelValue, update:errorMessages
- **Fonctionnalités** : Sélecteur avancé, support multi-sélection, personnalisation complète du rendu (items, chips, menu, etc.), gestion des erreurs, validation, options avancées, accessibilité.

---

### Synthèse des points communs

- Tous les composants sont des sélecteurs personnalisés, avec props pour items, label, valeur, état, etc.
- Slots pour personnaliser le rendu (label, append, message, etc.).
- Les Customs Selects sont plus flexibles et adaptés à des usages variés (menu, input, bouton, etc.).

### Synthèse des différences

- AmeliproSelect est dédié à l’écosystème Amelipro, avec gestion métier et accessibilité renforcée.
- Les Customs Selects (SyBtnSelect, SyInputSelect, SySelect) sont plus modulaires et réutilisables.
- Les événements varient selon le type de sélecteur (v-model, update, etc.).

---

Historique :

- 05/09/2025 : Synthèse technique famille Select, ajout des liens et types.
