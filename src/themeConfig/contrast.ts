type Rgb = [number, number, number]

const parseHexColor = (color: string): Rgb | null => {
	const hex = color.trim().replace(/^#/, '')

	if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
		return null
	}

	const full = hex.length === 3
		? hex.split('').map(char => char + char).join('')
		: hex

	return [0, 2, 4].map(index => Number.parseInt(full.slice(index, index + 2), 16)) as Rgb
}

const toLinear = (channel: number): number => {
	const value = channel / 255
	return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

const relativeLuminance = ([r, g, b]: Rgb): number =>
	0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

/**
 * Ratio de contraste WCAG entre deux couleurs hexadécimales (`#rgb` ou `#rrggbb`).
 * Retourne `null` si l'une des couleurs n'est pas interprétable (rgba, nom CSS…).
 */
export function getContrastRatio(foreground: string, background: string): number | null {
	const fg = parseHexColor(foreground)
	const bg = parseHexColor(background)

	if (!fg || !bg) {
		return null
	}

	const [lighter, darker] = [relativeLuminance(fg), relativeLuminance(bg)].sort((a, b) => b - a) as [number, number]
	return (lighter + 0.05) / (darker + 0.05)
}
