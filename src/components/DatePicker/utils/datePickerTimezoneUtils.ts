import { getDateParts, isUtcMidnight } from '@/utils/date/dateOnly'

export const utcMidnightToLocalMidnight = (date: Date): Date => {
	if (!isUtcMidnight(date)) return date

	const { year, month, day } = getDateParts(date)
	return new Date(year, month, day, 0, 0, 0, 0)
}

export const mapUtcMidnightToLocalMidnight = <T>(value: T): T => {
	if (value instanceof Date) return utcMidnightToLocalMidnight(value) as unknown as T
	if (Array.isArray(value)) {
		return value.map(d => (d instanceof Date ? utcMidnightToLocalMidnight(d) : d)) as unknown as T
	}
	return value
}
