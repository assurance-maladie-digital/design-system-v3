import './assets/themes.scss'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import {
	cnamColorsTokens,
	cnamContextualTokens,
	cnamLightTheme,
	cnamDarkTheme,
	cnamFontsTokens,
	paColorsTokens,
	paContextualTokens,
	paLightTheme,
	paDarkTheme,
	paFontsTokens,
	// apColorsTokens,
	apContextualTokens,
	apLightTheme,
	apDarkTheme,
} from './designTokens'
import { createFlattenTheme, createFontVariables } from './designTokens/utils'
import { fr } from 'vuetify/locale'

import { createVuetify } from 'vuetify'

export const createVuetifyInstance = () => createVuetify({
	components,
	directives,
	locale: {
		locale: 'fr',
		messages: { fr },
	},
	theme: {
		defaultTheme: 'cnam',
		themes: {
			cnam: {
				dark: false,
				colors: {
					...cnamLightTheme,
					...cnamDarkTheme,
					...createFlattenTheme(cnamContextualTokens),
					...createFlattenTheme(cnamColorsTokens),
				},
				variables: {
					'border-color': cnamColorsTokens.grey.base,
					'font-family': cnamFontsTokens.family.primary,
					...createFontVariables(cnamFontsTokens),
				},
			},
			pa: {
				dark: false,
				colors: {
					...paLightTheme,
					...paDarkTheme,
					...createFlattenTheme(paContextualTokens),
					...createFlattenTheme(cnamColorsTokens),
				},
				variables: {
					'border-color': paColorsTokens.grey.base,
					'font-family': paFontsTokens.family.primary,
					...createFontVariables(paFontsTokens),
				},
			},
			ap: {
				dark: false,
				colors: {
					...apLightTheme,
					...apDarkTheme,
					...createFlattenTheme(apContextualTokens),
					...createFlattenTheme(cnamColorsTokens),
				},
				variables: {
					'font-family': '"Arial", sans-serif',
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
