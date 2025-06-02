import { computed, type ComputedRef } from 'vue'
import dayjs from 'dayjs'
import { type DateObjectValue } from '../types'

export interface TodayButtonProps {
	displayTodayButton?: boolean
	displayRange?: boolean
}

export interface TodayButtonReturn {
	todayInString: ComputedRef<string>
	selectToday: (selectedDates: { value: DateObjectValue }) => void
}

/**
 * Composable pour gérer le bouton "Aujourd'hui" dans le DatePicker
 */
export function useTodayButton(props: TodayButtonProps): TodayButtonReturn {
	// Computed pour le format de la date du jour
	const todayInString = computed(() => {
		return dayjs().locale('fr').format('dddd D MMMM').replace(/\b\w/g, l => l.toUpperCase())
	})

	// Fonction pour sélectionner la date du jour
	const selectToday = (selectedDates: { value: DateObjectValue }) => {
		const today = new Date()
		if (props.displayRange) {
			// Si c'est une plage de dates, on définit le même jour pour début et fin
			selectedDates.value = [today, today]
		}
		else {
			// Sinon, on sélectionne simplement aujourd'hui
			selectedDates.value = today
		}
		// Le watcher sur selectedDates dans le composant parent se chargera de mettre à jour l'affichage
		// et d'émettre l'événement update:modelValue
	}

	return {
		todayInString,
		selectToday,
	}
}
