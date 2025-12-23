import { isNotBeforeDateFn } from '..'
import { describe, it, expect } from 'vitest'

import dayjs from 'dayjs'
import { formatDate } from '@/utils/formatDate'

describe('isNotBeforeDate', () => {
	const currentDate = formatDate(dayjs())
	const pastDate = formatDate(dayjs().subtract(1, 'year'))
	const futureDate = formatDate(dayjs().add(1, 'year'))
	const pastDateObject = dayjs().subtract(1, 'year').toDate()
	const futureDateObject = dayjs().add(1, 'year').toDate()
	const todayDateObject = dayjs().toDate()

	const rule = isNotBeforeDateFn(currentDate)

	it('returns true with a future date', () => {
		expect(rule(futureDate)).toBe(true)
	})

	it('returns an error with a past date', () => {
		expect(typeof rule(pastDate)).toBe('string')
	})

	it('returns true if the value is falsy', () => {
		expect(rule('')).toBe(true)
	})

	it('returns true with a future Date object', () => {
		expect(rule(futureDateObject)).toBe(true)
	})

	it('returns an error with a past Date object', () => {
		expect(typeof rule(pastDateObject)).toBe('string')
	})

	it('returns true when the value is the reference date as a Date object', () => {
		expect(rule(todayDateObject)).toBe(true)
	})

	it('returns an error when the value type is not supported', () => {
		// number is allowed by Value type but is not handled by the rule
		expect(typeof rule(123 as unknown as string)).toBe('string')
	})
})
