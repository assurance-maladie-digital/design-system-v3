import { parseDate } from '@/utils/parseDate'

/** Check if a date is before another date (DD/MM/YYYY format) */
export function isDateBefore(minDate: string, value: string): boolean {
	const parsedValue = parseDate(value)
	const parsedMinDate = parseDate(minDate)

	return parsedValue.isBefore(parsedMinDate)
}
