import { describe, expect, it } from 'vitest'
import { generateThemeVariables } from '../utils/convertSemanticsToken'
import { createFlattenTheme, toKebabCase } from '@/designTokens/utils'
import { createVuetifyInstance } from '@/vuetifyConfig'

describe('design token utils', () => {
	it('flattens nested theme objects without non-null assertions', () => {
		expect(createFlattenTheme({
			primary: {
				base: '#0c419a',
			},
			spacing: {
				md: 16,
			},
		})).toEqual({
			'primary-base': '#0c419a',
			'spacing-md': 16,
		})
	})

	it('throws when a flattened theme value is undefined', () => {
		expect(() => createFlattenTheme({
			primary: {
				base: undefined,
			},
		} as unknown as Parameters<typeof createFlattenTheme>[0])).toThrowError('Missing theme value for key "primary-base"')
	})

	it('converts theme color names to kebab-case for CSS variables', () => {
		expect(toKebabCase('onSurfaceVariant')).toBe('on-surface-variant')
		expect(toKebabCase('greyDarken60')).toBe('grey-darken60')
	})

	it('generates CSS color variables without uppercase characters', () => {
		const vuetify = createVuetifyInstance()
		const themes = vuetify.theme.themes.value

		for (const [themeName, theme] of Object.entries(themes)) {
			for (const colorName of Object.keys(theme.colors)) {
				expect(colorName, `${themeName}: --v-theme-${colorName}`).toBe(colorName.toLowerCase())
			}
		}

		expect(vuetify.theme.styles.value).not.toMatch(/--v-theme-[^\s:]*[A-Z][^\s:]*\s*:/)
	})

	it('generates semantic theme variables from token categories', () => {
		expect(generateThemeVariables({
			colors: {
				background: {
					main: '#ffffff',
				},
				text: {
					base: '#222324',
				},
			},
		})).toEqual({
			onBackgroundMain: '#ffffff',
			onTextBase: '#222324',
		})
	})

	it('throws when a semantic token value is undefined', () => {
		expect(() => generateThemeVariables({
			colors: {
				background: {
					main: undefined,
				},
			},
		} as unknown as Parameters<typeof generateThemeVariables>[0])).toThrow('Missing semantic token "main" in category "background"')
	})
})
