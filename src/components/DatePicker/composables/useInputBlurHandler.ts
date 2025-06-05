import { type Ref } from 'vue'
import { type DateValue } from '@/composables/date/useDateInitializationDayjs'
import { type DateObjectValue } from '../types'

/**
 * Composable pour gérer le comportement lors de la perte de focus d'un champ de date
 *
 * @param options - Options de configuration
 * @returns Fonction pour gérer la perte de focus
 */
export const useInputBlurHandler = (options: {
	// Propriétés de configuration
	format: string
	dateFormatReturn?: string
	required?: boolean

	// Références réactives
	displayFormattedDate: Ref<string>
	hasInteracted: Ref<boolean>
	isManualInputActive: Ref<boolean>
	isUpdatingFromInternal: Ref<boolean>
	selectedDates: Ref<DateObjectValue>

	// Fonctions
	validateDateFormat: (dateStr: string) => { isValid: boolean, message: string }
	parseDate: (dateStr: string, format: string) => Date | null
	formatDate: (date: Date, format: string) => string
	updateModel: (value: DateValue) => void
	validateManualInput: (value: string) => boolean

	// Émetteurs d'événements
	emitBlur: () => void
}) => {
	const {
		format,
		dateFormatReturn = '',
		required = false,
		displayFormattedDate,
		hasInteracted,
		isManualInputActive,
		isUpdatingFromInternal,
		selectedDates,
		validateDateFormat,
		parseDate,
		formatDate,
		updateModel,
		validateManualInput,
		emitBlur,
	} = options

	/**
	 * Gère la perte de focus du champ de saisie de date
	 */
	const handleInputBlur = () => {
		// Émettre l'événement blur
		emitBlur()

		// Marquer que l'utilisateur a interagi avec le champ
		hasInteracted.value = true

		// Désactiver le mode de saisie manuelle
		isManualInputActive.value = false

		// Gérer la mise à jour du modèle en fonction de la validité de la date
		if (displayFormattedDate.value) {
			const validation = validateDateFormat(displayFormattedDate.value)
			if (validation.isValid) {
				const date = parseDate(displayFormattedDate.value, format)
				if (date) {
					// Si la date est valide, mettre à jour selectedDates et le modèle
					try {
						isUpdatingFromInternal.value = true
						selectedDates.value = date

						// Si on a un format de retour, formater la date dans ce format
						const formattedValue = dateFormatReturn
							? formatDate(date, dateFormatReturn)
							: formatDate(date, format)
						updateModel(formattedValue)
					}
					finally {
						setTimeout(() => {
							isUpdatingFromInternal.value = false
						}, 0)
					}
				}
			}
		}
		else if (!required) {
			// Si le champ est vide et non requis, réinitialiser le modèle
			updateModel(null)
		}

		// Valider la saisie manuelle (affiche les messages d'erreur)
		validateManualInput(displayFormattedDate.value || '')
	}

	return {
		handleInputBlur,
	}
}
