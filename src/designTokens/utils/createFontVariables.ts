/**
 * Creates CSS variables from font tokens
 * @param fontTokens The font tokens object
 * @returns An object with CSS variables for font properties
 */
interface FontProperty {
	fontFamily?: string
	fontSize?: string
	fontsize?: string // Alternative casing
	fontWeight?: number
	fontweight?: number // Alternative casing
	lineHeight?: number
	lineheight?: number // Alternative casing
	letterSpacing?: string
	letterspacing?: string // Alternative casing
	textTransform?: string
}

interface FontTokens {
	family?: {
		primary?: string
	}
	heading?: {
		[key: string]: FontProperty
	}
	body?: {
		[key: string]: FontProperty
	}
	subtitle?: {
		[key: string]: FontProperty
	}
	caption?: FontProperty | {
		[key: string]: FontProperty
	}
	overline?: FontProperty | {
		[key: string]: FontProperty
	}
	display?: {
		[key: string]: FontProperty
	}
	[key: string]: unknown
}

export function createFontVariables(fontTokens: FontTokens): Record<string, string> {
	const variables: Record<string, string> = {}

	// Add font family variables if available
	if (fontTokens.family && fontTokens.family.primary) {
		variables['font-family'] = fontTokens.family.primary
	}

	// Add heading variables
	if (fontTokens.heading) {
		Object.entries(fontTokens.heading).forEach(([key, value]: [string, FontProperty]) => {
			// Use the key directly (h1, h2, etc.)
			variables[`${key}-font-size`] = value.fontSize || value.fontsize || ''
			variables[`${key}-font-weight`] = value.fontWeight?.toString() || value.fontweight?.toString() || ''
			variables[`${key}-line-height`] = value.lineHeight?.toString() || value.lineheight?.toString() || ''
			variables[`${key}-letter-spacing`] = value.letterSpacing || value.letterspacing || ''
		})
	}

	// Add body variables
	if (fontTokens.body) {
		Object.entries(fontTokens.body).forEach(([key, value]: [string, FontProperty]) => {
			// Use the key directly (body1, body2, etc.)
			variables[`${key}-font-size`] = value.fontSize || value.fontsize || ''
			variables[`${key}-font-weight`] = value.fontWeight?.toString() || value.fontweight?.toString() || ''
			variables[`${key}-line-height`] = value.lineHeight?.toString() || value.lineheight?.toString() || ''
			variables[`${key}-letter-spacing`] = value.letterSpacing || value.letterspacing || ''
		})
	}

	// Add subtitle variables
	if (fontTokens.subtitle) {
		Object.entries(fontTokens.subtitle).forEach(([key, value]: [string, FontProperty]) => {
			// Use the key directly (subtitle1, subtitle2, etc.)
			variables[`${key}-font-size`] = value.fontSize || value.fontsize || ''
			variables[`${key}-font-weight`] = value.fontWeight?.toString() || value.fontweight?.toString() || ''
			variables[`${key}-line-height`] = value.lineHeight?.toString() || value.lineheight?.toString() || ''
			variables[`${key}-letter-spacing`] = value.letterSpacing || value.letterspacing || ''
		})
	}

	// Add caption, overline, and display variables if they exist
	['caption', 'overline', 'display'].forEach((category) => {
		if (fontTokens[category]) {
			Object.entries(fontTokens[category] as Record<string, FontProperty>).forEach(([key, value]: [string, FontProperty]) => {
				// Use the key directly (caption, overline, button, etc.)
				variables[`${key}-font-size`] = value.fontSize || value.fontsize || ''
				variables[`${key}-font-weight`] = value.fontWeight?.toString() || value.fontweight?.toString() || ''
				variables[`${key}-line-height`] = value.lineHeight?.toString() || value.lineheight?.toString() || ''
				variables[`${key}-letter-spacing`] = value.letterSpacing || value.letterspacing || ''
				variables[`${key}-line-height`] = value.lineHeight?.toString() || value.lineheight?.toString() || ''
				variables[`${key}-letter-spacing`] = value.letterSpacing || value.letterspacing || ''
			})
		}
	})

	// Add direct typography variables for Vuetify
	// This ensures the variables are available in the format Vuetify expects
	if (fontTokens.heading) {
		if (fontTokens.heading.h1) {
			variables['typography-h1-font-size'] = fontTokens.heading.h1.fontSize || ''
			variables['typography-h1-font-weight'] = fontTokens.heading.h1.fontWeight?.toString() || ''
			variables['typography-h1-line-height'] = fontTokens.heading.h1.lineHeight?.toString() || ''
			variables['typography-h1-letter-spacing'] = fontTokens.heading.h1.letterSpacing || ''
		}
		// Add similar entries for h2-h6
		for (let i = 2; i <= 6; i++) {
			const key = `h${i}`
			if (fontTokens.heading[key]) {
				variables[`typography-${key}-font-size`] = fontTokens.heading[key].fontSize || ''
				variables[`typography-${key}-font-weight`] = fontTokens.heading[key].fontWeight?.toString() || ''
				variables[`typography-${key}-line-height`] = fontTokens.heading[key].lineHeight?.toString() || ''
				variables[`typography-${key}-letter-spacing`] = fontTokens.heading[key].letterSpacing || ''
			}
		}
	}

	// Add body, subtitle, etc. in Vuetify format
	const categories = ['body', 'subtitle', 'caption', 'overline']
	categories.forEach((category) => {
		if (fontTokens[category]) {
			Object.entries(fontTokens[category] as Record<string, FontProperty>).forEach(([key, value]: [string, FontProperty]) => {
				variables[`typography-${key}-font-size`] = value.fontSize || ''
				variables[`typography-${key}-font-weight`] = value.fontWeight?.toString() || ''
				variables[`typography-${key}-line-height`] = value.lineHeight?.toString() || ''
				variables[`typography-${key}-letter-spacing`] = value.letterSpacing || ''
			})
		}
	})

	return variables
}
