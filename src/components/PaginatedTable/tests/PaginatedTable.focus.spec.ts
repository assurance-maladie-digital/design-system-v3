import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import PaginatedTable from '../PaginatedTable.vue'

const headers = [
	{ title: 'Nom', key: 'nom' },
	{ title: 'Prénom', key: 'prenom' },
]
const items = [
	{ nom: 'Dupont', prenom: 'Jean' },
	{ nom: 'Martin', prenom: 'Marie' },
]

// jsdom ne calcule pas `:focus-visible` : on vérifie ici le prérequis structurel du ring DS
// ajouté sur les en-têtes (les `<th>` sont rendus focusables au clavier pour le tri). Le rendu
// du ring `th:focus-visible` est couvert par le test visuel Cypress.
describe('PaginatedTable - Focus', () => {
	it('makes column headers keyboard-focusable (tabindex 0) for sorting', async () => {
		const wrapper = mount(PaginatedTable, {
			props: { headers, items, caption: 'Table' },
			attachTo: document.body,
		})
		await nextTick()
		await flushPromises()

		const ths = wrapper.findAll('th')
		expect(ths.length).toBeGreaterThan(0)
		// tabindex 0 posé en onMounted => atteignable au clavier, donc éligible au ring scopé.
		ths.forEach((th) => {
			expect(th.attributes('tabindex')).toBe('0')
		})

		wrapper.unmount()
	})
})
