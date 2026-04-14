import { describe, expect, it } from 'vitest'
import { buildPrimitives, formatColor } from '../builders'

describe('formatColor', () => {
	it('normalizes valid hex colors', () => {
		expect(formatColor('#0C419A')).toBe('#0c419a')
	})

	it('keeps valid rgba colors after whitespace normalization', () => {
		expect(formatColor('rgba(255,255, 255, 0.080)')).toBe('rgba(255, 255, 255, 0.080)')
	})

	it('accepts modern rgb slash syntax', () => {
		expect(formatColor('rgb(255 255 255/20%)')).toBe('rgb(255 255 255 / 20%)')
	})

	it('rejects malformed hex colors', () => {
		expect(() => formatColor('#12')).toThrow('Invalid color token')
	})

	it('rejects malformed rgba colors', () => {
		expect(() => formatColor('rgba(255, 255, 255)')).toThrow('Invalid color token')
	})

	it('rejects non-string color values', () => {
		expect(() => formatColor(undefined)).toThrow('Expected color token to be a string')
	})
})

describe('buildPrimitives', () => {
	it('fails fast when a color token is invalid', () => {
		expect(() => buildPrimitives({
			blue: {
				base: '#12',
			},
		})).toThrow('Invalid color token "#12"')
	})
})
