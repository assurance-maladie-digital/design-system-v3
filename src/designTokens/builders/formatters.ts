export function toKebabCase(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([a-zA-Z])(\d)/g, '$1-$2')
		.replace(/_/g, '-')
		.toLowerCase()
}

export function toTokenSuffix(value: string): string {
	return toKebabCase(value)
		.replace(/(darken|lighten)(\d+)$/, '$1-$2')
}

export function formatColor(value: unknown): string {
	if (typeof value !== 'string')
		return String(value)

	if (value.startsWith('#'))
		return value.toLowerCase()

	return value.replace(/,\s+/g, ', ').replace(/\s+/g, ' ')
}

export function formatLength(value: string | number): string {
	if (value === '0' || value === 0)
		return '0'

	if (typeof value === 'number')
		return `${value}px`

	return String(value)
}
