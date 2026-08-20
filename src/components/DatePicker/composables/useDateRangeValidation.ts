import { computed, unref, type Ref, type MaybeRef } from 'vue'
import { locales } from '../locales'
import type { DateObjectValue } from '../types'
import { isValidDateRange } from '../utils/dateFormattingUtils'

/**
 * Composable pour gérer la validation des plages de dates
 * Permet de vérifier si une plage de dates est valide (date de début avant date de fin)
 */
export function useDateRangeValidation(
	selectedDates: Ref<DateObjectValue>,
	displayRange: MaybeRef<boolean>,
) {
	/**
	 * Vérifie si une plage de dates est valide (date de début avant date de fin)
	 * Délègue à la fonction partagée isValidDateRange (dateFormattingUtils.ts)
	 */
	const isRangeValid = isValidDateRange

	/**
	 * Variable réactive pour suivre la validité de la plage de dates actuelle
	 */
	const currentRangeIsValid = computed(() => {
		if (!unref(displayRange) || !selectedDates.value) return true
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
		return locales.endBeforeStartEqual
	})

	return {
		isRangeValid,
		currentRangeIsValid,
		getRangeValidationError,
	}
}
