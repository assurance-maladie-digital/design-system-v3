import { getDateParts } from '@/utils/date/dateOnly'

export const normalizeToUtcMidnight = (date: Date): Date => {
	const { year, month, day } = getDateParts(date)
	return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
}
