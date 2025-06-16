import { ref } from 'vue'
import type { Ref } from 'vue'

/**
 * Composable pour gérer la sélection de dates dans les composants DatePicker
 * Gère les plages de dates et la génération des dates intermédiaires
 */
export function useDateSelection(
	parseDate: (dateStr: string, format: string) => Date | null,
	selectedDates: Ref<Date | (Date | null)[] | null>,
	format: string,
	displayRange: boolean,
) {
	// Stockage des dates de début et de fin pour les plages
	const rangeBoundaryDates = ref<[Date | null, Date | null] | null>(null)

	/**
	 * Génère toutes les dates entre deux dates (incluses)
	 */
	const generateDateRange = (start: Date, end: Date): Date[] => {
		const dateArray: Date[] = []
		const currentDate = new Date(start)

		// Ajouter la date de début
		dateArray.push(new Date(currentDate))

		// Ajouter toutes les dates intermédiaires jusqu'à la date de fin
		while (currentDate < end) {
			currentDate.setDate(currentDate.getDate() + 1)
			dateArray.push(new Date(currentDate))
		}

		return dateArray
	}

	/**
	 * Met à jour les dates sélectionnées en fonction de l'entrée
	 */
	const updateSelectedDates = (input: Date | Date[] | string | string[] | null | undefined) => {
		// Cas 0: Input est null ou undefined (suppression de la sélection)
		if (input === null || input === undefined) {
			selectedDates.value = null
			rangeBoundaryDates.value = null
			return
		}

		// Cas 1: Input est un tableau de dates ou de chaînes (sélection depuis le calendrier)
		if (Array.isArray(input)) {
			const dates = input
				.map((item) => {
					if (item instanceof Date) return item
					return item ? parseDate(item, format) : null
				})
				.filter((date): date is Date => date !== null)

			if (dates.length === 0) {
				selectedDates.value = null
				rangeBoundaryDates.value = null
				return
			}

			if (displayRange && dates.length >= 2) {
				// Trier les dates pour s'assurer que nous avons la première et la dernière
				dates.sort((a, b) => a.getTime() - b.getTime())

				// Récupérer les dates de début et de fin
				const startDate = dates[0]
				const endDate = dates[dates.length - 1]

				// Stocker les dates de début et de fin pour la plage, même si la plage est invalide
				rangeBoundaryDates.value = [startDate, endDate]

				// Pour l'affichage dans le calendrier, générer les dates intermédiaires si la plage est valide
				if (startDate && endDate && startDate.getTime() <= endDate.getTime()) {
					const allDates = generateDateRange(startDate, endDate)
					selectedDates.value = allDates
				}
				else {
					// Même si la plage est invalide, conserver les deux dates pour l'affichage
					// Cela permettra à l'utilisateur de voir et corriger la plage invalide
					selectedDates.value = [startDate, endDate]
				}
			}
			else {
				selectedDates.value = dates
				rangeBoundaryDates.value = null
			}
			return
		}

		// Cas 2: Input est une chaîne de caractères (saisie manuelle)
		if (!displayRange) {
			// Mode date unique
			const date = input && typeof input === 'string' ? parseDate(input, format) : null
			selectedDates.value = date === null ? null : date
			rangeBoundaryDates.value = null
		}
		else if (typeof input === 'string') {
			// Mode plage de dates
			const dates = input.split(' - ')
			if (dates.length === 2) {
				const startDate = parseDate(dates[0], format)
				const endDate = parseDate(dates[1], format)
				if (startDate && endDate) {
					// Stocker les dates de début et de fin pour la plage
					rangeBoundaryDates.value = [startDate, endDate]

					// Générer toutes les dates intermédiaires pour l'affichage dans le calendrier
					const allDates = generateDateRange(startDate, endDate)
					selectedDates.value = allDates
				}
			}
		}
	}

	return {
		updateSelectedDates,
		rangeBoundaryDates,
		generateDateRange,
	}
}
