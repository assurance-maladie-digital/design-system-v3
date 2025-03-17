import { describe, it, expect } from 'vitest'
import { useValidation } from '../useValidation'

describe('useValidation', () => {
	it('should initialize with empty validation state', () => {
		const validation = useValidation()

		expect(validation.errors.value).toEqual([])
		expect(validation.warnings.value).toEqual([])
		expect(validation.successes.value).toEqual([])
		expect(validation.hasError.value).toBe(false)
		expect(validation.hasWarning.value).toBe(false)
		expect(validation.hasSuccess.value).toBe(false)
	})

	it('should handle basic validation rules', async () => {
		const validation = useValidation()
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
				successMessage: 'Champ valide',
			},
		}]

		// Test avec une valeur vide
		const emptyResult = await validation.validateField('', rules)
		expect(emptyResult.hasError).toBe(true)
		expect(emptyResult.state.errors).toContain('Ce champ est requis')

		// Test avec une valeur valide
		const validResult = await validation.validateField('test', rules)
		expect(validResult.hasSuccess).toBe(true)
		expect(validResult.state.successes).toContain('Champ valide')
	})

	it('should handle warning rules', async () => {
		const validation = useValidation()
		const warningRules = [{
			type: 'custom',
			options: {
				validate: (value: string) => value.length >= 8,
				warningMessage: 'Le champ devrait contenir au moins 8 caractères',
				isWarning: true,
			},
		}]

		// Test avec une valeur courte
		const shortResult = await validation.validateField('test', [], warningRules)
		expect(shortResult.hasWarning).toBe(true)
		expect(shortResult.state.warnings[0]).toContain('8 caractères')

		// Test avec une valeur valide
		const validResult = await validation.validateField('test_long', [], warningRules)
		expect(validResult.hasWarning).toBe(false)
		expect(validResult.state.warnings).toEqual([])
	})

	it('should handle multiple validation rules', async () => {
		const validation = useValidation()
		const rules = [
			{
				type: 'required',
				options: {
					message: 'Ce champ est requis',
				},
			},
			{
				type: 'minLength',
				options: {
					length: 3,
					message: 'Minimum 3 caractères requis',
				},
			},
		]

		// Test avec une valeur vide
		const emptyResult = await validation.validateField('', rules)
		expect(emptyResult.hasError).toBe(true)
		expect(emptyResult.state.errors).toContain('Ce champ est requis')

		// Test avec une valeur trop courte
		const shortResult = await validation.validateField('ab', rules)
		expect(shortResult.hasError).toBe(true)
		expect(shortResult.state.errors).toContain('Minimum 3 caractères requis')

		// Test avec une valeur valide
		const validResult = await validation.validateField('abc', rules)
		expect(validResult.hasError).toBe(false)
		expect(validResult.hasSuccess).toBe(true)
	})

	it('should respect showSuccessMessages option', async () => {
		const validation = useValidation({ showSuccessMessages: false })
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
				successMessage: 'Champ valide',
			},
		}]

		const result = await validation.validateField('test', rules)
		expect(result.hasSuccess).toBe(false)
		expect(result.state.successes).toEqual([])
	})

	it('should use fieldIdentifier in messages', async () => {
		const validation = useValidation({ fieldIdentifier: 'Email' })
		const rules = [{
			type: 'required',
			options: {
				message: 'Le champ Email est requis',
			},
		}]

		const result = await validation.validateField('', rules)
		expect(result.state.errors[0]).toContain('Email')
	})

	it('should clear validation state', async () => {
		const validation = useValidation()
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
			},
		}]

		await validation.validateField('', rules)
		expect(validation.hasError.value).toBe(true)

		validation.clearValidation()
		expect(validation.errors.value).toEqual([])
		expect(validation.warnings.value).toEqual([])
		expect(validation.successes.value).toEqual([])
	})

	it('should validate on submit', async () => {
		const validation = useValidation()
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
			},
		}]

		await validation.validateField('', rules)
		expect(await validation.validateOnSubmit()).toBe(false)

		await validation.validateField('test', rules)
		expect(await validation.validateOnSubmit()).toBe(true)
	})
})
