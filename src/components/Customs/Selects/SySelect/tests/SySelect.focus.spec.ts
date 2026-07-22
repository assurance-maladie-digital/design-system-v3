import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SySelect from '../SySelect.vue'

const items = [
	{ text: 'Option A', value: 'a' },
	{ text: 'Option B', value: 'b' },
]

// jsdom ne calcule pas `:focus-visible` : SySelect est un combobox. Le focus reste sur l'input
// (SyTextField, bordure primary) ; l'option active au clavier reçoit la classe `keyboard-focused`
// (ring DS primary, sans fond). Le seul focusable propre non couvert est le bouton clear
// (`<button>` natif). On vérifie ici ses prérequis structurels ; le rendu est couvert par le visuel.
describe('SySelect - Focus', () => {
	it('renders the clear button as a focusable native button when clearable with a selection', () => {
		const wrapper = mount(SySelect, {
			props: { items, clearable: true, modelValue: 'a', label: 'Option' },
		})
		const clear = wrapper.find('.sy-select__clear-button')

		expect(clear.exists()).toBe(true)
		expect(clear.element.tagName).toBe('BUTTON')
		expect(clear.attributes('tabindex')).not.toBe('-1')
	})

	it('exposes a focusable combobox input (primary field border)', () => {
		const wrapper = mount(SySelect, {
			props: { items, label: 'Option' },
		})
		const input = wrapper.find('input')

		expect(input.exists()).toBe(true)
		expect(input.attributes('tabindex')).not.toBe('-1')
	})
})
