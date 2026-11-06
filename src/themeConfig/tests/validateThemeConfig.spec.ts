import { describe, expect, it } from 'vitest'
import { validateThemeConfig } from '../validateThemeConfig'

const colors = {
	'primary': '#0c419a',
	'pink-darken20': '#b41567',
	'surface': '#ffffff',
}

describe('validateThemeConfig', () => {
	it('accepts an empty configuration', () => {
		expect(validateThemeConfig({}, colors)).toEqual({ valid: true, issues: [] })
	})

	it('accepts a complete valid configuration', () => {
		const result = validateThemeConfig({
			brand: 'pa',
			focus: { width: 3, offset: 2, color: 'primary' },
			fields: { variant: 'filled', density: 'compact' },
		}, colors)

		expect(result.valid).toBe(true)
	})

	it('rejects a non object configuration', () => {
		expect(validateThemeConfig('cnam').valid).toBe(false)
	})

	it('rejects a focus ring thinner than 2px', () => {
		const result = validateThemeConfig({ focus: { width: 1 } })

		expect(result.valid).toBe(false)
		expect(result.issues).toEqual([expect.objectContaining({ level: 'error', path: 'focus.width' })])
	})

	it('rejects values outside the allowed lists', () => {
		const result = validateThemeConfig({ brand: 'acme', fields: { variant: 'solo', density: 'tiny' } })

		expect(result.issues.map(issue => issue.path)).toEqual(['brand', 'fields.variant', 'fields.density'])
	})

	it.each(['primary', 'pinkDarken20'])('accepts %s as focus color', (color) => {
		expect(validateThemeConfig({ focus: { color } }, colors)).toEqual({ valid: true, issues: [] })
	})

	it.each(['secondary', 'surface', 'pink-darken20', 42])('rejects %s as focus color', (color) => {
		const result = validateThemeConfig({ focus: { color } }, colors)

		expect(result.issues).toEqual([expect.objectContaining({ level: 'error', path: 'focus.color' })])
		expect(result.issues[0]?.message).toContain('primary, pinkDarken20')
	})

	it('rejects an allowed focus color missing from the theme', () => {
		const result = validateThemeConfig({ focus: { color: 'pinkDarken20' } }, { primary: '#0c419a', surface: '#ffffff' })

		expect(result.issues).toEqual([expect.objectContaining({ level: 'error', path: 'focus.color' })])
		expect(result.issues[0]?.message).toContain('n\'existe pas')
	})

	it('rejects a focus color without enough contrast against the surface', () => {
		const result = validateThemeConfig({ focus: { color: 'pinkDarken20' } }, { ...colors, 'pink-darken20': '#f9d1e6' })

		expect(result.valid).toBe(false)
		expect(result.issues[0]?.message).toContain('3:1')
	})

	it('warns about unknown settings without failing', () => {
		const result = validateThemeConfig({ radius: 'xl', focus: { style: 'dashed' } })

		expect(result.valid).toBe(true)
		expect(result.issues).toEqual([
			expect.objectContaining({ level: 'warning', path: 'radius' }),
			expect.objectContaining({ level: 'warning', path: 'focus.style' }),
		])
	})
})
