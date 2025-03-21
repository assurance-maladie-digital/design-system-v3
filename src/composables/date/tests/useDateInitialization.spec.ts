import { describe, it, expect } from 'vitest'
import { initializeSelectedDates, type DateInput } from '../useDateInitialization'

describe('useDateInitialization', () => {
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

			expect(dates[0].getFullYear()).toBe(2023)
			expect(dates[0].getMonth()).toBe(0)
			expect(dates[0].getDate()).toBe(15)

			expect(dates[1].getFullYear()).toBe(2023)
			expect(dates[1].getMonth()).toBe(0)
			expect(dates[1].getDate()).toBe(20)
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

			expect(dates[0].getFullYear()).toBe(2023)
			expect(dates[0].getMonth()).toBe(0)
			expect(dates[0].getDate()).toBe(15)
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

			// Date au format d'affichage quand le format de retour est différen
			const result2 = initializeSelectedDates('15/01/2023', 'DD/MM/YYYY', 'YYYY-MM-DD')
			expect(result2).toBeInstanceOf(Date)
			expect((result2 as Date).getDate()).toBe(15)
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
