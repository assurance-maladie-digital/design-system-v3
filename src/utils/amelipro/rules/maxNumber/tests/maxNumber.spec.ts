import { describe, it, expect } from 'vitest'
import { maxNumberRule } from '..'

describe('dateHelper', () => {
	const limitNumber = '123'
	const underNumber = '122,99'
	const overNumber = '123.01'

	const rule = maxNumberRule(limitNumber)

	it('number over the limit returns string', () => {
		expect(rule(overNumber)).toEqual('Le nombre saisi doit être inférieur ou égal à 123.')
	})

	it('number under the limit returns true', () => {
		expect(rule(underNumber)).toEqual(true)
	})

	it('returns true if value is an empty string', () => {
		expect(rule('')).toEqual(true)
	})
})
