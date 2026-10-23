import { describe, it, expect } from 'vitest'
import { isEmptySelectValue } from '../isEmptySelectValue'

describe('isEmptySelectValue', () => {
	it.each([null, undefined, ''])('considers %o as empty', (value) => {
		expect(isEmptySelectValue(value)).toBe(true)
	})

	it.each([0, false, 'a', 1, true, [], {}])('considers %o as a value', (value) => {
		expect(isEmptySelectValue(value)).toBe(false)
	})
})
