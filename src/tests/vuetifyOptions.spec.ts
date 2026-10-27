import { config, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import BackBtn from '@/components/BackBtn/BackBtn.vue'
import { createVuetifyInstance } from '@/vuetifyConfig'
import { createVuetifyOptions } from '@/vuetifyOptions'

describe('createVuetifyOptions', () => {
	it('provides the Synapse themes, the French locale and the MDI icons', () => {
		const options = createVuetifyOptions()

		expect(options.theme && options.theme.defaultTheme).toBe('cnam')
		expect(Object.keys((options.theme && options.theme.themes) ?? {})).toEqual(['cnam', 'pa', 'ap2026', 'ap'])
		expect(options.locale?.locale).toBe('fr')
		expect(options.icons?.defaultSet).toBe('mdi')
	})

	it('does not register Vuetify components or directives', () => {
		const options = createVuetifyOptions()

		expect(options.components).toBeUndefined()
		expect(options.directives).toBeUndefined()
	})

	it('uses kebab-case theme color names', () => {
		const themes = (createVuetifyOptions().theme || {}).themes ?? {}

		for (const [themeName, theme] of Object.entries(themes)) {
			for (const colorName of Object.keys(theme.colors ?? {})) {
				expect(colorName, `${themeName}: ${colorName}`).toBe(colorName.toLowerCase())
			}
		}
	})

	it('returns a new configuration on each call', () => {
		const options = createVuetifyOptions()
		options.defaults = { ...options.defaults, VTextField: { variant: 'outlined' } }

		expect(createVuetifyOptions().defaults).not.toHaveProperty('VTextField')
	})

	it('produces the same themes as createVuetifyInstance', () => {
		const fromOptions = createVuetify(createVuetifyOptions())
		const fromInstance = createVuetifyInstance()

		expect(fromOptions.theme.themes.value).toEqual(fromInstance.theme.themes.value)
		expect(fromOptions.theme.global.name.value).toBe(fromInstance.theme.global.name.value)
	})

	describe('without global registration of Vuetify components', () => {
		let globalPlugins: typeof config.global.plugins

		beforeEach(() => {
			globalPlugins = config.global.plugins
			config.global.plugins = []
		})

		afterEach(() => {
			config.global.plugins = globalPlugins
			vi.restoreAllMocks()
		})

		it('renders a Synapse component that uses Vuetify components', () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const wrapper = mount(BackBtn, {
				global: {
					plugins: [createVuetify(createVuetifyOptions())],
				},
			})

			expect(wrapper.find('.v-btn').exists()).toBe(true)
			expect(warn.mock.calls.flat().join(' ')).not.toMatch(/Failed to resolve (component|directive)/)
		})
	})
})
