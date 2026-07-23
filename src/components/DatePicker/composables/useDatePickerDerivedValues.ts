import { computed, type ComputedRef } from 'vue'
import dayjs from 'dayjs'
import { locales } from '../locales'
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
	const returnFormat = computed(() => props.dateFormatReturn || props.format || locales.formatDefault)

	/**
	 * Date minimale autorisée (period.min ou 200 ans avant aujourd'hui)
	 */
	const minDate = computed(() => props.period?.min || dayjs().subtract(200, 'year').format(props.format || locales.formatDefault))

	/**
	 * Date maximale autorisée (period.max ou 200 ans après aujourd'hui)
	 */
	const maxDate = computed(() => props.period?.max || dayjs().add(200, 'year').format(props.format || locales.formatDefault))

	return {
		returnFormat,
		minDate,
		maxDate,
	}
}
