import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDatePickerViewMode } from '../useDatePickerViewMode'

// Stocke les callbacks de watch pour pouvoir les invoquer explicitement dans les tests
const registeredWatchCallbacks: Array<(newValue: unknown, oldValue: unknown) => void> = []

vi.mock('vue', async () => {
	const actual = await vi.importActual<typeof import('vue')>('vue')
	return {
		...actual,
		watch: vi.fn((source: unknown, cb: (newValue: unknown, oldValue: unknown) => void) => {
			registeredWatchCallbacks.push(cb)
		}),
	}
})

describe('useDatePickerViewMode', () => {
	// Mocks et setup
	let isBirthDate = false
	let selectedDate: Date | (Date | null)[] | null = null
	const mockIsBirthDateGetter = vi.fn(() => isBirthDate)
	const mockSelectedDateGetter = vi.fn(() => selectedDate)

	beforeEach(() => {
		registeredWatchCallbacks.length = 0
		// Réinitialiser les mocks avant chaque test
		mockIsBirthDateGetter.mockClear()
		mockSelectedDateGetter.mockClear()
		isBirthDate = false
		selectedDate = null
	})

	describe('watchers', () => {
		it('met à jour currentViewMode quand isBirthDate change (branches year/month/normal)', () => {
			// Cas 1 : passage en birthDate sans date sélectionnée -> year
			isBirthDate = false
			selectedDate = null
			const { currentViewMode } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)
			// Deux watchers sont enregistrés : [isBirthDateWatcher, selectedDateWatcher]
			const [isBirthDateWatcher] = registeredWatchCallbacks
			// Simuler isBirthDate passant à true sans date sélectionnée
			isBirthDate = true
			isBirthDateWatcher(true, false)
			expect(currentViewMode.value).toBe('year')

			// Cas 2 : birthDate avec date sélectionnée -> month
			selectedDate = new Date('2024-01-01')
			isBirthDateWatcher(true, false)
			expect(currentViewMode.value).toBe('month')

			// Cas 3 : mode normal (isBirthDate = false) -> month
			isBirthDate = false
			isBirthDateWatcher(false, true)
			expect(currentViewMode.value).toBe('month')
		})

		it('met à jour currentViewMode quand la date sélectionnée change en mode birthDate', () => {
			isBirthDate = true
			selectedDate = null
			const { currentViewMode } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)
			const [, selectedDateWatcher] = registeredWatchCallbacks

			// newValue null -> year
			selectedDate = null
			selectedDateWatcher(null, undefined)
			expect(currentViewMode.value).toBe('year')

			// newValue défini -> month
			selectedDate = new Date('2024-01-01')
			selectedDateWatcher(selectedDate, null)
			expect(currentViewMode.value).toBe('month')
		})

		it('ne change pas currentViewMode quand la date change en mode normal', () => {
			isBirthDate = false
			selectedDate = null
			const { currentViewMode } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)
			const [, selectedDateWatcher] = registeredWatchCallbacks

			// En mode normal, le watcher ne doit rien faire
			selectedDateWatcher(new Date('2024-01-01'), null)
			expect(currentViewMode.value).toBe('month')
		})
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

	describe('Navigation Regression Tests', () => {
		it('should handle year update correctly in birth date mode', () => {
			isBirthDate = true

			const { currentViewMode, handleYearUpdate } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

			// Initialement en mode year
			expect(currentViewMode.value).toBe('year')

			// Simuler la sélection d'une année
			handleYearUpdate()

			// Devrait passer en mode months
			expect(currentViewMode.value).toBe('months')
		})

		it('should handle month update correctly in birth date mode', () => {
			isBirthDate = true

			const { currentViewMode, handleYearUpdate, handleMonthUpdate } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

			// Passer en mode months (après sélection année)
			handleYearUpdate()
			expect(currentViewMode.value).toBe('months')

			// Simuler la sélection d'un mois
			handleMonthUpdate()

			// Devrait passer en mode month (calendrier)
			expect(currentViewMode.value).toBe('month')
		})

		it('should not update view mode in non-birth date mode', () => {
			isBirthDate = false

			const { currentViewMode, handleYearUpdate, handleMonthUpdate } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

			// Initialement en mode month
			expect(currentViewMode.value).toBe('month')

			// Les handlers ne devraient pas changer le mode en mode normal
			handleYearUpdate()
			expect(currentViewMode.value).toBe('month')

			handleMonthUpdate()
			expect(currentViewMode.value).toBe('month')
		})

		it('should handle complete navigation cycle correctly', () => {
			isBirthDate = true

			const { currentViewMode, handleYearUpdate, handleMonthUpdate, resetViewMode } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

			// Cycle complet : year → months → month → reset → year
			expect(currentViewMode.value).toBe('year')

			handleYearUpdate()
			expect(currentViewMode.value).toBe('months')

			handleMonthUpdate()
			expect(currentViewMode.value).toBe('month')

			// Simuler fermeture/réouverture
			resetViewMode()
			expect(currentViewMode.value).toBe('year')

			// Vérifier que la navigation fonctionne encore
			handleYearUpdate()
			expect(currentViewMode.value).toBe('months')

			handleMonthUpdate()
			expect(currentViewMode.value).toBe('month')
		})

		it('should prevent VDatePicker from overriding months mode', () => {
			isBirthDate = true

			const { currentViewMode, handleYearUpdate, handleViewModeUpdate } = useDatePickerViewMode(mockIsBirthDateGetter, mockSelectedDateGetter)

			// Passer en mode months
			handleYearUpdate()
			expect(currentViewMode.value).toBe('months')

			// VDatePicker essaie de forcer le mode 'month'
			handleViewModeUpdate('month')

			// Le mode devrait rester 'months' (protection contre VDatePicker)
			expect(currentViewMode.value).toBe('months')
		})
	})
})
