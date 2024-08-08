import { createApp } from 'vue'
import Playground from './Playground.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { cnamLightTheme, cnamContextualTokens } from '../designTokens'
import { flattenTheme, convertGaps } from './utils'

const vuetify = createVuetify({
	components,
	directives,
	theme: {
		themes: {
			light: {
				dark: false,
				colors: {
					...cnamLightTheme
				},
				variables: {
					...flattenTheme(cnamContextualTokens),
					...convertGaps(cnamContextualTokens.gap)
				},
			}
		}
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