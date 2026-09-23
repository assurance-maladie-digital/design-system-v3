import { computed, type ComputedRef } from 'vue'
import dayjs from 'dayjs'
import { locales } from '../locales'
import type { DatePickerCommonProps } from '../types'
import { parseDate, formatDate } from '@/composables/date/useDateFormatDayjs'

const PERIOD_FALLBACK_FORMATS = ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY']

const normalizePeriodBound = (
	value: string | undefined,
	displayFormat: string,
	fallbackDate: dayjs.Dayjs,
): string => {
	if (!value) {
		return fallbackDate.format('YYYY-MM-DD')
	}

	const parsedDate = parseDate(value, displayFormat)
		|| PERIOD_FALLBACK_FORMATS
			.filter(format => format !== displayFormat)
			.map(format => parseDate(value, format))
			.find((date): date is Date => date instanceof Date)

	return parsedDate ? formatDate(parsedDate, 'YYYY-MM-DD') : value
}

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
	const minDate = computed(() => normalizePeriodBound(
		props.period?.min,
		props.format || locales.formatDefault,
		dayjs().subtract(200, 'year'),
	))

	/**
	 * Date maximale autorisée (period.max ou 200 ans après aujourd'hui)
	 */
	const maxDate = computed(() => normalizePeriodBound(
		props.period?.max,
		props.format || locales.formatDefault,
		dayjs().add(200, 'year'),
	))

	return {
		returnFormat,
		minDate,
		maxDate,
	}
}
