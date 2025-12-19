import { isDateValid, isDateValidFn } from '../'
import { describe, it, expect } from 'vitest'

const validDate = '14/09/2019'
const invalidDate = '99/99/9999'
const validDateObject = new Date(2019, 8, 14)

describe('isDateValid', () => {
	it('returns an error when the date is not valid', () => {
		expect(typeof isDateValid(invalidDate)).toBe('string')
	})

	it('returns true when the date is valid', () => {
		expect(isDateValid(validDate)).toBe(true)
	})

	it('returns true if the value is falsy', () => {
		expect(isDateValid('')).toBe(true)
	})

	it('returns true when the value is a valid Date object', () => {
		expect(isDateValid(validDateObject)).toBe(true)
	})

	it('returns an error when the value type is not supported', () => {
		expect(typeof isDateValid(123 as unknown as string)).toBe('string')
	})

	it('works with custom error messages', () => {
		const rule = isDateValidFn({
			default: 'test',
		})

		expect(rule(invalidDate)).toBe('test')
	})
})
