import { describe, expect, it } from 'vitest'
import { isCssColor } from '../isCssColor'

describe('isCssColor', () => {
	it('returns true for hex colors', () => {
		expect(isCssColor('#fff')).toBe(true)
		expect(isCssColor('#ffffff')).toBe(true)
		expect(isCssColor('#FF0000')).toBe(true)
	})

	it('returns true for rgb/rgba colors', () => {
		expect(isCssColor('rgb(0, 0, 0)')).toBe(true)
		expect(isCssColor('rgba(0, 0, 0, 0.5)')).toBe(true)
	})

	it('returns true for hsl/hsla colors', () => {
		expect(isCssColor('hsl(0, 0%, 0%)')).toBe(true)
		expect(isCssColor('hsla(0, 0%, 0%, 0.5)')).toBe(true)
	})

	it('returns true for CSS custom properties', () => {
		expect(isCssColor('var(--color-primary)')).toBe(true)
		expect(isCssColor('var(--my-color)')).toBe(true)
	})

	it('returns false for named colors', () => {
		expect(isCssColor('red')).toBe(false)
		expect(isCssColor('white')).toBe(false)
		expect(isCssColor('transparent')).toBe(false)
	})

	it('returns false for class-like strings', () => {
		expect(isCssColor('primary')).toBe(false)
		expect(isCssColor('ap-blue-base')).toBe(false)
	})

	it('returns false for undefined', () => {
		expect(isCssColor(undefined)).toBe(false)
	})

	it('returns false for false', () => {
		expect(isCssColor(false)).toBe(false)
	})

	it('returns false for empty string', () => {
		expect(isCssColor('')).toBe(false)
	})
})
