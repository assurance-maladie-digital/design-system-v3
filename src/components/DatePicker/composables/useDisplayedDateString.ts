import { computed, type ComputedRef } from 'vue'
import dayjs from 'dayjs'
import { type DateObjectValue } from '../types'

const capitalizeWords = (str: string) => {
	return str
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

// Évite le décalage de jour quand la Date interne est normalisée à 00:00 UTC.
// On reconstruit une date "safe" à midi UTC (qui ne passe pas au jour précédent/suivant en local).
const toSafeDateForDisplay = (date: Date): Date => {
	return new Date(Date.UTC(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		12,
		0,
		0,
		0,
	))
}

const formatFull = (date: Date): string => {
	return capitalizeWords(dayjs(toSafeDateForDisplay(date)).locale('fr').format('dddd DD MMMM YYYY'))
}

const formatShort = (date: Date): string => {
	return capitalizeWords(dayjs(toSafeDateForDisplay(date)).locale('fr').format('D MMMM'))
}

const formatShortWithYear = (date: Date): string => {
	return capitalizeWords(dayjs(toSafeDateForDisplay(date)).locale('fr').format('D MMMM YYYY'))
}

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
			const startRaw = props.rangeBoundaryDates.value[0]
			const endRaw = props.rangeBoundaryDates.value[1]
			if (
				startRaw instanceof Date
				&& endRaw instanceof Date
				&& !Number.isNaN(startRaw.getTime())
				&& !Number.isNaN(endRaw.getTime())
			) {
				return `${formatShort(startRaw)} - ${formatShortWithYear(endRaw)}`
			}
		}

		// Si nous avons une plage de dates dans selectedDates
		if (Array.isArray(props.selectedDates.value)) {
			// Si nous avons les deux dates de la plage
			if (props.selectedDates.value.length >= 2) {
				const startRaw = props.selectedDates.value[0]
				const endRaw = props.selectedDates.value[props.selectedDates.value.length - 1]
				if (startRaw instanceof Date && endRaw instanceof Date && !Number.isNaN(startRaw.getTime()) && !Number.isNaN(endRaw.getTime())) {
					return `${formatShort(startRaw)} - ${formatShortWithYear(endRaw)}`
				}
			}
			// Si nous n'avons qu'une seule date dans le tableau
			else if (props.selectedDates.value.length === 1) {
				const raw = props.selectedDates.value[0]
				if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
					return formatFull(raw)
				}
			}
			return props.todayInString.value
		}
		// Si nous avons une seule date (pas dans un tableau)
		else {
			const raw = props.selectedDates.value
			if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
				return formatFull(raw)
			}
			return props.todayInString.value
		}
	})

	return {
		displayedDateString,
	}
}
