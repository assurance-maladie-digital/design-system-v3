import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useDateValidation } from '../useDateValidation'

describe('useDateValidation', () => {
	// Mocks et setup
	const mockClearValidation = vi.fn()
	const mockValidateField = vi.fn()
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = ref<string[]>([])
	const selectedDates = ref<Date | Date[] | null>(null)
	const isUpdatingFromInternal = ref(false)
	const currentRangeIsValid = ref(true)
	const getRangeValidationError = ref('')

	beforeEach(() => {
		// Réinitialiser les mocks et les refs avant chaque test
		mockClearValidation.mockReset()
		mockValidateField.mockReset()
		errors.value = []
		warnings.value = []
		successes.value = []
		selectedDates.value = null
		isUpdatingFromInternal.value = false
		currentRangeIsValid.value = true
		getRangeValidationError.value = ''
	})

	it('devrait retourner valid=true en mode noCalendar', () => {
		const { validateDates } = useDateValidation({
			noCalendar: true,
			required: true,
			selectedDates,
			isUpdatingFromInternal,
			currentRangeIsValid,
			getRangeValidationError,
			clearValidation: mockClearValidation,
			validateField: mockValidateField,
			errors,
			warnings,
			successes,
		})

		const result = validateDates()
		expect(result.hasError).toBe(false)
		expect(mockClearValidation).not.toHaveBeenCalled()
	})

	it('devrait appeler clearValidation lors de la validation', () => {
		const { validateDates } = useDateValidation({
			required: false,
			selectedDates,
			isUpdatingFromInternal,
			currentRangeIsValid,
			getRangeValidationError,
			clearValidation: mockClearValidation,
			validateField: mockValidateField,
			errors,
			warnings,
			successes,
		})

		validateDates()
		expect(mockClearValidation).toHaveBeenCalledTimes(1)
	})

	it('devrait retourner une erreur si le champ est requis et vide', () => {
		const { validateDates } = useDateValidation({
			required: true,
			selectedDates,
			isUpdatingFromInternal,
			currentRangeIsValid,
			getRangeValidationError,
			clearValidation: mockClearValidation,
			validateField: mockValidateField,
			errors,
			warnings,
			successes,
		})

		const result = validateDates()
		expect(result.hasError).toBe(true)
		expect(result.state.errors[0]).toBe('La date est requise.')
		expect(errors.value).toContain('La date est requise.')
	})

	it('ne devrait pas afficher d\'erreur si disableErrorHandling=true', () => {
		const { validateDates } = useDateValidation({
			required: true,
			disableErrorHandling: true,
			selectedDates,
			isUpdatingFromInternal,
			currentRangeIsValid,
			getRangeValidationError,
			clearValidation: mockClearValidation,
			validateField: mockValidateField,
			errors,
			warnings,
			successes,
		})

		validateDates()
		expect(errors.value).toHaveLength(0)
	})

	it('devrait appeler validateField pour chaque date dans un tableau', () => {
		const today = new Date()
		const tomorrow = new Date(today)
		tomorrow.setDate(today.getDate() + 1)

		selectedDates.value = [today, tomorrow]

		mockValidateField.mockReturnValue({ valid: true })

		const { validateDates } = useDateValidation({
			selectedDates,
			isUpdatingFromInternal,
			currentRangeIsValid,
			getRangeValidationError,
			clearValidation: mockClearValidation,
			validateField: mockValidateField,
			errors,
			warnings,
			successes,
		})

		validateDates()
		expect(mockValidateField).toHaveBeenCalledTimes(2)
		expect(mockValidateField).toHaveBeenCalledWith(today, [], [])
		expect(mockValidateField).toHaveBeenCalledWith(tomorrow, [], [])
	})

	it('devrait appeler validateField avec les règles personnalisées', () => {
		selectedDates.value = new Date()

		const customRules = [{ type: 'custom', options: {} }]
		const customWarningRules = [{ type: 'warning', options: {} }]

		mockValidateField.mockReturnValue({ valid: true })

		const { validateDates } = useDateValidation({
			customRules,
			customWarningRules,
			selectedDates,
			isUpdatingFromInternal,
			currentRangeIsValid,
			getRangeValidationError,
			clearValidation: mockClearValidation,
			validateField: mockValidateField,
			errors,
			warnings,
			successes,
		})

		validateDates()
		expect(mockValidateField).toHaveBeenCalledWith(
			selectedDates.value,
			customRules,
			customWarningRules,
		)
	})

	it('devrait ajouter l\'erreur de plage si displayRange=true et la plage est invalide', () => {
		selectedDates.value = [new Date(), new Date()]
		currentRangeIsValid.value = false
		getRangeValidationError.value = 'La date de fin doit être postérieure ou égale à la date de début'

		mockValidateField.mockReturnValue({ valid: true })

		const { validateDates } = useDateValidation({
			displayRange: true,
			selectedDates,
			isUpdatingFromInternal,
			currentRangeIsValid,
			getRangeValidationError,
			clearValidation: mockClearValidation,
			validateField: mockValidateField,
			errors,
			warnings,
			successes,
		})

		const result = validateDates()
		expect(result.hasError).toBe(true)
		expect(errors.value).toContain('La date de fin doit être postérieure ou égale à la date de début')
	})

	it('devrait dédoublonner les messages d\'erreur', () => {
		selectedDates.value = [new Date(), new Date()]

		// Simuler des erreurs dupliquées
		mockValidateField.mockImplementation(() => {
			errors.value.push('Erreur dupliquée')
			return {
				hasError: true,
				hasWarning: false,
				hasSuccess: false,
				state: {
					errors: ['Erreur dupliquée'],
					warnings: [],
					successes: [],
				},
			}
		})

		const { validateDates } = useDateValidation({
			selectedDates,
			isUpdatingFromInternal,
			currentRangeIsValid,
			getRangeValidationError,
			clearValidation: mockClearValidation,
			validateField: mockValidateField,
			errors,
			warnings,
			successes,
		})

		validateDates()
		// Même avec 2 appels qui ajoutent la même erreur, on ne devrait avoir qu'une seule occurrence
		expect(errors.value).toEqual(['Erreur dupliquée'])
	})

	it('devrait forcer la validation avec validateOnSubmit', () => {
		isUpdatingFromInternal.value = true
		selectedDates.value = null

		const { validateOnSubmit } = useDateValidation({
			required: true,
			selectedDates,
			isUpdatingFromInternal,
			currentRangeIsValid,
			getRangeValidationError,
			clearValidation: mockClearValidation,
			validateField: mockValidateField,
			errors,
			warnings,
			successes,
		})

		const result = validateOnSubmit()
		expect(result.hasError).toBe(true)
		expect(errors.value).toContain('La date est requise.')
	})
})
