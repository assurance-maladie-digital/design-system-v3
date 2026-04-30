import { describe, it, expect } from 'vitest'
import { formatDate, parseDate } from '../useDateFormatDayjs'

describe('useDateFormatDayjs', () => {
	describe('formatDate', () => {
		it('formats a Date object to string according to the specified format', () => {
			const date = new Date(2023, 0, 15) // 15 janvier 2023
			expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2023')
			expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-01-15')
		})

		it('returns empty string when date is null or undefined', () => {
			expect(formatDate(null as unknown as Date, 'DD/MM/YYYY')).toBe('')
			expect(formatDate(undefined as unknown as Date, 'DD/MM/YYYY')).toBe('')
		})

		it('handles different date formats correctly', () => {
			const date = new Date(2023, 11, 31) // 31 décembre 2023
			expect(formatDate(date, 'DD/MM/YYYY')).toBe('31/12/2023')
			expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-12-31')
		})

		it('handles custom separators correctly', () => {
			const date = new Date(2023, 0, 15) // 15 janvier 2023
			expect(formatDate(date, 'DD.MM.YYYY')).toBe('15.01.2023')
			expect(formatDate(date, 'DD-MM-YYYY')).toBe('15-01-2023')
			expect(formatDate(date, 'YYYY/MM/DD')).toBe('2023/01/15')
		})
	})

	describe('parseDate', () => {
		it('parses a date string to a Date object according to the specified format', () => {
			const dateStr = '15/01/2023'
			const date = parseDate(dateStr, 'DD/MM/YYYY')
			expect(date).toBeInstanceOf(Date)
			expect(date?.getFullYear()).toBe(2023)
			expect(date?.getMonth()).toBe(0) // Janvier = 0
			expect(date?.getDate()).toBe(15)
		})

		it('returns null for invalid date strings', () => {
			expect(parseDate('invalid', 'DD/MM/YYYY')).toBeNull()
			expect(parseDate('31/02/2023', 'DD/MM/YYYY')).toBeNull() // 31 février n'existe pas
		})

		it('handles different date formats correctly', () => {
			expect(parseDate('2023-01-15', 'YYYY-MM-DD')?.getDate()).toBe(15)
			expect(parseDate('15.01.2023', 'DD.MM.YYYY')?.getDate()).toBe(15)
		})

		it('returns null when input is null or empty', () => {
			expect(parseDate(null, 'DD/MM/YYYY')).toBeNull()
			expect(parseDate('', 'DD/MM/YYYY')).toBeNull()
		})

		it('handles leap years correctly', () => {
			// 2020 était une année bissextile
			expect(parseDate('29/02/2020', 'DD/MM/YYYY')).not.toBeNull()
			// 2023 n'est pas une année bissextile
			expect(parseDate('29/02/2023', 'DD/MM/YYYY')).toBeNull()
		})

		it('returns the Date object as-is when input is already a Date', () => {
			const original = new Date(2023, 5, 15, 10, 30)
			const result = parseDate(original, 'DD/MM/YYYY')
			expect(result).toBe(original) // même référence
		})

		it('creates dates at midnight (00:00:00.000)', () => {
			const date = parseDate('15/01/2023', 'DD/MM/YYYY')!
			expect(date.getHours()).toBe(0)
			expect(date.getMinutes()).toBe(0)
			expect(date.getSeconds()).toBe(0)
			expect(date.getMilliseconds()).toBe(0)
		})

		it('roundtrip: parseDate then formatDate preserves the same calendar day', () => {
			const formats = ['DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY']
			const inputs = ['01/01/2023', '2023-06-30', '31.12.2020']
			formats.forEach((fmt, i) => {
				const parsed = parseDate(inputs[i]!, fmt)
				expect(parsed).not.toBeNull()
				expect(formatDate(parsed, fmt)).toBe(inputs[i])
			})
		})

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
