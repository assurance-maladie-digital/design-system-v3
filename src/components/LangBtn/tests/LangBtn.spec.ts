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

describe('LangBtn.vue', () => {
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

		// Vérifier la langue initiale
		expect(wrapper.find('.vd-lang-btn').text()).toBe('Français')

		// Modifier la prop modelValue
		await wrapper.setProps({ modelValue: 'es' })
		await wrapper.vm.$nextTick()

		// Vérifier que la langue affichée a été mise à jour
		expect(wrapper.find('.vd-lang-btn').text()).toBe('Español')
	})

	it('updates language when a language is selected', async () => {
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

		// Vérifier que le menu n'est pas ouvert au départ
		expect(document.body.querySelector('.v-list')).toBeNull()

		// Trouver le bouton activator
		const activatorButton = wrapper.find('.vd-lang-btn')

		// Simuler un clic sur le bouton
		await activatorButton.trigger('click')
		await wrapper.vm.$nextTick()

		// Vérifier que le menu est maintenant ouvert
		expect(document.body.querySelector('.v-list')).not.toBeNull()
	})

	it('hides down arrow when hideDownArrow is true', () => {
		wrapper = mount(LangBtn, {
			props: { hideDownArrow: true },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.v-icon').exists()).toBe(false)
	})

	it('shows down arrow when hideDownArrow is false', () => {
		wrapper = mount(LangBtn, {
			props: { hideDownArrow: false },
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

		// Ouvrir le menu
		const activatorButton = wrapper.find('.vd-lang-btn')
		await activatorButton.trigger('click')
		await wrapper.vm.$nextTick()

		// Récupérer toutes les langues disponibles via ISO6391
		const allLanguageCodes = ISO6391.getAllCodes()

		// Trouver tous les éléments de la liste
		const listItems = document.body.querySelectorAll('.v-list-item')

		// Vérifier que le nombre d'éléments correspond au nombre de langues
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

		// Ouvrir le menu
		const activatorButton = wrapper.find('.vd-lang-btn')
		await activatorButton.trigger('click')
		await wrapper.vm.$nextTick()

		// Trouver tous les éléments de la liste
		const listItems = document.body.querySelectorAll('.v-list-item')

		// Vérifier que le nombre d'éléments correspond au nombre de langues spécifiées
		expect(listItems.length).toBe(languages.length)

		// Vérifier que les langues rendues sont correctes
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
		expect(button.attributes('aria-label')).toBe('Choix de la langue.')
	})

	it('uses ariaLabel prop correctly', () => {
		const customAriaLabel = 'Sélectionnez la langue'
		wrapper = mount(LangBtn, {
			props: {
				ariaLabel: customAriaLabel,
				availableLanguages: ['fr', 'co', 'es'],
			},
			global: {
				plugins: [vuetify],
			},
		})

		const button = wrapper.find('.vd-lang-btn')
		expect(button.attributes('aria-label')).toBe(customAriaLabel)
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

		// La langue affichée doit être 'unknown'
		expect(wrapper.find('.vd-lang-btn').text()).toBe('unknown')
	})

	it('falls back to language code when name and nativeName are unavailable', () => {
		// Mock des méthodes ISO6391 pour qu'elles renvoient undefined
		const getNameMock = vi.spyOn(ISO6391, 'getName').mockReturnValue(undefined as unknown as string)
		const getNativeNameMock = vi
			.spyOn(ISO6391, 'getNativeName')
			.mockReturnValue(undefined as unknown as string)

		wrapper = mount(LangBtn, {
			props: {
				modelValue: 'xx', // Code de langue invalide
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

		// Open the menu
		const activatorButton = wrapper.find('.vd-lang-btn')
		await activatorButton.trigger('click')
		await wrapper.vm.$nextTick()

		// Find the language item and simulate a click
		const languageItem = document.body.querySelectorAll('.v-list-item')[1] // Select the second language item (e.g., 'co')
		await languageItem.dispatchEvent(new Event('click'))
		await wrapper.vm.$nextTick()

		// Verify that the language is updated
		expect(wrapper.find('.vd-lang-btn').text()).toBe('corsu')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['co'])
	})
})
