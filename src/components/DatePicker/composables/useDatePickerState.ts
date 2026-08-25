import { computed, ref, unref, watch, type Ref, type ComputedRef, type MaybeRef } from 'vue'
import type { DateInput, DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import { locales } from '../locales'
import { formatDateRangeDisplay, resolveDatePickerStateFromModelValue } from '../utils/dateFormattingUtils'

/**
 * Options du composable `useDatePickerState`.
 *
 * ## Rôle dans l'architecture validation
 * `validateDates` et `clearValidation` sont des fonctions déléguées par le composant
 * appelant. En pratique, le composant passe `() => validate()` pour `validateDates`.
 * Le composable appelle ces fonctions après avoir mis à jour `selectedDates` pour
 * déclencher la validation des nouvelles dates. Il ne connaît pas le flow interne.
 */
export interface UseDatePickerStateOptions {
	selectedDates: Ref<Date | (Date | null)[] | null>
	rangeBoundaryDates?: Ref<[Date | null, Date | null] | null>
	format: MaybeRef<string>
	dateFormatReturn?: string
	displayRange?: MaybeRef<boolean>
	parseDate: (value: string, format: string) => Date | null
	formatDate: (date: Date | null, format: string) => string
	/** Fonction de validation déléguée — en pratique `() => validate()`. Appelée après mise à jour des dates. */
	validateDates: (forceValidation?: boolean) => void
	/** Vide l'état de validation. Déléguée par le composant appelant. */
	clearValidation?: () => void
	generateDateRange?: (start: Date, end: Date) => Date[]
}

export interface UseDatePickerStateResult {
	textInputValue: Ref<string>
	displayFormattedDate: Ref<string>
	formattedDate: Ref<DateModelValue>
	displayFormattedFromSelectedDates: ComputedRef<string | null>
	syncFromModelValue: (newValue: DateInput | undefined) => void
	syncTextInputFromSelection: () => void
}

export const useDatePickerState = (options: UseDatePickerStateOptions): UseDatePickerStateResult => {
	const {
		selectedDates,
		rangeBoundaryDates,
		format,
		dateFormatReturn,
		displayRange = false,
		parseDate,
		formatDate,
		validateDates,
		clearValidation,
		generateDateRange,
	} = options

	const textInputValue = ref('')
	const displayFormattedDate = ref('')
	const displayFormatValue = (): string => unref(format)
	const returnFormatValue = (): string => dateFormatReturn || displayFormatValue()

	const getRangeDates = (value: Date | (Date | null)[] | null): [Date | null, Date | null] | null => {
		if (!Array.isArray(value) || value.length < 2) {
			return null
		}

		return [value[0] ?? null, value[value.length - 1] ?? null]
	}

	const formatRangeModelValue = (startDate: Date | null, endDate: Date | null, outputFormat: string): [string, string] | null => {
		if (!startDate || !endDate) {
			return null
		}

		return [
			formatDate(startDate, outputFormat),
			formatDate(endDate, outputFormat),
		]
	}

	const formatSelectionForModelValue = (): DateModelValue => {
		const value = selectedDates.value
		if (!value) return ''

		const outputFormat = returnFormatValue()

		if (unref(displayRange) && rangeBoundaryDates?.value) {
			return formatRangeModelValue(
				rangeBoundaryDates.value[0],
				rangeBoundaryDates.value[1],
				outputFormat,
			) ?? ''
		}

		const rangeDates = getRangeDates(value)
		if (rangeDates) {
			return formatRangeModelValue(rangeDates[0], rangeDates[1], outputFormat) ?? ''
		}

		return Array.isArray(value) ? '' : formatDate(value, outputFormat)
	}

	const formatSelectionForDisplayValue = (value = selectedDates.value): string | null => {
		if (!value) return null

		const rangeDates = getRangeDates(value)
		if (rangeDates?.[0] && rangeDates[1]) {
			return formatDateRangeDisplay(
				rangeDates[0],
				rangeDates[1],
				displayFormatValue(),
				formatDate,
			)
		}

		const firstDate = Array.isArray(value) ? (value[0] ?? null) : value
		return firstDate ? formatDate(firstDate, displayFormatValue()) : null
	}

	const formatModelValueForInput = (value: DateModelValue): string => {
		if (!value) {
			return ''
		}

		if (Array.isArray(value) && value.length === 2) {
			if (!dateFormatReturn) {
				return `${value[0]}${locales.rangeSeparator}${value[1]}`
			}

			const startDate = parseDate(value[0]!, dateFormatReturn)
			const endDate = parseDate(value[1]!, dateFormatReturn)
			return startDate && endDate
				? formatDateRangeDisplay(startDate, endDate, displayFormatValue(), formatDate)
				: ''
		}

		if (typeof value === 'string') {
			if (!dateFormatReturn) {
				return value
			}

			const date = parseDate(value, dateFormatReturn)
			return date ? formatDate(date, displayFormatValue()) : ''
		}

		return ''
	}

	const clearSyncedValues = (): void => {
		textInputValue.value = ''
		displayFormattedDate.value = ''
	}

	const applyResolvedState = (nextState: { selectedDates: Date | (Date | null)[] | null, displayValue: string }): void => {
		selectedDates.value = nextState.selectedDates
		textInputValue.value = nextState.displayValue
		displayFormattedDate.value = nextState.displayValue
	}

	const formattedDate = computed<DateModelValue>(() => {
		return formatSelectionForModelValue()
	})

	const displayFormattedFromSelectedDates = computed<string | null>(() => {
		return formatSelectionForDisplayValue()
	})

	watch(
		formattedDate,
		(newValue) => {
			textInputValue.value = formatModelValueForInput(newValue)
		},
		{ immediate: true },
	)

	const syncFromModelValue = (newValue: DateInput | undefined) => {
		if (!newValue || newValue === '') {
			selectedDates.value = null
			clearSyncedValues()
			clearValidation?.()
			validateDates()
			return
		}

		const nextState = resolveDatePickerStateFromModelValue({
			modelValue: newValue as DateModelValue,
			displayRange: unref(displayRange),
			displayFormat: unref(format),
			returnFormat: dateFormatReturn || unref(format),
			parseDate,
			formatDate,
			generateDateRange,
			preserveInvalidValue: true,
		})

		applyResolvedState(nextState)
		validateDates()
	}

	const syncTextInputFromSelection = () => {
		const formattedForInput = formatSelectionForDisplayValue()
		if (formattedForInput === null) {
			textInputValue.value = ''
			return
		}

		if (textInputValue.value !== formattedForInput) {
			textInputValue.value = formattedForInput
		}
	}

	return {
		textInputValue,
		displayFormattedDate,
		formattedDate,
		displayFormattedFromSelectedDates,
		syncFromModelValue,
		syncTextInputFromSelection,
	}
}
