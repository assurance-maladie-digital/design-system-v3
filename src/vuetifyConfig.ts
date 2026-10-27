import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import { createVuetifyOptions } from './vuetifyOptions'

// Enregistre tous les composants et directives Vuetify : pour un projet sans tree-shaking Vuetify.
// Avec vite-plugin-vuetify, utiliser `createVuetifyOptions` (`@cnamts/synapse/vuetifyOptions`).
export const createVuetifyInstance = () => createVuetify({
	...createVuetifyOptions(),
	components,
	directives,
})
