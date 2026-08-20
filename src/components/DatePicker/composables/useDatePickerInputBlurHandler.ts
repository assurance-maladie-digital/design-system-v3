import { type Ref, unref, type MaybeRef } from 'vue'
import { type DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import { type DateObjectValue } from '../types'
import { locales } from '../locales'
import { isValidDateRange } from '../utils/dateFormattingUtils'

/**
 * Gère le commit au blur du champ texte utilisé par le DatePicker
 * quand la saisie manuelle doit synchroniser le modèle/calendrier.
 *
 * @param options - Options de configuration
 * @returns Fonction pour gérer la perte de focus
 */
export const useDatePickerInputBlurHandler = (options: {
	// Propriétés de configuration
	format: MaybeRef<string>
	dateFormatReturn?: string
	required?: MaybeRef<boolean>

	// Références réactives
	displayFormattedDate: Ref<string>
	hasInteracted: Ref<boolean>
	isManualInputActive: Ref<boolean>
	isUpdatingFromInternal: Ref<boolean>
	selectedDates: Ref<DateObjectValue>
	replaceErrors?: (messages: string[]) => void

	// Fonctions
	withInternalUpdate: (fn: () => void) => void
	validateDateFormat: (dateStr: string) => { isValid: boolean, message: string }
	parseDate: (dateStr: string, format: string) => Date | null
	formatDate: (date: Date, format: string) => string
	updateModel: (value: DateModelValue) => void
	validateTextInput: (value: string) => Promise<boolean>

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
		selectedDates,
		replaceErrors = () => {},
		withInternalUpdate,
		validateDateFormat,
		parseDate,
		formatDate,
		updateModel,
		validateTextInput,
		emitBlur,
	} = options

	const formatForModel = (date: Date): string => {
		return dateFormatReturn
			? formatDate(date, dateFormatReturn)
			: formatDate(date, unref(format))
	}

	const updateRangeModel = (startDate: Date, endDate: Date) => {
		if (!isValidDateRange(startDate, endDate)) {
			replaceErrors([locales.endBeforeStart])
			return
		}

		withInternalUpdate(() => {
			selectedDates.value = [startDate, endDate]
			updateModel([formatForModel(startDate), formatForModel(endDate)])
		})
	}

	const updateSingleModel = (date: Date) => {
		withInternalUpdate(() => {
			selectedDates.value = date
			updateModel(formatForModel(date))
		})
	}

	const handleRangeBlur = (value: string) => {
		const [startDateStr = '', endDateStr = ''] = value
			.split(locales.rangeSeparator)
			.map(part => part?.trim() || '')

		if (!startDateStr || !endDateStr) return

		const startValidation = validateDateFormat(startDateStr)
		const endValidation = validateDateFormat(endDateStr)
		if (!startValidation.isValid || !endValidation.isValid) return

		const startDate = parseDate(startDateStr, unref(format))
		const endDate = parseDate(endDateStr, unref(format))
		if (!startDate || !endDate) return

		updateRangeModel(startDate, endDate)
	}

	const handleSingleBlur = (value: string) => {
		const validation = validateDateFormat(value)
		if (!validation.isValid) return

		const date = parseDate(value, unref(format))
		if (!date) return

		updateSingleModel(date)
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
			if (displayFormattedDate.value.includes(locales.rangeSeparator)) {
				handleRangeBlur(displayFormattedDate.value)
			}
			else {
				handleSingleBlur(displayFormattedDate.value)
			}
		}
		else if (!unref(required)) {
			// Si le champ est vide et non requis, réinitialiser le modèle
			updateModel(null)
		}

		if (displayFormattedDate.value) {
			await Promise.resolve(validateTextInput(displayFormattedDate.value))
		}
	}

	return {
		handleInputBlur,
	}
}
