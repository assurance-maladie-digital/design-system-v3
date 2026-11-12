import { defaultThemeConfig } from './constants'
import type { SynapseThemeConfig, SynapseThemeConfigInput, ThemeConfigIssue } from './types'

/**
 * Fusionne la configuration d'un projet avec les valeurs par défaut.
 * Un réglage en erreur (cf. `validateThemeConfig`) est remplacé par sa valeur par défaut.
 */
export function resolveThemeConfig(
	config: SynapseThemeConfigInput = {},
	issues: ThemeConfigIssue[] = [],
): SynapseThemeConfig {
	const rejected = new Set(issues.filter(issue => issue.level === 'error').map(issue => issue.path))
	const pick = <T>(path: string, value: T | undefined, fallback: T): T =>
		value === undefined || rejected.has(path) ? fallback : value

	return {
		brand: pick('brand', config.brand, defaultThemeConfig.brand),
		focus: {
			width: pick('focus.width', config.focus?.width, defaultThemeConfig.focus.width),
			offset: pick('focus.offset', config.focus?.offset, defaultThemeConfig.focus.offset),
			color: pick('focus.color', config.focus?.color, defaultThemeConfig.focus.color),
		},
		fields: {
			density: pick('fields.density', config.fields?.density, defaultThemeConfig.fields.density),
		},
	}
}
