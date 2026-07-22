import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChipList from '../ChipList.vue'

const items = [
	{ value: '1', text: 'Option 1' },
	{ value: '2', text: 'Option 2' },
	{ value: '3', text: 'Option 3' },
	{ value: '4', text: 'Option 4' },
	{ value: '5', text: 'Option 5' },
]

// jsdom ne calcule pas `:focus-visible` : les rings DS sont portés par la CSS scoped (croix en
// inset contrasté, chip overflow + boutons Réinitialiser/Masquer via override global). Le rendu
// est couvert par le visuel. On valide ici que les cibles de focus sont de vrais éléments focusables.
describe('ChipList - Focus', () => {
	it('renders a real focusable remove button per chip', () => {
		const wrapper = mount(ChipList, { props: { items, overflowLimit: 10 } })
		const removeBtns = wrapper.findAll('.remove-chip')

		expect(removeBtns.length).toBe(items.length)
		removeBtns.forEach((btn) => {
			expect(btn.element.tagName).toBe('BUTTON')
			expect(btn.attributes('tabindex')).not.toBe('-1')
		})
	})

	it('exposes the overflow chip as a focusable button', () => {
		const wrapper = mount(ChipList, { props: { items, overflowLimit: 4 } })
		const overflow = wrapper.find('.overflow-chip')

		expect(overflow.exists()).toBe(true)
		expect(overflow.attributes('role')).toBe('button')
		expect(overflow.attributes('tabindex')).toBe('0')
	})

	it('renders no remove buttons in readonly mode', () => {
		const wrapper = mount(ChipList, { props: { items, readonly: true, overflowLimit: 10 } })

		expect(wrapper.findAll('.remove-chip').length).toBe(0)
	})

	it('exposes a focusable reset button when interactive', () => {
		const wrapper = mount(ChipList, { props: { items, overflowLimit: 10 } })
		const reset = wrapper.find('[data-test-id="reset-btn"]')

		expect(reset.exists()).toBe(true)
		expect(reset.element.tagName).toBe('BUTTON')
	})
})
