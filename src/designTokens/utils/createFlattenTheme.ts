type Theme = { [key: string]: string | number | Theme }

export const createFlattenTheme = (theme: Theme) => {
	const result: { [key: string]: string | number } = {}
	const flatten = (obj: Theme, prefix = '') => {
		for (const key in obj) {
			const value = obj[key]
			const newKey = prefix ? `${prefix}-${key}` : key
			if (typeof value === 'object' && value !== null) {
				flatten(value as Theme, newKey)
			}
			else {
				result[newKey] = value
			}
		}
	}
	flatten(theme)
	return result
}
