# Configuration de thème projet — nouveaux exports et paramètre optionnel (ajout au contrat, non cassant)

`createVuetifyOptions` (`@cnamts/synapse/vuetifyOptions`) et `createVuetifyInstance` (`@cnamts/synapse/vuetifyConfig`) acceptent un paramètre optionnel : un objet de configuration qui ajuste un nombre limité de réglages.

| Réglage | Valeurs | Défaut |
|---|---|---|
| `brand` | `cnam`, `pa`, `ap` | `cnam` |
| `focus.width` | 2 à 4 (px) | 2 |
| `focus.offset` | 0 à 4 (px) | 3 |
| `focus.color` | `primary`, `pinkDarken20` (contraste ≥ 3:1 exigé) | `primary` |
| `fields.variant` | `outlined`, `filled`, `underlined` | `outlined` |
| `fields.density` | `default`, `comfortable`, `compact` | `default` |

Un réglage hors bornes ou non accessible est refusé : il est signalé en développement et remplacé par sa valeur par défaut.

Nouveaux exports :

- `@cnamts/synapse/vuetifyOptions` : `checkThemeConfig`, pour valider une configuration en CI avec les couleurs réelles de la marque ;
- `@cnamts/synapse` : `validateThemeConfig`, `applyThemeConfig`, `resolveThemeConfig`, `getContrastRatio`, `defaultThemeConfig`, les constantes (`SYNAPSE_BRANDS`, `FOCUS_COLORS`, `FIELD_VARIANTS`, `FIELD_DENSITIES`, bornes du focus, `FIELDS_DEFAULTS_KEY`), le composable `useFieldsThemeConfig` et les types (`SynapseThemeConfigInput`, `SynapseThemeConfig`, `ThemeConfigIssue`…).

Quand le projet renseigne `fields`, les champs Synapse l'appliquent aussi : `SyTextField`, `SyTextArea`, `SySelect`, `SyAutocomplete`, `PasswordField`, `NirField`, `PhoneField`, `LunarCalendar`, `SearchListField`, `DatePicker` et `PeriodField`. Une prop passée explicitement sur un champ (`variant-style`, `variant`, `outlined`, `is-outlined`, `density`) reste prioritaire. `SyInputSelect` (rendu en bouton) et les composants Amelipro ne sont pas concernés.

Sans configuration, le rendu est identique à la version précédente.

## Conduite à tenir

- Aucune si vous n'utilisez pas la configuration.
- Pour l'adopter, composez votre fichier avec le configurateur de la page *Guide Du Dev / Démarrage / Configuration de thème projet*, puis passez-le à `createVuetifyOptions(themeConfig)`.
