import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDatePickerViewMode } from '../useDatePickerViewMode'

// Mock pour watch
vi.mock('vue', async () => {
	const actual = await vi.importActual('vue')
	return {
		...actual,
		watch: vi.fn(),
	}
})

describe('useDatePickerViewMode', () => {
	// Mocks et setup
	let isBirthDate = false
	let selectedDate: Date | (Date | null)[] | null = null
	const mockIsBirthDateGetter = vi.fn(() => isBirthDate)
	const mockSelectedDateGetter = vi.fn(() => selectedDate)

	beforeEach(() => {
		// Réinitialiser les mocks avant chaque test
		mockIsBirthDateGetter.mockClear()
		mockSelectedDateGetter.mockClear()
		isBirthDate = false
		selectedDate = null
	})

	it('devrait initialiser currentViewMode à "month" si isBirthDate est false', () => {
		const { currentViewMode } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

		expect(currentViewMode.value).toBe('month')
		expect(mockIsBirthDateGetter).toHaveBeenCalled()
		// Note: mockSelectedDateGetter n'est pas appelé car isBirthDateGetter() retourne false
		// et l'évaluation court-circuite (false && !selectedDateGetter() n'évalue pas selectedDateGetter())
		expect(mockSelectedDateGetter).not.toHaveBeenCalled()
	})

	it('devrait initialiser currentViewMode à "year" si isBirthDate est true et aucune date sélectionnée', () => {
		isBirthDate = true

		const { currentViewMode } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

		expect(currentViewMode.value).toBe('year')
		expect(mockIsBirthDateGetter).toHaveBeenCalled()
		expect(mockSelectedDateGetter).toHaveBeenCalled()
	})

	it('devrait initialiser currentViewMode à "month" si isBirthDate est true et une date est sélectionnée', () => {
		isBirthDate = true
		selectedDate = new Date('2024-01-15')

		const { currentViewMode } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

		expect(currentViewMode.value).toBe('month')
		expect(mockIsBirthDateGetter).toHaveBeenCalled()
		expect(mockSelectedDateGetter).toHaveBeenCalled()
	})

	describe('resetViewMode', () => {
		it('devrait réinitialiser currentViewMode à "month" si isBirthDate est false', () => {
			const { currentViewMode, handleViewModeUpdate, resetViewMode } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

			// Mettre à jour le mode d'affichage à 'year'
			handleViewModeUpdate('year')

			// Réinitialiser le mode d'affichage
			resetViewMode()

			// currentViewMode devrait être réinitialisé à 'month'
			expect(currentViewMode.value).toBe('month')
		})

		it('devrait réinitialiser currentViewMode à "year" si isBirthDate est true et aucune date sélectionnée', () => {
			isBirthDate = true

			const { currentViewMode, handleViewModeUpdate, resetViewMode } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

			// Mettre à jour le mode d'affichage à 'months'
			handleViewModeUpdate('months')

			// Réinitialiser le mode d'affichage
			resetViewMode()

			// currentViewMode devrait être réinitialisé à 'year'
			expect(currentViewMode.value).toBe('year')
		})

		it('devrait réinitialiser currentViewMode à "month" si isBirthDate est true et une date est sélectionnée', () => {
			isBirthDate = true
			selectedDate = new Date('2024-01-15')

			const { currentViewMode, handleViewModeUpdate, resetViewMode } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

			// Mettre à jour le mode d'affichage à 'year'
			handleViewModeUpdate('year')

			// Réinitialiser le mode d'affichage
			resetViewMode()

			// currentViewMode devrait être réinitialisé à 'month' (car une date est sélectionnée)
			expect(currentViewMode.value).toBe('month')
		})
	})
})
