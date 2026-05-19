import { describe, it, expect } from 'vitest'
import {
	getJoursFeries,
	isHolidayDay,
	useHolidayDay,
} from '../useHolidayDay'

describe('useHolidayDay', () => {
	const { calculPaquesGregorienne } = useHolidayDay()

	describe('calculPaquesGregorienne', () => {
		it('calculates Easter date for various years', () => {
			// Pâques 2023: 9 avril
			const paques2023 = calculPaquesGregorienne(2023)
			expect(paques2023.jour).toBe(9)
			expect(paques2023.mois).toBe(4)

			// Pâques 2024: 31 mars
			const paques2024 = calculPaquesGregorienne(2024)
			expect(paques2024.jour).toBe(31)
			expect(paques2024.mois).toBe(3)

			// Pâques 2025: 20 avril
			const paques2025 = calculPaquesGregorienne(2025)
			expect(paques2025.jour).toBe(20)
			expect(paques2025.mois).toBe(4)
		})

		it('handles years where sum <= 9 (Easter in March)', () => {
			// Certaines années Pâques tombe en mars (sum <= 9)
			const paques2016 = calculPaquesGregorienne(2016)
			expect(paques2016.mois).toBe(3) // 27 mars 2016
		})
	})

	describe('getJoursFeries', () => {
		it('returns a Set of holidays for a given year', () => {
			const holidays2023 = getJoursFeries(2023)
			expect(holidays2023).toBeInstanceOf(Set)
			expect(holidays2023.size).toBe(11) // 11 jours fériés fixes + variables
		})

		it('includes fixed holidays', () => {
			const holidays2023 = getJoursFeries(2023)
			expect(holidays2023.has('01/01/2023')).toBe(true) // Jour de l'an
			expect(holidays2023.has('01/05/2023')).toBe(true) // Fête du travail
			expect(holidays2023.has('08/05/2023')).toBe(true) // Victoire
			expect(holidays2023.has('14/07/2023')).toBe(true) // Fête nationale
			expect(holidays2023.has('15/08/2023')).toBe(true) // Assomption
			expect(holidays2023.has('01/11/2023')).toBe(true) // Toussaint
			expect(holidays2023.has('11/11/2023')).toBe(true) // Armistice
			expect(holidays2023.has('25/12/2023')).toBe(true) // Noël
		})

		it('includes Easter-related holidays', () => {
			const holidays2023 = getJoursFeries(2023)
			// Pâques 2023: 9 avril
			expect(holidays2023.has('10/04/2023')).toBe(true) // Lundi de Pâques
			expect(holidays2023.has('18/05/2023')).toBe(true) // Ascension
			expect(holidays2023.has('29/05/2023')).toBe(true) // Lundi de Pentecôte
		})

		it('accepts custom format', () => {
			const holidays2023 = getJoursFeries(2023, 'YYYY-MM-DD')
			expect(holidays2023.has('2023-01-01')).toBe(true)
			expect(holidays2023.has('2023-12-25')).toBe(true)
		})
	})

	describe('isHolidayDay', () => {
		it('returns true for holidays', () => {
			expect(isHolidayDay(new Date(2023, 0, 1))).toBe(true) // Jour de l'an
			expect(isHolidayDay(new Date(2023, 4, 1))).toBe(true) // Fête du travail
			expect(isHolidayDay(new Date(2023, 11, 25))).toBe(true) // Noël
		})

		it('returns false for non-holidays', () => {
			expect(isHolidayDay(new Date(2023, 0, 2))).toBe(false) // 2 janvier
			expect(isHolidayDay(new Date(2023, 5, 15))).toBe(false) // 15 juin
		})

		it('accepts string dates', () => {
			expect(isHolidayDay('01/01/2023', 'DD/MM/YYYY')).toBe(true)
			expect(isHolidayDay('02/01/2023', 'DD/MM/YYYY')).toBe(false)
		})

		it('accepts custom format', () => {
			expect(isHolidayDay('2023-01-01', 'YYYY-MM-DD')).toBe(true)
			expect(isHolidayDay('2023-12-25', 'YYYY-MM-DD')).toBe(true)
		})

		it('returns false for invalid dates', () => {
			expect(isHolidayDay('invalid-date', 'DD/MM/YYYY')).toBe(false)
			expect(isHolidayDay('', 'DD/MM/YYYY')).toBe(false)
		})
	})

	describe('useHolidayDay composable', () => {
		it('returns all functions', () => {
			const hook = useHolidayDay()
			expect(hook.getJoursFeries).toBeDefined()
			expect(hook.isHolidayDay).toBeDefined()
			expect(hook.calculPaquesGregorienne).toBeDefined()
			expect(typeof hook.getJoursFeries).toBe('function')
			expect(typeof hook.isHolidayDay).toBe('function')
			expect(typeof hook.calculPaquesGregorienne).toBe('function')
		})
	})
})
