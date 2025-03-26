import { isValidEmail, isValidEmailFn } from '..'
import { describe, it, expect } from 'vitest'

describe('email', () => {
	it('returns an error when the email is invalid', () => {
		expect(typeof isValidEmail('test')).toBe('string')
	})

	it('returns true when the email is valid', () => {
		expect(isValidEmail('test@example.com')).toBe(true)
	})

	it('returns true if the value is falsy', () => {
		expect(isValidEmail('')).toBe(true)
	})

	it('works with custom error messages', () => {
		const rule = isValidEmailFn({
			default: 'test',
		})

		expect(rule('test')).toBe('test')
	})
})
