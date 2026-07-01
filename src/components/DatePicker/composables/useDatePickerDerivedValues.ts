import { computed, type ComputedRef } from 'vue'
import dayjs from 'dayjs'
import { DATE_PICKER_MESSAGES } from '../constants/messages'
import type { DatePickerCommonProps } from '../types'

/**
 * Composable pour centraliser les computed values partagés entre CalendarMode et ComplexDatePicker
 */
export function useDatePickerDerivedValues(props: DatePickerCommonProps): {
	returnFormat: ComputedRef<string>
	minDate: ComputedRef<string>
	maxDate: ComputedRef<string>
} {
	/**
	 * Format de retour pour les dates (dateFormatReturn ou format par défaut)
	 */
	const returnFormat = computed(() => props.dateFormatReturn || props.format || DATE_PICKER_MESSAGES.FORMAT_DEFAULT)

	/**
	 * Date minimale autorisée (period.min ou 200 ans avant aujourd'hui)
	 */
	const minDate = computed(() => props.period?.min || dayjs().subtract(200, 'year').format(props.format || DATE_PICKER_MESSAGES.FORMAT_DEFAULT))

	/**
	 * Date maximale autorisée (period.max ou 200 ans après aujourd'hui)
	 */
	const maxDate = computed(() => props.period?.max || dayjs().add(200, 'year').format(props.format || DATE_PICKER_MESSAGES.FORMAT_DEFAULT))

	return {
		returnFormat,
		minDate,
		maxDate,
	}
}
