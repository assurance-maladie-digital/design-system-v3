import { createVuetify } from 'vuetify'
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

// Import typography styles
import './assets/_typography.scss'

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
				},
				variables: {
					'border-color': cnamColorsTokens.grey.base,
					'font-family': cnamFontsTokens.family.primary,
					...createFlattenTheme(cnamContextualTokens),
					...createFontVariables(cnamFontsTokens),
				},
			},
			pa: {
				dark: false,
				colors: {
					...paLightTheme,
					...paDarkTheme,
				},
				variables: {
					'border-color': paColorsTokens.grey.base,
					'font-family': paFontsTokens.family.primary,
					...createFlattenTheme(paContextualTokens),
					...createFontVariables(paFontsTokens),
				},
			},
			ap: {
				dark: false,
				colors: {
					...apLightTheme,
					...apDarkTheme,
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
