export const normalizeToUtcMidnight = (date: Date): Date => {
	const isAlreadyUtcMidnight = date.getUTCHours() === 0
		&& date.getUTCMinutes() === 0
		&& date.getUTCSeconds() === 0
		&& date.getUTCMilliseconds() === 0

	const year = isAlreadyUtcMidnight ? date.getUTCFullYear() : date.getFullYear()
	const month = isAlreadyUtcMidnight ? date.getUTCMonth() : date.getMonth()
	const day = isAlreadyUtcMidnight ? date.getUTCDate() : date.getDate()

	return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
}
