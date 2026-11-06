import { afterEach, describe, expect, it, vi } from 'vitest'
import { checkThemeConfig, createVuetifyOptions } from '@/vuetifyOptions'
import { defaultThemeConfig } from '../constants'
import { resolveThemeConfig } from '../resolveThemeConfig'

describe('resolveThemeConfig', () => {
	it('returns the defaults without configuration', () => {
		expect(resolveThemeConfig()).toEqual(defaultThemeConfig)
	})

	it('replaces rejected settings with their default value', () => {
		const config = resolveThemeConfig(
			{ focus: { width: 1, offset: 1 } },
			[{ level: 'error', path: 'focus.width', message: '' }],
		)

		expect(config.focus).toEqual({ ...defaultThemeConfig.focus, offset: 1 })
	})
})

describe('createVuetifyOptions with a theme configuration', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('keeps the current options when no configuration is given', () => {
		const options = createVuetifyOptions()

		expect(options.defaults?.VTextField).toBeUndefined()
		expect(options.theme && typeof options.theme === 'object' && options.theme.themes?.cnam?.variables?.['focus-width']).toBeFalsy()
	})

	it('uses the brand as default theme and exposes focus variables on every theme', () => {
		const options = createVuetifyOptions({ brand: 'pa', focus: { width: 3, offset: 1, color: 'pinkDarken20' } })
		const theme = options.theme && typeof options.theme === 'object' ? options.theme : {}

		expect(theme.defaultTheme).toBe('pa')
		for (const definition of Object.values(theme.themes ?? {})) {
			expect(definition.variables).toMatchObject({
				'focus-width': '3px',
				'focus-offset': '1px',
				'focus-color': 'var(--v-theme-pink-darken20)',
			})
		}
	})

	it('applies field settings to Vuetify fields only when provided', () => {
		const options = createVuetifyOptions({ fields: { density: 'compact' } })

		expect(options.defaults?.VTextField).toEqual({ variant: 'outlined', density: 'compact' })
		expect(options.defaults?.VSelect).toEqual({ variant: 'outlined', density: 'compact' })
		expect(options.defaults?.VBtn).toEqual({ ripple: false })
	})

	it('falls back to defaults for rejected settings and warns in development', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
		const options = createVuetifyOptions({ focus: { width: 1 } })
		const theme = options.theme && typeof options.theme === 'object' ? options.theme : {}

		expect(theme.themes?.cnam?.variables?.['focus-width']).toBe('2px')
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('focus.width'))
	})
})

describe('checkThemeConfig', () => {
	it('validates the focus color against the real brand colors', () => {
		expect(checkThemeConfig({ brand: 'cnam', focus: { color: 'primary' } }).valid).toBe(true)
		expect(checkThemeConfig({ brand: 'cnam', focus: { color: 'pinkDarken20' } }).valid).toBe(true)
		expect(checkThemeConfig({ brand: 'cnam', focus: { color: 'surface' } }).valid).toBe(false)
	})
})
