import { describe, expect, it } from 'vitest'
import { getContrastRatio } from '../contrast'

describe('getContrastRatio', () => {
	it('returns 21 for black on white', () => {
		expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
	})

	it('is symmetric and supports short hex', () => {
		expect(getContrastRatio('#fff', '#0c419a')).toBeCloseTo(getContrastRatio('#0c419a', '#ffffff') ?? 0, 5)
	})

	it('returns null for non hexadecimal colors', () => {
		expect(getContrastRatio('rgba(0, 0, 0, 0.5)', '#ffffff')).toBeNull()
	})
})
