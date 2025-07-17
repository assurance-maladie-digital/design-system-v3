import { describe, it, expect } from 'vitest'
import { minNumberRule } from '..'

describe('dateHelper', () => {
	const limitNumber = '123'
	const underNumber = '122,99'
	const overNumber = '123.01'

	const rule = minNumberRule(limitNumber)

	it('number under the limit returns string', () => {
		expect(rule(underNumber)).toEqual('Le nombre saisi doit être supérieur ou égal à 123.')
	})

	it('number over the limit returns true', () => {
		expect(rule(overNumber)).toEqual(true)
	})

	it('returns true if value is an empty string', () => {
		expect(rule('')).toEqual(true)
	})
})
