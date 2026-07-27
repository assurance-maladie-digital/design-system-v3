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

	const setRangeValidationError = () => {
		if (errors && errors.value) {
			errors.value = [locales.endBeforeStart]
		}
	}

	const formatForModel = (date: Date) =>
		dateFormatReturn
			? formatDate(date, dateFormatReturn)
			: formatDate(date, unref(format))

	const splitRangeValue = (value: string) => {
		const [startDateStr = '', endDateStr = ''] = value.split(locales.rangeSeparator)
		return {
			startDateStr: startDateStr.trim(),
			endDateStr: endDateStr.trim(),
		}
	}

	const syncSingleDateToModel = (value: string) => {
		const validation = validateDateFormat(value)
		if (!validation.isValid) return

		const date = parseDate(value, unref(format))
		if (!date) return

		try {
			isUpdatingFromInternal.value = true
			selectedDates.value = date
			updateModel(formatForModel(date))
		}
		finally {
			queueMicrotask(() => {
				isUpdatingFromInternal.value = false
			})
		}
	}

	const syncRangeToModel = (value: string) => {
		const { startDateStr, endDateStr } = splitRangeValue(value)
		if (!startDateStr || !endDateStr) return

		const startValidation = validateDateFormat(startDateStr)
		const endValidation = validateDateFormat(endDateStr)
		if (!startValidation.isValid || !endValidation.isValid) return

		const startDate = parseDate(startDateStr, unref(format))
		const endDate = parseDate(endDateStr, unref(format))
		if (!startDate || !endDate) return

		if (!isRangeValid(startDate, endDate)) {
			setRangeValidationError()
			return
		}

		try {
			isUpdatingFromInternal.value = true
			selectedDates.value = [startDate, endDate]
			updateModel([formatForModel(startDate), formatForModel(endDate)])
		}
		finally {
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}

	const syncDisplayValueToModel = (value: string) => {
		if (value.includes(locales.rangeSeparator)) {
			syncRangeToModel(value)
			return
		}

		syncSingleDateToModel(value)
	}

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

			syncDisplayValueToModel(displayFormattedDate.value)
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
