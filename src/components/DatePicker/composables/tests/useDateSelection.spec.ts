import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useDateSelection } from '../useDateSelection'

describe('useDateSelection', () => {
	// Mocks et setup
	const mockParseDate = vi.fn()
	const selectedDates = ref<Date | Date[] | null>(null)
	const format = 'DD/MM/YYYY'

	beforeEach(() => {
		// Réinitialiser les mocks et les refs avant chaque test
		mockParseDate.mockReset()
		selectedDates.value = null
	})

	describe('generateDateRange', () => {
		it('devrait générer un tableau contenant toutes les dates entre deux dates (incluses)', () => {
			const { generateDateRange } = useDateSelection(mockParseDate, selectedDates, format, true)

			const startDate = new Date('2023-01-01')
			const endDate = new Date('2023-01-05')

			const result = generateDateRange(startDate, endDate)

			expect(result).toHaveLength(5)
			expect(result[0].toISOString().split('T')[0]).toBe('2023-01-01')
			expect(result[1].toISOString().split('T')[0]).toBe('2023-01-02')
			expect(result[2].toISOString().split('T')[0]).toBe('2023-01-03')
			expect(result[3].toISOString().split('T')[0]).toBe('2023-01-04')
			expect(result[4].toISOString().split('T')[0]).toBe('2023-01-05')
		})

		it('devrait retourner une seule date si les dates de début et de fin sont identiques', () => {
			const { generateDateRange } = useDateSelection(mockParseDate, selectedDates, format, true)

			const sameDate = new Date('2023-01-01')

			const result = generateDateRange(sameDate, sameDate)

			expect(result).toHaveLength(1)
			expect(result[0].toISOString().split('T')[0]).toBe('2023-01-01')
		})
	})

	describe('updateSelectedDates', () => {
		it('devrait définir selectedDates à null si l\'entrée est null', () => {
			const { updateSelectedDates } = useDateSelection(mockParseDate, selectedDates, format, true)

			updateSelectedDates(null)

			expect(selectedDates.value).toBeNull()
		})

		it('devrait définir selectedDates à null si l\'entrée est undefined', () => {
			const { updateSelectedDates } = useDateSelection(mockParseDate, selectedDates, format, true)

			updateSelectedDates(undefined)

			expect(selectedDates.value).toBeNull()
		})

		it('devrait traiter un tableau de dates en mode non-plage', () => {
			const date1 = new Date('2023-01-01')
			const date2 = new Date('2023-01-05')

			mockParseDate.mockImplementation((dateStr) => {
				if (dateStr === date1) return date1
				if (dateStr === date2) return date2
				return null
			})

			const { updateSelectedDates } = useDateSelection(mockParseDate, selectedDates, format, false)

			updateSelectedDates([date1, date2])

			expect(selectedDates.value).toEqual([date1, date2])
		})

		it('devrait générer une plage de dates en mode plage', () => {
			const date1 = new Date('2023-01-01')
			const date2 = new Date('2023-01-03')

			mockParseDate.mockImplementation((dateStr) => {
				if (dateStr === date1) return date1
				if (dateStr === date2) return date2
				return null
			})

			const { updateSelectedDates, rangeBoundaryDates } = useDateSelection(mockParseDate, selectedDates, format, true)

			updateSelectedDates([date1, date2])

			// Vérifier que selectedDates contient toutes les dates de la plage
			expect(Array.isArray(selectedDates.value)).toBe(true)
			expect((selectedDates.value as Date[]).length).toBe(3)

			// Vérifier que rangeBoundaryDates contient les dates de début et de fin
			expect(rangeBoundaryDates.value).toEqual([date1, date2])
		})

		it('devrait trier les dates avant de générer une plage', () => {
			const date1 = new Date('2023-01-01')
			const date2 = new Date('2023-01-03')

			mockParseDate.mockImplementation((dateStr) => {
				if (dateStr === date1) return date1
				if (dateStr === date2) return date2
				return null
			})

			const { updateSelectedDates, rangeBoundaryDates } = useDateSelection(mockParseDate, selectedDates, format, true)

			// Dates dans le désordre
			updateSelectedDates([date2, date1])

			// Vérifier que les dates ont été triées et que la plage est correcte
			expect(rangeBoundaryDates.value).toEqual([date1, date2])
		})

		it('devrait traiter une chaîne de caractères en mode non-plage', () => {
			const date = new Date('2023-01-01')

			mockParseDate.mockReturnValue(date)

			const { updateSelectedDates } = useDateSelection(mockParseDate, selectedDates, format, false)

			updateSelectedDates('01/01/2023')

			expect(selectedDates.value).toEqual(date)
			expect(mockParseDate).toHaveBeenCalledWith('01/01/2023', format)
		})

		it('devrait traiter une chaîne de plage de dates en mode plage', () => {
			const startDate = new Date('2023-01-01')
			const endDate = new Date('2023-01-05')

			mockParseDate.mockImplementation((dateStr) => {
				if (dateStr === '01/01/2023') return startDate
				if (dateStr === '05/01/2023') return endDate
				return null
			})

			const { updateSelectedDates, rangeBoundaryDates } = useDateSelection(mockParseDate, selectedDates, format, true)

			updateSelectedDates('01/01/2023 - 05/01/2023')

			// Vérifier que selectedDates contient toutes les dates de la plage
			expect(Array.isArray(selectedDates.value)).toBe(true)
			expect((selectedDates.value as Date[]).length).toBe(5)

			// Vérifier que rangeBoundaryDates contient les dates de début et de fin
			expect(rangeBoundaryDates.value).toEqual([startDate, endDate])
		})

		it('ne devrait pas modifier selectedDates si une des dates de la plage est invalide', () => {
			mockParseDate.mockImplementation((dateStr) => {
				if (dateStr === '01/01/2023') return new Date('2023-01-01')
				return null
			})

			const { updateSelectedDates } = useDateSelection(mockParseDate, selectedDates, format, true)

			// Date de fin invalide
			updateSelectedDates('01/01/2023 - invalidDate')

			// selectedDates ne devrait pas être modifié
			expect(selectedDates.value).toBeNull()
		})
	})
})
