import { describe, it, expect } from 'vitest'
import { useFieldValidation } from '../useFieldValidation'

describe('useFieldValidation', () => {
	const { generateRules } = useFieldValidation()

	it('should validate required rule', () => {
		const rules = generateRules([{ type: 'required', options: { message: 'This field is required.' } }])
		const rule = rules[0]

		expect(rule('')).toEqual({ error: 'This field is required.' })
		expect(rule('value')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should validate min rule', () => {
		const rules = generateRules([{ type: 'min', options: { value: 5, message: 'Value must be at least 5.' } }])
		const rule = rules[0]

		expect(rule(3)).toEqual({ error: 'Value must be at least 5.' })
		expect(rule(5)).toEqual({ success: 'Le champ est valide.' })
	})

	it('should validate max rule', () => {
		const rules = generateRules([{ type: 'max', options: { value: 10, message: 'Value must be at most 10.' } }])
		const rule = rules[0]

		expect(rule(15)).toEqual({ error: 'Value must be at most 10.' })
		expect(rule(10)).toEqual({ success: 'Le champ est valide.' })
	})

	it('should validate minLength rule', () => {
		const rules = generateRules([{ type: 'minLength', options: { length: 5, message: 'Minimum length is 5.' } }])
		const rule = rules[0]

		expect(rule('1234')).toEqual({ error: 'Minimum length is 5.' })
		expect(rule('12345')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should validate maxLength rule', () => {
		const rules = generateRules([{ type: 'maxLength', options: { length: 5, message: 'Maximum length is 5.' } }])
		const rule = rules[0]

		expect(rule('123456')).toEqual({ error: 'Maximum length is 5.' })
		expect(rule('12345')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should validate exactLength rule', () => {
		const rules = generateRules([{ type: 'exactLength', options: { length: 5, message: 'Length must be exactly 5.' } }])
		const rule = rules[0]

		expect(rule('1234')).toEqual({ error: 'Length must be exactly 5.' })
		expect(rule('12345')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should validate email rule', () => {
		const rules = generateRules([{ type: 'email', options: { message: 'Invalid email address.' } }])
		const rule = rules[0]

		expect(rule('invalid-email')).toEqual({ error: 'Invalid email address.' })
		expect(rule('test@example.com')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should validate matchPattern rule', () => {
		const rules = generateRules([{
			type: 'matchPattern',
			options: { pattern: /^[a-z]+$/, message: 'Invalid format.' },
		}])
		const rule = rules[0]

		expect(rule('123')).toEqual({ error: 'Invalid format.' })
		expect(rule('abc')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should validate custom rule', () => {
		const rules = generateRules([{
			type: 'custom',
			options: { validate: value => value === 'valid', message: 'Custom validation failed.' },
		}])
		const rule = rules[0]

		expect(rule('invalid')).toEqual({ error: 'Custom validation failed.' })
		expect(rule('valid')).toEqual({ success: 'Le champ est valide.' })
	})
})
