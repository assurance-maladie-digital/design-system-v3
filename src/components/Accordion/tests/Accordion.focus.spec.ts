import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Accordion from '../Accordion.vue'

const items = [
	{ id: '1', title: 'Premier', content: 'Contenu 1' },
	{ id: '2', title: 'Deuxième', content: 'Contenu 2' },
	{ id: '3', title: 'Troisième', content: 'Contenu 3' },
]

// jsdom ne calcule pas `:focus-visible` : le ring DS est porté par la CSS scoped (outline inset
// 2px primary sur `.sy-accordion-button:focus-visible` ET `.sy-accordion-button--focused`, sans
// background ni bordure — le rendu est couvert par le visuel). On valide ici le contrat focusable.
describe('Accordion - Focus', () => {
	it('exposes each header as a focusable button', () => {
		const wrapper = mount(Accordion, { props: { items } })
		const buttons = wrapper.findAll('.sy-accordion-button')

		expect(buttons.length).toBe(items.length)
		buttons.forEach((btn) => {
			expect(btn.attributes('role')).toBe('button')
			expect(btn.attributes('tabindex')).toBe('0')
		})
	})

	it('marks the active header with the focus class carrying the DS ring', async () => {
		const wrapper = mount(Accordion, { props: { items } })
		const button = wrapper.findAll('.sy-accordion-button')[0]!

		expect(button.classes()).not.toContain('sy-accordion-button--focused')

		await button.trigger('click')
		expect(button.classes()).toContain('sy-accordion-button--focused')
	})

	it('makes the content region focusable only once its panel is open', async () => {
		const wrapper = mount(Accordion, { props: { items } })

		let region = wrapper.findAll('[role="region"]')[0]!
		expect(region.attributes('tabindex')).toBe('-1')

		await wrapper.findAll('.sy-accordion-button')[0]!.trigger('click')

		region = wrapper.findAll('[role="region"]')[0]!
		expect(region.attributes('tabindex')).toBe('0')
	})
})
