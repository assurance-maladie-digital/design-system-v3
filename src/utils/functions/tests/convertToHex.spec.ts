import { describe, expect, it } from 'vitest'
import { convertToHex } from '../convertToHex'

describe('convertToHex', () => {
	it('returns the color as-is when it is a valid CSS color', () => {
		expect(convertToHex('#fff')).toBe('#fff')
		expect(convertToHex('#0c419a')).toBe('#0c419a')
		expect(convertToHex('rgb(0, 0, 0)')).toBe('rgb(0, 0, 0)')
		expect(convertToHex('var(--color-primary)')).toBe('var(--color-primary)')
	})

	it('converts "white" to #FFF', () => {
		expect(convertToHex('white')).toBe('#FFF')
	})

	it('converts "black" to #000', () => {
		expect(convertToHex('black')).toBe('#000')
	})

	it('converts "transparent" to transparent', () => {
		expect(convertToHex('transparent')).toBe('transparent')
	})

	it('returns #000 for undefined', () => {
		expect(convertToHex(undefined)).toBe('#000')
	})

	it('returns #000 for unknown class names', () => {
		expect(convertToHex('not-a-real-color-class')).toBe('#000')
	})
})
