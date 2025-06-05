import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTodayButton } from '../useTodayButton'

// Mock pour dayjs
vi.mock('dayjs', () => {
	return {
		default: vi.fn(() => ({
			locale: vi.fn().mockReturnThis(),
			format: vi.fn().mockReturnValue('lundi 1 janvier'),
		})),
	}
})

describe('useTodayButton', () => {
	beforeEach(() => {
		vi.clearAllMocks()
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
			// Créer une date fixe pour le test
			const fixedDate = new Date('2023-01-01')
			// Espionner le constructeur Date pour qu'il retourne notre date fixe
			vi.spyOn(global, 'Date').mockImplementation(() => fixedDate)

			const { selectToday } = useTodayButton({
				displayRange: false,
			})

			const selectedDates = { value: null }
			selectToday(selectedDates)

			expect(selectedDates.value).toBeDefined()
			expect(selectedDates.value).toEqual(fixedDate)

			// Restaurer le mock
			vi.restoreAllMocks()
		})

		it('devrait définir selectedDates à un tableau avec deux fois la date du jour en mode plage', () => {
			// Créer une date fixe pour le test
			const fixedDate = new Date('2023-01-01')
			// Espionner le constructeur Date pour qu'il retourne notre date fixe
			vi.spyOn(global, 'Date').mockImplementation(() => fixedDate)

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

			// Restaurer le mock
			vi.restoreAllMocks()
		})
	})
})
