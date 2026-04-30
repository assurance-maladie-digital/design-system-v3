import { describe, it, expect, vi } from 'vitest'
import { useValidation } from '../useValidation'

describe('useValidation', () => {
	it('should initialize with empty validation state', () => {
		const validation = useValidation()

		expect(validation.errors.value).toEqual([])
		expect(validation.warnings.value).toEqual([])
		expect(validation.successes.value).toEqual([])
		expect(validation.displaySuccesses.value).toEqual([])
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

	it('should expose displaySuccesses populated when showSuccessMessages is true', async () => {
		const validation = useValidation({ showSuccessMessages: true })
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
				successMessage: 'Champ valide',
			},
		}]

		const result = await validation.validateField('test', rules)
		expect(result.hasSuccess).toBe(true)
		expect(validation.successes.value).toEqual(['Champ valide'])
		expect(validation.displaySuccesses.value).toEqual(['Champ valide'])
	})

	it('should populate successes even when showSuccessMessages is false', async () => {
		const validation = useValidation({ showSuccessMessages: false })
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
				successMessage: 'Champ valide',
			},
		}]

		const result = await validation.validateField('test', rules)
		expect(result.hasSuccess).toBe(true)
		expect(result.state.successes).toEqual(['Champ valide'])
		expect(validation.displaySuccesses.value).toEqual([])
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
		expect(validation.validateOnSubmit()).toBe(false)

		await validation.validateField('test', rules)
		expect(validation.validateOnSubmit()).toBe(true)
	})

	describe('Handle thrown errors in async rules', () => {
		it('should handle thrown error in async validation rules', async () => {
			const validation = useValidation()
			const rules = [{
				type: 'custom',
				options: {
					validate: async () => {
						throw new Error('Network error')
					},
					message: 'Erreur personnalisée',
				},
			}]

			const result = await validation.validateField('test', rules)
			expect(result.hasError).toBe(true)
			expect(result.state.errors[0]).toBe('Erreur personnalisée')
		})

		it('should use thrown error message when no custom message is provided', async () => {
			const validation = useValidation()
			const rules = [{
				type: 'custom',
				options: {
					validate: async () => {
						throw new Error('Service unavailable')
					},
				},
			}]

			const result = await validation.validateField('test', rules)
			expect(result.hasError).toBe(true)
			expect(result.state.errors[0]).toBe('Service unavailable')
		})

		it('should handle thrown error in async warning rules', async () => {
			const validation = useValidation()
			const warningRules = [{
				type: 'custom',
				options: {
					validate: async () => {
						throw new Error('Warning service failed')
					},
					isWarning: true,
				},
			}]

			const result = await validation.validateField('test', [], warningRules)
			expect(result.hasWarning).toBe(true)
			expect(result.state.warnings[0]).toBe('Warning service failed')
		})
	})

	it('should discard a slow async validation when a newer one is triggered after', async () => {
		vi.useFakeTimers()
		const validation = useValidation()

		// Slow rule: resolves after 100ms with an error
		const slowRules = [{
			type: 'custom',
			options: {
				validate: () => new Promise<boolean>(resolve => setTimeout(() => resolve(false), 100)),
				message: 'Erreur lente',
			},
		}]

		// Fast rule: resolves immediately with success
		const fastRules = [{
			type: 'custom',
			options: {
				validate: () => true,
				successMessage: 'Validation rapide réussie',
			},
		}]

		// Launch slow validation first, then fast validation immediately after
		const slowPromise = validation.validateField('test', slowRules)
		const fastResult = await validation.validateField('test', fastRules)

		// Fast validation should have succeeded
		expect(fastResult.hasError).toBe(false)
		expect(fastResult.hasSuccess).toBe(true)
		expect(fastResult.state.successes).toContain('Validation rapide réussie')

		// Wait for the slow validation to resolve
		vi.advanceTimersByTime(100)
		await slowPromise

		// The slow validation must NOT have overwritten the fast result
		expect(validation.errors.value).toEqual([])
		expect(validation.hasError.value).toBe(false)
		expect(validation.successes.value).toContain('Validation rapide réussie')

		vi.useRealTimers()
	})
})
