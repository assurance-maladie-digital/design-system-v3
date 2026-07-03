import { locales } from '../locales'

/**
 * Fichier contenant toutes les constantes de textes utilisées dans les composants/composables CalendarMode.
 * Conservé pour compatibilité ascendante ; les textes sont désormais centralisés dans locales.ts.
 */

export const DATE_PICKER_MESSAGES = {
	LABEL_DEFAULT: locales.label,
	ERROR_REQUIRED: locales.required,
	ERROR_INVALID_FORMAT: locales.invalidDateFormat,
	ERROR_INVALID_DATE: locales.invalidDate,
	ERROR_INVALID_FORMAT_WITH_FORMAT: locales.invalidDateFormatWithFormat,
	ERROR_INCOMPLETE_DATE: locales.incompleteDate,
	ERROR_INVALID_RANGE: locales.invalidRange,
	ERROR_START_DATE_MISSING: locales.startDateMissing,
	ERROR_END_DATE_MISSING: locales.endDateMissing,
	ERROR_END_BEFORE_START: locales.endBeforeStart,
	ERROR_INVALID_FORMAT_START: locales.invalidStartDateFormat,
	ERROR_INVALID_FORMAT_END: locales.invalidEndDateFormat,
	SUCCESS_VALID_DATE: locales.validDate,
	ARIA_DATE_INPUT: locales.dateInputDescription,
	ARIA_CALENDAR_BUTTON: locales.openCalendar,
	ARIA_CALENDAR_MONTH_BUTTON: locales.selectMonth,
	ARIA_CALENDAR_YEAR_BUTTON: locales.selectYear,
	ARIA_TODAY_BUTTON: locales.buttonToday,
	BUTTON_TODAY: locales.buttonToday,
	BUTTON_CLEAR: locales.buttonClear,
	BUTTON_CLOSE: locales.buttonClose,
	FORMAT_DEFAULT: locales.formatDefault,
	MONTH_NAMES: locales.monthNames,
	DAY_NAMES: locales.dayNames,
	DATE_SEPARATOR: locales.dateSeparator,
	RANGE_SEPARATOR: locales.rangeSeparator,
}
