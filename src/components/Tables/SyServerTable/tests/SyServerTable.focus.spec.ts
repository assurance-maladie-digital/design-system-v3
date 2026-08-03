import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyServerTable from '../SyServerTable.vue'

const headers = [
	{ title: 'Nom', key: 'nom', sortable: true },
	{ title: 'Prénom', key: 'prenom', sortable: true },
]
const items = [
	{ nom: 'Dupont', prenom: 'Jean' },
	{ nom: 'Martin', prenom: 'Marie' },
]

// SyServerTable délègue tout le focus à l'infra commune déjà migrée (TableHeader : bouton de
// tri + poignée de redimensionnement ; SyTablePagination ; OrganizeColumns ; SyCheckbox/
// SyTextField ; mixin clickable-row). On vérifie ici que sa surface focusable est bien exposée.
describe('SyServerTable - Focus', () => {
	it('renders the sortable header sort button as a real focusable button (DS ring via TableHeader)', () => {
		const wrapper = mount(SyServerTable, {
			props: { options: {} as never, serverItemsLength: 50, suffix: 'focus-sort' },
			attrs: { items, headers },
		})
		const sortBtn = wrapper.find('.sort-button')

		expect(sortBtn.exists()).toBe(true)
		expect(sortBtn.element.tagName).toBe('BUTTON')
		expect(sortBtn.attributes('tabindex')).not.toBe('-1')
	})

	it('renders the keyboard column resizer as a focusable button when resizableColumns', () => {
		const wrapper = mount(SyServerTable, {
			props: { options: {} as never, serverItemsLength: 50, suffix: 'focus-resize', resizableColumns: true },
			attrs: { items, headers },
		})
		const resizer = wrapper.find('.resizer')

		expect(resizer.exists()).toBe(true)
		expect(resizer.element.tagName).toBe('BUTTON')
		expect(resizer.attributes('tabindex')).toBe('0')
	})
})
