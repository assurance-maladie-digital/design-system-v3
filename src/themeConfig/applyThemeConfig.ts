import type { VuetifyOptions } from 'vuetify'
import { toKebabCase } from '@/designTokens/utils/toKebabCase'
import { devWarn } from '@/utils/devWarn'
import { FIELD_COMPONENTS, FIELDS_DEFAULTS_KEY, SYNAPSE_BRANDS, defaultThemeConfig } from './constants'
import { resolveThemeConfig } from './resolveThemeConfig'
import type { SynapseFieldsConfig, SynapseFocusConfig, SynapseThemeConfigInput } from './types'
import { validateThemeConfig } from './validateThemeConfig'

type ThemeColors = Record<string, string>

export const getThemeColors = (options: VuetifyOptions, brand: string): ThemeColors | undefined => {
	const colors = options.theme && typeof options.theme === 'object'
		? options.theme.themes?.[brand]?.colors
		: undefined

	return colors
		? Object.fromEntries(Object.entries(colors).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
		: undefined
}

/**
 * Variables de thème Vuetify du ring de focus (`--v-focus-width`, `--v-focus-offset`, `--v-focus-color`).
 */
export const getFocusVariables = (focus: SynapseFocusConfig): Record<string, string> => ({
	'focus-width': `${focus.width}px`,
	'focus-offset': `${focus.offset}px`,
	'focus-color': `var(--v-theme-${toKebabCase(focus.color)})`,
})

/**
 * `defaults` Vuetify des réglages `fields` : champs Vuetify natifs et champs Synapse (clé `FIELDS_DEFAULTS_KEY`).
 */
export const getFieldsDefaults = (fields: SynapseFieldsConfig): Record<string, Record<string, unknown>> => {
	const fieldDefaults = { variant: fields.variant, density: fields.density }
	return {
		...Object.fromEntries(FIELD_COMPONENTS.map(component => [component, fieldDefaults])),
		// Lu par `useFieldsThemeConfig` dans les champs Synapse, qui passent leur `variant` explicitement à Vuetify.
		[FIELDS_DEFAULTS_KEY]: fieldDefaults,
	}
}

/**
 * Applique la configuration de thème d'un projet aux options Vuetify de Synapse.
 *
 * - `brand` devient le thème par défaut ;
 * - `focus` est exposé en variables CSS (`--v-focus-width`, `--v-focus-offset`, `--v-focus-color`) sur tous les thèmes ;
 * - `fields` n'est appliqué aux champs Vuetify que s'il est renseigné, pour ne pas modifier les projets existants.
 *
 * Un réglage refusé par `validateThemeConfig` est signalé en développement et remplacé par sa valeur par défaut.
 */
export function applyThemeConfig(options: VuetifyOptions, input: SynapseThemeConfigInput): VuetifyOptions {
	const brand = SYNAPSE_BRANDS.find(name => name === input.brand) ?? defaultThemeConfig.brand
	const { issues } = validateThemeConfig(input, getThemeColors(options, brand))

	for (const issue of issues) {
		devWarn(`[Synapse] Configuration de thème — ${issue.message}`)
	}

	const config = resolveThemeConfig(input, issues)
	const theme = options.theme && typeof options.theme === 'object' ? options.theme : {}
	const focusVariables = getFocusVariables(config.focus)

	const themes = Object.fromEntries(
		Object.entries(theme.themes ?? {}).map(([name, definition]) => [
			name,
			{ ...definition, variables: { ...definition.variables, ...focusVariables } },
		]),
	)

	const defaults = { ...options.defaults }
	if (input.fields) {
		for (const [component, fieldDefaults] of Object.entries(getFieldsDefaults(config.fields))) {
			defaults[component] = { ...defaults[component], ...fieldDefaults }
		}
	}

	return {
		...options,
		defaults,
		theme: { ...theme, defaultTheme: config.brand, themes },
	}
}
