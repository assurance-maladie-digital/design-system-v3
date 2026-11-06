import type { VuetifyOptions } from 'vuetify'
import { toKebabCase } from '@/designTokens/utils/toKebabCase'
import { devWarn } from '@/utils/devWarn'
import { FIELD_COMPONENTS, SYNAPSE_BRANDS, defaultThemeConfig } from './constants'
import { resolveThemeConfig } from './resolveThemeConfig'
import type { SynapseThemeConfigInput } from './types'
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
	const focusVariables = {
		'focus-width': `${config.focus.width}px`,
		'focus-offset': `${config.focus.offset}px`,
		'focus-color': `var(--v-theme-${toKebabCase(config.focus.color)})`,
	}

	const themes = Object.fromEntries(
		Object.entries(theme.themes ?? {}).map(([name, definition]) => [
			name,
			{ ...definition, variables: { ...definition.variables, ...focusVariables } },
		]),
	)

	const defaults = { ...options.defaults }
	if (input.fields) {
		const fieldDefaults = { variant: config.fields.variant, density: config.fields.density }
		for (const component of FIELD_COMPONENTS) {
			defaults[component] = { ...defaults[component], ...fieldDefaults }
		}
	}

	return {
		...options,
		defaults,
		theme: { ...theme, defaultTheme: config.brand, themes },
	}
}
