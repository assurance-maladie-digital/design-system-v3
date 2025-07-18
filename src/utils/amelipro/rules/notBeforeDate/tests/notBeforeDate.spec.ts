import { describe, it, expect } from 'vitest'
import { notBeforeDate } from '..'
import { dateToFormatFr } from '@/utils/amelipro/dateHelper/dateHelper'

describe('notAfterDate', () => {
	const currentDate = '2025-03-05'
	const pastDate = '2025-03-04'
	const futureDate = '2025-03-06'

	const rule = notBeforeDate(currentDate, 'date')
	const ruleTextField = notBeforeDate(currentDate, 'text')

	it('returns true with a future date', () => {
		expect(rule(futureDate)).toBe(true)
	})

	it('returns an error with a past date', () => {
		expect(typeof rule(pastDate)).toBe('string')
	})

	it('returns true if the value is falsy', () => {
		expect(rule('')).toBe(true)
	})

	it('rule for text type returns true with a future date', () => {
		expect(ruleTextField(dateToFormatFr(futureDate))).toBe(true)
	})

	it('rule for text type returns an error with a past date', () => {
		expect(typeof ruleTextField(dateToFormatFr(pastDate))).toBe('string')
	})
})
