import { type Ref, ref, unref, type MaybeRef } from 'vue'
import { type DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import { type DateObjectValue } from '../types'
import { locales } from '../locales'
import { useDateRangeValidation } from './useDateRangeValidation'

/**
 * Composable pour gérer le comportement lors de la perte de focus d'un champ de date
 *
 * @param options - Options de configuration
 * @returns Fonction pour gérer la perte de focus
 */
export const useInputBlurHandler = (options: {
	// Propriétés de configuration
	format: MaybeRef<string>
	dateFormatReturn?: string
	required?: MaybeRef<boolean>
	displayRange?: MaybeRef<boolean>

	// Références réactives
	displayFormattedDate: Ref<string>
	hasInteracted: Ref<boolean>
	isManualInputActive: Ref<boolean>
	isUpdatingFromInternal: Ref<boolean>
	selectedDates: Ref<DateObjectValue>
	errors?: Ref<string[]>

	// Fonctions
	validateDateFormat: (dateStr: string) => { isValid: boolean, message: string }
	parseDate: (dateStr: string, format: string) => Date | null
	formatDate: (date: Date, format: string) => string
	updateModel: (value: DateModelValue) => void
	validateManualInput: (value: string) => boolean | Promise<boolean>

	// Émetteurs d'événements
	emitBlur: () => void
}) => {
	const {
		format,
		dateFormatReturn = '',
		required = false,
		displayRange = false,
		displayFormattedDate,
		hasInteracted,
		isManualInputActive,
		isUpdatingFromInternal,
		selectedDates,
		errors = ref([]),
		validateDateFormat,
		parseDate,
		formatDate,
		updateModel,
		validateManualInput,
		emitBlur,
	} = options

	// Utiliser useDateRangeValidation pour centraliser la validation des plages
	const { isRangeValid } = useDateRangeValidation(selectedDates, unref(displayRange))

	/**
	 * Gère la perte de focus du champ de saisie de date
	 */
	const handleInputBlur = async () => {
		// Émettre l'événement blur
		emitBlur()

		// Marquer que l'utilisateur a interagi avec le champ
		hasInteracted.value = true

		// Désactiver le mode de saisie manuelle
		isManualInputActive.value = false

		// Gérer la mise à jour du modèle en fonction de la validité de la date
		if (displayFormattedDate.value) {
			// S'assurer que displayFormattedDate.value est une chaîne de caractères
			if (typeof displayFormattedDate.value !== 'string') {
				return
			}

			// Vérifier si c'est une plage de dates (contient un séparateur)
			if (displayFormattedDate.value.includes(locales.rangeSeparator)) {
				const parts = displayFormattedDate.value.split(locales.rangeSeparator)
				const startDateStr = parts[0]?.trim() || ''
				const endDateStr = parts[1]?.trim() || ''

				// Si les deux dates sont présentes, valider et mettre à jour
				if (startDateStr && endDateStr) {
					const startValidation = validateDateFormat(startDateStr)
					const endValidation = validateDateFormat(endDateStr)

					if (startValidation.isValid && endValidation.isValid) {
						const startDate = parseDate(startDateStr, unref(format))
						const endDate = parseDate(endDateStr, unref(format))

						if (startDate && endDate) {
							// Utiliser isRangeValid depuis useDateRangeValidation pour centraliser la validation
							if (isRangeValid(startDate, endDate)) {
								try {
									isUpdatingFromInternal.value = true
									selectedDates.value = [startDate, endDate]

									// Formater les dates selon le format de retour
									const formattedStartDate = dateFormatReturn
										? formatDate(startDate, dateFormatReturn)
										: formatDate(startDate, unref(format))
									const formattedEndDate = dateFormatReturn
										? formatDate(endDate, dateFormatReturn)
										: formatDate(endDate, unref(format))

									// Mettre à jour le modèle avec un tableau de dates formatées
									updateModel([formattedStartDate, formattedEndDate])
								}
								finally {
									setTimeout(() => {
										isUpdatingFromInternal.value = false
									}, 0)
								}
							}
							else {
								// Ajouter un message d'erreur si la date de fin est antérieure à la date de début
								if (errors && errors.value) {
									errors.value = [locales.endBeforeStart]
								}
							}
						}
					}
				}
			}
			else {
				// Traitement pour une date unique
				const validation = validateDateFormat(displayFormattedDate.value)
				if (validation.isValid) {
					const date = parseDate(displayFormattedDate.value, unref(format))
					if (date) {
						// Si la date est valide, mettre à jour selectedDates et le modèle
						try {
							isUpdatingFromInternal.value = true
							selectedDates.value = date

							// Si on a un format de retour, formater la date dans ce format
							const formattedValue = dateFormatReturn
								? formatDate(date, dateFormatReturn)
								: formatDate(date, unref(format))
							updateModel(formattedValue)
						}
						finally {
							queueMicrotask(() => {
								isUpdatingFromInternal.value = false
							})
						}
					}
				}
			}
		}
		else if (!unref(required)) {
			// Si le champ est vide et non requis, réinitialiser le modèle
			updateModel(null)
		}

		// Valider la saisie manuelle (affiche les messages d'erreur)
		// Note: La vérification du type string a déjà été faite plus haut
		// et on retourne si ce n'est pas une chaîne, donc ici displayFormattedDate.value est forcément une chaîne
		if (displayFormattedDate.value) {
			await Promise.resolve(validateManualInput(displayFormattedDate.value || ''))
		}
	}

	return {
		handleInputBlur,
	}
}
