import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useManualDateValidation } from '../useManualDateValidation'

describe('useManualDateValidation', () => {
	// Mocks et setup
	const mockClearValidation = vi.fn()
	const mockValidateDateFormat = vi.fn()
	const mockIsDateComplete = vi.fn()
	const mockParseDate = vi.fn()
	const mockValidateField = vi.fn()
	const hasInteracted = ref(false)
	const errors = ref<string[]>([])

	beforeEach(() => {
		// Réinitialiser les mocks et les refs avant chaque test
		mockClearValidation.mockReset()
		mockValidateDateFormat.mockReset()
		mockIsDateComplete.mockReset()
		mockParseDate.mockReset()
		mockValidateField.mockReset()
		hasInteracted.value = false
		errors.value = []
	})

	it('devrait appeler clearValidation lors de la validation', () => {
		const { validateManualInput } = useManualDateValidation({
			format: 'DD/MM/YYYY',
			hasInteracted,
			errors,
			clearValidation: mockClearValidation,
			validateDateFormat: mockValidateDateFormat,
			isDateComplete: mockIsDateComplete,
			parseDate: mockParseDate,
			validateField: mockValidateField,
		})

		validateManualInput('01/01/2023')

		expect(mockClearValidation).toHaveBeenCalledTimes(1)
	})

	it('devrait retourner false et ajouter une erreur si le champ est requis, vide et l\'utilisateur a interagi', () => {
		hasInteracted.value = true

		const { validateManualInput } = useManualDateValidation({
			format: 'DD/MM/YYYY',
			required: true,
			hasInteracted,
			errors,
			clearValidation: mockClearValidation,
			validateDateFormat: mockValidateDateFormat,
			isDateComplete: mockIsDateComplete,
			parseDate: mockParseDate,
			validateField: mockValidateField,
		})

		const result = validateManualInput('')

		expect(result).toBe(false)
		expect(errors.value).toContain('La date est requise.')
	})

	it('devrait retourner true si le champ est vide et non requis', () => {
		const { validateManualInput } = useManualDateValidation({
			format: 'DD/MM/YYYY',
			required: false,
			hasInteracted,
			errors,
			clearValidation: mockClearValidation,
			validateDateFormat: mockValidateDateFormat,
			isDateComplete: mockIsDateComplete,
			parseDate: mockParseDate,
			validateField: mockValidateField,
		})

		const result = validateManualInput('')

		expect(result).toBe(true)
		expect(errors.value).toHaveLength(0)
	})

	it('devrait retourner true si la saisie n\'est pas complète', () => {
		mockIsDateComplete.mockReturnValue(false)

		const { validateManualInput } = useManualDateValidation({
			format: 'DD/MM/YYYY',
			hasInteracted,
			errors,
			clearValidation: mockClearValidation,
			validateDateFormat: mockValidateDateFormat,
			isDateComplete: mockIsDateComplete,
			parseDate: mockParseDate,
			validateField: mockValidateField,
		})

		const result = validateManualInput('01/01')

		expect(result).toBe(true)
		expect(errors.value).toHaveLength(0)
	})

	it('devrait retourner false et ajouter une erreur si le format est invalide', () => {
		mockIsDateComplete.mockReturnValue(true)
		mockValidateDateFormat.mockReturnValue({ isValid: false, message: 'Format de date invalide (DD/MM/YYYY)' })

		const { validateManualInput } = useManualDateValidation({
			format: 'DD/MM/YYYY',
			hasInteracted,
			errors,
			clearValidation: mockClearValidation,
			validateDateFormat: mockValidateDateFormat,
			isDateComplete: mockIsDateComplete,
			parseDate: mockParseDate,
			validateField: mockValidateField,
		})

		const result = validateManualInput('32/01/2023')

		expect(result).toBe(false)
		expect(errors.value).toContain('Format de date invalide (DD/MM/YYYY)')
	})

	it('ne devrait pas ajouter d\'erreur si disableErrorHandling=true', () => {
		mockIsDateComplete.mockReturnValue(true)
		mockValidateDateFormat.mockReturnValue({ isValid: false, message: 'Format de date invalide (DD/MM/YYYY)' })

		const { validateManualInput } = useManualDateValidation({
			format: 'DD/MM/YYYY',
			disableErrorHandling: true,
			hasInteracted,
			errors,
			clearValidation: mockClearValidation,
			validateDateFormat: mockValidateDateFormat,
			isDateComplete: mockIsDateComplete,
			parseDate: mockParseDate,
			validateField: mockValidateField,
		})

		validateManualInput('32/01/2023')

		expect(errors.value).toHaveLength(0)
	})

	it('devrait retourner false et ajouter une erreur si la date ne peut pas être parsée', () => {
		mockIsDateComplete.mockReturnValue(true)
		mockValidateDateFormat.mockReturnValue({ isValid: true, message: '' })
		mockParseDate.mockReturnValue(null)

		const { validateManualInput } = useManualDateValidation({
			format: 'DD/MM/YYYY',
			hasInteracted,
			errors,
			clearValidation: mockClearValidation,
			validateDateFormat: mockValidateDateFormat,
			isDateComplete: mockIsDateComplete,
			parseDate: mockParseDate,
			validateField: mockValidateField,
		})

		const result = validateManualInput('01/01/2023')

		expect(result).toBe(false)
		expect(errors.value).toContain('Format de date invalide (JJ/MM/AAAA)')
	})

	it('devrait appeler validateField avec les règles personnalisées', () => {
		const date = new Date('2023-01-01')
		const customRules = [{ type: 'custom', options: { validate: () => true } }]
		const customWarningRules = [{ type: 'warning', options: { validate: () => true } }]

		mockIsDateComplete.mockReturnValue(true)
		mockValidateDateFormat.mockReturnValue({ isValid: true, message: '' })
		mockParseDate.mockReturnValue(date)
		mockValidateField.mockReturnValue({ valid: true })

		const { validateManualInput } = useManualDateValidation({
			format: 'DD/MM/YYYY',
			customRules,
			customWarningRules,
			hasInteracted,
			errors,
			clearValidation: mockClearValidation,
			validateDateFormat: mockValidateDateFormat,
			isDateComplete: mockIsDateComplete,
			parseDate: mockParseDate,
			validateField: mockValidateField,
		})

		validateManualInput('01/01/2023')

		// Vérifier que validateField a été appelé
		expect(mockValidateField).toHaveBeenCalled()
		// Vérifier que le premier argument est la date attendue
		expect(mockValidateField.mock.calls[0][0]).toBe(date)
		// Vérifier la structure des règles sans comparer les références de fonctions
		expect(mockValidateField.mock.calls[0][1][0].type).toBe('custom')
		expect(typeof mockValidateField.mock.calls[0][1][0].options.validate).toBe('function')
		expect(mockValidateField.mock.calls[0][2][0].type).toBe('warning')
		expect(typeof mockValidateField.mock.calls[0][2][0].options.validate).toBe('function')
	})

	it('devrait retourner le résultat de validateField', () => {
		mockIsDateComplete.mockReturnValue(true)
		mockValidateDateFormat.mockReturnValue({ isValid: true, message: '' })
		mockParseDate.mockReturnValue(new Date('2023-01-01'))

		// Cas où validateField retourne un résultat sans erreur
		mockValidateField.mockReturnValue({
			hasError: false,
			hasWarning: false,
			hasSuccess: true,
			state: { errors: [], warnings: [], successes: ['Valide'] },
		})

		const { validateManualInput } = useManualDateValidation({
			format: 'DD/MM/YYYY',
			hasInteracted,
			errors,
			clearValidation: mockClearValidation,
			validateDateFormat: mockValidateDateFormat,
			isDateComplete: mockIsDateComplete,
			parseDate: mockParseDate,
			validateField: mockValidateField,
		})

		let result = validateManualInput('01/01/2023')
		expect(result).toBe(true)

		// Cas où validateField retourne un résultat avec erreur
		mockValidateField.mockReturnValue({
			hasError: true,
			hasWarning: false,
			hasSuccess: false,
			state: { errors: ['Erreur'], warnings: [], successes: [] },
		})

		result = validateManualInput('01/01/2023')
		expect(result).toBe(false)
	})
})
