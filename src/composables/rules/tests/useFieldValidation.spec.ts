import { useFieldValidation } from '../useFieldValidation'
import { describe, it, expect } from 'vitest'

describe('useFieldValidation', () => {
	const { generateRules } = useFieldValidation()

	describe('createRule', () => {
		it('should validate required rule', () => {
			const rules = generateRules([{ type: 'required', options: { fieldName: 'Nom' } }])
			const requiredRule = rules[0]

			expect(requiredRule('')).toBe('Vous devez renseigner Nom.')
			expect(requiredRule('Test')).toBe(true)
		})

		it('should validate min rule', () => {
			const rules = generateRules([{ type: 'min', options: { value: 5 } }])
			const minRule = rules[0]

			expect(minRule(3)).toBe('La valeur doit être supérieure ou égale à 5.')
			expect(minRule(5)).toBe(true)
			expect(minRule(10)).toBe(true)
		})

		it('should validate minLength rule', () => {
			const rules = generateRules([{ type: 'minLength', options: { length: 3 } }])
			const minLengthRule = rules[0]

			expect(minLengthRule('ab')).toBe('Ce champ doit avoir au moins 3 caractères.')
			expect(minLengthRule('abc')).toBe(true)
		})

		it('should validate max rule', () => {
			const rules = generateRules([{ type: 'max', options: { value: 10 } }])
			const maxRule = rules[0]

			expect(maxRule(15)).toBe('La valeur doit être inférieure ou égale à 10.')
			expect(maxRule(10)).toBe(true)
			expect(maxRule(5)).toBe(true)
		})

		it('should validate maxLength rule', () => {
			const rules = generateRules([{ type: 'maxLength', options: { length: 5 } }])
			const maxLengthRule = rules[0]

			expect(maxLengthRule('abcdef')).toBe('Ce champ ne doit pas dépasser 5 caractères.')
			expect(maxLengthRule('abc')).toBe(true)
		})

		it('should validate exactLength rule', () => {
			const rules = generateRules([{ type: 'exactLength', options: { length: 4 } }])
			const exactLengthRule = rules[0]

			expect(exactLengthRule('abc')).toBe('Ce champ doit avoir exactement 4 caractères.')
			expect(exactLengthRule('abcd')).toBe(true)
		})

		it('should validate email rule', () => {
			const rules = generateRules([{ type: 'email' }])
			const emailRule = rules[0]

			expect(emailRule('invalid-email')).toBe('Veuillez entrer un email valide.')
			expect(emailRule('test@example.com')).toBe(true)
		})

		it('should validate matchPattern rule', () => {
			const rules = generateRules([{ type: 'matchPattern', options: { pattern: /^[a-z]+$/ } }])
			const matchPatternRule = rules[0]

			expect(matchPatternRule('123')).toBe('Format invalide.')
			expect(matchPatternRule('abc')).toBe(true)
		})

		it('should handle ignoreSpace option in length rules', () => {
			const rules = generateRules([{ type: 'minLength', options: { length: 3, ignoreSpace: true } }])
			const minLengthRule = rules[0]

			expect(minLengthRule('a b')).toBe('Ce champ doit avoir au moins 3 caractères.')
			expect(minLengthRule('ab c')).toBe(true)
		})
	})
})
