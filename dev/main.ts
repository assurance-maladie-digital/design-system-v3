import { createApp } from 'vue'
import Playground from './Playground.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
// import { cnamLightTheme, cnamContextualTokens, cnamColorsTokens } from '../src/designTokens'
import { cnamLightTheme, cnamDarkTheme, cnamContextualTokens, cnamColorsTokens } from '../src/designTokens'
import { createFlattenTheme } from '@/designTokens/utils'
import {fr} from 'vuetify/locale'
// import { paLightTheme } from '../designTokens/tokens/pa/paLightTheme'

import { router } from './router'

const vuetify = createVuetify({
	components,
	directives,
	locale: {
		locale: 'fr',
		messages: {fr},
	},
	theme: {
		themes: {
			light: {
				dark: false,
				colors: {
					...cnamLightTheme,
					// ...paLightTheme,
				},
				variables: {
					'border-color': cnamColorsTokens.grey.base,
					...createFlattenTheme(cnamContextualTokens),
				},
			},
			dark: {
				dark: true,
				colors: { ...cnamDarkTheme },
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
	.use(router)
	.mount('#app')
