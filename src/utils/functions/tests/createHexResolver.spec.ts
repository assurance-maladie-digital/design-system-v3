import { describe, expect, it } from 'vitest'
import { createHexResolver } from '../createHexResolver'

const colors = {
	apBlue: { base: '#0c419a', darken1: '#00749c', lighten1: '#99dbf2' },
	apRed: { base: '#b33f2e' },
}

const theme = {
	primary: '#00749c',
	secondary: '#00516d',
}

const legacy = {
	apBluelighten1: { hexColor: '#99dbf2' },
	apBlue: { hexColor: '#0c419a' },
}

describe('createHexResolver', () => {
	it('resolves a color name to its base value', () => {
		const resolve = createHexResolver(theme, colors)
		expect(resolve('apBlue')).toBe('#0c419a')
	})

	it('resolves a color name with a modifier', () => {
		const resolve = createHexResolver(theme, colors)
		// "ap-blue-darken-1" → apBlue.darken1
		expect(resolve('ap-blue-darken-1')).toBe('#00749c')
	})

	it('falls back to base when modifier is not found', () => {
		const resolve = createHexResolver(theme, colors)
		// "ap-blue-unknownmod": first -b→B gives "apBlue-unknownmod",
		// then first -→space gives "apBlue unknownmod" → modifier not found → falls back to base
		expect(resolve('ap-blue-unknownmod')).toBe('#0c419a')
	})

	it('falls back to theme map', () => {
		const resolve = createHexResolver(theme, colors)
		expect(resolve('primary')).toBe('#00749c')
		expect(resolve('secondary')).toBe('#00516d')
	})

	it('falls back to legacyColors map', () => {
		const resolve = createHexResolver(theme, colors, legacy)
		expect(resolve('ap-blue-lighten-1')).toBe('#99dbf2')
	})

	it('returns undefined for unknown color', () => {
		const resolve = createHexResolver(theme, colors)
		expect(resolve('nonexistent-color')).toBeUndefined()
	})

	it('trims whitespace from input', () => {
		const resolve = createHexResolver(theme, colors)
		expect(resolve('  apBlue  ')).toBe('#0c419a')
	})

	it('is independent — two resolvers with different themes return different values', () => {
		const theme2 = { primary: '#ff0000' }
		const resolveA = createHexResolver(theme, colors)
		const resolveB = createHexResolver(theme2, colors)
		expect(resolveA('primary')).toBe('#00749c')
		expect(resolveB('primary')).toBe('#ff0000')
	})
})
