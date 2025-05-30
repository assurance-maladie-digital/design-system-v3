import { ref, type Ref } from 'vue'
import { type DateValue } from '@/composables/date/useDateInitializationDayjs'
import { type DateObjectValue } from '../types'

/**
 * Composable pour gérer le comportement lors de la perte de focus d'un champ de date
 * avec normalisation des dates invalides
 *
 * @param options - Options de configuration
 * @returns Fonction pour gérer la perte de focus avec normalisation
 */
export const useInputBlurHandlerWithNormalization = (options: {
	// Propriétés de configuration
	format: string
	dateFormatReturn?: string
	required?: boolean
	enableNormalization?: boolean

	// Références réactives
	displayFormattedDate: Ref<string>
	hasInteracted: Ref<boolean>
	isManualInputActive: Ref<boolean>
	isUpdatingFromInternal: Ref<boolean>
	selectedDates: Ref<DateObjectValue>

	// Fonctions
	validateDateFormat: (dateStr: string) => { isValid: boolean, message: string }
	parseDate: (dateStr: string, format: string) => Date | null
	formatDate: (date: Date | null, format: string) => string
	updateModel: (value: DateValue) => void
	validateManualInput: (value: string) => boolean
	normalizeDate?: (dateStr: string) => { normalizedDate: Date | null, wasNormalized: boolean }

	// Émetteurs d'événements
	emitBlur: () => void
	emitNormalized?: (originalDate: string, normalizedDate: string) => void
}) => {
	const {
		format,
		dateFormatReturn = '',
		required = false,
		enableNormalization = false,
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
		normalizeDate,
		emitBlur,
		emitNormalized,
	} = options

	// État pour suivre la normalisation
	const wasNormalized = ref(false)
	const originalDateStr = ref('')
	const normalizedDateStr = ref('')

	/**
	 * Gère la perte de focus du champ de saisie de date avec normalisation
	 */
	const handleInputBlur = () => {
		// Réinitialiser l'état de normalisation
		wasNormalized.value = false

		// Émettre l'événement blur
		emitBlur()

		// Marquer que l'utilisateur a interagi avec le champ
		hasInteracted.value = true

		// Désactiver le mode de saisie manuelle
		isManualInputActive.value = false

		// Gérer la mise à jour du modèle en fonction de la validité de la date
		if (displayFormattedDate.value) {
			// Vérifier si la normalisation est activée et si la fonction normalizeDate est disponible
			if (enableNormalization && normalizeDate) {
				// Sauvegarder la date originale
				const originalDate = displayFormattedDate.value

				// Normaliser la date
				const { normalizedDate, wasNormalized: dateWasNormalized } = normalizeDate(originalDate)

				// Si la date a été normalisée, mettre à jour le modèle avec la date normalisée
				if (dateWasNormalized && normalizedDate) {
					// Mettre à jour l'état de normalisation
					wasNormalized.value = true
					originalDateStr.value = originalDate
					normalizedDateStr.value = formatDate(normalizedDate, format)

					// Mettre à jour le modèle avec la date normalisée
					try {
						isUpdatingFromInternal.value = true
						selectedDates.value = normalizedDate

						// Formater la date selon le format de retour si spécifié
						const formattedValue = dateFormatReturn
							? formatDate(normalizedDate, dateFormatReturn)
							: formatDate(normalizedDate, format)

						// Mettre à jour le modèle et l'affichage
						updateModel(formattedValue)
						displayFormattedDate.value = formatDate(normalizedDate, format)

						// Émettre l'événement de normalisation si disponible
						if (emitNormalized) {
							emitNormalized(originalDate, normalizedDateStr.value)
						}
					}
					finally {
						setTimeout(() => {
							isUpdatingFromInternal.value = false
						}, 0)
					}

					// Valider la saisie
					validateManualInput(displayFormattedDate.value)
					return
				}
			}

			// Traitement standard si pas de normalisation ou si la date n'a pas été normalisée
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
		wasNormalized,
		originalDateStr,
		normalizedDateStr,
	}
}

export default useInputBlurHandlerWithNormalization
