import { describe, it, expect } from 'vitest'
import { formatDate, parseDate } from '../useDateFormatDayjs'

describe('useDateFormatDayjs', () => {
	describe('parseDate', () => {
		it('keeps the same calendar day when formatting back in a negative timezone (UTC-4)', () => {
			const previousTz = process.env.TZ
			process.env.TZ = 'America/Guadeloupe'
			try {
				const parsed = parseDate('2023-01-15', 'YYYY-MM-DD')
				expect(parsed).toBeInstanceOf(Date)
				expect(formatDate(parsed, 'YYYY-MM-DD')).toBe('2023-01-15')
			}
			finally {
				process.env.TZ = previousTz
			}
		})
	})
})
