import { describe, expect, it } from 'vitest'
import { buildPrimitives } from '../builders/buildPrimitives'
import { buildSemantic } from '../builders/buildSemantic'
import { buildContextual } from '../builders/buildContextual'
import { cnamColorsTokens } from '../tokens/cnam/cnamColors'
import { cnamContextualTokens } from '../tokens/cnam/cnamContextual'
import { cnamSpacingTokens } from '../tokens/cnam/cnamSpacingTokens'
import { paContextualTokens } from '../tokens/pa/paContextual'
import { apContextualTokens } from '../tokens/amelipro/apContextual'

describe('buildPrimitives', () => {
	it('generates CNAM primitives', () => {
		const lines = buildPrimitives(cnamColorsTokens)
		expect(lines.join('\n')).toMatchSnapshot()
	})

	it('starts with // Primitives comment', () => {
		const lines = buildPrimitives(cnamColorsTokens)
		expect(lines[0]).toBe('// Primitives')
	})

	it('appends hardcoded transparent-blue variables at the end', () => {
		const lines = buildPrimitives(cnamColorsTokens)
		expect(lines).toContain('$transparent-blue-18: rgba(12, 65, 154, 0.18);')
		expect(lines).toContain('$transparent-blue-08: rgba(12, 65, 154, 0.08);')
		expect(lines).toContain('$transparent-blue-00: rgba(12, 65, 154, 0);')
	})

	it('normalizes white scale steps to fixed names', () => {
		const lines = buildPrimitives(cnamColorsTokens)
		expect(lines).toContain(`$white-08: ${cnamColorsTokens.white.lighten8};`)
		expect(lines).toContain(`$white-70: ${cnamColorsTokens.white.lighten70};`)
		expect(lines).toContain('$white-00: rgba(255, 255, 255, 0);')
	})
})

describe('buildSemantic', () => {
	const fixture: Record<string, string> = {
		'primary-base': '$blue-base',
		'primary-lighter-4': '$blue-lighten-90',
		'neutral-white': '$white-base',
	}

	it('generates // Semantic Tokens section', () => {
		const lines = buildSemantic(fixture)
		expect(lines[1]).toBe('// Semantic Tokens')
	})

	it('generates one SCSS variable per entry', () => {
		const lines = buildSemantic(fixture)
		expect(lines).toContain('$primary-base: $blue-base;')
		expect(lines).toContain('$primary-lighter-4: $blue-lighten-90;')
		expect(lines).toContain('$neutral-white: $white-base;')
	})
})

describe('buildContextual', () => {
	it('generates CNAM contextual section snapshot', () => {
		const lines = buildContextual(cnamContextualTokens, {})
		expect(lines.join('\n')).toMatchSnapshot()
	})

	it('reads gap values from the contextual token object (no hardcoded overrides)', () => {
		const lines = buildContextual(cnamContextualTokens, {})
		expect(lines).toContain(`$gap-3: ${cnamContextualTokens.gap[3]};`)
		expect(lines).toContain(`$gap-0: ${cnamContextualTokens.gap[0]};`)
		expect(lines).toContain(`$gap-16: ${cnamContextualTokens.gap[16]};`)
	})

	it('gap values are aligned across all themes', () => {
		const keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
		for (const key of keys) {
			const numKey = Number(key)
			expect(cnamContextualTokens.gap[numKey]).toBe(paContextualTokens.gap[numKey])
			expect(cnamContextualTokens.gap[numKey]).toBe(apContextualTokens.gap[numKey])
		}
	})

	it('includes spacing section when spacingTokens is provided', () => {
		const lines = buildContextual(cnamContextualTokens, {}, cnamSpacingTokens)
		expect(lines).toContain('$spacing-none: 0;')
		expect(lines).toContain('$container-mobile-max-width: 600px;')
	})

	it('omits spacing section when spacingTokens is not provided', () => {
		const lines = buildContextual(cnamContextualTokens, {})
		expect(lines).not.toContain('$spacing-none: 0;')
		expect(lines).not.toContain('$container-mobile-max-width: 600px;')
	})

	it('includes additionalContextual entries', () => {
		const additional = { 'colors-background-main': '$primary-lighter-4' }
		const lines = buildContextual(cnamContextualTokens, additional)
		expect(lines).toContain('$colors-background-main: $primary-lighter-4;')
	})
})
