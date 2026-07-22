import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordField from '../PasswordField.vue'

// jsdom ne calcule pas `:focus-visible` ni l'`outline` : on vérifie ici les prérequis
// structurels des rings DS scopés (vrais boutons focusables), le rendu étant couvert par
// les tests visuels Cypress.
describe('PasswordField - Focus', () => {
	it('renders the visibility-toggle as a focusable button', () => {
		const wrapper = mount(PasswordField, {
			props: { label: 'Mot de passe' },
		})
		const toggle = wrapper.find('.password-toggle-button')

		expect(toggle.exists()).toBe(true)
		expect(toggle.element.tagName).toBe('BUTTON')
		expect(toggle.attributes('tabindex')).not.toBe('-1')
	})

	it('renders the clear button as a focusable native button when clearable with a value', () => {
		const wrapper = mount(PasswordField, {
			props: { label: 'Mot de passe', clearable: true, modelValue: 'secret' },
		})
		const clear = wrapper.find('.password-clear-button')

		expect(clear.exists()).toBe(true)
		expect(clear.element.tagName).toBe('BUTTON')
		expect(clear.attributes('tabindex')).not.toBe('-1')
	})

	it('exposes a focusable text input (primary field border on focus)', () => {
		const wrapper = mount(PasswordField, {
			props: { label: 'Mot de passe' },
		})
		const input = wrapper.find('input')

		expect(input.exists()).toBe(true)
		expect(input.attributes('tabindex')).not.toBe('-1')
	})
})
