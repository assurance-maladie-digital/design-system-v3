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
	apContextualTokens,
	apLightTheme,
	apDarkTheme,
	apColorsTokens,
	apColorsTokensNew,
	apLightThemeNew,
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
					...createFlattenTheme(cnamColorsTokens),
				},
				variables: {
					'border-color': cnamColorsTokens.grey.base,
					'font-family': cnamFontsTokens.family.primary,
					...createFontVariables(cnamFontsTokens),
					...createFlattenTheme(cnamContextualTokens),
				},
			},
			pa: {
				dark: false,
				colors: {
					...paLightTheme,
					...paDarkTheme,
					...createFlattenTheme(paColorsTokens),
				},
				variables: {
					'border-color': paColorsTokens.grey.base,
					'font-family': paFontsTokens.family.primary,
					...createFontVariables(paFontsTokens),
					...createFlattenTheme(paContextualTokens),
				},
			},
			ap: {
				dark: false,
				colors: {
					...apLightTheme,
					...apDarkTheme,
					...createFlattenTheme(apColorsTokens),
				},
				variables: {
					'font-family': '"Arial", sans-serif',
					...createFlattenTheme(apContextualTokens),
				},
			},
			apNew: {
				dark: false,
				colors: {
					...apLightThemeNew,
					...apDarkTheme,
					...createFlattenTheme(apColorsTokensNew),
				},
				variables: {
					'font-family': '"Arial", sans-serif',
					...createFlattenTheme(apContextualTokens),
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
