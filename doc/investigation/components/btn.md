# Investigation : Famille Btn

## Composants concernés

- BackBtn
- CopyBtn
- DownloadBtn
- FranceConnectBtn
- LangBtn
- UserMenuBtn
- AmeliproBtn

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement entre ces composants.

## Synthèse des props, slots et événements

| Composant         | Props principales                                                                                                   | Slots principaux         | Événements principaux |
|-------------------|--------------------------------------------------------------------------------------------------------------------|--------------------------|----------------------|
| BackBtn           | hideBackIcon, dark, backgroundColor                                                                                | icon, default            | —                    |
| CopyBtn           | ariaLabel, ariaOwns, textToCopy, hideTooltip, tooltipDuration, separatorsToRemove, options (customisable)           | default, icon            | —                    |
| DownloadBtn       | filePromise, fallbackFilename, backgroundColor, dark, locales, options (customisable)                               | default                  | error, success       |
| FranceConnectBtn  | href, isConnectPlus, dark                                                                                          | default                  | —                    |
| LangBtn           | modelValue, hideDownArrow, ariaLabel, ariaOwns, availableLanguages, options (customisable)                          | default, icon            | update:modelValue, change |
| UserMenuBtn       | menuItems, additionalInformation, fullName, hideLogoutBtn, isMobileView, hideUserIcon, logoutText, options (customisable) | append-icon, footer-list-item, default | logout               |
| AmeliproBtn       | badge, badgeBgColor, badgeColor, bordered, classes, color, disabled, hoverColor, hoverUnderline, iconBgColor, iconBordered, iconColor, iconFocusColor, iconHoverColor, options (customisable) | default, icon, badge     | —                    |

## Détails techniques, similitudes et différences

### Points communs

- Tous utilisent un composant bouton (VBtn ou équivalent).
- Props de personnalisation fréquentes : couleur, icône, état (dark/light), accessibilité.
- Slots pour personnaliser le contenu ou l’icône.
- Certains boutons exposent des événements spécifiques (ex : download, logout, update:modelValue).

### Différences

- Certains boutons sont très spécialisés (DownloadBtn, FranceConnectBtn, UserMenuBtn).
- AmeliproBtn est le plus personnalisable (badge, icône, couleur, etc.).
- Les événements sont présents uniquement sur les boutons à logique métier (DownloadBtn, UserMenuBtn, LangBtn).
- Les props varient fortement selon le contexte métier (ex : menuItems pour UserMenuBtn, filePromise pour DownloadBtn).

---

Historique :

- 05/09/2025 : Synthèse technique famille Btn.
