export const utcMidnightToLocalMidnight = (date: Date): Date => {
	const isUtcMidnight = date.getUTCHours() === 0
		&& date.getUTCMinutes() === 0
		&& date.getUTCSeconds() === 0
		&& date.getUTCMilliseconds() === 0

	if (!isUtcMidnight) return date

	return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0)
}

export const mapUtcMidnightToLocalMidnight = <T>(value: T): T => {
	if (value instanceof Date) return utcMidnightToLocalMidnight(value) as unknown as T
	if (Array.isArray(value)) {
		return value.map(d => (d instanceof Date ? utcMidnightToLocalMidnight(d) : d)) as unknown as T
	}
	return value
}
