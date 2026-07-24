import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyTable from '../SyTable.vue'

const headers = [
	{ title: 'Nom', key: 'nom', sortable: true },
	{ title: 'Prénom', key: 'prenom', sortable: true },
]
const items = [
	{ nom: 'Dupont', prenom: 'Jean' },
	{ nom: 'Martin', prenom: 'Marie' },
]

// jsdom ne calcule pas `:focus-visible` : on vérifie les prérequis structurels des rings DS
// des en-têtes (bouton de tri + poignée de redimensionnement clavier). Le rendu des anneaux
// est couvert par les tests visuels Cypress.
describe('SyTable - Focus', () => {
	it('renders the sortable header sort button as a real focusable button (has a DS ring)', () => {
		const wrapper = mount(SyTable, {
			props: { options: {} as never, suffix: 'focus-sort' },
			attrs: { items, headers },
		})
		const sortBtn = wrapper.find('.sort-button')

		expect(sortBtn.exists()).toBe(true)
		expect(sortBtn.element.tagName).toBe('BUTTON')
		expect(sortBtn.attributes('tabindex')).not.toBe('-1')
	})

	it('renders the keyboard column resizer as a focusable button when resizableColumns', () => {
		const wrapper = mount(SyTable, {
			props: { options: {} as never, suffix: 'focus-resize', resizableColumns: true },
			attrs: { items, headers },
		})
		const resizer = wrapper.find('.resizer')

		expect(resizer.exists()).toBe(true)
		expect(resizer.element.tagName).toBe('BUTTON')
		// tabindex 0 => atteignable au clavier, donc éligible au ring `:focus-visible` scopé.
		expect(resizer.attributes('tabindex')).toBe('0')
	})
})
