/**
 * Creates CSS variables from font tokens
 * @param fontTokens The font tokens object
 * @returns An object with CSS variables for font properties
 */
interface FontProperty {
	fontFamily?: string
	fontSize?: string
	fontWeight?: number
	lineHeight?: number
	letterSpacing?: string
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

	// Add font family if available
	if (fontTokens.family && fontTokens.family.primary) {
		variables['font-family'] = fontTokens.family.primary
	}

	// Process heading styles with proper Vuetify theme variable format
	if (fontTokens.heading) {
		Object.entries(fontTokens.heading).forEach(([key, value]: [string, FontProperty]) => {
			// Add variables in the format Vuetify expects (without -- prefix)
			// Vuetify will automatically add --v-theme- prefix
			variables[`typography-${key}-font-size`] = value.fontSize || ''
			variables[`typography-${key}-font-weight`] = value.fontWeight?.toString() || ''
			variables[`typography-${key}-line-height`] = value.lineHeight?.toString() || ''
			variables[`typography-${key}-letter-spacing`] = value.letterSpacing || ''
		})
	}

	// Process body styles with proper Vuetify theme variable format
	if (fontTokens.body) {
		Object.entries(fontTokens.body).forEach(([key, value]: [string, FontProperty]) => {
			// Add variables in the format Vuetify expects (without -- prefix)
			variables[`typography-${key}-font-size`] = value.fontSize || ''
			variables[`typography-${key}-font-weight`] = value.fontWeight?.toString() || ''
			variables[`typography-${key}-line-height`] = value.lineHeight?.toString() || ''
			variables[`typography-${key}-letter-spacing`] = value.letterSpacing || ''
		})
	}

	// Process subtitle styles with proper Vuetify theme variable format
	if (fontTokens.subtitle) {
		Object.entries(fontTokens.subtitle).forEach(([key, value]: [string, FontProperty]) => {
			// Add variables in the format Vuetify expects (without -- prefix)
			variables[`typography-${key}-font-size`] = value.fontSize || ''
			variables[`typography-${key}-font-weight`] = value.fontWeight?.toString() || ''
			variables[`typography-${key}-line-height`] = value.lineHeight?.toString() || ''
			variables[`typography-${key}-letter-spacing`] = value.letterSpacing || ''
		})
	}

	// Process caption and overline styles with proper Vuetify theme variable format
	['caption', 'overline'].forEach((category) => {
		if (fontTokens[category]) {
			const value = fontTokens[category]
			if (typeof value === 'object' && !Array.isArray(value)) {
				if ('fontSize' in value) {
					// Direct property object
					// Add variables in the format Vuetify expects (without -- prefix)
					variables[`typography-${category}-font-size`] = (value as FontProperty).fontSize || ''
					variables[`typography-${category}-font-weight`] = (value as FontProperty).fontWeight?.toString() || ''
					variables[`typography-${category}-line-height`] = (value as FontProperty).lineHeight?.toString() || ''
					variables[`typography-${category}-letter-spacing`] = (value as FontProperty).letterSpacing || ''

					// Add text-transform if present
					if ((value as FontProperty).textTransform) {
						variables[`typography-${category}-text-transform`] = (value as FontProperty).textTransform || ''
					}
				}
				else {
					// Nested object with key matching category name
					const nestedValue = (value as Record<string, FontProperty>)[category]
					if (nestedValue) {
						// Add variables in the format Vuetify expects (without -- prefix)
						variables[`typography-${category}-font-size`] = nestedValue.fontSize || ''
						variables[`typography-${category}-font-weight`] = nestedValue.fontWeight?.toString() || ''
						variables[`typography-${category}-line-height`] = nestedValue.lineHeight?.toString() || ''
						variables[`typography-${category}-letter-spacing`] = nestedValue.letterSpacing || ''

						// Add text-transform if present
						if (nestedValue.textTransform) {
							variables[`typography-${category}-text-transform`] = nestedValue.textTransform || ''
						}
					}
				}
			}
		}
	})

	// Process display styles with display1 and display2 properties
	if (fontTokens.display) {
		const display = fontTokens.display as Record<string, FontProperty>

		// Process each display size (display1, display2)
		['display1', 'display2'].forEach((key) => {
			if (display[key]) {
				const value = display[key]
				// Add variables in the format Vuetify expects (without -- prefix)
				variables[`typography-${key}-font-size`] = value.fontSize || ''
				variables[`typography-${key}-font-weight`] = value.fontWeight?.toString() || ''
				variables[`typography-${key}-line-height`] = value.lineHeight?.toString() || ''
				variables[`typography-${key}-letter-spacing`] = value.letterSpacing || ''

				// Add text-transform if present
				if (value.textTransform) {
					variables[`typography-${key}-text-transform`] = value.textTransform || ''
				}
			}
		})
	}

	return variables
}
