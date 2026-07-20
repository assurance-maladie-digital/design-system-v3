import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PhoneField from '../PhoneField.vue'

// jsdom ne calcule pas `:focus-visible` : PhoneField délègue le focus à SySelect (indicatif)
// et SyTextField (numéro) ; le seul focusable propre est le bouton clear (`<button>` natif,
// non couvert par `_btns.scss`). On vérifie ici les prérequis structurels du ring DS scopé.
describe('PhoneField - Focus', () => {
	it('renders the clear button as a focusable native button when clearable with a value', () => {
		const wrapper = mount(PhoneField, {
			props: { isClearable: true, modelValue: '0612345678' },
		})
		const clear = wrapper.find('.phone-field__clear-button')

		expect(clear.exists()).toBe(true)
		expect(clear.element.tagName).toBe('BUTTON')
		// Pas de tabindex -1 => atteignable au clavier, éligible au ring scopé.
		expect(clear.attributes('tabindex')).not.toBe('-1')
	})

	it('exposes a focusable phone number input (primary field border on focus)', () => {
		const wrapper = mount(PhoneField, {
			props: { modelValue: '0612345678' },
		})
		const input = wrapper.find('input')

		expect(input.exists()).toBe(true)
		expect(input.attributes('tabindex')).not.toBe('-1')
	})
})
