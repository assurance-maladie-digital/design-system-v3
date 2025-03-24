import { describe, it, expect } from 'vitest'
import { formatDate, parseDate } from '../useDateFormat'

describe('useDateFormat', () => {
	describe('formatDate', () => {
		it('formats a Date object to string according to the specified format', () => {
			const date = new Date(2023, 0, 15) // 15 janvier 2023
			expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2023')
			expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-01-15')
			expect(formatDate(date, 'MM.DD.YYYY')).toBe('01.15.2023')
		})

		it('returns empty string when date is null or undefined', () => {
			expect(formatDate(null as unknown as Date, 'DD/MM/YYYY')).toBe('')
			expect(formatDate(undefined as unknown as Date, 'DD/MM/YYYY')).toBe('')
		})

		it('handles different date formats correctly', () => {
			const date = new Date(2023, 11, 31) // 31 décembre 2023
			expect(formatDate(date, 'DD/MM/YYYY')).toBe('31/12/2023')
			expect(formatDate(date, 'D/M/YYYY')).toBe('31/12/2023')
			expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-12-31')
			expect(formatDate(date, 'MM/DD/YYYY')).toBe('12/31/2023')
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
			expect(parseDate('01/15/2023', 'MM/DD/YYYY')?.getDate()).toBe(15)
			expect(parseDate('15.01.2023', 'DD.MM.YYYY')?.getDate()).toBe(15)
		})

		it('returns null when input is null or empty', () => {
			expect(parseDate(null as unknown as string, 'DD/MM/YYYY')).toBeNull()
			expect(parseDate('', 'DD/MM/YYYY')).toBeNull()
		})

		it('handles leap years correctly', () => {
			// 2020 était une année bissextile
			expect(parseDate('29/02/2020', 'DD/MM/YYYY')).not.toBeNull()
			// 2023 n'est pas une année bissextile
			expect(parseDate('29/02/2023', 'DD/MM/YYYY')).toBeNull()
		})
	})
})
