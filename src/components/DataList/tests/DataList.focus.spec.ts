import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataList from '../DataList.vue'

const items = [
	{ key: 'Nom', value: 'Dupont' },
	{ key: 'Email', value: 'jean.dupont@example.com', action: 'Modifier' },
]

// DataList ne porte aucun style de focus propre : la seule cible focusable est le bouton d'action
// d'un item (rendu par DataListItem), un `.v-btn` standalone couvert par le ring global
// `_btns.scss`. Le rendu du ring est couvert par le visuel. On valide ici le contrat focusable.
describe('DataList - Focus', () => {
	it('renders a real focusable action button for items with an action', () => {
		const wrapper = mount(DataList, { props: { items } })
		const btn = wrapper.find('.sy-data-list-item-action-btn')

		expect(btn.exists()).toBe(true)
		expect(btn.element.tagName).toBe('BUTTON')
		expect(btn.attributes('tabindex')).not.toBe('-1')
	})

	it('renders no action button for items without an action', () => {
		const wrapper = mount(DataList, {
			props: { items: [{ key: 'Nom', value: 'Dupont' }] },
		})

		expect(wrapper.find('.sy-data-list-item-action-btn').exists()).toBe(false)
	})
})
