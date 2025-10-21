import { ref, watch, type Ref } from 'vue'

export type ViewMode = 'month' | 'year' | 'months' | undefined

export interface ViewModeReturn {
	currentViewMode: Ref<ViewMode>
	handleViewModeUpdate: (newMode: ViewMode) => void
	handleYearUpdate: () => void
	handleMonthUpdate: () => void
	resetViewMode: () => void
}

/**
 * Composable pour gérer le mode d'affichage du CalendarMode (année, mois, jour)
 * Utilisé pour contrôler le comportement du CalendarMode, notamment pour les dates de naissance
 *
 * @param isBirthDateGetter - Une fonction qui retourne la valeur actuelle de isBirthDate
 */
export function useDatePickerViewMode(isBirthDateGetter: () => boolean): ViewModeReturn {
	// Variable pour suivre le mode d'affichage actuel du CalendarMode
	const currentViewMode = ref<ViewMode>(isBirthDateGetter() ? 'year' : 'month')

	// Mettre à jour le mode d'affichage quand isBirthDate change
	watch(isBirthDateGetter, (newValue) => {
		currentViewMode.value = newValue ? 'year' : 'month'
	})

	// Fonction pour gérer le changement de mode d'affichage
	const handleViewModeUpdate = (newMode: ViewMode) => {
		// En mode birthDate, ne pas laisser VDatePicker écraser le mode 'months'
		if (isBirthDateGetter() && currentViewMode.value === 'months' && newMode === 'month') {
			return
		}

		currentViewMode.value = newMode
	}

	// Fonction pour gérer la sélection de l'année quand isBirthDate est true
	const handleYearUpdate = () => {
		if (isBirthDateGetter()) {
			// Après la sélection de l'année, passer au mode months pour la sélection du mois
			currentViewMode.value = 'months'
		}
	}

	// Fonction pour gérer la sélection du mois quand isBirthDate est true
	const handleMonthUpdate = () => {
		if (isBirthDateGetter()) {
			// Après la sélection du mois, passer automatiquement à la vue calendrier mensuel
			currentViewMode.value = 'month'
		}
	}

	// Fonction pour réinitialiser le mode d'affichage (utile lors de la fermeture du CalendarMode)
	const resetViewMode = () => {
		currentViewMode.value = isBirthDateGetter() ? 'year' : 'month'
	}

	return {
		currentViewMode,
		handleViewModeUpdate,
		handleYearUpdate,
		handleMonthUpdate,
		resetViewMode,
	}
}
