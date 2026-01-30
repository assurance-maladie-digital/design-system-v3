import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { useValidation, type ValidationOptions } from '../useValidation'

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

	it('should handle basic validation rules', () => {
		const validation = useValidation()
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
				successMessage: 'Champ valide',
			},
		}]

		// Test avec une valeur vide
		const emptyResult = validation.validateField('', rules)
		expect(emptyResult.hasError).toBe(true)
		expect(emptyResult.state.errors).toContain('Ce champ est requis')

		// Test avec une valeur valide
		const validResult = validation.validateField('test', rules)
		expect(validResult.hasSuccess).toBe(true)
		expect(validResult.state.successes).toContain('Champ valide')
	})

	it('should handle warning rules', () => {
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
		const shortResult = validation.validateField('test', [], warningRules)
		expect(shortResult.hasWarning).toBe(true)
		expect(shortResult.state.warnings[0]).toContain('8 caractères')

		// Test avec une valeur valide
		const validResult = validation.validateField('test_long', [], warningRules)
		expect(validResult.hasWarning).toBe(false)
		expect(validResult.state.warnings).toEqual([])
	})

	it('should handle multiple validation rules', () => {
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
		const emptyResult = validation.validateField('', rules)
		expect(emptyResult.hasError).toBe(true)
		expect(emptyResult.state.errors).toContain('Ce champ est requis')

		// Test avec une valeur trop courte
		const shortResult = validation.validateField('ab', rules)
		expect(shortResult.hasError).toBe(true)
		expect(shortResult.state.errors).toContain('Minimum 3 caractères requis')

		// Test avec une valeur valide
		const validResult = validation.validateField('abc', rules)
		expect(validResult.hasError).toBe(false)
		expect(validResult.hasSuccess).toBe(true)
	})

	it('should respect showSuccessMessages option', () => {
		const validation = useValidation({ showSuccessMessages: false })
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
				successMessage: 'Champ valide',
			},
		}]

		const result = validation.validateField('test', rules)
		expect(result.hasSuccess).toBe(false)
		expect(result.state.successes).toEqual([])
	})

	it('should react to reactive options changes for success messages and fieldIdentifier', () => {
		const options = ref<ValidationOptions>({ showSuccessMessages: false, fieldIdentifier: 'Email' })
		const validation = useValidation(options)
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
			},
		}]

		// Avec showSuccessMessages à false, pas de succès retourné
		const resultWithoutSuccess = validation.validateField('ok', rules)
		expect(resultWithoutSuccess.hasSuccess).toBe(false)
		expect(resultWithoutSuccess.state.successes).toEqual([])

		// Mise à jour réactive des options
		options.value.showSuccessMessages = true
		options.value.fieldIdentifier = 'Nom'

		const resultWithSuccess = validation.validateField('ok', rules)
		expect(resultWithSuccess.hasSuccess).toBe(true)
		expect(resultWithSuccess.state.successes).toContain('Le champ Nom est valide.')
	})

	it('should respect reactive disableErrorHandling option', () => {
		const options = ref<ValidationOptions>({ disableErrorHandling: true })
		const validation = useValidation(options)
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
			},
		}]

		// Mode désactivé : aucune erreur même si la règle échoue
		const disabledResult = validation.validateField('', rules)
		expect(disabledResult.hasError).toBe(false)
		expect(disabledResult.state.errors).toEqual([])

		// Réactivation : l'erreur doit remonter
		options.value.disableErrorHandling = false
		const enabledResult = validation.validateField('', rules)
		expect(enabledResult.hasError).toBe(true)
		expect(enabledResult.state.errors).toContain('Ce champ est requis')
	})

	it('validateOnSubmit should run validation when params are provided', async () => {
		const validation = useValidation()
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
			},
		}]

		const result = await validation.validateOnSubmit('', rules)
		expect(result).toBe(false)
		expect(validation.errors.value).toContain('Ce champ est requis')
	})

	it('should use fieldIdentifier in messages', () => {
		const validation = useValidation({ fieldIdentifier: 'Email' })
		const rules = [{
			type: 'required',
			options: {
				message: 'Le champ Email est requis',
			},
		}]

		const result = validation.validateField('', rules)
		expect(result.state.errors[0]).toContain('Email')
	})

	it('should clear validation state', () => {
		const validation = useValidation()
		const rules = [{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
			},
		}]

		validation.validateField('', rules)
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

		validation.validateField('', rules)
		expect(await validation.validateOnSubmit()).toBe(false)

		validation.validateField('test', rules)
		expect(await validation.validateOnSubmit()).toBe(true)
	})
})
