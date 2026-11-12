# Configuration de thème projet

Un projet peut ajuster un nombre **limité** de réglages du DS via un objet de configuration.
Tout ce qui n'est pas listé ici reste verrouillé : c'est volontaire, pour garder un rendu cohérent entre les projets.

Source : `src/themeConfig/`.

## Utilisation

Écrivez la configuration dans un fichier `.ts` avec `satisfies SynapseThemeConfigInput`, plutôt qu'en JSON : TypeScript type les valeurs d'un fichier JSON importé en `string` (`brand: string`), que `createVuetifyOptions` refuse. Le `.ts` garde les valeurs exactes (`'pa'`) et l'éditeur propose les valeurs autorisées.

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
| `fields.density` | `default`, `comfortable`, `compact` | `default` | `density` des champs Vuetify |

Le focus est exposé en variables CSS sur tous les thèmes : `--v-focus-width`, `--v-focus-offset`, `--v-focus-color`.

Le style des champs n'est pas configurable : la maquette Synapse ne définit qu'un champ à contour (`outlined`), dont la bordure porte les états (focus, erreur, avertissement, succès). Un `fields.variant` éventuel est traité comme un réglage inconnu : ignoré avec un avertissement.

### Champs concernés par `fields`

`fields` ne s'applique que si le projet le renseigne :

- champs Vuetify natifs (`VTextField`, `VTextarea`, `VSelect`, `VAutocomplete`, `VCombobox`, `VFileInput`), via leurs `defaults` ;
- champs Synapse (`SyTextField`, `SyTextArea`, `SySelect`, `SyAutocomplete`, `PasswordField`, `NirField`, `PhoneField`, `LunarCalendar`, `SearchListField`, `DatePicker`, `PeriodField`), via le composable `useFieldsThemeConfig`.

Les champs Synapse passent leur `density` explicitement à Vuetify : les `defaults` ne les atteignent pas. `applyThemeConfig` range donc aussi le réglage sous la clé `FIELDS_DEFAULTS_KEY` (`SyFields`) des `defaults`, que `useFieldsThemeConfig` lit. Ordre de priorité : prop `density` passée explicitement, puis configuration du projet, puis valeur par défaut du composant. Un composant qui encapsule un autre champ transmet la valeur résolue (voir `useDatePickerFieldAppearance` pour la famille DatePicker).

`SyInputSelect` (rendu en bouton) et les composants Amelipro ne lisent pas `fields`.

Un configurateur interactif est disponible dans Storybook : *Guide Du Dev / Démarrage / Customisation du thème*.

## Validation

Un réglage hors bornes ou non accessible est **refusé** : il est signalé en développement (`console.warn`) et remplacé par sa valeur par défaut. Un réglage inconnu est ignoré avec un avertissement.

Pour bloquer en CI, utiliser `checkThemeConfig`, qui vérifie aussi les couleurs réelles de la marque :

```ts
import { checkThemeConfig } from '@cnamts/synapse/vuetifyOptions'
import themeConfig from './synapse.theme'

const { valid, issues } = checkThemeConfig(themeConfig)
if (!valid) {
  console.error(issues)
  process.exit(1)
}
```

`validateThemeConfig(config, themeColors?)`, exporté depuis `@cnamts/synapse`, fait la même vérification sans lire les couleurs Synapse (utile pour un outil externe).
