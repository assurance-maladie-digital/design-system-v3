import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDatePickerViewMode } from '../useDatePickerViewMode'

// Mock pour watch
vi.mock('vue', async () => {
	const actual = await vi.importActual('vue')
	return {
		...actual,
		watch: vi.fn((getter, callback) => {
			// Stocker le callback pour pouvoir le déclencher manuellement dans les tests
			watchCallback = callback
		}),
	}
})

// Variable pour stocker le callback de watch
let watchCallback: ((newValue: boolean) => void) | null = null

describe('useDatePickerViewMode', () => {
	// Mocks et setup
	let isBirthDate = false
	const mockIsBirthDateGetter = vi.fn(() => isBirthDate)

	beforeEach(() => {
		// Réinitialiser les mocks avant chaque test
		mockIsBirthDateGetter.mockClear()
		isBirthDate = false
		watchCallback = null
	})

	it('devrait initialiser currentViewMode à "month" si isBirthDate est false', () => {
		const { currentViewMode } = useDatePickerViewMode(mockIsBirthDateGetter)

		expect(currentViewMode.value).toBe('month')
		expect(mockIsBirthDateGetter).toHaveBeenCalled()
	})

	it('devrait initialiser currentViewMode à "year" si isBirthDate est true', () => {
		isBirthDate = true

		const { currentViewMode } = useDatePickerViewMode(mockIsBirthDateGetter)

		expect(currentViewMode.value).toBe('year')
		expect(mockIsBirthDateGetter).toHaveBeenCalled()
	})

	it('devrait mettre à jour currentViewMode quand isBirthDate change', () => {
		const { currentViewMode } = useDatePickerViewMode(mockIsBirthDateGetter)

		// Initialement, currentViewMode devrait être 'month'
		expect(currentViewMode.value).toBe('month')

		// Simuler un changement de isBirthDate
		if (watchCallback) {
			watchCallback(true)
		}

		// Après le changement, currentViewMode devrait être 'year'
		expect(currentViewMode.value).toBe('year')
	})

	describe('handleViewModeUpdate', () => {
		it('devrait mettre à jour currentViewMode avec la nouvelle valeur', () => {
			const { currentViewMode, handleViewModeUpdate } = useDatePickerViewMode(mockIsBirthDateGetter)

			// Initialement, currentViewMode devrait être 'month'
			expect(currentViewMode.value).toBe('month')

			// Mettre à jour le mode d'affichage
			handleViewModeUpdate('year')

			// Après la mise à jour, currentViewMode devrait être 'year'
			expect(currentViewMode.value).toBe('year')
		})

		it('devrait ignorer la tentative de VDatePicker de changer de months à month en mode birthDate', () => {
			isBirthDate = true

			const { currentViewMode, handleViewModeUpdate } = useDatePickerViewMode(mockIsBirthDateGetter)

			// Mettre manuellement le mode à 'months' (comme le ferait handleYearUpdate)
			currentViewMode.value = 'months'
			expect(currentViewMode.value).toBe('months')

			// VDatePicker tente de changer de 'months' à 'month' (ce qui doit être ignoré)
			handleViewModeUpdate('month')

			// currentViewMode devrait rester 'months' et ne pas être écrasé
			expect(currentViewMode.value).toBe('months')
		})

		it('devrait permettre le changement de months à month si isBirthDate est false', () => {
			isBirthDate = false

			const { currentViewMode, handleViewModeUpdate } = useDatePickerViewMode(mockIsBirthDateGetter)

			// Mettre manuellement le mode à 'months'
			currentViewMode.value = 'months'
			expect(currentViewMode.value).toBe('months')

			// Tenter de changer de 'months' à 'month' (devrait être autorisé)
			handleViewModeUpdate('month')

			// currentViewMode devrait être mis à jour à 'month'
			expect(currentViewMode.value).toBe('month')
		})

		it('devrait permettre les autres changements de mode même en mode birthDate', () => {
			isBirthDate = true

			const { currentViewMode, handleViewModeUpdate } = useDatePickerViewMode(mockIsBirthDateGetter)

			// Mettre le mode à 'months'
			currentViewMode.value = 'months'

			// Changer vers 'year' (devrait être autorisé)
			handleViewModeUpdate('year')
			expect(currentViewMode.value).toBe('year')

			// Changer vers undefined (devrait être autorisé)
			handleViewModeUpdate(undefined)
			expect(currentViewMode.value).toBeUndefined()
		})
	})

	describe('handleYearUpdate', () => {
		it('ne devrait pas modifier currentViewMode si isBirthDate est false', () => {
			const { currentViewMode, handleViewModeUpdate, handleYearUpdate } = useDatePickerViewMode(mockIsBirthDateGetter)

			// Mettre à jour le mode d'affichage à 'year'
			handleViewModeUpdate('year')

			// Appeler handleYearUpdate
			handleYearUpdate()

			// currentViewMode ne devrait pas changer
			expect(currentViewMode.value).toBe('year')
		})

		it('devrait passer à "months" si isBirthDate est true', () => {
			isBirthDate = true

			const { currentViewMode, handleYearUpdate } = useDatePickerViewMode(mockIsBirthDateGetter)

			// Appeler handleYearUpdate
			handleYearUpdate()

			// currentViewMode devrait passer à 'months'
			expect(currentViewMode.value).toBe('months')
		})
	})

	describe('handleMonthUpdate', () => {
		it('ne devrait pas modifier currentViewMode si isBirthDate est false', () => {
			const { currentViewMode, handleViewModeUpdate, handleMonthUpdate } = useDatePickerViewMode(mockIsBirthDateGetter)

			// Mettre à jour le mode d'affichage à 'months'
			handleViewModeUpdate('months')

			// Appeler handleMonthUpdate
			handleMonthUpdate()

			// currentViewMode ne devrait pas changer
			expect(currentViewMode.value).toBe('months')
		})

		it('devrait passer à month si isBirthDate est true', () => {
			isBirthDate = true

			const { currentViewMode, handleMonthUpdate } = useDatePickerViewMode(mockIsBirthDateGetter)

			// Appeler handleMonthUpdate
			handleMonthUpdate()

			// currentViewMode devrait passer à 'month'
			expect(currentViewMode.value).toBe('month')
		})
	})

	describe('resetViewMode', () => {
		it('devrait réinitialiser currentViewMode à "month" si isBirthDate est false', () => {
			const { currentViewMode, handleViewModeUpdate, resetViewMode } = useDatePickerViewMode(mockIsBirthDateGetter)

			// Mettre à jour le mode d'affichage à 'year'
			handleViewModeUpdate('year')

			// Réinitialiser le mode d'affichage
			resetViewMode()

			// currentViewMode devrait être réinitialisé à 'month'
			expect(currentViewMode.value).toBe('month')
		})

		it('devrait réinitialiser currentViewMode à "year" si isBirthDate est true', () => {
			isBirthDate = true

			const { currentViewMode, handleViewModeUpdate, resetViewMode } = useDatePickerViewMode(mockIsBirthDateGetter)

			// Mettre à jour le mode d'affichage à 'months'
			handleViewModeUpdate('months')

			// Réinitialiser le mode d'affichage
			resetViewMode()

			// currentViewMode devrait être réinitialisé à 'year'
			expect(currentViewMode.value).toBe('year')
		})
	})

	describe('Flux complet en mode birthDate (test de non-régression)', () => {
		it('devrait maintenir le flux year → months → month sans écrasement par VDatePicker', () => {
			isBirthDate = true

			const { currentViewMode, handleYearUpdate, handleMonthUpdate, handleViewModeUpdate } = useDatePickerViewMode(mockIsBirthDateGetter)

			// État initial : mode 'year'
			expect(currentViewMode.value).toBe('year')

			// 1. Sélection d'année → devrait passer en mode 'months'
			handleYearUpdate()
			expect(currentViewMode.value).toBe('months')

			// 2. Simulation de VDatePicker tentant d'écraser 'months' avec 'month'
			handleViewModeUpdate('month')
			// Le mode devrait rester 'months' (protection contre l'écrasement)
			expect(currentViewMode.value).toBe('months')

			// 3. Sélection de mois → devrait passer en mode 'month'
			handleMonthUpdate()
			expect(currentViewMode.value).toBe('month')

			// 4. VDatePicker peut maintenant changer le mode normalement
			handleViewModeUpdate('year')
			expect(currentViewMode.value).toBe('year')
		})

		it('devrait permettre le flux normal quand isBirthDate est false', () => {
			isBirthDate = false

			const { currentViewMode, handleYearUpdate, handleMonthUpdate, handleViewModeUpdate } = useDatePickerViewMode(mockIsBirthDateGetter)

			// État initial : mode 'month'
			expect(currentViewMode.value).toBe('month')

			// handleYearUpdate ne devrait rien faire
			handleYearUpdate()
			expect(currentViewMode.value).toBe('month')

			// handleViewModeUpdate devrait fonctionner normalement
			handleViewModeUpdate('year')
			expect(currentViewMode.value).toBe('year')

			handleViewModeUpdate('month')
			expect(currentViewMode.value).toBe('month')
		})
	})
})
