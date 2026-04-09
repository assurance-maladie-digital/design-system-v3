import type { ContextualTokens, SpacingTokens } from './types'
import { formatColor, formatLength, toKebabCase } from './formatters'

const GAP_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'] as const
const PADDING_KEYS = ['0', '2', '3', '4', '6', '8', '10', '14', '16'] as const

function buildSpacingSection(spacing: SpacingTokens): string[] {
	const lines: string[] = []

	lines.push('', '// vertical spacing')
	for (const [name, value] of Object.entries(spacing.vertical))
		lines.push(`$spacing-${toKebabCase(name)}: ${value};`)

	lines.push('', '// horizontal spacing')
	for (const [name, value] of Object.entries(spacing.horizontal))
		lines.push(`$spacing-horizontal-${toKebabCase(name)}: ${value};`)

	lines.push('', '// container')
	for (const [name, value] of Object.entries(spacing.container))
		lines.push(`$container-${toKebabCase(name)}: ${value};`)

	return lines
}

export function buildContextual(
	contextual: ContextualTokens,
	additionalContextual: Record<string, string>,
	spacingTokens?: SpacingTokens,
): string[] {
	const lines: string[] = ['', '// Contextual Tokens']

	lines.push(`$colors-background: ${formatColor(contextual.colors.background)};`)
	lines.push(`$colors-border: ${formatColor(contextual.colors.border)};`)
	lines.push(`$colors-text: ${formatColor(contextual.colors.text)};`)
	lines.push(`$colors-icon: ${formatColor(contextual.colors.icon)};`)
	lines.push(`$colors-overlay: ${formatColor(contextual.colors.overlay)};`)
	lines.push(`$colors-interactive: ${formatColor(contextual.colors.interactive)};`)

	for (const key of GAP_KEYS)
		lines.push(`$gap-${key}: ${formatLength(contextual.gap[key]!)};`)

	lines.push(`$icon-size-xsmall: ${formatLength(contextual.iconSize.xsmall)};`)
	lines.push(`$icon-size-small: ${formatLength(contextual.iconSize.small)};`)
	lines.push(`$icon-size-default: ${formatLength(contextual.iconSize.default)};`)
	lines.push(`$icon-size-large: ${formatLength(contextual.iconSize.large)};`)
	lines.push(`$radius-rounded-0: ${formatLength(contextual.radius.rounded0)};`)
	lines.push(`$radius-rounded: ${formatLength(contextual.radius.rounded)};`)
	lines.push(`$radius-rounded-md: ${formatLength(contextual.radius.rounded)};`)
	lines.push(`$radius-rounded-lg: ${formatLength(contextual.radius.roundedLg)};`)
	lines.push(`$radius-rounded-pill: ${formatLength(contextual.radius.roundedPill)};`)

	for (const key of PADDING_KEYS)
		lines.push(`$padding-${key}: ${formatLength(contextual.padding[key]!)};`)

	lines.push(`$font-size-title: ${formatLength(contextual.fontSize.titres)};`)
	lines.push(`$font-size-alt-title: ${formatLength(contextual.fontSize.titresAlternatifs)};`)
	lines.push(`$font-size-body-text: ${formatLength(contextual.fontSize.corpsDeTexte)};`)
	lines.push(`$font-size-link-label: ${formatLength(contextual.fontSize.liensEtLibelles)};`)

	lines.push('', '// Additional Contextual Tokens')

	for (const [name, value] of Object.entries(additionalContextual))
		lines.push(`$${name}: ${value};`)

	if (spacingTokens)
		lines.push(...buildSpacingSection(spacingTokens))

	return lines
}
