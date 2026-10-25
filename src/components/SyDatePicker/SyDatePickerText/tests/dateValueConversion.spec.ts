import { describe, expect, it } from 'vitest'
import { formatValue, parseValue, sameValue } from '../dateValueConversion'

describe('dateValueConversion', () => {
	it('parses localized month names', () => {
		expect(parseValue('single', '4 September 2025', 'D MMMM YYYY', ' - ', 'en-US'))
			.toEqual(new Date(2025, 8, 4))
	})

	it('formats with the French fallback locale during SSR', () => {
		expect(formatValue('single', new Date(2025, 8, 3), 'D MMMM YYYY', ' - ', 'fr-FR'))
			.toBe('3 septembre 2025')
	})

	it('formats a range with the separator and parses it back', () => {
		const start = new Date(2025, 0, 15)
		const end = new Date(2025, 0, 20)
		const formatted = formatValue('range', [start, end], 'DD/MM/YYYY', ' - ', 'fr-FR')
		expect(formatted).toBe('15/01/2025 - 20/01/2025')
		expect(parseValue('range', formatted ?? null, 'DD/MM/YYYY', ' - ', 'fr-FR')).toEqual([start, end])
	})

	it('formats an incomplete entry to undefined and parses it to null', () => {
		expect(formatValue('single', null, 'DD/MM/YYYY', ' - ', 'fr-FR')).toBeUndefined()
		expect(parseValue('single', '25/12/20', 'DD/MM/YYYY', ' - ', 'fr-FR')).toBeNull()
	})

	it('compares values per mode', () => {
		const date = new Date(2025, 8, 4)
		expect(sameValue('single', date, new Date(2025, 8, 4))).toBe(true)
		expect(sameValue('single', date, new Date(2025, 8, 5))).toBe(false)
		expect(sameValue('range', [date, date], [date, date])).toBe(true)
		expect(sameValue('range', [date, date], [date, new Date(2025, 8, 5)])).toBe(false)
	})
})
