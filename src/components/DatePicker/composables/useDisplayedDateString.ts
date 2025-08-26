import { computed, type ComputedRef } from 'vue'
import dayjs from 'dayjs'
import { type DateObjectValue } from '../types'

export interface DisplayedDateStringProps {
	selectedDates: { value: DateObjectValue }
	rangeBoundaryDates?: { value: [Date | null, Date | null] | null }
	todayInString: ComputedRef<string>
}

export interface DisplayedDateStringReturn {
	displayedDateString: ComputedRef<string>
}

/**
 * Composable pour formater l'affichage des dates sélectionnées
 * Gère à la fois les dates uniques et les plages de dates
 */
export function useDisplayedDateString(props: DisplayedDateStringProps): DisplayedDateStringReturn {
	// Computed pour formater l'affichage des dates sélectionnées
	const displayedDateString = computed(() => {
		// Si nous n'avons pas de date sélectionnée, afficher la date du jour
		if (!props.selectedDates.value) return props.todayInString.value

		// Priorité aux rangeBoundaryDates pour les plages
		if (props.rangeBoundaryDates?.value && props.rangeBoundaryDates.value[0] && props.rangeBoundaryDates.value[1]) {
			const startDate = dayjs(props.rangeBoundaryDates.value[0])
			const endDate = dayjs(props.rangeBoundaryDates.value[1])

			if (startDate.isValid() && endDate.isValid()) {
				// Format court pour la date de début, format complet pour la date de fin
				return `${startDate.format('D MMMM').split(' ')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ')} - ${endDate.format('D MMMM YYYY').split(' ')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ')}`
			}
		}

		// Si nous avons une plage de dates dans selectedDates
		if (Array.isArray(props.selectedDates.value)) {
			// Si nous avons les deux dates de la plage
			if (props.selectedDates.value.length >= 2) {
				const startDate = dayjs(props.selectedDates.value[0])
				const endDate = dayjs(props.selectedDates.value[props.selectedDates.value.length - 1])

				if (startDate.isValid() && endDate.isValid()) {
					// Format court pour la date de début, format complet pour la date de fin
					return `${startDate.format('D MMMM').split(' ')
						.map(word => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ')} - ${endDate.format('D MMMM YYYY').split(' ')
							.map(word => word.charAt(0).toUpperCase() + word.slice(1))
							.join(' ')}`
				}
			}
			// Si nous n'avons qu'une seule date dans le tableau
			else if (props.selectedDates.value.length === 1) {
				const date = dayjs(props.selectedDates.value[0])
				if (date.isValid()) {
					return dayjs(date).locale('fr').format('dddd DD MMMM YYYY')
						.split(' ')
						.map(word => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ')
				}
			}
			return props.todayInString.value
		}
		// Si nous avons une seule date (pas dans un tableau)
		else {
			const date = dayjs(props.selectedDates.value)
			if (date.isValid()) {
				return dayjs(date).locale('fr').format('dddd DD MMMM YYYY')
					.split(' ')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ')
			}
			return props.todayInString.value
		}
	})

	return {
		displayedDateString,
	}
}
