import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyCheckbox from '../SyCheckbox.vue'

// jsdom ne calcule pas `:focus-visible` : SyCheckbox porte déjà son ring DS
// (`.v-selection-control--focus-visible`, 2px primary, offset 2px). On vérifie ici les
// prérequis structurels ; le rendu du ring est couvert par le test visuel Cypress.
describe('SyCheckbox - Focus', () => {
	it('exposes a keyboard-focusable checkbox input', () => {
		const wrapper = mount(SyCheckbox, {
			props: { label: 'J\'accepte' },
		})
		const input = wrapper.find('input[type="checkbox"]')

		expect(input.exists()).toBe(true)
		expect(input.attributes('tabindex')).not.toBe('-1')
	})

	it('renders no focusable input in decorative mode (purely visual, aria-hidden)', () => {
		const wrapper = mount(SyCheckbox, {
			props: { label: 'Option', decorative: true },
		})

		// Le rendu décoratif est aria-hidden / pointer-events-none : aucun input focusable.
		expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false)
		expect(wrapper.find('.sy-checkbox-decorative[aria-hidden="true"]').exists()).toBe(true)
	})
})
