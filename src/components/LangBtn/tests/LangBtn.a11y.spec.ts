// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import LangBtn from '../LangBtn.vue'

// Scénario d’accessibilité : sélecteur de langue fermé, avec label ARIA
// et liste de langues FR / EN.

describe('LangBtn – accessibility (axe)', () => {
	it('has no obvious axe violations in closed state', async () => {
		const wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'en'],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LangBtn – closed state', {
			ignoreRules: ['region'],
		})
	})

	// Scénario : menu ouvert — la listbox et ses options sont téléportées dans body
	it('has no obvious axe violations in open state', async () => {
		const wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'en'],
			},
			attachTo: document.body,
		})

		await wrapper.find('.vd-lang-btn').trigger('click')
		await wrapper.vm.$nextTick()

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'LangBtn – open state', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	// Scénario : libellé personnalisé — le bouton reste correctement nommé
	it('has no obvious axe violations with a custom ariaLabel', async () => {
		const wrapper = mount(LangBtn, {
			props: {
				ariaLabel: 'Langue d’affichage du portail',
				availableLanguages: ['fr', 'en'],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LangBtn – custom ariaLabel', {
			ignoreRules: ['region'],
		})
	})

	// Scénario : liste mixte incluant des langues RTL (arabe, hébreu) — couvre
	// les attributs lang / dir sur les options.
	it('has no obvious axe violations with RTL languages', async () => {
		const wrapper = mount(LangBtn, {
			props: {
				modelValue: 'fr',
				availableLanguages: ['fr', 'en', 'ar', 'he', 'es'],
			},
			attachTo: document.body,
		})

		await wrapper.find('.vd-lang-btn').trigger('click')
		await wrapper.vm.$nextTick()

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'LangBtn – RTL languages', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	// Scénario : plusieurs instances — vérifie l'absence d'ids dupliqués (RGAA 8.2)
	it('has no obvious axe violations with several instances', async () => {
		const wrapper = mount(defineComponent({
			components: { LangBtn },
			template: `
				<LangBtn :availableLanguages="['fr', 'en']" />
				<LangBtn :availableLanguages="['fr', 'en']" />
			`,
		}), { attachTo: document.body })

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'LangBtn – several instances', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})

describe('LangBtn – accessibility (focus & states)', () => {
	it('moves focus to the selected option when the menu opens', async () => {
		const wrapper = mount(LangBtn, {
			props: {
				modelValue: 'en',
				availableLanguages: ['fr', 'en'],
			},
			attachTo: document.body,
		})

		await wrapper.find('.vd-lang-btn').trigger('click')
		await wrapper.vm.$nextTick()
		// La gestion du focus passe par requestAnimationFrame après le rendu du menu
		await new Promise(resolve => setTimeout(resolve, 20))

		const selectedOption = Array.from(document.body.querySelectorAll('[role="option"]'))
			.find(el => el.getAttribute('aria-selected') === 'true')
		expect(selectedOption).toBeTruthy()
		expect(document.activeElement).toBe(selectedOption)

		wrapper.unmount()
	})

	it('returns focus to the button after selecting a language', async () => {
		const wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'en'],
			},
			attachTo: document.body,
		})

		const button = wrapper.find('.vd-lang-btn').element as HTMLElement
		await wrapper.find('.vd-lang-btn').trigger('click')
		await wrapper.vm.$nextTick()

		const englishOption = Array.from(document.body.querySelectorAll('[role="option"]'))
			.find(el => el.getAttribute('lang') === 'en') as HTMLElement
		englishOption.click()
		await wrapper.vm.$nextTick()
		// Le retour du focus passe par un watcher async après la fermeture du menu
		await new Promise(resolve => setTimeout(resolve, 20))

		expect(document.activeElement).toBe(button)
		expect(button.getAttribute('aria-expanded')).toBe('false')

		wrapper.unmount()
	})

	it('updates aria-expanded and the accessible name when the selection changes', async () => {
		const wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'en'],
			},
			attachTo: document.body,
		})

		const button = wrapper.find('.vd-lang-btn')
		expect(button.attributes('aria-expanded')).toBe('false')
		expect(button.attributes('aria-label')).toBe('Choix de la langue. Actuellement Français')

		await wrapper.vm.$.exposed?.updateLang('en')
		await wrapper.vm.$nextTick()

		expect(button.attributes('aria-label')).toBe('Choix de la langue. Actuellement English')

		wrapper.unmount()
	})
})
