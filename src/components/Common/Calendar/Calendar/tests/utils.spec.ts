import { describe, expect, it } from 'vitest'
import { getISODatePart, parseISODatePart } from '../utils'

describe('Date utils', () => {
	it('parses an ISO date at local midnight, not UTC', () => {
		// Regression: new Date('2024-06-15') parses as UTC midnight, which
		// resolves to the previous day in negative UTC offsets
		expect(parseISODatePart('2024-06-15').getTime())
			.toBe(new Date(2024, 5, 15).getTime())
	})

	it('round-trips with getISODatePart', () => {
		expect(getISODatePart(parseISODatePart('2024-12-31'))).toBe('2024-12-31')
		expect(getISODatePart(parseISODatePart('2024-01-01'))).toBe('2024-01-01')
	})
})
