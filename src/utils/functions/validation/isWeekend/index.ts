import dayjs from 'dayjs'

export const WEEKEND_DAYS = [0, 6]

/** Check if a date is Saturday or Sunday */
export function isWeekend(date: string): boolean {
	return WEEKEND_DAYS.includes(dayjs(date).day())
}
