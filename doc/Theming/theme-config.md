# Configuration de thème projet

Un projet peut ajuster un nombre **limité** de réglages du DS via un objet de configuration.
Tout ce qui n'est pas listé ici reste verrouillé : c'est volontaire, pour garder un rendu cohérent entre les projets.

Source : `src/themeConfig/`.

## Utilisation

```ts
import { createVuetify } from 'vuetify'
import { createVuetifyOptions } from '@cnamts/synapse/vuetifyOptions'
import themeConfig from './synapse.theme.json'

app.use(createVuetify(createVuetifyOptions(themeConfig)))
```

Sans argument, `createVuetifyOptions()` garde exactement le rendu actuel. `createVuetifyInstance(themeConfig)` (`@cnamts/synapse/vuetifyConfig`) accepte le même objet.

## Réglages

| Réglage | Valeurs | Défaut | Effet |
|---|---|---|---|
| `brand` | `cnam`, `pa`, `ap` | `cnam` | Thème Vuetify par défaut (`ap2026`, thème de test, n'est pas proposé) |
| `focus.width` | 2 à 4 (px) | 2 | Épaisseur du ring de focus (boutons, liens, menus) |
| `focus.offset` | 0 à 4 (px) | 3 | Écart du ring des boutons (les liens gardent 2px, les menus leur ring intérieur) |
| `focus.color` | `primary`, `pinkDarken20` | `primary` | Couleur du ring ; contraste ≥ 3:1 avec `surface` exigé |
| `fields.variant` | `outlined`, `filled`, `underlined` | `outlined` | `variant` des champs Vuetify |
| `fields.density` | `default`, `comfortable`, `compact` | `default` | `density` des champs Vuetify |

Le focus est exposé en variables CSS sur tous les thèmes : `--v-focus-width`, `--v-focus-offset`, `--v-focus-color`.

### Champs concernés par `fields`

`fields` ne s'applique que si le projet le renseigne :

- champs Vuetify natifs (`VTextField`, `VTextarea`, `VSelect`, `VAutocomplete`, `VCombobox`, `VFileInput`), via leurs `defaults` ;
- champs Synapse (`SyTextField`, `SyTextArea`, `SySelect`, `SyAutocomplete`, `PasswordField`, `NirField`, `PhoneField`, `LunarCalendar`, `SearchListField`, `DatePicker`, `PeriodField`), via le composable `useFieldsThemeConfig`.

Les champs Synapse passent leur `variant` explicitement à Vuetify : les `defaults` ne les atteignent pas. `applyThemeConfig` range donc aussi les réglages sous la clé `FIELDS_DEFAULTS_KEY` (`SyFields`) des `defaults`, que `useFieldsThemeConfig` lit. Ordre de priorité : prop passée explicitement (`variant-style`, `variant`, `outlined`, `is-outlined`, `density`), puis configuration du projet, puis valeur par défaut du composant. Un composant qui encapsule un autre champ transmet la valeur résolue (ou `undefined` pour `is-outlined`, afin que le champ imbriqué résolve lui-même la configuration : voir `useDatePickerFieldAppearance`).

`SyInputSelect` (rendu en bouton) et les composants Amelipro ne lisent pas `fields`.

Un configurateur interactif est disponible dans Storybook : *Guide Du Dev / Démarrage / Configuration de thème projet*.

## Validation

Un réglage hors bornes ou non accessible est **refusé** : il est signalé en développement (`console.warn`) et remplacé par sa valeur par défaut. Un réglage inconnu est ignoré avec un avertissement.

Pour bloquer en CI, utiliser `checkThemeConfig`, qui vérifie aussi les couleurs réelles de la marque :

```ts
import { checkThemeConfig } from '@cnamts/synapse/vuetifyOptions'
import themeConfig from './synapse.theme.json'

const { valid, issues } = checkThemeConfig(themeConfig)
if (!valid) {
  console.error(issues)
  process.exit(1)
}
```

`validateThemeConfig(config, themeColors?)`, exporté depuis `@cnamts/synapse`, fait la même vérification sans lire les couleurs Synapse (utile pour un outil externe).
