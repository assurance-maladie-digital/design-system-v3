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
| `brand` | `cnam`, `pa`, `ap`, `ap2026` | `cnam` | Thème Vuetify par défaut |
| `focus.width` | 2 à 4 (px) | 2 | Épaisseur du ring de focus (boutons, liens, menus) |
| `focus.offset` | 0 à 4 (px) | 3 | Écart du ring des boutons (les liens gardent 2px, les menus leur ring intérieur) |
| `focus.color` | clé de couleur du thème (camelCase) | `primary` | Couleur du ring ; contraste ≥ 3:1 avec `surface` exigé |
| `fields.variant` | `outlined`, `filled`, `underlined` | `outlined` | `variant` des champs Vuetify |
| `fields.density` | `default`, `comfortable`, `compact` | `default` | `density` des champs Vuetify |

Le focus est exposé en variables CSS sur tous les thèmes : `--v-focus-width`, `--v-focus-offset`, `--v-focus-color`.

> `fields` ne s'applique qu'aux champs Vuetify natifs (`VTextField`, `VTextarea`, `VSelect`, `VAutocomplete`, `VCombobox`, `VFileInput`), et uniquement si le projet le renseigne. Les composants `Sy*` (ex. `SyTextField`) ne le lisent pas encore.

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
