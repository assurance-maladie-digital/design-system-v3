import { describe, it, expect, vi } from 'vitest'
import { isHolidayDay } from '../index'

// Mock du composable useHolidayDay
vi.mock('@/composables/date/useHolidayDay', () => ({
	useHolidayDay: () => ({
		isHolidayDay: (date: string) => {
			// Simuler quelques jours fériés pour les tests
			const holidays = [
				'01/01/2025', // Jour de l'an
				'14/07/2025', // Fête nationale
				'25/12/2025', // Noël
			]
			return holidays.includes(date)
		},
	}),
}))

describe('isHolidayDay', () => {
	it('devrait retourner true si la valeur est vide', () => {
		expect(isHolidayDay('')).toBe(true)
		expect(isHolidayDay(null)).toBe(true)
	})

	it('devrait retourner true si la date n\'est pas un jour férié', () => {
		expect(isHolidayDay('02/01/2025')).toBe(true)
		expect(isHolidayDay('15/07/2025')).toBe(true)
	})

	it('devrait retourner un message d\'erreur si la date est un jour férié', () => {
		expect(isHolidayDay('01/01/2025')).toBe('La date ne peut pas être un jour férié.')
		expect(isHolidayDay('14/07/2025')).toBe('La date ne peut pas être un jour férié.')
		expect(isHolidayDay('25/12/2025')).toBe('La date ne peut pas être un jour férié.')
	})
})
