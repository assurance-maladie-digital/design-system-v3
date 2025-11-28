import { describe, it, expect, vi } from 'vitest'
import { useDisplayedDateString } from '../useDisplayedDateString'
import { computed } from 'vue'

// Mock pour dayjs
vi.mock('dayjs', () => {
	const mockDayjs = (date: Date | string | null) => {
		// Cas de date invalide simulée
		if (date === null || date === 'invalid') {
			return {
				isValid: () => false,
				format: vi.fn(),
				locale: () => ({
					isValid: () => false,
					format: vi.fn(),
				}),
			}
		}

		// Créer l'objet mock de base avec les méthodes nécessaires
		const obj = {
			isValid: () => true,
			format: (format: string) => {
				if (format === 'D MMMM') {
					return '1 Janvier'
				}
				if (format === 'D MMMM YYYY') {
					return '1 Janvier 2025'
				}
				if (format === 'dddd DD MMMM YYYY') {
					return 'Jeudi 1 Janvier 2025'
				}
				return 'date formatée'
			},
			// La méthode locale retourne le même objet pour permettre le chaînage
			locale: () => obj,
		}
		return obj
	}

	return {
		default: mockDayjs,
	}
})

describe('useDisplayedDateString', () => {
	const todayInString = computed(() => 'Jeudi 1 Janvier 2025')

	it('devrait initialiser correctement', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: null },
			todayInString,
		})
		expect(displayedDateString).toBeDefined()
	})

	it('devrait retourner la date du jour si aucune date n\'est sélectionnée', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: null },
			todayInString,
		})
		expect(displayedDateString.value).toBe('Jeudi 1 Janvier 2025')
	})

	it('devrait formater correctement une date unique', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: new Date('2025-01-01') },
			todayInString,
		})
		expect(displayedDateString.value).toBe('Jeudi 1 Janvier 2025')
	})

	it('devrait formater correctement une plage de dates avec deux dates', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: [new Date('2025-01-01'), new Date('2025-01-15')] },
			todayInString,
		})
		expect(displayedDateString.value).toBe('1 Janvier - 1 Janvier 2025')
	})

	it('devrait formater correctement une plage de dates avec une seule date', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: [new Date('2025-01-01')] },
			todayInString,
		})
		expect(displayedDateString.value).toBe('Jeudi 1 Janvier 2025')
	})

	it('devrait retourner la date du jour si la date est invalide', () => {
		// Utiliser un objet Date invalide pour simuler une date non valide
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: new Date('invalid date') },
			todayInString,
		})
		expect(displayedDateString.value).toBe('Jeudi 1 Janvier 2025')
	})

	it('devrait retourner la date du jour si la plage de dates est vide', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: [] },
			todayInString,
		})
		expect(displayedDateString.value).toBe('Jeudi 1 Janvier 2025')
	})

	it('devrait utiliser rangeBoundaryDates en priorité pour formater une plage valide', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: [new Date('2025-01-01'), new Date('2025-01-15')] },
			rangeBoundaryDates: { value: [new Date('2025-01-01'), new Date('2025-01-15')] },
			todayInString,
		})
		expect(displayedDateString.value).toBe('1 Janvier - 1 Janvier 2025')
	})

	it('devrait retourner la date du jour si rangeBoundaryDates est invalide et que la plage est vide', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: [] },
			rangeBoundaryDates: { value: ['invalid' as unknown as Date, 'invalid' as unknown as Date] },
			todayInString,
		})
		expect(displayedDateString.value).toBe('Jeudi 1 Janvier 2025')
	})

	it('devrait retourner la date du jour si une plage contient des dates invalides', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: [null, null] as unknown as (Date | null)[] },
			todayInString,
		})
		expect(displayedDateString.value).toBe('Jeudi 1 Janvier 2025')
	})

	it('devrait retourner la date du jour si la seule date du tableau est invalide', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: [null] as unknown as (Date | null)[] },
			todayInString,
		})
		expect(displayedDateString.value).toBe('Jeudi 1 Janvier 2025')
	})
})
