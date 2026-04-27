import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initializeSelectedDates, type DateInput } from '../useDateInitializationDayjs'

describe('useDateInitializationDayjs', () => {
	describe('initializeSelectedDates', () => {
		it('returns null when modelValue is null or undefined', () => {
			expect(initializeSelectedDates(null, 'DD/MM/YYYY')).toBeNull()
			expect(initializeSelectedDates(null as unknown as DateInput, 'DD/MM/YYYY')).toBeNull()
		})

		it('parses a single date string correctly', () => {
			const result = initializeSelectedDates('15/01/2023', 'DD/MM/YYYY')
			expect(result).toBeInstanceOf(Date)

			const date = result as Date
			expect(date.getFullYear()).toBe(2023)
			expect(date.getMonth()).toBe(0) // Janvier = 0
			expect(date.getDate()).toBe(15)
		})

		it('parses an array of date strings correctly', () => {
			const result = initializeSelectedDates(['15/01/2023', '20/01/2023'], 'DD/MM/YYYY')
			expect(Array.isArray(result)).toBe(true)

			const dates = result as Date[]
			expect(dates.length).toBe(2)

			expect(dates[0]?.getFullYear()).toBe(2023)
			expect(dates[0]?.getMonth()).toBe(0)
			expect(dates[0]?.getDate()).toBe(15)

			expect(dates[1]?.getFullYear()).toBe(2023)
			expect(dates[1]?.getMonth()).toBe(0)
			expect(dates[1]?.getDate()).toBe(20)
		})

		it('returns empty array when dates are invalid', () => {
			const result = initializeSelectedDates(['invalid', '20/01/2023'], 'DD/MM/YYYY')
			expect(Array.isArray(result)).toBe(true)
			expect(result).toHaveLength(0)
		})

		it('returns empty array when first date is after second date', () => {
			const result = initializeSelectedDates(['25/01/2023', '20/01/2023'], 'DD/MM/YYYY')
			expect(Array.isArray(result)).toBe(true)
			expect(result).toHaveLength(0)
		})

		it('handles single element array correctly', () => {
			const result = initializeSelectedDates(['15/01/2023'], 'DD/MM/YYYY')
			expect(Array.isArray(result)).toBe(true)

			const dates = result as Date[]
			expect(dates.length).toBe(1)

			expect(dates[0]?.getFullYear()).toBe(2023)
			expect(dates[0]?.getMonth()).toBe(0)
			expect(dates[0]?.getDate()).toBe(15)
		})

		it('returns empty array for empty array input', () => {
			const result = initializeSelectedDates([], 'DD/MM/YYYY')
			expect(Array.isArray(result)).toBe(true)
			expect(result).toHaveLength(0)
		})

		it('handles different display and return formats correctly', () => {
			// Date au format de retour
			const result1 = initializeSelectedDates('2023-01-15', 'DD/MM/YYYY', 'YYYY-MM-DD')
			expect(result1).toBeInstanceOf(Date)
			expect((result1 as Date).getDate()).toBe(15)

			// Date au format d'affichage quand le format de retour est différent
			const result2 = initializeSelectedDates('15/01/2023', 'DD/MM/YYYY', 'YYYY-MM-DD')
			expect(result2).toBeInstanceOf(Date)
			expect((result2 as Date).getDate()).toBe(15)
		})

		describe('timezone regression', () => {
			let tzOffsetSpy: ReturnType<typeof vi.spyOn> | null = null

			beforeEach(() => {
				tzOffsetSpy = vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(240)
			})

			afterEach(() => {
				tzOffsetSpy?.mockRestore()
				tzOffsetSpy = null
			})

			it('does not shift day when parsing YYYY-MM-DD in a negative timezone (regression)', () => {
				const result = initializeSelectedDates('2022-10-18', 'DD/MM/YYYY', 'YYYY-MM-DD')
				expect(result).toBeInstanceOf(Date)
				expect((result as Date).getFullYear()).toBe(2022)
				expect((result as Date).getMonth()).toBe(9)
				expect((result as Date).getDate()).toBe(18)
			})
		})

		it('creates dates at midnight (00:00:00.000)', () => {
			const result = initializeSelectedDates('15/06/2023', 'DD/MM/YYYY') as Date
			expect(result.getHours()).toBe(0)
			expect(result.getMinutes()).toBe(0)
			expect(result.getSeconds()).toBe(0)
			expect(result.getMilliseconds()).toBe(0)
		})

		it('creates dates at midnight for arrays too', () => {
			const result = initializeSelectedDates(['01/03/2023', '15/03/2023'], 'DD/MM/YYYY') as Date[]
			result.forEach(date => {
				expect(date.getHours()).toBe(0)
				expect(date.getMinutes()).toBe(0)
				expect(date.getSeconds()).toBe(0)
			})
		})

		it('handles range array with different return format', () => {
			const result = initializeSelectedDates(['2023-01-10', '2023-01-20'], 'DD/MM/YYYY', 'YYYY-MM-DD')
			expect(Array.isArray(result)).toBe(true)
			const dates = result as Date[]
			expect(dates).toHaveLength(2)
			expect(dates[0]?.getDate()).toBe(10)
			expect(dates[1]?.getDate()).toBe(20)
		})

		it('accepts a range where both dates are equal', () => {
			const result = initializeSelectedDates(['15/01/2023', '15/01/2023'], 'DD/MM/YYYY')
			expect(Array.isArray(result)).toBe(true)
			expect(result).toHaveLength(2)
		})

		it('returns null for empty string input', () => {
			expect(initializeSelectedDates('', 'DD/MM/YYYY')).toBeNull()
		})

		it('returns null for object input', () => {
			const result = initializeSelectedDates({}, 'DD/MM/YYYY')
			expect(result).toBeNull()
		})

		it('handles invalid date strings correctly', () => {
			const result = initializeSelectedDates('invalid', 'DD/MM/YYYY')
			expect(result).toBeNull()
		})
	})
})
