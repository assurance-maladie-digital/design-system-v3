import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useInputBlurHandler } from '../useInputBlurHandler'
import { DATE_PICKER_MESSAGES } from '../../constants/messages'

describe('useInputBlurHandler', () => {
	// Mocks et setup
	const mockValidateDateFormat = vi.fn()
	const mockParseDate = vi.fn()
	const mockFormatDate = vi.fn()
	const mockUpdateModel = vi.fn()
	const mockValidateManualInput = vi.fn()
	const mockEmitBlur = vi.fn()
	const displayFormattedDate = ref('')
	const hasInteracted = ref(false)
	const isManualInputActive = ref(true)
	const isUpdatingFromInternal = ref(false)
	const selectedDates = ref<Date | Date[] | null>(null)
	const errors = ref<string[]>([])

	beforeEach(() => {
		// Réinitialiser les mocks et les refs avant chaque test
		mockValidateDateFormat.mockReset()
		mockParseDate.mockReset()
		mockFormatDate.mockReset()
		mockUpdateModel.mockReset()
		mockValidateManualInput.mockReset()
		mockEmitBlur.mockReset()
		displayFormattedDate.value = ''
		hasInteracted.value = false
		isManualInputActive.value = true
		isUpdatingFromInternal.value = false
		selectedDates.value = null
		errors.value = []

		// Configuration par défaut des mocks
		mockValidateDateFormat.mockReturnValue({ isValid: true, message: '' })
		mockValidateManualInput.mockReturnValue(true)
	})

	describe('handleInputBlur', () => {
		it('devrait émettre l\'événement blur et marquer l\'interaction', () => {
			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockEmitBlur).toHaveBeenCalledTimes(1)
			expect(hasInteracted.value).toBe(true)
			expect(isManualInputActive.value).toBe(false)
		})

		it('devrait mettre à jour le modèle si la date est valide', () => {
			displayFormattedDate.value = '01/01/2023'
			const date = new Date('2023-01-01')

			mockValidateDateFormat.mockReturnValue({ isValid: true, message: '' })
			mockParseDate.mockReturnValue(date)
			mockFormatDate.mockReturnValue('01/01/2023')

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockValidateDateFormat).toHaveBeenCalledWith('01/01/2023')
			expect(mockParseDate).toHaveBeenCalledWith('01/01/2023', 'DD/MM/YYYY')
			expect(mockFormatDate).toHaveBeenCalledWith(date, 'DD/MM/YYYY')
			expect(selectedDates.value).toBe(date)
			expect(mockUpdateModel).toHaveBeenCalledWith('01/01/2023')
			expect(isUpdatingFromInternal.value).toBe(true) // Sera réinitialisé par le setTimeout
		})

		it('devrait utiliser le format de retour si spécifié', () => {
			displayFormattedDate.value = '01/01/2023'
			const date = new Date('2023-01-01')

			mockValidateDateFormat.mockReturnValue({ isValid: true, message: '' })
			mockParseDate.mockReturnValue(date)
			mockFormatDate.mockReturnValue('2023-01-01')

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-MM-DD',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockFormatDate).toHaveBeenCalledWith(date, 'YYYY-MM-DD')
			expect(mockUpdateModel).toHaveBeenCalledWith('2023-01-01')
		})

		it('ne devrait pas mettre à jour le modèle si le format de date est invalide', () => {
			displayFormattedDate.value = '32/01/2023'

			mockValidateDateFormat.mockReturnValue({ isValid: false, message: 'Format de date invalide' })

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockValidateDateFormat).toHaveBeenCalledWith('32/01/2023')
			expect(mockParseDate).not.toHaveBeenCalled()
			expect(mockFormatDate).not.toHaveBeenCalled()
			expect(selectedDates.value).toBeNull()
			expect(mockUpdateModel).not.toHaveBeenCalled()
		})

		it('ne devrait pas mettre à jour le modèle si parseDate retourne null', () => {
			displayFormattedDate.value = '01/01/2023'

			mockValidateDateFormat.mockReturnValue({ isValid: true, message: '' })
			mockParseDate.mockReturnValue(null)

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockValidateDateFormat).toHaveBeenCalledWith('01/01/2023')
			expect(mockParseDate).toHaveBeenCalledWith('01/01/2023', 'DD/MM/YYYY')
			expect(mockFormatDate).not.toHaveBeenCalled()
			expect(selectedDates.value).toBeNull()
			expect(mockUpdateModel).not.toHaveBeenCalled()
		})

		it('devrait réinitialiser le modèle si le champ est vide et non requis', () => {
			displayFormattedDate.value = ''

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				required: false,
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockUpdateModel).toHaveBeenCalledWith(null)
		})

		it('ne devrait pas réinitialiser le modèle si le champ est vide mais requis', () => {
			displayFormattedDate.value = ''

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				required: true,
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockUpdateModel).not.toHaveBeenCalled()
		})

		it('devrait valider la date et mettre à jour le modèle avec la valeur formatée', () => {
			displayFormattedDate.value = '01/01/2023'
			// Simuler une date valide
			mockValidateDateFormat.mockReturnValue({ isValid: true, message: '' })
			const parsedDate = new Date('2023-01-01')
			mockParseDate.mockReturnValue(parsedDate)
			// Simuler le formatage de la date
			const formattedDate = '01/01/2023'
			mockFormatDate.mockReturnValue(formattedDate)

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				errors,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			// Avec nos modifications, on valide d'abord le format de la date
			expect(mockValidateDateFormat).toHaveBeenCalledWith('01/01/2023')
			// Puis on met à jour le modèle avec la date formatée (pas l'objet Date)
			expect(mockUpdateModel).toHaveBeenCalledWith(formattedDate)
		})

		it('devrait mettre à jour le modèle avec null si displayFormattedDate est vide', () => {
			displayFormattedDate.value = ''

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				errors,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			// Avec nos modifications, on met à jour directement le modèle avec null
			// au lieu d'appeler validateManualInput
			expect(mockUpdateModel).toHaveBeenCalledWith(null)
		})
	})

	// Nouveaux tests pour les plages de dates
	describe('handleInputBlur avec plages de dates', () => {
		it('devrait mettre à jour le modèle avec un tableau de dates si la plage est valide', () => {
			displayFormattedDate.value = '01/01/2023 - 10/01/2023'
			const startDate = new Date('2023-01-01')
			const endDate = new Date('2023-01-10')

			mockValidateDateFormat
				.mockReturnValueOnce({ isValid: true, message: '' }) // Pour la date de début
				.mockReturnValueOnce({ isValid: true, message: '' }) // Pour la date de fin

			mockParseDate
				.mockReturnValueOnce(startDate) // Pour la date de début
				.mockReturnValueOnce(endDate) // Pour la date de fin

			mockFormatDate
				.mockReturnValueOnce('01/01/2023') // Pour la date de début
				.mockReturnValueOnce('10/01/2023') // Pour la date de fin

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				errors,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockValidateDateFormat).toHaveBeenCalledWith('01/01/2023')
			expect(mockValidateDateFormat).toHaveBeenCalledWith('10/01/2023')
			expect(mockParseDate).toHaveBeenCalledWith('01/01/2023', 'DD/MM/YYYY')
			expect(mockParseDate).toHaveBeenCalledWith('10/01/2023', 'DD/MM/YYYY')
			expect(mockFormatDate).toHaveBeenCalledWith(startDate, 'DD/MM/YYYY')
			expect(mockFormatDate).toHaveBeenCalledWith(endDate, 'DD/MM/YYYY')
			expect(selectedDates.value).toEqual([startDate, endDate])
			expect(mockUpdateModel).toHaveBeenCalledWith(['01/01/2023', '10/01/2023'])
			expect(isUpdatingFromInternal.value).toBe(true) // Sera réinitialisé par le setTimeout
		})

		it('devrait utiliser le format de retour pour les plages de dates si spécifié', () => {
			displayFormattedDate.value = '01/01/2023 - 10/01/2023'
			const startDate = new Date('2023-01-01')
			const endDate = new Date('2023-01-10')

			mockValidateDateFormat
				.mockReturnValueOnce({ isValid: true, message: '' }) // Pour la date de début
				.mockReturnValueOnce({ isValid: true, message: '' }) // Pour la date de fin

			mockParseDate
				.mockReturnValueOnce(startDate) // Pour la date de début
				.mockReturnValueOnce(endDate) // Pour la date de fin

			mockFormatDate
				.mockReturnValueOnce('2023-01-01') // Pour la date de début avec format de retour
				.mockReturnValueOnce('2023-01-10') // Pour la date de fin avec format de retour

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-MM-DD',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				errors,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockFormatDate).toHaveBeenCalledWith(startDate, 'YYYY-MM-DD')
			expect(mockFormatDate).toHaveBeenCalledWith(endDate, 'YYYY-MM-DD')
			expect(mockUpdateModel).toHaveBeenCalledWith(['2023-01-01', '2023-01-10'])
		})

		it('devrait ajouter une erreur si la date de fin est antérieure à la date de début', () => {
			displayFormattedDate.value = '10/01/2023 - 01/01/2023' // Date de fin avant date de début
			const startDate = new Date('2023-01-10')
			const endDate = new Date('2023-01-01')

			mockValidateDateFormat
				.mockReturnValueOnce({ isValid: true, message: '' }) // Pour la date de début
				.mockReturnValueOnce({ isValid: true, message: '' }) // Pour la date de fin

			mockParseDate
				.mockReturnValueOnce(startDate) // Pour la date de début
				.mockReturnValueOnce(endDate) // Pour la date de fin

			// Utiliser la constante importée au début du fichier

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				errors,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockValidateDateFormat).toHaveBeenCalledWith('10/01/2023')
			expect(mockValidateDateFormat).toHaveBeenCalledWith('01/01/2023')
			expect(mockParseDate).toHaveBeenCalledWith('10/01/2023', 'DD/MM/YYYY')
			expect(mockParseDate).toHaveBeenCalledWith('01/01/2023', 'DD/MM/YYYY')
			expect(errors.value).toContain(DATE_PICKER_MESSAGES.ERROR_END_BEFORE_START)
			expect(mockUpdateModel).not.toHaveBeenCalled()
		})

		it('ne devrait pas mettre à jour le modèle si une des dates de la plage est invalide', () => {
			displayFormattedDate.value = '01/01/2023 - 32/01/2023' // Date de fin invalide

			mockValidateDateFormat
				.mockReturnValueOnce({ isValid: true, message: '' }) // Pour la date de début
				.mockReturnValueOnce({ isValid: false, message: 'Date invalide' }) // Pour la date de fin

			const { handleInputBlur } = useInputBlurHandler({
				format: 'DD/MM/YYYY',
				displayFormattedDate,
				hasInteracted,
				isManualInputActive,
				isUpdatingFromInternal,
				selectedDates,
				errors,
				validateDateFormat: mockValidateDateFormat,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				updateModel: mockUpdateModel,
				validateManualInput: mockValidateManualInput,
				emitBlur: mockEmitBlur,
			})

			handleInputBlur()

			expect(mockValidateDateFormat).toHaveBeenCalledWith('01/01/2023')
			expect(mockValidateDateFormat).toHaveBeenCalledWith('32/01/2023')
			expect(mockUpdateModel).not.toHaveBeenCalled()
		})
	})
})
