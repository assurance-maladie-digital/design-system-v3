const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const COLOR_FUNCTION_PATTERN = /^(rgb|rgba|hsl|hsla)\((.*)\)$/i
const NUMBER_PATTERN = /^[+-]?(?:\d+|\d*\.\d+)$/
const PERCENT_PATTERN = /^[+-]?(?:\d+|\d*\.\d+)%$/
const ANGLE_PATTERN = /^[+-]?(?:\d+|\d*\.\d+)(?:deg|grad|rad|turn)?$/i

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

function normalizeColorWhitespace(value: string): string {
	return value
		.trim()
		.replace(/\s*,\s*/g, ', ')
		.replace(/\s*\/\s*/g, ' / ')
		.replace(/\s+/g, ' ')
}

function isNumberWithinRange(value: string, min: number, max: number): boolean {
	if (!NUMBER_PATTERN.test(value))
		return false

	const parsed = Number(value)
	return parsed >= min && parsed <= max
}

function isPercentageWithinRange(value: string, min: number, max: number): boolean {
	if (!PERCENT_PATTERN.test(value))
		return false

	const parsed = Number.parseFloat(value.slice(0, -1))
	return parsed >= min && parsed <= max
}

function isRgbChannel(value: string): boolean {
	return isNumberWithinRange(value, 0, 255) || isPercentageWithinRange(value, 0, 100)
}

function isAlphaChannel(value: string): boolean {
	return isNumberWithinRange(value, 0, 1) || isPercentageWithinRange(value, 0, 100)
}

function isHueChannel(value: string): boolean {
	return ANGLE_PATTERN.test(value)
}

function isHslChannel(value: string): boolean {
	return isPercentageWithinRange(value, 0, 100)
}

function validateFunctionSyntax(name: string, rawArguments: string): boolean {
	const expectsAlpha = name.endsWith('a')
	const args = rawArguments.trim()
	if (!args)
		return false

	if (args.includes(',')) {
		if (args.includes('/'))
			return false

		const parts = args.split(',').map(part => part.trim())
		const expectedLength = expectsAlpha ? 4 : 3
		if (parts.length !== expectedLength)
			return false

		if (name.startsWith('rgb'))
			return parts.slice(0, 3).every(isRgbChannel) && (!expectsAlpha || isAlphaChannel(parts[3]!))

		return isHueChannel(parts[0]!)
			&& parts.slice(1, 3).every(isHslChannel)
			&& (!expectsAlpha || isAlphaChannel(parts[3]!))
	}

	const slashParts = args.split('/')
	if (slashParts.length > 2)
		return false

	const [channels, alpha] = slashParts.map(part => part.trim())
	if (expectsAlpha && !alpha)
		return false

	const parts = channels?.split(/\s+/).filter(Boolean) ?? []
	if (parts.length !== 3)
		return false

	if (alpha && !isAlphaChannel(alpha))
		return false

	if (name.startsWith('rgb'))
		return parts.every(isRgbChannel)

	return isHueChannel(parts[0]!)
		&& parts.slice(1).every(isHslChannel)
}

export function formatColor(value: unknown): string {
	if (typeof value !== 'string')
		throw new TypeError(`Expected color token to be a string, received ${String(value)}`)

	const normalizedValue = normalizeColorWhitespace(value)

	if (HEX_COLOR_PATTERN.test(normalizedValue))
		return normalizedValue.toLowerCase()

	const colorFunction = normalizedValue.match(COLOR_FUNCTION_PATTERN)
	if (colorFunction) {
		const [, name, rawArguments] = colorFunction
		if (name && rawArguments && validateFunctionSyntax(name.toLowerCase(), rawArguments))
			return normalizedValue
	}

	throw new TypeError(
		`Invalid color token "${value}". Expected a valid hex, rgb(), rgba(), hsl(), or hsla() CSS color.`,
	)
}

export function formatLength(value: string | number): string {
	if (value === '0' || value === 0)
		return '0'

	if (typeof value === 'number')
		return `${value}px`

	return String(value)
}
