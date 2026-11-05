# Nouveau point d'entrée `@cnamts/synapse/vuetifyOptions` — ajout au contrat

Un nouveau point d'entrée exporte `createVuetifyOptions`. La fonction renvoie la configuration Vuetify de Synapse (thèmes, `defaults`, locale, icônes) sans enregistrer les composants ni les directives Vuetify.

`createVuetifyInstance` (`@cnamts/synapse/vuetifyConfig`) ne change pas : elle est désormais construite sur `createVuetifyOptions` et enregistre toujours tous les composants et directives.

Cet ajout n'est pas cassant.

## Conduite à tenir

C'est désormais la configuration recommandée : `vite-plugin-vuetify` (import automatique des composants) et `createVuetifyOptions`. La documentation ne présente plus qu'elle, dans la section « Configurer Vuetify » de la page *Guide Du Dev / Démarrage / Installation*, qui remplace la page *createVuetifyInstance*.

```ts
import { createVuetify } from 'vuetify'
import { createVuetifyOptions } from '@cnamts/synapse/vuetifyOptions'

export const vuetify = createVuetify(createVuetifyOptions())
```

Les composants Vuetify inutilisés ne sont alors plus inclus dans votre bundle.

`createVuetifyInstance` reste disponible et fonctionne comme avant : vous pouvez la garder.
