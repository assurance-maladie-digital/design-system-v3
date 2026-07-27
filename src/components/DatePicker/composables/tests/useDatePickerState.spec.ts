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

		it('préserve une chaîne invalide en mode date simple', () => {
			const selectedDates = ref<Date | (Date | null)[] | null>(null)

			mockInitializeSelectedDates.mockReturnValue(null)

			const { syncFromModelValue, textInputValue, displayFormattedDate } = useDatePickerState({
				selectedDates,
				format,
				displayRange: false,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				initializeSelectedDates: mockInitializeSelectedDates,
				validateDates: mockValidateDates,
			})

			syncFromModelValue('invalid-date')

			expect(selectedDates.value).toBeNull()
			expect(textInputValue.value).toBe('invalid-date')
			expect(displayFormattedDate.value).toBe('invalid-date')
		})

		it('ne valide pas pendant syncFromModelValue quand validateOnSyncFromModelValue=false', () => {
			const selectedDates = ref<Date | (Date | null)[] | null>(null)
			const parsedDate = new Date('2025-01-10')

			mockInitializeSelectedDates.mockReturnValue(parsedDate)
			mockFormatDate.mockReturnValue('10/01/2025')

			const { syncFromModelValue } = useDatePickerState({
				selectedDates,
				format,
				displayRange: false,
				validateOnSyncFromModelValue: false,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				initializeSelectedDates: mockInitializeSelectedDates,
				validateDates: mockValidateDates,
			})

			syncFromModelValue('10/01/2025')

			expect(mockValidateDates).not.toHaveBeenCalled()
		})
	})

	describe('formattedDate watcher', () => {
		it('retombe sur la valeur source quand dateFormatReturn contient une borne invalide', () => {
			const startDate = new Date('2025-01-05')
			const endDate = new Date('2025-01-10')
			const selectedDates = ref<Date | (Date | null)[] | null>([startDate, endDate])
			const rangeBoundaryDates = ref<[Date | null, Date | null] | null>([startDate, endDate])

			mockFormatDate.mockImplementation((date: Date | null, currentFormat: string) => {
				if (date?.getTime() === startDate.getTime()) {
					return currentFormat === 'YYYY-MM-DD' ? 'invalid-start' : '05/01/2025'
				}
				if (date?.getTime() === endDate.getTime()) {
					return currentFormat === 'YYYY-MM-DD' ? '2025-01-10' : '10/01/2025'
				}

				return ''
			})

			mockParseDate.mockImplementation((value: string) => {
				if (value === '2025-01-10') {
					return endDate
				}

				return null
			})

			const { textInputValue } = useDatePickerState({
				selectedDates,
				rangeBoundaryDates,
				format,
				dateFormatReturn: 'YYYY-MM-DD',
				displayRange: true,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				initializeSelectedDates: mockInitializeSelectedDates,
				validateDates: mockValidateDates,
			})

			expect(textInputValue.value).toBe('invalid-start - 10/01/2025')
		})
	})

	describe('syncTextInputFromSelection', () => {
		it('synchronise textInputValue et displayFormattedDate depuis la sélection', () => {
			const selectedDate = new Date('2025-01-10')
			const selectedDates = ref<Date | (Date | null)[] | null>(selectedDate)

			mockFormatDate.mockImplementation((date: Date | null) => {
				if (date?.getTime() === selectedDate.getTime()) {
					return '10/01/2025'
				}

				return ''
			})

			const { textInputValue, displayFormattedDate, syncTextInputFromSelection } = useDatePickerState({
				selectedDates,
				format,
				displayRange: false,
				parseDate: mockParseDate,
				formatDate: mockFormatDate,
				initializeSelectedDates: mockInitializeSelectedDates,
				validateDates: mockValidateDates,
			})

			textInputValue.value = ''
			displayFormattedDate.value = ''

			syncTextInputFromSelection()

			expect(textInputValue.value).toBe('10/01/2025')
			expect(displayFormattedDate.value).toBe('10/01/2025')
		})
	})
})
