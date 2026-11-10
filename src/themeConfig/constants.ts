import type { SynapseBrand, SynapseFieldDensity, SynapseFieldVariant, SynapseFocusColor, SynapseThemeConfig } from './types'

export const SYNAPSE_BRANDS: readonly SynapseBrand[] = ['cnam', 'pa', 'ap']
export const FIELD_VARIANTS: readonly SynapseFieldVariant[] = ['outlined', 'filled', 'underlined']
export const FIELD_DENSITIES: readonly SynapseFieldDensity[] = ['default', 'comfortable', 'compact']

/** Couleurs autorisées pour le ring de focus. */
export const FOCUS_COLORS: readonly SynapseFocusColor[] = ['primary', 'pinkDarken20']

/** Bornes du ring de focus, en pixels. */
export const FOCUS_WIDTH_MIN = 2
export const FOCUS_WIDTH_MAX = 4
export const FOCUS_OFFSET_MIN = 0
export const FOCUS_OFFSET_MAX = 4

/** Contraste minimal du ring de focus avec le fond (WCAG 1.4.11 / 2.4.13). */
export const FOCUS_MIN_CONTRAST = 3

/** Champs Vuetify qui reçoivent les réglages `fields`. */
export const FIELD_COMPONENTS = [
	'VTextField',
	'VTextarea',
	'VSelect',
	'VAutocomplete',
	'VCombobox',
	'VFileInput',
] as const

/**
 * Clé des `defaults` Vuetify qui transporte les réglages `fields` jusqu'aux composants Synapse
 * (`SyTextField`, `SySelect`, `DatePicker`…). Elle n'est renseignée que si le projet configure `fields`.
 */
export const FIELDS_DEFAULTS_KEY = 'SyFields'

/** Valeurs par défaut : reproduisent le rendu actuel de Synapse. */
export const defaultThemeConfig: SynapseThemeConfig = {
	brand: 'cnam',
	focus: {
		width: 2,
		offset: 3,
		color: 'primary',
	},
	fields: {
		variant: 'outlined',
		density: 'default',
	},
}
