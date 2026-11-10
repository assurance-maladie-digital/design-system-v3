import { toKebabCase } from '@/designTokens/utils/toKebabCase'
import {
	FIELD_DENSITIES,
	FOCUS_COLORS,
	FOCUS_MIN_CONTRAST,
	FOCUS_OFFSET_MAX,
	FOCUS_OFFSET_MIN,
	FOCUS_WIDTH_MAX,
	FOCUS_WIDTH_MIN,
	SYNAPSE_BRANDS,
} from './constants'
import { getContrastRatio } from './contrast'
import type { SynapseFocusColor, SynapseThemeConfigInput, ThemeConfigIssue, ThemeConfigValidationResult } from './types'

const KNOWN_KEYS: Record<string, readonly string[]> = {
	'': ['brand', 'focus', 'fields'],
	'focus': ['width', 'offset', 'color'],
	'fields': ['density'],
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const checkUnknownKeys = (value: Record<string, unknown>, scope: string, issues: ThemeConfigIssue[]): void => {
	for (const key of Object.keys(value)) {
		if (!KNOWN_KEYS[scope]?.includes(key)) {
			const path = scope ? `${scope}.${key}` : key
			issues.push({ level: 'warning', path, message: `Réglage inconnu « ${path} » : il est ignoré.` })
		}
	}
}

const checkEnum = (value: unknown, allowed: readonly string[], path: string, issues: ThemeConfigIssue[]): void => {
	if (value !== undefined && !allowed.includes(value as string)) {
		issues.push({ level: 'error', path, message: `Valeur « ${String(value)} » non autorisée pour « ${path} ». Valeurs possibles : ${allowed.join(', ')}.` })
	}
}

const checkRange = (value: unknown, min: number, max: number, path: string, issues: ThemeConfigIssue[]): void => {
	if (value === undefined) {
		return
	}
	if (typeof value !== 'number' || !Number.isFinite(value)) {
		issues.push({ level: 'error', path, message: `« ${path} » doit être un nombre de pixels.` })
	}
	else if (value < min || value > max) {
		issues.push({ level: 'error', path, message: `« ${path} » doit être compris entre ${min} et ${max} px (valeur reçue : ${value}).` })
	}
}

const checkFocusColor = (
	color: unknown,
	themeColors: Record<string, string> | undefined,
	issues: ThemeConfigIssue[],
): void => {
	if (color === undefined) {
		return
	}
	if (typeof color !== 'string' || !FOCUS_COLORS.includes(color as SynapseFocusColor)) {
		issues.push({ level: 'error', path: 'focus.color', message: `Valeur « ${String(color)} » non autorisée pour « focus.color ». Valeurs possibles : ${FOCUS_COLORS.join(', ')}.` })
		return
	}
	if (!themeColors) {
		return
	}

	const value = themeColors[toKebabCase(color)]
	if (value === undefined) {
		issues.push({ level: 'error', path: 'focus.color', message: `La couleur « ${color} » n'existe pas dans le thème de la marque.` })
		return
	}

	const background = themeColors.surface ?? '#ffffff'
	const ratio = getContrastRatio(value, background)
	if (ratio === null) {
		issues.push({ level: 'warning', path: 'focus.color', message: `Contraste de « ${color} » non vérifiable (format de couleur non hexadécimal).` })
	}
	else if (ratio < FOCUS_MIN_CONTRAST) {
		issues.push({ level: 'error', path: 'focus.color', message: `Le ring de focus « ${color} » a un contraste de ${ratio.toFixed(2)}:1 avec le fond, minimum requis ${FOCUS_MIN_CONTRAST}:1.` })
	}
}

/**
 * Vérifie une configuration de thème fournie par un projet.
 *
 * Les erreurs signalent un réglage refusé (hors bornes, non accessible, inconnu de Synapse) ;
 * les avertissements signalent un réglage ignoré ou non vérifiable.
 *
 * @param config Configuration du projet (objet JSON).
 * @param themeColors Couleurs du thème de la marque (clés kebab-case), pour vérifier `focus.color`.
 */
export function validateThemeConfig(
	config: SynapseThemeConfigInput | unknown,
	themeColors?: Record<string, string>,
): ThemeConfigValidationResult {
	const issues: ThemeConfigIssue[] = []

	if (!isRecord(config)) {
		issues.push({ level: 'error', path: '', message: 'La configuration de thème doit être un objet.' })
		return { valid: false, issues }
	}

	checkUnknownKeys(config, '', issues)
	checkEnum(config.brand, SYNAPSE_BRANDS, 'brand', issues)

	for (const scope of ['focus', 'fields'] as const) {
		const section = config[scope]
		if (section !== undefined && !isRecord(section)) {
			issues.push({ level: 'error', path: scope, message: `« ${scope} » doit être un objet.` })
		}
	}

	const focus = isRecord(config.focus) ? config.focus : {}
	const fields = isRecord(config.fields) ? config.fields : {}

	checkUnknownKeys(focus, 'focus', issues)
	checkRange(focus.width, FOCUS_WIDTH_MIN, FOCUS_WIDTH_MAX, 'focus.width', issues)
	checkRange(focus.offset, FOCUS_OFFSET_MIN, FOCUS_OFFSET_MAX, 'focus.offset', issues)
	checkFocusColor(focus.color, themeColors, issues)

	checkUnknownKeys(fields, 'fields', issues)
	checkEnum(fields.density, FIELD_DENSITIES, 'fields.density', issues)

	return {
		valid: issues.every(issue => issue.level !== 'error'),
		issues,
	}
}
