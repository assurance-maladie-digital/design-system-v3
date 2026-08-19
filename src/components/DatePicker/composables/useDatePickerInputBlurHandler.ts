import { type Ref, ref, unref, type MaybeRef } from 'vue'
import { type DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import { type DateObjectValue } from '../types'
import { locales } from '../locales'

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

	const isRangeValid = (startDate: Date | null | undefined, endDate: Date | null | undefined): boolean => {
		if (!startDate || !endDate) return true
		return startDate.getTime() <= endDate.getTime()
	}

	const formatForModel = (date: Date): string => {
		return dateFormatReturn
			? formatDate(date, dateFormatReturn)
			: formatDate(date, unref(format))
	}

	const withInternalUpdate = (fn: () => void, resetMode: 'microtask' | 'timeout' = 'microtask') => {
		try {
			isUpdatingFromInternal.value = true
			fn()
		}
		finally {
			if (resetMode === 'timeout') {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
			else {
				queueMicrotask(() => {
					isUpdatingFromInternal.value = false
				})
			}
		}
	}

	const updateRangeModel = (startDate: Date, endDate: Date) => {
		if (!isRangeValid(startDate, endDate)) {
			errors.value = [locales.endBeforeStart]
			return
		}

		withInternalUpdate(() => {
			selectedDates.value = [startDate, endDate]
			updateModel([formatForModel(startDate), formatForModel(endDate)])
		}, 'timeout')
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
			await Promise.resolve(validateManualInput(displayFormattedDate.value))
		}
	}

	return {
		handleInputBlur,
	}
}
