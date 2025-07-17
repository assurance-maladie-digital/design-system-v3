export function isCssColor(color?: string | false): boolean {
	return typeof color === 'string' && Boolean(color.match(/^(#|var\(--|(rgb|hsl)a?\()/))
}
