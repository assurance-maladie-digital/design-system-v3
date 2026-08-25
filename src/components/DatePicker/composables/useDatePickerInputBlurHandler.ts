import { type Ref, unref, type MaybeRef } from 'vue'
import { type DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import { type DateObjectValue } from '../types'
import { locales } from '../locales'
import { isValidDateRange } from '../utils/dateFormattingUtils'

/**
 * Gère le commit au blur du champ texte utilisé par le DatePicker
 * quand la saisie manuelle doit synchroniser le modèle/calendrier.
 *
 * ## Rôle dans l'architecture validation
 * Reçoit deux fonctions de validation en paramètres :
 * - `validateTextInput(value)` : en pratique, c'est `(value) => validate({ textValue: value })`
 *   fournie par le composant appelant. Déclenche le flow de validation texte.
 * - `replaceErrors(messages)` : remplace directement les erreurs affichées, utilisée
 *   pour les erreurs de plage (endBeforeStart) détectées localement sans passer par
 *   le flow de validation complet.
 *
 * Le composable ne connaît pas le flow interne — il se contente d'appeler
 * ces fonctions au moment du blur après avoir synchronisé le modèle.
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
	/** Remplace les erreurs affichées. Utilisé pour les erreurs de plage locales (endBeforeStart). */
	replaceErrors?: (messages: string[]) => void

	// Fonctions
	withInternalUpdate: (fn: () => void) => void
	validateDateFormat: (dateStr: string) => { isValid: boolean, message: string }
	parseDate: (dateStr: string, format: string) => Date | null
	formatDate: (date: Date, format: string) => string
	updateModel: (value: DateModelValue) => void
	/** Validation texte déléguée — en pratique `(value) => validate({ textValue: value })`. */
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
			// validateTextInput treats incomplete dates as valid (for typing flow),
			// but at blur the user is done: check format validity first.
			// If the format is invalid (including incomplete dates), push the error
			// and skip validateTextInput which would incorrectly mark it as valid.
			const value = displayFormattedDate.value
			if (value.includes(locales.rangeSeparator)) {
				const [startStr = '', endStr = ''] = value.split(locales.rangeSeparator).map(s => s?.trim() || '')
				const startValid = validateDateFormat(startStr).isValid
				const endValid = endStr ? validateDateFormat(endStr).isValid : true
				if (!startValid || !endValid) {
					replaceErrors([locales.invalidDateFormatWithFormat(unref(format))])
					return
				}
			}
			else {
				const formatValidation = validateDateFormat(value)
				if (!formatValidation.isValid) {
					replaceErrors([formatValidation.message])
					return
				}
			}
			await Promise.resolve(validateTextInput(displayFormattedDate.value))
		}
	}

	return {
		handleInputBlur,
	}
}
