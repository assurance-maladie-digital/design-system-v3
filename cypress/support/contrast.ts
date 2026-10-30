type Rgba = [number, number, number, number]

function parseColor(value: string): Rgba {
	const match = value.match(/^rgba?\(([^)]+)\)$/)
	if (!match) {
		throw new Error(`Couleur non prise en charge : ${value}`)
	}
	const [r = 0, g = 0, b = 0, a = 1] = match[1]!.split(/[\s,/]+/).filter(Boolean).map(Number)
	return [r, g, b, a]
}

function relativeLuminance([r, g, b]: Rgba): number {
	const [lr, lg, lb] = [r, g, b].map((channel) => {
		const value = channel / 255
		return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
	}) as [number, number, number]
	return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

function blend(foreground: Rgba, background: Rgba, alpha: number): Rgba {
	return [
		foreground[0] * alpha + background[0] * (1 - alpha),
		foreground[1] * alpha + background[1] * (1 - alpha),
		foreground[2] * alpha + background[2] * (1 - alpha),
		1,
	]
}

/**
 * Contraste WCAG d'un élément texte : couleur × opacités cumulées des ancêtres,
 * mélangée au premier fond opaque rencontré en remontant le DOM.
 */
export function getTextContrast(element: Element): number {
	const win = element.ownerDocument.defaultView!
	const color = parseColor(win.getComputedStyle(element).color)

	let alpha = color[3]
	let background: Rgba = [255, 255, 255, 1]
	let node: Element | null = element
	let backgroundFound = false

	while (node) {
		const style = win.getComputedStyle(node)
		alpha *= Number(style.opacity)
		if (!backgroundFound) {
			const nodeBackground = parseColor(style.backgroundColor)
			if (nodeBackground[3] === 1) {
				background = nodeBackground
				backgroundFound = true
			}
		}
		node = node.parentElement
	}

	const foregroundLuminance = relativeLuminance(blend(color, background, alpha))
	const backgroundLuminance = relativeLuminance(background)
	const lighter = Math.max(foregroundLuminance, backgroundLuminance)
	const darker = Math.min(foregroundLuminance, backgroundLuminance)
	return (lighter + 0.05) / (darker + 0.05)
}
