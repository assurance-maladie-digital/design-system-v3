import { describe, expect, it } from 'vitest'
import { classToHex } from '../classToHex'

describe('classToHex', () => {
	it('resolves a camelCase color name to its base hex value', () => {
		expect(classToHex('apBlue')).toBe('#0C419A')
	})

	it('resolves a kebab-case color name', () => {
		expect(classToHex('ap-blue')).toBe('#0C419A')
	})

	it('resolves a color name with a modifier', () => {
		expect(classToHex('ap-blue-darken-1')).toBe('#00749C')
	})

	it('falls back to base when modifier is not found', () => {
		expect(classToHex('ap-blue-unknown')).toBe('#0C419A')
	})

	it('resolves theme keys like "colorPrimary"', () => {
		expect(classToHex('colorPrimary')).toBe('#00749C')
	})

	it('resolves legacy color names via AmeliproColors', () => {
		expect(classToHex('apBluelighten1')).toBe('#99DBF2')
	})

	it('returns undefined for completely unknown color', () => {
		expect(classToHex('not-a-color')).toBeUndefined()
	})

	it('trims whitespace from input', () => {
		expect(classToHex('  apBlue  ')).toBe('#0C419A')
	})
})
