import type { ContextualTokens, SpacingTokens } from './types'
import { formatColor, formatLength, toKebabCase } from './formatters'

function buildSpacingSection(spacing: SpacingTokens): string[] {
	const lines: string[] = []

	lines.push('', '// vertical spacing')
	for (const [name, value] of Object.entries(spacing.vertical))
		lines.push(`$spacing-${toKebabCase(name)}: ${formatLength(value)};`)

	lines.push('', '// horizontal spacing')
	for (const [name, value] of Object.entries(spacing.horizontal))
		lines.push(`$spacing-horizontal-${toKebabCase(name)}: ${formatLength(value)};`)

	lines.push('', '// container')
	for (const [name, value] of Object.entries(spacing.container))
		lines.push(`$container-${toKebabCase(name)}: ${formatLength(value)};`)

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

	for (const [key, value] of Object.entries(contextual.gap).sort(([a], [b]) => Number(a) - Number(b)))
		lines.push(`$gap-${key}: ${formatLength(value)};`)

	lines.push(`$icon-size-xsmall: ${formatLength(contextual.iconSize.xsmall)};`)
	lines.push(`$icon-size-small: ${formatLength(contextual.iconSize.small)};`)
	lines.push(`$icon-size-default: ${formatLength(contextual.iconSize.default)};`)
	lines.push(`$icon-size-large: ${formatLength(contextual.iconSize.large)};`)
	lines.push(`$radius-rounded-0: ${formatLength(contextual.radius.rounded0)};`)
	lines.push(`$radius-rounded: ${formatLength(contextual.radius.rounded)};`)
	lines.push(`$radius-rounded-md: ${formatLength(contextual.radius.rounded)};`) // alias for backwards compatibility
	lines.push(`$radius-rounded-lg: ${formatLength(contextual.radius.roundedLg)};`)
	lines.push(`$radius-rounded-pill: ${formatLength(contextual.radius.roundedPill)};`)

	for (const [key, value] of Object.entries(contextual.padding).sort(([a], [b]) => Number(a) - Number(b)))
		lines.push(`$padding-${key}: ${formatLength(value)};`)

	lines.push(`$font-size-title: ${formatLength(contextual.fontSize.titres)};`)
	lines.push(`$font-size-alt-title: ${formatLength(contextual.fontSize.titresAlternatifs)};`)
	lines.push(`$font-size-body-text: ${formatLength(contextual.fontSize.corpsDeTexte)};`)
	lines.push(`$font-size-link-label: ${formatLength(contextual.fontSize.liensEtLibelles)};`)

	lines.push('', '// Additional Contextual Tokens')

	for (const [name, value] of Object.entries(additionalContextual)) {
		if (!value.trim())
			throw new TypeError(`Expected additional contextual token "${name}" to be a non-empty string, received ${JSON.stringify(value)}`)
		lines.push(`$${name}: ${value};`)
	}

	if (spacingTokens)
		lines.push(...buildSpacingSection(spacingTokens))

	return lines
}
