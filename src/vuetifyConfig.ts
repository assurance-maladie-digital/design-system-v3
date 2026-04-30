import './assets/themes.scss'
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
	apLightTheme2026,
	apDarkTheme,
	apColorsTokens,
	apColorsTokens2026,
	apLightTheme,
} from './designTokens'
import { createFlattenTheme, createFontVariables } from './designTokens/utils'
import { fr } from 'vuetify/locale'

import { createVuetify } from 'vuetify'

export const createVuetifyInstance = () => createVuetify({
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
			ap2026: {
				dark: false,
				colors: {
					...apLightTheme2026,
					...apDarkTheme,
					...createFlattenTheme(apColorsTokens2026),
				},
				variables: {
					'font-family': '"Arial", sans-serif',
					...createFlattenTheme(apContextualTokens),
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
