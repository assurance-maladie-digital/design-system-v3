import { describe, it, expect } from 'vitest'
import { useDateNormalization } from '../useDateNormalization'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Initialiser le plugin dayjs nécessaire pour les tests
dayjs.extend(customParseFormat)

// Fonction de parsing simplifiée pour les tests
const parseDate = (dateStr: string, format: string): Date | null => {
	const parsedDate = dayjs(dateStr, format, true)
	if (!parsedDate.isValid()) {
		return null
	}
	return parsedDate.toDate()
}

// Fonction de formatage simplifiée pour les tests
const formatDate = (date: Date | null, format: string): string => {
	if (!date) return ''
	return dayjs(date).format(format)
}

describe('useDateNormalization', () => {
	const format = 'DD/MM/YYYY'
	const { normalizeDate, normalizeAndFormatDate, normalizeValue } = useDateNormalization({
		format,
		parseDate,
		formatDate,
	})

	describe('normalizeDate', () => {
		it('devrait retourner la date telle quelle si elle est valide', () => {
			const validDate = '15/06/2024'
			const result = normalizeDate(validDate)

			expect(result.wasNormalized).toBe(false)
			expect(result.normalizedDate).toBeInstanceOf(Date)
			expect(formatDate(result.normalizedDate, format)).toBe(validDate)
		})

		it('devrait normaliser une date avec un jour invalide (31/02/2024 -> 29/02/2024)', () => {
			const invalidDate = '31/02/2024'
			const result = normalizeDate(invalidDate)

			expect(result.wasNormalized).toBe(true)
			expect(result.normalizedDate).toBeInstanceOf(Date)
			expect(formatDate(result.normalizedDate, format)).toBe('29/02/2024')
		})

		it('devrait normaliser une date avec un jour invalide (31/04/2024 -> 30/04/2024)', () => {
			const invalidDate = '31/04/2024'
			const result = normalizeDate(invalidDate)

			expect(result.wasNormalized).toBe(true)
			expect(result.normalizedDate).toBeInstanceOf(Date)
			expect(formatDate(result.normalizedDate, format)).toBe('30/04/2024')
		})

		it('devrait normaliser une date avec un jour invalide (29/02/2023 -> 28/02/2023)', () => {
			const invalidDate = '29/02/2023' // 2023 n'est pas une année bissextile
			const result = normalizeDate(invalidDate)

			expect(result.wasNormalized).toBe(true)
			expect(result.normalizedDate).toBeInstanceOf(Date)
			expect(formatDate(result.normalizedDate, format)).toBe('28/02/2023')
		})

		it('devrait retourner null pour une entrée complètement invalide', () => {
			const invalidInput = 'abc'
			const result = normalizeDate(invalidInput)

			expect(result.wasNormalized).toBe(false)
			expect(result.normalizedDate).toBeNull()
		})
	})

	describe('normalizeAndFormatDate', () => {
		it('devrait formater correctement une date valide', () => {
			const validDate = '15/06/2024'
			const result = normalizeAndFormatDate(validDate)

			expect(result.wasNormalized).toBe(false)
			expect(result.formattedDate).toBe(validDate)
		})

		it('devrait normaliser et formater une date invalide', () => {
			const invalidDate = '31/02/2024'
			const result = normalizeAndFormatDate(invalidDate)

			expect(result.wasNormalized).toBe(true)
			expect(result.formattedDate).toBe('29/02/2024')
		})
	})

	describe('normalizeValue', () => {
		it('devrait gérer correctement une valeur null', () => {
			const result = normalizeValue(null)

			expect(result.wasNormalized).toBe(false)
			expect(result.normalizedValue).toBeNull()
		})

		it('devrait normaliser une chaîne de date', () => {
			const invalidDate = '31/02/2024'
			const result = normalizeValue(invalidDate)

			expect(result.wasNormalized).toBe(true)
			expect(result.normalizedValue).toBeInstanceOf(Date)
			expect(formatDate(result.normalizedValue as Date, format)).toBe('29/02/2024')
		})

		it('devrait normaliser un tableau de chaînes de dates', () => {
			const dates = ['15/06/2024', '31/02/2024']
			const result = normalizeValue(dates)

			expect(result.wasNormalized).toBe(true)
			expect(Array.isArray(result.normalizedValue)).toBe(true)

			const normalizedDates = result.normalizedValue as Date[]
			expect(normalizedDates.length).toBe(2)
			expect(formatDate(normalizedDates[0], format)).toBe('15/06/2024')
			expect(formatDate(normalizedDates[1], format)).toBe('29/02/2024')
		})

		it('devrait retourner une Date telle quelle', () => {
			const date = new Date(2024, 5, 15) // 15/06/2024
			const result = normalizeValue(date)

			expect(result.wasNormalized).toBe(false)
			expect(result.normalizedValue).toBe(date)
		})
	})
})
