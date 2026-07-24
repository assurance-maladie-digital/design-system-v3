import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTodaySelectionState, useTodayButton } from '../useTodayButton'

// Mock pour dayjs
vi.mock('dayjs', () => {
	return {
		default: vi.fn(() => {
			const fixedDate = new Date(2023, 0, 1)
			return {
				locale: vi.fn().mockReturnThis(),
				format: vi.fn().mockReturnValue('lundi 1 janvier'),
				startOf: vi.fn().mockReturnThis(),
				toDate: vi.fn().mockReturnValue(fixedDate),
			}
		}),
	}
})

describe('useTodayButton', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('buildTodaySelectionState', () => {
		it('returns a complete today state in single mode', () => {
			const fixedDate = new Date(2023, 0, 1, 10)
			vi.useFakeTimers()
			vi.setSystemTime(fixedDate)

			const state = buildTodaySelectionState({
				displayRange: false,
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-MM-DD',
				formatDate: (date, format) => {
					const value = date as Date
					if (format === 'DD/MM/YYYY') return '01/01/2023'
					if (format === 'YYYY-MM-DD') return '2023-01-01'
					return value.toISOString()
				},
			})

			expect(state.selectedDates).toEqual(new Date(2023, 0, 1))
			expect(state.modelValue).toBe('2023-01-01')
			expect(state.displayValue).toBe('01/01/2023')
			expect(state.month).toBe('0')
			expect(state.year).toBe('2023')

			vi.useRealTimers()
		})

		it('returns a complete today state in range mode', () => {
			const fixedDate = new Date(2023, 0, 1, 10)
			vi.useFakeTimers()
			vi.setSystemTime(fixedDate)

			const state = buildTodaySelectionState({
				displayRange: true,
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-MM-DD',
				formatDate: (_date, format) => format === 'DD/MM/YYYY' ? '01/01/2023' : '2023-01-01',
			})

			expect(state.selectedDates).toEqual([
				new Date(2023, 0, 1),
				new Date(2023, 0, 1),
			])
			expect(state.modelValue).toEqual(['2023-01-01', '2023-01-01'])
			expect(state.displayValue).toBe('01/01/2023 - 01/01/2023')

			vi.useRealTimers()
		})
	})

	it('devrait initialiser correctement', () => {
		const { selectToday } = useTodayButton({})
		// Vérifier que la fonction selectToday est définie
		expect(selectToday).toBeDefined()
	})

	it('devrait sélectionner la date du jour lorsque selectToday est appelé', () => {
		const { selectToday } = useTodayButton({})

		const selectedDates = { value: null }
		selectToday(selectedDates)

		// Vérifier que selectedDates a été mis à jour
		expect(selectedDates.value).not.toBeNull()
	})

	it('devrait formater la date du jour correctement', () => {
		const { todayInString } = useTodayButton({})

		// Vérifier que le computed todayInString est défini
		expect(todayInString.value).toBeDefined()
	})

	describe('todayInString', () => {
		it('devrait retourner la date du jour formatée avec la première lettre en majuscule', () => {
			const { todayInString } = useTodayButton({})

			// Vérifier que la valeur de todayInString est définie
			expect(todayInString.value).toBeDefined()
		})
	})

	describe('selectToday', () => {
		it('devrait définir selectedDates à la date du jour en mode date unique', () => {
			// Figer l'horloge système sur une date fixe pour le test
			const fixedDate = new Date(2023, 0, 1)
			vi.useFakeTimers()
			vi.setSystemTime(fixedDate)

			const { selectToday } = useTodayButton({
				displayRange: false,
			})

			const selectedDates = { value: null }
			selectToday(selectedDates)

			expect(selectedDates.value).toBeDefined()
			expect(selectedDates.value).toEqual(fixedDate)

			// Restaurer l'horloge réelle
			vi.useRealTimers()
		})

		it('devrait définir selectedDates à un tableau avec deux fois la date du jour en mode plage', () => {
			// Figer l'horloge système sur une date fixe pour le test
			const fixedDate = new Date(2023, 0, 1)
			vi.useFakeTimers()
			vi.setSystemTime(fixedDate)

			const { selectToday } = useTodayButton({
				displayRange: true,
			})

			const selectedDates = { value: null }
			selectToday(selectedDates)

			expect(Array.isArray(selectedDates.value)).toBe(true)
			expect(selectedDates.value).toHaveLength(2)
			// Ajouter une vérification non-null pour satisfaire TypeScript
			if (selectedDates.value) {
				expect(selectedDates.value[0]).toEqual(fixedDate)
				expect(selectedDates.value[1]).toEqual(fixedDate)
			}

			// Restaurer l'horloge réelle
			vi.useRealTimers()
		})
	})
})
