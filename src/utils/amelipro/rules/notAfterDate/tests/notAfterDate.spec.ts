import { describe, it, expect } from 'vitest'
import { notAfterDate } from '..'
import { dateToFormatFr } from '@/utils/amelipro/dateHelper/dateHelper'

describe('notAfterDate', () => {
	const currentDate = '2025-03-05'
	const pastDate = '2025-03-04'
	const futureDate = '2025-03-06'

	const rule = notAfterDate(currentDate, 'date')
	const ruleTextField = notAfterDate(currentDate, 'text')

	it('returns true with a past date', () => {
		expect(rule(pastDate)).toBe(true)
	})

	it('returns an error with a future date', () => {
		expect(typeof rule(futureDate)).toBe('string')
	})

	it('returns true if the value is falsy', () => {
		expect(rule('')).toBe(true)
	})

	it('rule for text type returns true with a past date', () => {
		expect(ruleTextField(dateToFormatFr(pastDate))).toBe(true)
	})

	it('rule for text type returns an error with a future date', () => {
		expect(typeof ruleTextField(dateToFormatFr(futureDate))).toBe('string')
	})
})
