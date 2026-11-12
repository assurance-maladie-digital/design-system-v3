import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import { createVuetifyOptions } from './vuetifyOptions'
import type { SynapseThemeConfigInput } from './themeConfig/types'

// Enregistre tous les composants et directives Vuetify : pour un projet sans tree-shaking Vuetify.
// Avec vite-plugin-vuetify, utiliser `createVuetifyOptions` (`@cnamts/synapse/vuetifyOptions`).
export const createVuetifyInstance = (themeConfig?: SynapseThemeConfigInput) => createVuetify({
	...createVuetifyOptions(themeConfig),
	components,
	directives,
})
