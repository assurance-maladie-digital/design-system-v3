import { describe, expect, it } from 'vitest'
import { buildColorClassMap } from '../builders/buildColorClassMap'
import { apColorClasses, apColorsTokens2026 } from '../tokens/amelipro/apColors2026'

describe('buildColorClassMap', () => {
	it('maps base color to kebab-case class without -base suffix', () => {
		const tokens = { apBlue: { base: '#0c419a' } }
		const map = buildColorClassMap(tokens)
		expect(map['ap-blue']).toBe('#0c419a')
		expect(map['ap-blue-base']).toBeUndefined()
	})

	it('maps color with numeric variant to dash-separated class', () => {
		const tokens = { apBlue: { darken1: '#00749c', lighten2: '#ccedf9' } }
		const map = buildColorClassMap(tokens)
		expect(map['ap-blue-darken-1']).toBe('#00749c')
		expect(map['ap-blue-lighten-2']).toBe('#ccedf9')
	})

	it('apColorClasses matches buildColorClassMap output for apColorsTokens2026', () => {
		const generated = buildColorClassMap(apColorsTokens2026)
		expect(apColorClasses).toEqual(generated)
	})

	it('includes all colors from apColorsTokens2026', () => {
		expect(apColorClasses['ap-blue']).toBe('#0c419a')
		expect(apColorClasses['ap-blue-darken-1']).toBe('#00749c')
		expect(apColorClasses['ap-grey-lighten-6']).toBe('#f4f8f9')
		expect(apColorClasses['ap-turquoise-darken-3']).toBe('#005647')
	})
})
