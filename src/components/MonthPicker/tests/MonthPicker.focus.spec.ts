import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MonthPicker from '../MonthPicker.vue'

// jsdom ne calcule pas `:focus-visible` : on vérifie ici les prérequis structurels des rings
// DS scopés (vrais boutons focusables + pattern roving-tabindex des grilles), le rendu des
// anneaux étant couvert par les tests visuels Cypress.
describe('MonthPicker - Focus', () => {
	it('renders the picker toggle as a focusable native button (scoped DS ring)', () => {
		const wrapper = mount(MonthPicker, { props: { label: 'Mois', modelValue: '03/2025' } })
		const toggle = wrapper.find('.month-picker-input__toggle-btn')

		expect(toggle.exists()).toBe(true)
		expect(toggle.element.tagName).toBe('BUTTON')
		expect(toggle.attributes('tabindex')).not.toBe('-1')
	})

	it('exposes a focusable text input (primary field border)', () => {
		const wrapper = mount(MonthPicker, { props: { label: 'Mois', modelValue: '03/2025' } })
		const input = wrapper.find('input')

		expect(input.exists()).toBe(true)
		expect(input.attributes('tabindex')).not.toBe('-1')
	})

	it('uses a single roving tabindex across the month grid buttons (keyboard nav)', async () => {
		const wrapper = mount(MonthPicker, {
			props: { label: 'Mois', modelValue: '03/2025' },
			attachTo: document.body,
		})
		// Laisse le VMenu résoudre son activateur avant l'ouverture.
		await nextTick()
		await nextTick()
		await wrapper.find('.month-picker-input__toggle-btn').trigger('click')
		await nextTick()

		const months = wrapper.findComponent({ name: 'MonthSelector' }).findAll('.month-selector__month')
		expect(months.length).toBe(12)
		// Roving tabindex : exactement un bouton atteignable (0), les autres retirés (-1).
		// C'est ce bouton actif qui reçoit le ring `:focus-visible` au clavier.
		const tabbable = months.filter(b => b.attributes('tabindex') === '0')
		expect(tabbable).toHaveLength(1)

		wrapper.unmount()
	})
})
