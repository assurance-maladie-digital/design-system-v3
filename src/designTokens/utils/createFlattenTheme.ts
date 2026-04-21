type Theme = { [key: string]: string | number | Theme }

const isThemeBranch = (value: string | number | Theme): value is Theme =>
	typeof value === 'object' && value !== null

export const createFlattenTheme = (theme: Theme): Record<string, string | number> => {
	const result: Record<string, string | number> = {}
	const flatten = (obj: Theme, prefix = '') => {
		for (const [key, value] of Object.entries(obj)) {
			const newKey: string = prefix ? `${prefix}-${key}` : key

			if (value === undefined) {
				throw new Error(`Missing theme value for key "${newKey}"`)
			}

			if (isThemeBranch(value)) {
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
