import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useDateRangeValidation } from '../useDateRangeValidation'

describe('useDateRangeValidation', () => {
	describe('isRangeValid', () => {
		it('devrait retourner true si la date de début est antérieure à la date de fin', () => {
			const selectedDates = ref(null)
			const { isRangeValid } = useDateRangeValidation(selectedDates, true)

			const startDate = new Date('2023-01-01')
			const endDate = new Date('2023-01-10')

			expect(isRangeValid(startDate, endDate)).toBe(true)
		})

		it('devrait retourner true si les dates sont identiques', () => {
			const selectedDates = ref(null)
			const { isRangeValid } = useDateRangeValidation(selectedDates, true)

			const sameDate = new Date('2023-01-01')

			expect(isRangeValid(sameDate, sameDate)).toBe(true)
		})

		it('devrait retourner false si la date de début est postérieure à la date de fin', () => {
			const selectedDates = ref(null)
			const { isRangeValid } = useDateRangeValidation(selectedDates, true)

			const startDate = new Date('2023-01-10')
			const endDate = new Date('2023-01-01')

			expect(isRangeValid(startDate, endDate)).toBe(false)
		})

		it('devrait retourner true si une des dates est null', () => {
			const selectedDates = ref(null)
			const { isRangeValid } = useDateRangeValidation(selectedDates, true)

			const date = new Date('2023-01-01')

			expect(isRangeValid(date, null)).toBe(true)
			expect(isRangeValid(null, date)).toBe(true)
			expect(isRangeValid(null, null)).toBe(true)
		})
	})

	describe('currentRangeIsValid', () => {
		it('devrait retourner true si displayRange est false', () => {
			const selectedDates = ref([new Date('2023-01-10'), new Date('2023-01-01')])
			const { currentRangeIsValid } = useDateRangeValidation(selectedDates, false)

			expect(currentRangeIsValid.value).toBe(true)
		})

		it('devrait retourner true si selectedDates est null', () => {
			const selectedDates = ref(null)
			const { currentRangeIsValid } = useDateRangeValidation(selectedDates, true)

			expect(currentRangeIsValid.value).toBe(true)
		})

		it('devrait retourner true si selectedDates n\'est pas un tableau', () => {
			const selectedDates = ref(new Date('2023-01-01'))
			const { currentRangeIsValid } = useDateRangeValidation(selectedDates, true)

			expect(currentRangeIsValid.value).toBe(true)
		})

		it('devrait retourner true si selectedDates contient moins de 2 dates', () => {
			const selectedDates = ref([new Date('2023-01-01')])
			const { currentRangeIsValid } = useDateRangeValidation(selectedDates, true)

			expect(currentRangeIsValid.value).toBe(true)
		})

		it('devrait retourner true si la plage est valide', () => {
			const selectedDates = ref([new Date('2023-01-01'), new Date('2023-01-10')])
			const { currentRangeIsValid } = useDateRangeValidation(selectedDates, true)

			expect(currentRangeIsValid.value).toBe(true)
		})

		it('devrait retourner false si la plage est invalide', () => {
			const selectedDates = ref([new Date('2023-01-10'), new Date('2023-01-01')])
			const { currentRangeIsValid } = useDateRangeValidation(selectedDates, true)

			expect(currentRangeIsValid.value).toBe(false)
		})
	})

	describe('getRangeValidationError', () => {
		it('devrait retourner une chaîne vide si la plage est valide', () => {
			const selectedDates = ref([new Date('2023-01-01'), new Date('2023-01-10')])
			const { getRangeValidationError } = useDateRangeValidation(selectedDates, true)

			expect(getRangeValidationError.value).toBe('')
		})

		it('devrait retourner un message d\'erreur si la plage est invalide', () => {
			const selectedDates = ref([new Date('2023-01-10'), new Date('2023-01-01')])
			const { getRangeValidationError } = useDateRangeValidation(selectedDates, true)

			expect(getRangeValidationError.value).toBe('La date de fin doit être postérieure ou égale à la date de début')
		})
	})
})
