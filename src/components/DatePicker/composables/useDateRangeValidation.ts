import { computed, type Ref } from 'vue'
import type { DateObjectValue } from '../types'

/**
 * Composable pour gérer la validation des plages de dates
 * Permet de vérifier si une plage de dates est valide (date de début avant date de fin)
 */
export function useDateRangeValidation(
	selectedDates: Ref<DateObjectValue>,
	displayRange: boolean,
) {
	/**
	 * Vérifie si une plage de dates est valide (date de début avant date de fin)
	 */
	const isRangeValid = (startDate: Date | null, endDate: Date | null): boolean => {
		if (!startDate || !endDate) return true // Si une des dates est manquante, considérer comme valide
		return startDate.getTime() <= endDate.getTime()
	}

	/**
	 * Variable réactive pour suivre la validité de la plage de dates actuelle
	 */
	const currentRangeIsValid = computed(() => {
		if (!displayRange || !selectedDates.value) return true
		if (!Array.isArray(selectedDates.value)) return true
		if (selectedDates.value.length < 2) return true

		const [startDate, endDate] = selectedDates.value.length >= 2
			? [selectedDates.value[0], selectedDates.value[selectedDates.value.length - 1]]
			: [null, null]

		return isRangeValid(startDate, endDate)
	})

	/**
	 * Fonction pour obtenir un message d'erreur si la plage n'est pas valide
	 */
	const getRangeValidationError = computed((): string => {
		if (currentRangeIsValid.value) return ''
		return 'La date de fin doit être postérieure ou égale à la date de début'
	})

	return {
		isRangeValid,
		currentRangeIsValid,
		getRangeValidationError,
	}
}
