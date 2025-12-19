import dayjs from 'dayjs'

import { isNotBeforeToday, isNotBeforeTodayFn } from '..'
import { describe, it, expect } from 'vitest'

const DATE_FORMAT = 'DD/MM/YYYY'

const pastDate = dayjs().subtract(1, 'year').format(DATE_FORMAT)
const futureDate = dayjs().add(1, 'year').format(DATE_FORMAT)
const today = dayjs().format(DATE_FORMAT)
const pastDateObject = dayjs().subtract(1, 'year').toDate()
const futureDateObject = dayjs().add(1, 'year').toDate()
const todayDateObject = dayjs().toDate()

describe('isNotBeforeToday', () => {
	it('returns an error when the date is past', () => {
		expect(typeof isNotBeforeToday(pastDate)).toBe('string')
	})

	it('returns true when the date is future', () => {
		expect(isNotBeforeToday(futureDate)).toBe(true)
	})

	it('returns true if the value is falsy', () => {
		expect(isNotBeforeToday('')).toBe(true)
	})

	it('works with custom error messages', () => {
		const rule = isNotBeforeTodayFn({
			default: 'test',
		})

		expect(rule(pastDate)).toBe('test')
	})

	it('returns true when value is today', () => {
		expect(isNotBeforeToday(today)).toBe(true)
	})

	it('returns an error when the value is a past Date object', () => {
		expect(typeof isNotBeforeToday(pastDateObject)).toBe('string')
	})

	it('returns true when the value is a future Date object', () => {
		expect(isNotBeforeToday(futureDateObject)).toBe(true)
	})

	it('returns true when the value is today as a Date object', () => {
		expect(isNotBeforeToday(todayDateObject)).toBe(true)
	})

	it('returns an error when the value is neither a string nor a Date', () => {
		expect(typeof isNotBeforeToday(123)).toBe('string')
	})
})
