import { describe, expect, it } from 'vitest'
import { areDateModelValuesEqual } from '../dateModelValueUtils'

describe('dateModelValueUtils', () => {
	it('considers null and undefined equivalent for DatePicker model values', () => {
		expect(areDateModelValuesEqual(null, undefined)).toBe(true)
	})

	it('compares string model values directly', () => {
		expect(areDateModelValuesEqual('2025-01-10', '2025-01-10')).toBe(true)
		expect(areDateModelValuesEqual('2025-01-10', '2025-01-11')).toBe(false)
	})

	it('compares range model values by item order and content', () => {
		expect(areDateModelValuesEqual(['2025-01-01', '2025-01-10'], ['2025-01-01', '2025-01-10'])).toBe(true)
		expect(areDateModelValuesEqual(['2025-01-01', '2025-01-10'], ['2025-01-10', '2025-01-01'])).toBe(false)
	})

	it('returns false for unsupported model value shapes', () => {
		expect(areDateModelValuesEqual({ value: '2025-01-10' }, '2025-01-10')).toBe(false)
	})
})
