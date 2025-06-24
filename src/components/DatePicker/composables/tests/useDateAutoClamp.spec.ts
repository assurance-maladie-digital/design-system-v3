import { describe, it, expect } from 'vitest'
import { useDateAutoClamp } from '../useDateAutoClamp'

describe('useDateAutoClamp', () => {
	describe('clampDayToValidDate', () => {
		it('devrait retourner le jour inchangé si valide', () => {
			const { clampDayToValidDate } = useDateAutoClamp()

			// Jour valide dans un mois standard
			const result1 = clampDayToValidDate(15, 0, 2023) // 15 janvier 2023
			expect(result1.day).toBe(15)
			expect(result1.adjusted).toBe(false)

			// Jour valide dans un mois de 30 jours
			const result2 = clampDayToValidDate(30, 3, 2023) // 30 avril 2023
			expect(result2.day).toBe(30)
			expect(result2.adjusted).toBe(false)

			// Jour valide dans un mois de 31 jours
			const result3 = clampDayToValidDate(31, 0, 2023) // 31 janvier 2023
			expect(result3.day).toBe(31)
			expect(result3.adjusted).toBe(false)
		})

		it('devrait ajuster le jour au dernier jour du mois si invalide', () => {
			const { clampDayToValidDate } = useDateAutoClamp()

			// Jour invalide dans un mois de 30 jours
			const result1 = clampDayToValidDate(31, 3, 2023) // 31 avril 2023 -> 30 avril 2023
			expect(result1.day).toBe(30)
			expect(result1.adjusted).toBe(true)

			// Jour invalide dans un mois de 28 jours (février non bissextile)
			const result2 = clampDayToValidDate(29, 1, 2023) // 29 février 2023 -> 28 février 2023
			expect(result2.day).toBe(28)
			expect(result2.adjusted).toBe(true)

			// Jour très invalide
			const result3 = clampDayToValidDate(45, 5, 2023) // 45 juin 2023 -> 30 juin 2023
			expect(result3.day).toBe(30)
			expect(result3.adjusted).toBe(true)
		})

		it('devrait gérer correctement les années bissextiles', () => {
			const { clampDayToValidDate } = useDateAutoClamp()

			// 29 février sur une année bissextile
			const result1 = clampDayToValidDate(29, 1, 2024) // 29 février 2024
			expect(result1.day).toBe(29)
			expect(result1.adjusted).toBe(false)

			// 29 février sur une année non bissextile
			const result2 = clampDayToValidDate(29, 1, 2023) // 29 février 2023 -> 28 février 2023
			expect(result2.day).toBe(28)
			expect(result2.adjusted).toBe(true)
		})
	})

	describe('autoClampDate', () => {
		it('devrait retourner la chaîne inchangée si vide', () => {
			const { autoClampDate } = useDateAutoClamp()

			const result = autoClampDate('', 'DD/MM/YYYY')
			expect(result.clampedDate).toBe('')
			expect(result.adjusted).toBe(false)
		})

		it('devrait retourner la chaîne inchangée si la date est valide', () => {
			const { autoClampDate } = useDateAutoClamp()

			// Date valide au format DD/MM/YYYY
			const result1 = autoClampDate('15/01/2023', 'DD/MM/YYYY')
			expect(result1.clampedDate).toBe('15/01/2023')
			expect(result1.adjusted).toBe(false)

			// Date valide au format MM/DD/YYYY
			const result2 = autoClampDate('01/15/2023', 'MM/DD/YYYY')
			expect(result2.clampedDate).toBe('01/15/2023')
			expect(result2.adjusted).toBe(false)

			// Date valide au format YYYY-MM-DD
			const result3 = autoClampDate('2023-01-15', 'YYYY-MM-DD')
			expect(result3.clampedDate).toBe('2023-01-15')
			expect(result3.adjusted).toBe(false)
		})

		it('devrait ajuster les dates invalides au format DD/MM/YYYY', () => {
			const { autoClampDate } = useDateAutoClamp()

			// 31 avril -> 30 avril
			const result1 = autoClampDate('31/04/2023', 'DD/MM/YYYY')
			expect(result1.clampedDate).toBe('30/04/2023')
			expect(result1.adjusted).toBe(true)

			// 29 février 2023 (non bissextile) -> 28 février
			const result2 = autoClampDate('29/02/2023', 'DD/MM/YYYY')
			expect(result2.clampedDate).toBe('28/02/2023')
			expect(result2.adjusted).toBe(true)

			// 29 février 2024 (bissextile) reste inchangé
			const result3 = autoClampDate('29/02/2024', 'DD/MM/YYYY')
			expect(result3.clampedDate).toBe('29/02/2024')
			expect(result3.adjusted).toBe(false)
		})

		it('devrait ajuster les dates invalides au format MM/DD/YYYY', () => {
			const { autoClampDate } = useDateAutoClamp()

			// Avril 31 -> Avril 30
			const result1 = autoClampDate('04/31/2023', 'MM/DD/YYYY')
			expect(result1.clampedDate).toBe('04/30/2023')
			expect(result1.adjusted).toBe(true)

			// Février 29 2023 (non bissextile) -> Février 28
			const result2 = autoClampDate('02/29/2023', 'MM/DD/YYYY')
			expect(result2.clampedDate).toBe('02/28/2023')
			expect(result2.adjusted).toBe(true)
		})

		it('devrait ajuster les dates invalides au format YYYY-MM-DD', () => {
			const { autoClampDate } = useDateAutoClamp()

			// 2023-04-31 -> 2023-04-30
			const result1 = autoClampDate('2023-04-31', 'YYYY-MM-DD')
			expect(result1.clampedDate).toBe('2023-04-30')
			expect(result1.adjusted).toBe(true)

			// 2023-02-29 (non bissextile) -> 2023-02-28
			const result2 = autoClampDate('2023-02-29', 'YYYY-MM-DD')
			expect(result2.clampedDate).toBe('2023-02-28')
			expect(result2.adjusted).toBe(true)
		})

		it('devrait gérer différents séparateurs', () => {
			const { autoClampDate } = useDateAutoClamp()

			// Format avec tiret
			const result1 = autoClampDate('31-04-2023', 'DD-MM-YYYY')
			expect(result1.clampedDate).toBe('30-04-2023')
			expect(result1.adjusted).toBe(true)

			// Format avec point
			const result2 = autoClampDate('31.04.2023', 'DD.MM.YYYY')
			expect(result2.clampedDate).toBe('30.04.2023')
			expect(result2.adjusted).toBe(true)
		})

		it('devrait conserver le format de jour (D vs DD)', () => {
			const { autoClampDate } = useDateAutoClamp()

			// Format avec D (jour sans zéro initial)
			const result1 = autoClampDate('31/4/2023', 'D/M/YYYY')
			expect(result1.clampedDate).toBe('30/4/2023')
			expect(result1.adjusted).toBe(true)

			// Format avec DD (jour avec zéro initial)
			const result2 = autoClampDate('31/04/2023', 'DD/MM/YYYY')
			expect(result2.clampedDate).toBe('30/04/2023')
			expect(result2.adjusted).toBe(true)
		})

		it('devrait retourner la chaîne originale si le format ne correspond pas', () => {
			const { autoClampDate } = useDateAutoClamp()

			// Nombre de parties différent
			const result1 = autoClampDate('31/04', 'DD/MM/YYYY')
			expect(result1.clampedDate).toBe('31/04')
			expect(result1.adjusted).toBe(false)

			// Contient des caractères non numériques
			const result2 = autoClampDate('31/04/202a', 'DD/MM/YYYY')
			expect(result2.clampedDate).toBe('30/04/202a')
			expect(result2.adjusted).toBe(true)
		})

		it('devrait gérer les cas limites', () => {
			const { autoClampDate } = useDateAutoClamp()

			// Mois invalide
			const result1 = autoClampDate('15/13/2023', 'DD/MM/YYYY')
			expect(result1.clampedDate).toBe('15/13/2023')
			expect(result1.adjusted).toBe(false)

			// Jour négatif
			const result2 = autoClampDate('-1/04/2023', 'DD/MM/YYYY')
			expect(result2.clampedDate).toBe('-1/04/2023')
			expect(result2.adjusted).toBe(false)
		})
	})
})
