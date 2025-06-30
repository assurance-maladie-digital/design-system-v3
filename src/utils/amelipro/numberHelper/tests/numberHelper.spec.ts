import { describe, it, expect } from 'vitest'
import { numberMatchRegex, parseToNumber, parseToFrNumberFormat } from '../numberHelper'

describe('numberHelper', () => {
	it('wrong value does not match the number regex', () => {
		const value = numberMatchRegex('abcd')
		expect(value).toBeFalsy()
	})

	it('good value matches the number regex', () => {
		const value = numberMatchRegex('325.76')
		expect(value).toBeTruthy()
	})

	it('transform "," into "." and make it a number', () => {
		const value = '1230,723'
		expect(parseToNumber(value)).toEqual(1230.723)
	})

	it('transform "." into "," and make it a string', () => {
		const value = 1230.723
		expect(parseToFrNumberFormat(value)).toEqual('1230,723')
	})
})
