import { describe, expect, it } from 'vitest'
import { formatDateRangeDisplay, getDisplayedMonthYearState, resolveDatePickerStateFromModelValue } from '../dateFormattingUtils'

const parseDate = (value: string, format: string): Date | null => {
	if (format === 'YYYY-MM-DD') {
		const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
		if (!match) return null
		return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
	}

	if (format === 'DD/MM/YYYY') {
		const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
		if (!match) return null
		return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
	}

	return null
}

const formatDate = (date: Date | null, format: string): string => {
	if (!date) return ''

	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = String(date.getFullYear())

	if (format === 'YYYY-MM-DD') {
		return `${year}-${month}-${day}`
	}

	return `${day}/${month}/${year}`
}

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

	it('resolves a single model value into selected date and display value', () => {
		const result = resolveDatePickerStateFromModelValue({
			modelValue: '2026-07-01',
			displayRange: false,
			displayFormat: 'DD/MM/YYYY',
			returnFormat: 'YYYY-MM-DD',
			parseDate,
			formatDate,
		})

		expect(result.displayValue).toBe('01/07/2026')
		expect(result.selectedDates).toEqual(new Date(2026, 6, 1))
	})

	it('resolves a range model value into generated dates and display value', () => {
		const result = resolveDatePickerStateFromModelValue({
			modelValue: ['2026-07-01', '2026-07-03'],
			displayRange: true,
			displayFormat: 'DD/MM/YYYY',
			returnFormat: 'YYYY-MM-DD',
			parseDate,
			formatDate,
			generateDateRange: (start, end) => [start, new Date(2026, 6, 2), end],
		})

		expect(result.displayValue).toBe('01/07/2026 - 03/07/2026')
		expect(result.selectedDates).toEqual([
			new Date(2026, 6, 1),
			new Date(2026, 6, 2),
			new Date(2026, 6, 3),
		])
	})

	it('preserves invalid model strings only when explicitly requested', () => {
		const hiddenInvalid = resolveDatePickerStateFromModelValue({
			modelValue: 'not-a-date',
			displayRange: false,
			displayFormat: 'DD/MM/YYYY',
			returnFormat: 'YYYY-MM-DD',
			parseDate,
			formatDate,
		})
		const preservedInvalid = resolveDatePickerStateFromModelValue({
			modelValue: 'not-a-date',
			displayRange: false,
			displayFormat: 'DD/MM/YYYY',
			returnFormat: 'YYYY-MM-DD',
			parseDate,
			formatDate,
			preserveInvalidValue: true,
		})

		expect(hiddenInvalid).toEqual({
			selectedDates: null,
			displayValue: '',
		})
		expect(preservedInvalid).toEqual({
			selectedDates: null,
			displayValue: 'not-a-date',
		})
	})
})
