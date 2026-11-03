import './assets/themes.scss'

import type { VuetifyOptions } from 'vuetify'
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
import { createFlattenTheme, createFontVariables, toKebabCase } from './designTokens/utils'
import { fr } from 'vuetify/locale'

const createKebabThemeColors = (colors: Record<string, string>) => Object.fromEntries(
	Object.entries(colors).map(([name, value]) => [toKebabCase(name), value]),
)

// Configuration Synapse (thèmes, defaults, locale, icônes), sans `vuetify/components` ni `vuetify/directives` :
// un projet qui importe les composants Vuetify à la demande (vite-plugin-vuetify) garde son tree-shaking.
// Ce module ne doit importer ni l'un ni l'autre : `pnpm pack:check` le vérifie sur le build.
export const createVuetifyOptions = (): VuetifyOptions => ({
	defaults: {
		VTooltip: {
			interactive: true,
			closeDelay: 200,
		},
		VBtn: {
			ripple: false,
		},
		VCheckbox: {
			baseColor: 'rgb(var(--v-border-color))',
		},
		VCheckboxBtn: {
			baseColor: 'rgb(var(--v-border-color))',
		},
		VRadio: {
			baseColor: 'rgb(var(--v-border-color))',
		},
		VField: {
			baseColor: 'rgb(var(--v-border-color))',
		},
		VSelectionControl: {
			baseColor: 'rgb(var(--v-border-color))',
		},
	},
	locale: {
		locale: 'fr',
		messages: { fr },
	},
	theme: {
		defaultTheme: 'cnam',
		themes: {
			cnam: {
				dark: false,
				colors: createKebabThemeColors({
					...cnamLightTheme,
					...cnamDarkTheme,
					...createFlattenTheme(cnamColorsTokens),
				}),
				variables: {
					'border-color': cnamColorsTokens.grey.base,
					'font-family': cnamFontsTokens.family.primary,
					...createFontVariables(cnamFontsTokens),
					...createFlattenTheme(cnamContextualTokens),
				},
			},
			pa: {
				dark: false,
				colors: createKebabThemeColors({
					...paLightTheme,
					...paDarkTheme,
					...createFlattenTheme(paColorsTokens),
				}),
				variables: {
					'border-color': paColorsTokens.grey.base,
					'font-family': paFontsTokens.family.primary,
					...createFontVariables(paFontsTokens),
					...createFlattenTheme(paContextualTokens),
				},
			},
			ap2026: {
				dark: false,
				colors: createKebabThemeColors({
					...apLightTheme2026,
					...apDarkTheme,
					...createFlattenTheme(apColorsTokens2026),
				}),
				variables: {
					'border-color': cnamColorsTokens.grey.base,
					'font-family': '"Arial", sans-serif',
					...createFlattenTheme(apContextualTokens),
				},
			},
			ap: {
				dark: false,
				colors: createKebabThemeColors({
					...apLightTheme,
					...apDarkTheme,
					...createFlattenTheme(apColorsTokens),
				}),
				variables: {
					'border-color': cnamColorsTokens.grey.base,
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
