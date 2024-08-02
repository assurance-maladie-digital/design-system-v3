export const createFlattenTheme = (theme: any) => {
	const result: { [key: string]: string | number } = {}
	const flatten = (obj: any, prefix = '') => {
		for (const key in obj) {
			const value = obj[key]
			const newKey = prefix ? `${prefix}-${key}` : key
			if (typeof value === 'object' && value !== null) {
				flatten(value, newKey)
			}
			else {
				result[newKey] = value
			}
		}
	}
	flatten(theme)
	return result
}
