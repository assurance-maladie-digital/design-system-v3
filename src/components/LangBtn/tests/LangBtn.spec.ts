import { mount, VueWrapper } from '@vue/test-utils'
import LangBtn from '../LangBtn.vue'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ISO6391 from 'iso-639-1'

const vuetify = createVuetify({
	components,
	directives,
})

describe('LangBtn', () => {
	let wrapper: VueWrapper

	afterEach(() => {
		if (wrapper) {
			wrapper.unmount()
		}
	})

	it('renders correctly', async () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders with default props', () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.vd-lang-btn').text()).toBe('Français')
	})

	it('renders with custom modelValue', () => {
		wrapper = mount(LangBtn, {
			props: {
				modelValue: 'co',
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.vd-lang-btn').text()).toBe('corsu')
	})

	it('updates selectedLanguage when modelValue prop changes', async () => {
		wrapper = mount(LangBtn, {
			props: {
				modelValue: 'fr',
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.find('.vd-lang-btn').text()).toBe('Français')

		await wrapper.setProps({ modelValue: 'es' })
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.vd-lang-btn').text()).toBe('Español')
	})

	it('updates language when a language is selected', async () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'co', 'es'],
				modelValue: 'es',
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const activatorButton = wrapper.find('.vd-lang-btn')
		await activatorButton.trigger('click')
		await wrapper.vm.$nextTick()

		const languageItem = document.body.querySelectorAll('.v-list-item')[1] as HTMLElement
		languageItem.click()
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.vd-lang-btn').text()).toBe('corsu')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['co'])
	})

	it('opens the menu when clicked', async () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		expect(document.body.querySelector('.v-list')).toBeNull()

		const activatorButton = wrapper.find('.vd-lang-btn')

		await activatorButton.trigger('click')
		await wrapper.vm.$nextTick()

		expect(document.body.querySelector('.v-list')).not.toBeNull()
	})

	it('hides down arrow when hideDownArrow is true', () => {
		wrapper = mount(LangBtn, {
			props: {
				hideDownArrow: true,
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.v-icon').exists()).toBe(false)
	})

	it('shows down arrow when hideDownArrow is false', () => {
		wrapper = mount(LangBtn, {
			props: {
				hideDownArrow: false,
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.v-icon').exists()).toBe(true)
	})

	it('renders all languages when availableLanguages is "*"', async () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: '*',
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const activatorButton = wrapper.find('.vd-lang-btn')
		await activatorButton.trigger('click')
		await wrapper.vm.$nextTick()

		const allLanguageCodes = ISO6391.getAllCodes()

		const listItems = document.body.querySelectorAll('.v-list-item')

		expect(listItems.length).toBe(allLanguageCodes.length)
	})

	it('renders only specified languages', async () => {
		const languages = ['fr', 'co', 'es']
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: languages,
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const activatorButton = wrapper.find('.vd-lang-btn')
		await activatorButton.trigger('click')
		await wrapper.vm.$nextTick()

		const listItems = document.body.querySelectorAll('.v-list-item')

		expect(listItems.length).toBe(languages.length)

		const renderedLanguages = Array.from(listItems).map(item =>
			item?.textContent?.trim(),
		)
		const expectedLanguages = languages.map(
			code => ISO6391.getNativeName(code) || code,
		)
		expect(renderedLanguages).toEqual(expectedLanguages)
	})

	it('uses default ariaLabel when not provided', () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})

		const button = wrapper.find('.vd-lang-btn')
		expect(button.attributes('aria-label')).toBe('Choix de la langue. Actuellement Français')
	})

	it('uses ariaLabel prop correctly', () => {
		wrapper = mount(LangBtn, {
			props: {
				ariaLabel: 'Language selection',
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})

		const button = wrapper.find('.vd-lang-btn')
		expect(button.attributes('aria-label')).toBe('Language selection Français')
	})

	it('handles modelValue not in availableLanguages', () => {
		wrapper = mount(LangBtn, {
			props: {
				modelValue: 'unknown',
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.find('.vd-lang-btn').text()).toBe('unknown')
	})

	it('falls back to language code when name and nativeName are unavailable', () => {
		const getNameMock = vi.spyOn(ISO6391, 'getName').mockReturnValue(undefined as unknown as string)
		const getNativeNameMock = vi
			.spyOn(ISO6391, 'getNativeName')
			.mockReturnValue(undefined as unknown as string)

		wrapper = mount(LangBtn, {
			props: {
				modelValue: 'xx',
				availableLanguages: ['xx'],
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.find('.vd-lang-btn').text()).toBe('xx')

		getNameMock.mockRestore()
		getNativeNameMock.mockRestore()
	})

	it('updates selectedLanguage and emits event when updateLang is called', async () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.find('.vd-lang-btn').text()).toBe('Français')

		await wrapper.vm.$.exposed?.updateLang('es')

		expect(wrapper.find('.vd-lang-btn').text()).toBe('Español')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['es'])
	})

	it('updates language when a language is selected', async () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const activatorButton = wrapper.find('.vd-lang-btn')
		await activatorButton.trigger('click')
		await wrapper.vm.$nextTick()

		const languageItem = document.body.querySelectorAll('.v-list-item')[1]
		languageItem.dispatchEvent(new Event('click'))
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.vd-lang-btn').text()).toBe('corsu')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['co'])
	})
})
