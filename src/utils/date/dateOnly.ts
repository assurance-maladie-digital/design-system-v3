export const isUtcMidnight = (date: Date): boolean => date.getUTCHours() === 0
	&& date.getUTCMinutes() === 0
	&& date.getUTCSeconds() === 0
	&& date.getUTCMilliseconds() === 0

export type DateParts = { year: number, month: number, day: number }

export const getDateParts = (date: Date): DateParts => {
	if (isUtcMidnight(date)) {
		return {
			year: date.getUTCFullYear(),
			month: date.getUTCMonth(),
			day: date.getUTCDate(),
		}
	}

	return {
		year: date.getFullYear(),
		month: date.getMonth(),
		day: date.getDate(),
	}
}
