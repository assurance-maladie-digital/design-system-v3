import dayjs from 'dayjs'
import { it, describe, expect } from 'vitest'
import { isNotAfterTodayFn } from '..'
import { defaultErrorMessages } from '../locales'

const DATE_FORMAT = 'DD/MM/YYYY'

const pastDate = dayjs().subtract(1, 'year').format(DATE_FORMAT)
const futureDate = dayjs().add(1, 'year').format(DATE_FORMAT)
const today = dayjs().format(DATE_FORMAT)
const pastDateObject = dayjs().subtract(1, 'year').toDate()
const futureDateObject = dayjs().add(1, 'year').toDate()
const todayDateObject = dayjs().toDate()

describe('notAfterTodayFn', () => {
	const notAfterToday = isNotAfterTodayFn(defaultErrorMessages)

	it('returns true when value is null', () => {
		expect(notAfterToday(null)).toBe(true)
	})

	it('returns true when value is a date before today', () => {
		expect(notAfterToday(pastDate)).toBe(true)
	})

	it('returns error message when value is a date after today', () => {
		expect(notAfterToday(futureDate)).toBe(defaultErrorMessages.default)
	})

	it('returns true when value is today', () => {
		expect(notAfterToday(today)).toBe(true)
	})

	it('returns true when value is a past Date object', () => {
		expect(notAfterToday(pastDateObject)).toBe(true)
	})

	it('returns error message when value is a future Date object', () => {
		expect(notAfterToday(futureDateObject)).toBe(defaultErrorMessages.default)
	})

	it('returns true when value is today as a Date object', () => {
		expect(notAfterToday(todayDateObject)).toBe(true)
	})

	it('returns error message when value type is not supported', () => {
		// number is allowed by Value type but is not handled by the rule
		expect(notAfterToday(123 as unknown as string)).toBe(defaultErrorMessages.default)
	})
})
