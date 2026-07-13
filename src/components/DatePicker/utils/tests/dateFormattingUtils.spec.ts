import { describe, expect, it } from 'vitest'
import { formatDateRangeDisplay, getDisplayedMonthYearState } from '../dateFormattingUtils'

describe('dateFormattingUtils', () => {
	it('returns displayed month/year state from a date', () => {
		const result = getDisplayedMonthYearState(new Date(2025, 6, 14))

		expect(result.month).toBe('6')
		expect(result.year).toBe('2025')
		expect(result.yearName).toBe('2025')
		expect(result.monthName).toBeTruthy()
	})

	it('formats a date range display with the shared separator', () => {
		const result = formatDateRangeDisplay(
			new Date(2025, 0, 1),
			new Date(2025, 0, 15),
			'DD/MM/YYYY',
			(date) => {
				const value = date as Date
				return `${String(value.getDate()).padStart(2, '0')}/${String(value.getMonth() + 1).padStart(2, '0')}/${value.getFullYear()}`
			},
		)

		expect(result).toBe('01/01/2025 - 15/01/2025')
	})
})
