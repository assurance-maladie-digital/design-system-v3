import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataListGroup from '../DataListGroup.vue'

const items = [
	{
		title: 'Identité',
		items: [{ key: 'Nom', value: 'Dupont' }],
	},
	{
		title: 'Contact',
		items: [{ key: 'Email', value: 'jean.dupont@example.com', action: 'Modifier' }],
	},
]

// DataListGroup est un pur conteneur (liste de DataList) : aucun style de focus propre. Les seules
// cibles focusables sont les boutons d'action des items, des `.v-btn` standalone couverts par le
// ring global `_btns.scss`. Le rendu est couvert par le visuel ; on valide ici le contrat focusable.
describe('DataListGroup - Focus', () => {
	it('renders a real focusable action button for items with an action', () => {
		const wrapper = mount(DataListGroup, { props: { items } })
		const buttons = wrapper.findAll('.sy-data-list-item-action-btn')

		expect(buttons.length).toBe(1)
		expect(buttons[0]!.element.tagName).toBe('BUTTON')
		expect(buttons[0]!.attributes('tabindex')).not.toBe('-1')
	})
})
