export const normalizeToUtcMidnight = (date: Date): Date => {
	const isAlreadyUtcMidnight = date.getUTCHours() === 0
		&& date.getUTCMinutes() === 0
		&& date.getUTCSeconds() === 0
		&& date.getUTCMilliseconds() === 0

	if (isAlreadyUtcMidnight) {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0))
	}

	return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0))
}

export const utcMidnightToLocalMidnight = (date: Date): Date => {
	const isUtcMidnight = date.getUTCHours() === 0
		&& date.getUTCMinutes() === 0
		&& date.getUTCSeconds() === 0
		&& date.getUTCMilliseconds() === 0

	if (!isUtcMidnight) return date

	return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0)
}
