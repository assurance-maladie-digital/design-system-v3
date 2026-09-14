import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import type { DatePickerLiteMode, DatePickerLiteMultiple, DatePickerLiteRange, DatePickerLiteValue } from '../types'

dayjs.extend(customParseFormat)

function language(locale: string): string {
	return locale.split('-')[0] || 'fr'
}

function formatDate(date: Date, format: string, locale: string): string {
	return dayjs(date).locale(language(locale)).format(format)
}

function parseDate(value: string, format: string, locale: string): Date | null {
	const parsedDate = dayjs(value, format, language(locale), true)
	if (!parsedDate.isValid()) return null

	return dayjs()
		.year(parsedDate.year())
		.month(parsedDate.month())
		.date(parsedDate.date())
		.hour(0)
		.minute(0)
		.second(0)
		.millisecond(0)
		.toDate()
}

function isDateValue(value: unknown): value is Date {
	return value instanceof Date && Number.isFinite(value.getTime())
}

function isDateRange(value: unknown): value is DatePickerLiteRange {
	return Array.isArray(value)
		&& value.length === 2
		&& value.every(isDateValue)
}

function isDateMultiple(value: unknown): value is DatePickerLiteMultiple {
	return Array.isArray(value) && value.every(isDateValue)
}

// A model incoherent with the mode (e.g. a range received in single mode) formats to nothing
export function formatValue(mode: DatePickerLiteMode, value: DatePickerLiteValue, inputFormat: string, separator: string, locale: string): string | undefined {
	if (mode === 'range') {
		return isDateRange(value) ? `${formatDate(value[0], inputFormat, locale)}${separator}${formatDate(value[1], inputFormat, locale)}` : undefined
	}
	if (mode === 'multiple') {
		return isDateMultiple(value) ? value.map(date => formatDate(date, inputFormat, locale)).join(separator) : undefined
	}
	return isDateValue(value) ? formatDate(value, inputFormat, locale) : undefined
}

// Both range bounds must parse to emit; range-order rules stay in the root validation
export function parseValue(mode: DatePickerLiteMode, value: string | null, inputFormat: string, separator: string, locale: string): DatePickerLiteValue {
	if (value === null) return null
	if (mode === 'range') {
		const [startStr, endStr] = value.split(separator)
		const start = startStr ? parseDate(startStr, inputFormat, locale) : null
		const end = endStr ? parseDate(endStr, inputFormat, locale) : null
		return start && end ? [start, end] : null
	}
	if (mode === 'multiple') {
		const dates = value.split(separator).map(date => parseDate(date, inputFormat, locale))
		return dates.length > 0 && dates.every(isDateValue) ? dates : null
	}
	return parseDate(value, inputFormat, locale) ?? null
}

export function sameValue(mode: DatePickerLiteMode, a: DatePickerLiteValue, b: DatePickerLiteValue): boolean {
	if (mode === 'range') {
		return isDateRange(a) && isDateRange(b) && a[0].getTime() === b[0].getTime() && a[1].getTime() === b[1].getTime()
	}
	if (mode === 'multiple') {
		return isDateMultiple(a) && isDateMultiple(b) && a.length === b.length && a.every((date, index) => {
			const otherDate = b[index]
			return otherDate !== undefined && date.getTime() === otherDate.getTime()
		})
	}
	return isDateValue(a) && isDateValue(b) && a.getTime() === b.getTime()
}
