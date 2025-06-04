import { describe, it, expect, vi } from 'vitest'
import { useDisplayedDateString } from '../useDisplayedDateString'
import { computed } from 'vue'

// Mock pour dayjs
vi.mock('dayjs', () => {
	const mockDayjs = (date: Date | string | null) => {
		// Si la date est null, retourner un objet avec isValid = false
		if (date === null) {
			return {
				isValid: () => false,
				format: vi.fn(),
			}
		}

		// Simuler différents formats de date en fonction de l'entrée
		return {
			isValid: () => true,
			format: (format: string) => {
				if (format === 'D MMMM') {
					return '1 janvier'
				}
				if (format === 'D MMMM YYYY') {
					return '1 janvier 2025'
				}
				if (format === 'dddd D MMMM YYYY') {
					return 'jeudi 1 janvier 2025'
				}
				return 'date formatée'
			},
		}
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
		expect(displayedDateString.value).toBe('jeudi 1 janvier 2025')
	})

	it('devrait formater correctement une plage de dates avec deux dates', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: [new Date('2025-01-01'), new Date('2025-01-15')] },
			todayInString,
		})
		expect(displayedDateString.value).toBe('1 janvier - 1 janvier 2025')
	})

	it('devrait formater correctement une plage de dates avec une seule date', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: [new Date('2025-01-01')] },
			todayInString,
		})
		expect(displayedDateString.value).toBe('jeudi 1 janvier 2025')
	})

	it('devrait retourner la date du jour si la date est invalide', () => {
		// Utiliser un objet Date invalide pour simuler une date non valide
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: new Date('invalid date') },
			todayInString,
		})
		expect(displayedDateString.value).toBe('jeudi 1 janvier 2025')
	})

	it('devrait retourner la date du jour si la plage de dates est vide', () => {
		const { displayedDateString } = useDisplayedDateString({
			selectedDates: { value: [] },
			todayInString,
		})
		expect(displayedDateString.value).toBe('Jeudi 1 Janvier 2025')
	})
})
