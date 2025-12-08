import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useDateFormatValidation } from '../useDateFormatValidation'

describe('useDateFormatValidation', () => {
	const hasInteracted = ref(false)

	beforeEach(() => {
		hasInteracted.value = false
	})

	describe('validateDateFormat', () => {
		it('devrait retourner isValid=true pour une date valide', () => {
			const { validateDateFormat } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				hasInteracted,
			})

			const result = validateDateFormat('25/12/2023')
			expect(result.isValid).toBe(true)
			expect(result.message).toBe('')
		})

		it('devrait retourner isValid=false pour une date invalide', () => {
			const { validateDateFormat } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				hasInteracted,
			})

			const result = validateDateFormat('32/12/2023')
			expect(result.isValid).toBe(false)
			expect(result.message).toBe('Format de date invalide (JJ/MM/AAAA)')
		})

		it('devrait retourner isValid=true pour une date vide si non requis', () => {
			const { validateDateFormat } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				required: false,
				hasInteracted,
			})

			const result = validateDateFormat('')
			expect(result.isValid).toBe(true)
			expect(result.message).toBe('')
		})

		it('devrait retourner isValid=false pour une date vide si requis et utilisateur a interagi', () => {
			hasInteracted.value = true

			const { validateDateFormat } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				required: true,
				hasInteracted,
			})

			const result = validateDateFormat('')
			expect(result.isValid).toBe(false)
			expect(result.message).toBe('La date est requise.')
		})

		it('devrait retourner isValid=true si disableErrorHandling=true même pour une date invalide', () => {
			const { validateDateFormat } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				disableErrorHandling: true,
				hasInteracted,
			})

			const result = validateDateFormat('32/12/2023')
			expect(result.isValid).toBe(true)
			expect(result.message).toBe('')
		})

		it('devrait retourner isValid=false pour une date avec des caractères non autorisés', () => {
			const { validateDateFormat } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				hasInteracted,
			})

			const result = validateDateFormat('25/12/2023a')
			expect(result.isValid).toBe(false)
			expect(result.message).toBe('Format de date invalide (JJ/MM/AAAA)')
		})

		it('devrait valider une date au format alternatif si dateFormatReturn est spécifié', () => {
			const { validateDateFormat } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-MM-DD',
				hasInteracted,
			})

			// Format principal
			let result = validateDateFormat('25/12/2023')
			expect(result.isValid).toBe(true)

			// Format alternatif
			result = validateDateFormat('2023-12-25')
			expect(result.isValid).toBe(true)
		})
	})

	describe('isDateComplete', () => {
		it('devrait retourner true pour une date complète et valide', () => {
			const { isDateComplete } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				hasInteracted,
			})

			expect(isDateComplete.value('25/12/2023')).toBe(true)
		})

		it('devrait retourner false pour une date incomplète', () => {
			const { isDateComplete } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				hasInteracted,
			})

			expect(isDateComplete.value('25/12')).toBe(false)
		})

		it('devrait retourner false pour une date vide', () => {
			const { isDateComplete } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				hasInteracted,
			})

			expect(isDateComplete.value('')).toBe(false)
		})

		it('devrait retourner true pour une date avec le bon nombre de chiffres, même si elle est invalide', () => {
			const { isDateComplete } = useDateFormatValidation({
				format: 'DD/MM/YYYY',
				hasInteracted,
			})

			// 32/12/2023 a le bon nombre de chiffres, même si c'est une date invalide
			expect(isDateComplete.value('32/12/2023')).toBe(true)
		})

		it('devrait vérifier uniquement le nombre de chiffres pour différents formats de date', () => {
			const { isDateComplete: isDateCompleteUS } = useDateFormatValidation({
				format: 'MM/DD/YYYY',
				hasInteracted,
			})

			// 12/25/2023 a le bon nombre de chiffres pour le format MM/DD/YYYY
			expect(isDateCompleteUS.value('12/25/2023')).toBe(true)
			// 25/12/2023 a aussi le bon nombre de chiffres, même si ce n'est pas dans le bon ordre
			expect(isDateCompleteUS.value('25/12/2023')).toBe(true)
			// 1/2/2023 n'a pas assez de chiffres
			expect(isDateCompleteUS.value('1/2/2023')).toBe(false)

			const { isDateComplete: isDateCompleteISO } = useDateFormatValidation({
				format: 'YYYY-MM-DD',
				hasInteracted,
			})

			// 2023-12-25 a le bon nombre de chiffres pour le format YYYY-MM-DD
			expect(isDateCompleteISO.value('2023-12-25')).toBe(true)
			// 25-12-2023 a aussi le bon nombre de chiffres, même si ce n'est pas dans le bon ordre
			expect(isDateCompleteISO.value('25-12-2023')).toBe(true)
			// 23-1-25 n'a pas assez de chiffres
			expect(isDateCompleteISO.value('23-1-25')).toBe(false)
		})
	})
})
