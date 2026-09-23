import { mount, VueWrapper } from '@vue/test-utils'
import LangBtn from '../LangBtn.vue'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { defineComponent } from 'vue'
import ISO6391 from 'iso-639-1'

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
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders with default props', () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'co', 'es'],
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
		})
		expect(wrapper.find('.vd-lang-btn').text()).toBe('corsu')
	})

	it('updates selectedLanguage when modelValue prop changes', async () => {
		wrapper = mount(LangBtn, {
			props: {
				modelValue: 'fr',
				availableLanguages: ['fr', 'co', 'es'],
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
		})
		expect(wrapper.find('.v-icon').exists()).toBe(false)
	})

	it('shows down arrow when hideDownArrow is false', () => {
		wrapper = mount(LangBtn, {
			props: {
				hideDownArrow: false,
				availableLanguages: ['fr', 'co', 'es'],
			},
		})
		expect(wrapper.find('.v-icon').exists()).toBe(true)
	})

	it('renders all languages when availableLanguages is "*"', async () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: '*',
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
			attachTo: document.body,
		})

		const activatorButton = wrapper.find('.vd-lang-btn')
		await activatorButton.trigger('click')
		await wrapper.vm.$nextTick()

		const languageItem = document.body.querySelectorAll('.v-list-item')[1]
		languageItem!.dispatchEvent(new Event('click'))
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.vd-lang-btn').text()).toBe('corsu')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['co'])
	})

	it('exposes aria-controls and aria-owns only once the menu they reference exists', async () => {
		wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'en'],
			},
			attachTo: document.body,
		})

		const activator = wrapper.get('.vd-lang-btn')
		expect(activator.attributes('aria-controls')).toBeUndefined()
		expect(activator.attributes('aria-owns')).toBeUndefined()

		await activator.trigger('click')
		await wrapper.vm.$nextTick()

		const controls = activator.attributes('aria-controls')
		expect(controls).toBeTruthy()
		expect(document.getElementById(controls!)).not.toBeNull()
	})

	it('moves focus between items with arrow keys, Home and End', async () => {
		wrapper = mount(LangBtn, {
			props: {
				modelValue: 'fr',
				availableLanguages: ['fr', 'co', 'es'],
			},
			attachTo: document.body,
		})

		await wrapper.find('.vd-lang-btn').trigger('click')
		await wrapper.vm.$nextTick()

		const items = document.body.querySelectorAll('.v-list-item')

		// Le focus initial est posé en différé (retry rAF le temps que l'overlay
		// téléporté soit monté) : on attend qu'il se stabilise sur un item.
		await vi.waitFor(() => {
			expect(document.activeElement).toBe(items[0])
		})

		const keydown = (index: number, key: string) => {
			items[index]?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
		}

		// Le focus initial est placé sur la langue sélectionnée (fr)
		expect(document.activeElement).toBe(items[0])

		keydown(0, 'ArrowDown')
		expect(document.activeElement).toBe(items[1])

		keydown(1, 'ArrowDown')
		expect(document.activeElement).toBe(items[2])

		// Bouclage : ArrowDown sur le dernier item revient au premier
		keydown(2, 'ArrowDown')
		expect(document.activeElement).toBe(items[0])

		keydown(0, 'ArrowUp')
		expect(document.activeElement).toBe(items[2])

		keydown(2, 'Home')
		expect(document.activeElement).toBe(items[0])

		keydown(0, 'End')
		expect(document.activeElement).toBe(items[2])
	})

	it('generates unique ids per instance', () => {
		// useId() est scopé par app : les deux instances doivent partager la même app
		// pour reproduire le cas réel de plusieurs LangBtn sur une page.
		const Host = defineComponent({
			components: { LangBtn },
			template: `
				<LangBtn :available-languages="['fr', 'en']" />
				<LangBtn :available-languages="['fr', 'en']" />
			`,
		})
		const host = mount(Host)

		const ids = host.findAll('.vd-lang-btn').map(btn => btn.attributes('id'))
		expect(ids[0]).toBeTruthy()
		expect(ids[1]).toBeTruthy()
		expect(ids[0]).not.toBe(ids[1])

		host.unmount()
	})
})

// Le ring de focus vient de l'override global (activateur) et d'un style scopé (items) :
// jsdom ne calcule pas :focus-visible, on vérifie le prérequis — l'activateur est un
// <button> natif focusable.
describe('LangBtn - focus', () => {
	it('renders the activator as a native <button> so the global focus ring applies', () => {
		const langWrapper = mount(LangBtn, { props: { availableLanguages: ['fr', 'en'] } })
		expect(langWrapper.get('.vd-lang-btn').element.tagName).toBe('BUTTON')
		langWrapper.unmount()
	})

	it('is focusable', () => {
		const langWrapper = mount(LangBtn, {
			props: { availableLanguages: ['fr', 'en'] },
			attachTo: document.body,
		})
		const button = langWrapper.get('.vd-lang-btn').element as HTMLButtonElement
		button.focus()
		expect(document.activeElement).toBe(button)
		langWrapper.unmount()
	})
})
