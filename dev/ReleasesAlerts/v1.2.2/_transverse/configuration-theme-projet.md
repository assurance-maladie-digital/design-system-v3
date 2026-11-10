# Configuration de thème projet — nouveaux exports et paramètre optionnel (ajout au contrat, non cassant)

`createVuetifyOptions` (`@cnamts/synapse/vuetifyOptions`) et `createVuetifyInstance` (`@cnamts/synapse/vuetifyConfig`) acceptent un paramètre optionnel : un objet de configuration qui ajuste un nombre limité de réglages.

| Réglage | Valeurs | Défaut |
|---|---|---|
| `brand` | `cnam`, `pa`, `ap` | `cnam` |
| `focus.width` | 2 à 4 (px) | 2 |
| `focus.offset` | 0 à 4 (px) | 3 |
| `focus.color` | `primary`, `pinkDarken20` (contraste ≥ 3:1 exigé) | `primary` |
| `fields.density` | `default`, `comfortable`, `compact` | `default` |

Un réglage hors bornes ou non accessible est refusé : il est signalé en développement et remplacé par sa valeur par défaut.

Nouveaux exports :

- `@cnamts/synapse/vuetifyOptions` : `checkThemeConfig`, pour valider une configuration en CI avec les couleurs réelles de la marque ;
- `@cnamts/synapse` : `validateThemeConfig`, `applyThemeConfig`, `resolveThemeConfig`, `getContrastRatio`, `defaultThemeConfig`, les constantes (`SYNAPSE_BRANDS`, `FOCUS_COLORS`, `FIELD_DENSITIES`, bornes du focus, `FIELDS_DEFAULTS_KEY`), le composable `useFieldsThemeConfig` et les types (`SynapseThemeConfigInput`, `SynapseThemeConfig`, `ThemeConfigIssue`…).

Quand le projet renseigne `fields.density`, les champs Synapse l'appliquent aussi : `SyTextField`, `SyTextArea`, `SySelect`, `SyAutocomplete`, `PasswordField`, `NirField`, `PhoneField`, `LunarCalendar`, `SearchListField`, `DatePicker` et `PeriodField`. Une prop `density` passée explicitement sur un champ reste prioritaire. Le style des champs (contour) n'est pas configurable. `SyInputSelect` (rendu en bouton) et les composants Amelipro ne sont pas concernés.

Sans configuration, le rendu est identique à la version précédente.

## Conduite à tenir

- Aucune si vous n'utilisez pas la configuration.
- Pour l'adopter, composez votre fichier avec le configurateur de la page *Guide Du Dev / Démarrage / Customisation du thème*, enregistrez-le en `src/synapse.theme.ts`, puis passez-le à `createVuetifyOptions(themeConfig)` :

```ts
// src/synapse.theme.ts
import type { SynapseThemeConfigInput } from '@cnamts/synapse/vuetifyOptions'

export default {
  brand: 'pa',
  focus: { width: 3 },
} satisfies SynapseThemeConfigInput
```

```ts
import { createVuetify } from 'vuetify'
import { createVuetifyOptions } from '@cnamts/synapse/vuetifyOptions'
import themeConfig from './synapse.theme'

const vuetify = createVuetify(createVuetifyOptions(themeConfig))
```

- N'utilisez pas de fichier JSON : TypeScript type ses valeurs en `string` (`brand: string`), que `createVuetifyOptions` refuse au build. Le `.ts` avec `satisfies SynapseThemeConfigInput` garde les valeurs exactes et l'éditeur propose les valeurs autorisées.
- Pour bloquer une configuration refusée en CI, testez-la avec `checkThemeConfig(themeConfig)` (`@cnamts/synapse/vuetifyOptions`).
