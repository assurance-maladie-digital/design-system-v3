import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useInputBlurHandler } from '../useInputBlurHandler'

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

		it('devrait appeler validateManualInput avec la valeur actuelle', () => {
			displayFormattedDate.value = '01/01/2023'

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

			expect(mockValidateManualInput).toHaveBeenCalledWith('01/01/2023')
		})

		it('devrait appeler validateManualInput avec une chaîne vide si displayFormattedDate est vide', () => {
			displayFormattedDate.value = ''

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

			expect(mockValidateManualInput).toHaveBeenCalledWith('')
		})
	})
})
