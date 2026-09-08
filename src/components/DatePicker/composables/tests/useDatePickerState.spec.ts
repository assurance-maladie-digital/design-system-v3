import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useDatePickerState } from '../useDatePickerState'

describe('useDatePickerState', () => {
	const mockParseDate = vi.fn()
	const mockFormatDate = vi.fn()
	const mockValidateDates = vi.fn()
	const mockGenerateDateRange = vi.fn()

	const format = 'DD/MM/YYYY'

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('syncFromModelValue', () => {
		it('devrait initialiser selectedDates et générer les dates intermédiaires en mode plage', () => {
			const selectedDates = ref<Date | (Date | null)[] | null>(null)
			const startDate = new Date('2023-01-01')
			const endDate = new Date('2023-01-05')
			const intermediateDate = new Date('2023-01-03')

			mockParseDate.mockImplementation((value) => {
				if (value === '01/01/2023') return startDate
				if (value === '05/01/2023') return endDate
				return null
			})
			mockFormatDate.mockImplementation((date) => {
				if (date === startDate) return '01/01/2023'
				if (date === endDate) return '05/01/2023'
				return ''
			})
			mockGenerateDateRange.mockReturnValue([startDate, intermediateDate, endDate])

			const { syncFromModelValue } = useDatePickerState({
				selectedDates,
				format,
				displayRange: true,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				validateDates: mockValidateDates,
				generateDateRange: mockGenerateDateRange,
			})

			syncFromModelValue(['01/01/2023', '05/01/2023'])

			expect(mockParseDate).toHaveBeenCalledWith('01/01/2023', format)
			expect(mockParseDate).toHaveBeenCalledWith('05/01/2023', format)
			expect(mockGenerateDateRange).toHaveBeenCalledWith(startDate, endDate)
			expect(selectedDates.value).toEqual([startDate, intermediateDate, endDate])
		})

		it('devrait vider l’état synchronisé quand la valeur modèle est vide', () => {
			const selectedDates = ref<Date | (Date | null)[] | null>(new Date('2023-01-01'))

			const { syncFromModelValue, textInputValue, displayFormattedDate } = useDatePickerState({
				selectedDates,
				format,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				validateDates: mockValidateDates,
			})

			textInputValue.value = '01/01/2023'
			displayFormattedDate.value = '01/01/2023'

			syncFromModelValue('')

			expect(selectedDates.value).toBeNull()
			expect(textInputValue.value).toBe('')
			expect(displayFormattedDate.value).toBe('')
			expect(mockValidateDates).toHaveBeenCalled()
		})
	})

	describe('formattedDate', () => {
		it('devrait formater la valeur modèle avec dateFormatReturn quand il est fourni', () => {
			const selectedDate = new Date('2023-01-01')
			const selectedDates = ref<Date | (Date | null)[] | null>(selectedDate)

			mockFormatDate.mockImplementation((date, currentFormat) => {
				if (date !== selectedDate) return ''
				return currentFormat === 'YYYY-MM-DD' ? '2023-01-01' : '01/01/2023'
			})

			const { formattedDate, textInputValue } = useDatePickerState({
				selectedDates,
				format,
				dateFormatReturn: 'YYYY-MM-DD',
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				validateDates: mockValidateDates,
			})

			expect(formattedDate.value).toBe('2023-01-01')
			expect(textInputValue.value).toBe('')
		})
	})

	describe('syncTextInputFromSelection', () => {
		it('devrait synchroniser l’input avec la sélection en mode plage', () => {
			const startDate = new Date('2023-01-01')
			const endDate = new Date('2023-01-05')
			const selectedDates = ref<Date | (Date | null)[] | null>([startDate, endDate])

			mockFormatDate.mockImplementation((date) => {
				if (date === startDate) return '01/01/2023'
				if (date === endDate) return '05/01/2023'
				return ''
			})

			const { syncTextInputFromSelection, textInputValue } = useDatePickerState({
				selectedDates,
				format,
				displayRange: true,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				validateDates: mockValidateDates,
			})

			syncTextInputFromSelection()

			expect(textInputValue.value).toBe('01/01/2023 - 05/01/2023')
		})
	})
})
