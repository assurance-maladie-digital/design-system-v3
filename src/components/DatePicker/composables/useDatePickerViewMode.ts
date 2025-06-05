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
 * Composable pour gérer le mode d'affichage du DatePicker (année, mois, jour)
 * Utilisé pour contrôler le comportement du DatePicker, notamment pour les dates de naissance
 *
 * @param isBirthDateGetter - Une fonction qui retourne la valeur actuelle de isBirthDate
 */
export function useDatePickerViewMode(isBirthDateGetter: () => boolean): ViewModeReturn {
	// Variable pour suivre le mode d'affichage actuel du DatePicker
	const currentViewMode = ref<ViewMode>(isBirthDateGetter() ? 'year' : 'month')

	// Mettre à jour le mode d'affichage quand isBirthDate change
	watch(isBirthDateGetter, (newValue) => {
		currentViewMode.value = newValue ? 'year' : 'month'
	})

	// Fonction pour gérer le changement de mode d'affichage
	const handleViewModeUpdate = (newMode: ViewMode) => {
		currentViewMode.value = newMode
	}

	// Fonction pour gérer la sélection de l'année quand isBirthDate est true
	const handleYearUpdate = () => {
		if (isBirthDateGetter()) {
			// Après la sélection de l'année, passer automatiquement à la sélection du mois
			currentViewMode.value = 'months'
		}
	}

	// Fonction pour gérer la sélection du mois quand isBirthDate est true
	const handleMonthUpdate = () => {
		if (isBirthDateGetter()) {
			// Après la sélection du mois, passer automatiquement à la sélection du jour
			currentViewMode.value = undefined
		}
	}

	// Fonction pour réinitialiser le mode d'affichage (utile lors de la fermeture du DatePicker)
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
