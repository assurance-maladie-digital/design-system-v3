import { describe, it, expect } from 'vitest'
import { validateDateFormat, isDateComplete } from '../useDateFormatUtils'

describe('useDateFormatUtils', () => {
	describe('validateDateFormat', () => {
		it('devrait retourner une chaîne vide pour une date valide au format attendu', () => {
			const result = validateDateFormat('25/12/2023', 'DD/MM/YYYY')
			expect(result.isValid).toBe(true)
			expect(result.message).toBe('')
		})

		it('devrait valider une date avec le format de retour alternatif', () => {
			const result = validateDateFormat('2023-12-25', 'DD/MM/YYYY', 'YYYY-MM-DD')
			expect(result.isValid).toBe(true)
			expect(result.message).toBe('')
		})

		it('devrait retourner une erreur si la date ne correspond ni au format ni au format de retour', () => {
			const result = validateDateFormat('25-12-2023', 'DD/MM/YYYY', 'YYYY-MM-DD')
			expect(result.isValid).toBe(false)
			expect(result.message).toBe('Format de date invalide (DD/MM/YYYY)')
		})

		it('devrait retourner une erreur pour une date invalide mais syntaxiquement correcte', () => {
			const result = validateDateFormat('31/02/2023', 'DD/MM/YYYY')
			expect(result.isValid).toBe(false)
			expect(result.message).toBe('Format de date invalide (DD/MM/YYYY)')
		})

		it('devrait considérer une chaîne vide comme invalide si le champ est requis et a été interactif', () => {
			const result = validateDateFormat('', 'DD/MM/YYYY', undefined, true, true)
			expect(result.isValid).toBe(false)
			expect(result.message).toBe('La date est requise.')
		})

		it('devrait considérer une chaîne vide comme valide si le champ n\'est pas requis', () => {
			const result = validateDateFormat('', 'DD/MM/YYYY', undefined, false, true)
			expect(result.isValid).toBe(true)
			expect(result.message).toBe('')
		})

		it('devrait masquer le message d\'erreur si disableErrorHandling est actif', () => {
			const result = validateDateFormat('31/02/2023', 'DD/MM/YYYY', undefined, false, true, true)
			expect(result.isValid).toBe(true)
			expect(result.message).toBe('')
		})

		it('devrait retourner une erreur pour des caractères non autorisés', () => {
			const result = validateDateFormat('25/12/abcd', 'DD/MM/YYYY')
			expect(result.isValid).toBe(false)
			expect(result.message).toBe('Format de date invalide (DD/MM/YYYY)')
		})
	})

	describe('isDateComplete', () => {
		it('devrait retourner true si le nombre de chiffres correspond au format', () => {
			expect(isDateComplete('25/12/2023', 'DD/MM/YYYY')).toBe(true)
		})

		it('devrait retourner false si le nombre de chiffres est inférieur au format', () => {
			expect(isDateComplete('25/12/20', 'DD/MM/YYYY')).toBe(false)
		})

		it('devrait retourner false pour une chaîne vide', () => {
			expect(isDateComplete('', 'DD/MM/YYYY')).toBe(false)
		})

		it('devrait prendre en compte les différents séparateurs du format', () => {
			expect(isDateComplete('2023-12-25', 'YYYY-MM-DD')).toBe(true)
			expect(isDateComplete('25.12.2023', 'DD.MM.YYYY')).toBe(true)
		})
	})
})
