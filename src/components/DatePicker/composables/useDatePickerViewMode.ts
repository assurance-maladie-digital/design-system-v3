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
 * @param selectedDateGetter - Une fonction qui retourne l'état de la date sélectionnée (null si aucune date)
 */
export function useDatePickerViewMode(
	isBirthDateGetter: () => boolean,
	selectedDateGetter: () => Date | (Date | null)[] | null,
): ViewModeReturn {
	// Variable pour suivre le mode d'affichage actuel du CalendarMode
	const currentViewMode = ref<ViewMode>(
		isBirthDateGetter() && !selectedDateGetter() ? 'year' : 'month',
	)

	// Mettre à jour le mode d'affichage quand isBirthDate change
	watch(isBirthDateGetter, (newValue) => {
		if (newValue && !selectedDateGetter()) {
			// Mode birthDate et aucune date sélectionnée : commencer par year
			currentViewMode.value = 'year'
		} else if (newValue && selectedDateGetter()) {
			// Mode birthDate avec date sélectionnée : commencer par month
			currentViewMode.value = 'month'
		} else {
			// Mode normal
			currentViewMode.value = 'month'
		}
	})

	// Mettre à jour le mode d'affichage quand la date sélectionnée change
	watch(selectedDateGetter, (newValue) => {
		if (isBirthDateGetter()) {
			if (!newValue) {
				// Aucune date sélectionnée en mode birthDate : commencer par year
				currentViewMode.value = 'year'
			} else {
				// Date sélectionnée en mode birthDate : commencer par month
				currentViewMode.value = 'month'
			}
		}
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
		if (isBirthDateGetter()) {
			// En mode birthDate, la logique dépend de l'état de la date sélectionnée
			if (!selectedDateGetter()) {
				// Aucune date sélectionnée : commencer par year
				currentViewMode.value = 'year'
			} else {
				// Date sélectionnée : commencer par month (calendrier) pour permettre la modification
				currentViewMode.value = 'month'
			}
		} else {
			// Mode normal
			currentViewMode.value = 'month'
		}
	}

	return {
		currentViewMode,
		handleViewModeUpdate,
		handleYearUpdate,
		handleMonthUpdate,
		resetViewMode,
	}
}
