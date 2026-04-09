import type { ContextualTokens } from './types'
import { formatColor, formatLength } from './formatters'

const GAP_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'] as const
const PADDING_KEYS = ['0', '2', '3', '4', '6', '8', '10', '14', '16'] as const

export function buildContextual(
	contextual: ContextualTokens,
	additionalContextual: Record<string, string>,
	includeContainerAliases: boolean,
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

	if (includeContainerAliases) {
		lines.push('', '// vertical spacing')
		lines.push('$spacing-none: 0;')
		lines.push('$spacing-xx-small: 4px;')
		lines.push('$spacing-x-small: 8px;')
		lines.push('$spacing-small: 16px;')
		lines.push('$spacing-medium: 24px;')
		lines.push('$spacing-large: 32px;')
		lines.push('$spacing-x-large: 40px;')
		lines.push('$spacing-xx-large: 56px;')
		lines.push('$spacing-xxx-large: 64px;')
		lines.push('$spacing-huge: 80px;')
		lines.push('', '// horizontal spacing')
		lines.push('$spacing-horizontal-none: 0;')
		lines.push('$spacing-horizontal-xx-small: 4px;')
		lines.push('$spacing-horizontal-x-small: 8px;')
		lines.push('$spacing-horizontal-small: 16px;')
		lines.push('$spacing-horizontal-medium: 24px;')
		lines.push('$spacing-horizontal-large: 32px;')
		lines.push('$spacing-horizontal-x-large: 40px;')
		lines.push('$spacing-horizontal-xx-large: 56px;')
		lines.push('$spacing-horizontal-xxx-large: 64px;')
		lines.push('$spacing-horizontal-huge: 80px;')
		lines.push('', '// container')
		lines.push('$container-mobile-max-width: 600px;')
		lines.push('$container-tablet-max-width: 960px;')
		lines.push('$container-desktop-max-width: 960px;')
	}

	return lines
}
