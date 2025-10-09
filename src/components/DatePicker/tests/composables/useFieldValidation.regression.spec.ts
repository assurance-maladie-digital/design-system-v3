/**
 * Tests de régression pour useFieldValidation
 *
 * Ces tests couvrent spécifiquement les bugs résolus dans les mémoires :
 * - Mémoire 1f50fe1b : Messages "Date invalide" lors de suppression via croix
 * - Mémoire 36e3ba09 : Priorité des erreurs sur les succès
 * - Validation des règles de date avec valeurs nulles/vides
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useFieldValidation } from '@/composables/rules/useFieldValidation'

describe('useFieldValidation - Tests de Régression', () => {
	let fieldValidation: ReturnType<typeof useFieldValidation>

	beforeEach(() => {
		fieldValidation = useFieldValidation()
	})

	describe('Règles de date avec valeurs nulles/vides (Mémoire 1f50fe1b)', () => {
		it('notBeforeDate: ne doit pas valider les valeurs nulles', () => {
			const rules = fieldValidation.generateRules([{ type: 'notBeforeDate', options: { date: '2024-01-01' } }])
			const rule = rules[0]

			// Test avec null
			const resultNull = rule(null)
			expect(resultNull).toEqual({})

			// Test avec undefined
			const resultUndefined = rule(undefined)
			expect(resultUndefined).toEqual({})

			// Test avec chaîne vide
			const resultEmpty = rule('')
			expect(resultEmpty).toEqual({})
		})

		it('notAfterDate: ne doit pas valider les valeurs nulles', () => {
			const rules = fieldValidation.generateRules([{ type: 'notAfterDate', options: { date: '2024-12-31' } }])
			const rule = rules[0]

			// Test avec null
			const resultNull = rule(null)
			expect(resultNull).toEqual({})

			// Test avec undefined
			const resultUndefined = rule(undefined)
			expect(resultUndefined).toEqual({})

			// Test avec chaîne vide
			const resultEmpty = rule('')
			expect(resultEmpty).toEqual({})
		})

		it('dateExact: ne doit pas valider les valeurs nulles', () => {
			const rules = fieldValidation.generateRules([{ type: 'dateExact', options: { date: '2024-06-15' } }])
			const rule = rules[0]

			// Test avec null
			const resultNull = rule(null)
			expect(resultNull).toEqual({})

			// Test avec undefined
			const resultUndefined = rule(undefined)
			expect(resultUndefined).toEqual({})

			// Test avec chaîne vide
			const resultEmpty = rule('')
			expect(resultEmpty).toEqual({})
		})

		it('notBeforeDate: doit valider les vraies valeurs de date', () => {
			const rules = fieldValidation.generateRules([{ type: 'notBeforeDate', options: { date: '01/01/2024' } }])
			const rule = rules[0]

			// Date valide après la limite
			const resultValid = rule('15/06/2024')
			expect(resultValid).toHaveProperty('success')

			// Date invalide avant la limite
			const resultInvalid = rule('31/12/2023')
			expect(resultInvalid).toHaveProperty('error')
			expect(resultInvalid.error).toContain('ne peut pas être avant')
		})

		it('notAfterDate: doit valider les vraies valeurs de date', () => {
			const rules = fieldValidation.generateRules([{ type: 'notAfterDate', options: { date: '31/12/2024' } }])
			const rule = rules[0]

			// Date valide avant la limite
			const resultValid = rule('15/06/2024')
			expect(resultValid).toHaveProperty('success')

			// Date invalide après la limite
			const resultInvalid = rule('01/01/2025')
			expect(resultInvalid).toHaveProperty('error')
			expect(resultInvalid.error).toContain('ne peut pas être après')
		})

		it('dateExact: doit valider les vraies valeurs de date', () => {
			const rules = fieldValidation.generateRules([{ type: 'dateExact', options: { date: '15/06/2024' } }])
			const rule = rules[0]

			// Date exacte
			const resultValid = rule('15/06/2024')
			expect(resultValid).toHaveProperty('success')

			// Date différente
			const resultInvalid = rule('16/06/2024')
			expect(resultInvalid).toHaveProperty('error')
			expect(resultInvalid.error).toContain('doit être exactement')
		})
	})

	describe('Gestion des erreurs de configuration', () => {
		it('notBeforeDate: doit retourner une erreur si options.date manque', () => {
			const rules = fieldValidation.generateRules([{ type: 'notBeforeDate', options: {} }])
			const rule = rules[0]

			const result = rule('01/01/2024')
			expect(result).toEqual({ error: 'Configuration de la règle invalide' })
		})

		it('notAfterDate: doit retourner une erreur si options.date manque', () => {
			const rules = fieldValidation.generateRules([{ type: 'notAfterDate', options: {} }])
			const rule = rules[0]

			const result = rule('01/01/2024')
			expect(result).toEqual({ error: 'Configuration de la règle invalide' })
		})

		it('dateExact: doit retourner une erreur si options.date manque', () => {
			const rules = fieldValidation.generateRules([{ type: 'dateExact', options: {} }])
			const rule = rules[0]

			const result = rule('01/01/2024')
			expect(result).toEqual({ error: 'Configuration de la règle invalide' })
		})
	})

	describe('Gestion des dates invalides', () => {
		it('notBeforeDate: doit retourner "Date invalide" pour des formats incorrects', () => {
			const rules = fieldValidation.generateRules([{ type: 'notBeforeDate', options: { date: '01/01/2024' } }])
			const rule = rules[0]

			const result = rule('invalid-date')
			expect(result).toEqual({ error: 'Date invalide' })
		})

		it('notAfterDate: doit retourner "Date invalide" pour des formats incorrects', () => {
			const rules = fieldValidation.generateRules([{ type: 'notAfterDate', options: { date: '31/12/2024' } }])
			const rule = rules[0]

			const result = rule('not-a-date')
			expect(result).toEqual({ error: 'Date invalide' })
		})

		it('dateExact: doit retourner "Date invalide" pour des formats incorrects', () => {
			const rules = fieldValidation.generateRules([{ type: 'dateExact', options: { date: '15/06/2024' } }])
			const rule = rules[0]

			const result = rule('malformed-date')
			expect(result).toEqual({ error: 'Date invalide' })
		})
	})

	describe('Cas edge avec différents types de valeurs vides', () => {
		it('doit traiter correctement les valeurs falsy', () => {
			const rules = fieldValidation.generateRules([{ type: 'notBeforeDate', options: { date: '01/01/2024' } }])
			const rule = rules[0]

			// Valeurs falsy qui doivent être ignorées
			expect(rule(null)).toEqual({})
			expect(rule(undefined)).toEqual({})
			expect(rule('')).toEqual({})

			// Valeurs falsy qui doivent être validées (car ce sont des chaînes)
			const result0 = rule('0')
			expect(result0).toHaveProperty('error')
			expect(result0.error).toBe('Date invalide')

			const resultFalse = rule('false')
			expect(resultFalse).toHaveProperty('error')
			expect(resultFalse.error).toBe('Date invalide')
		})
	})

	describe('Intégration avec différents formats de date', () => {
		it('doit fonctionner avec différents formats de date valides', () => {
			const rules = fieldValidation.generateRules([{ type: 'notBeforeDate', options: { date: '01/01/2024' } }])
			const rule = rules[0]

			// Format français DD/MM/YYYY (format par défaut)
			expect(rule('15/06/2024')).toHaveProperty('success')

			// Formats non supportés devraient retourner une erreur
			const resultISO = rule('2024-06-15')
			expect(resultISO).toHaveProperty('error')
			expect(resultISO.error).toBe('Date invalide')
		})
	})
})
