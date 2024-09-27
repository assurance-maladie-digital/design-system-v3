import { createApp } from 'vue'
import Playground from './Playground.template.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { cnamLightTheme, cnamContextualTokens, cnamColorsTokens } from '../src/designTokens'
import { createFlattenTheme } from '../src/designTokens/utils'
// import { bootstrapLightTheme } from '../designTokens/tokens/bootstrap/bootstrapLightTheme'

const vuetify = createVuetify({
	components,
	directives,
	theme: {
		themes: {
			light: {
				dark: false,
				colors: {
					...cnamLightTheme,
					// ...bootstrapLightTheme,
				},
				variables: {
					'border-color': cnamColorsTokens.grey.base,
					...createFlattenTheme(cnamContextualTokens),
				},
			},
		},
	},
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
})

createApp(Playground)
	.use(vuetify)
	.mount('#app')