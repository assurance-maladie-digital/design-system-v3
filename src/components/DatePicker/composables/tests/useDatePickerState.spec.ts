import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useDatePickerState } from '../useDatePickerState'

describe('useDatePickerState', () => {
	const mockParseDate = vi.fn()
	const mockFormatDate = vi.fn()
	const mockInitializeSelectedDates = vi.fn()
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

			mockInitializeSelectedDates.mockReturnValue([startDate, endDate])
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
				initializeSelectedDates: mockInitializeSelectedDates,
				validateDates: mockValidateDates,
				generateDateRange: mockGenerateDateRange,
			})

			syncFromModelValue(['01/01/2023', '05/01/2023'])

			expect(mockInitializeSelectedDates).toHaveBeenCalled()
			expect(mockGenerateDateRange).toHaveBeenCalledWith(startDate, endDate)
			expect(selectedDates.value).toEqual([startDate, intermediateDate, endDate])
		})
	})
})
