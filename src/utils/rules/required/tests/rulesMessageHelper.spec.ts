import { ruleMessage } from '../ruleMessageHelper'
import { describe, it, expect } from 'vitest'

describe('ruleMessage', () => {
	it('returns the correct message for a string error message', () => {
		const errorMessages = { required: 'This field is required' }
		const result = ruleMessage(errorMessages, 'required')
		expect(result).toBe('This field is required')
	})

	it('returns the correct message for a function error message', () => {
		const errorMessages = { minLength: (min: number) => `Minimum length is ${min}` }
		const result = ruleMessage(errorMessages, 'minLength', [5])
		expect(result).toBe('Minimum length is 5')
	})

	it('handles multiple arguments for a function error message', () => {
		const errorMessages = { range: (min: number, max: number) => `Value must be between ${min} and ${max}` }
		const result = ruleMessage(errorMessages, 'range', [1, 10])
		expect(result).toBe('Value must be between 1 and 10')
	})
})
