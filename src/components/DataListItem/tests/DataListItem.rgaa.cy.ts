import { defineComponent, h } from 'vue'
import { mdiAccount } from '@mdi/js'
import DataListItem from '../DataListItem.vue'

const mountDataListItem = (props: Record<string, unknown>) => cy.mountWithVuetify(defineComponent({
	setup: () => () => h('dl', [h(DataListItem, props)]),
}))

describe('DataListItem – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 9.3 – exposes the label and value with description-list semantics', () => {
		mountDataListItem({ label: 'Nom', value: 'Dupont' })
		cy.get('dt').should('contain.text', 'Nom')
		cy.get('dd').should('contain.text', 'Dupont')
	})

	it('1.2 – keeps the optional icon decorative', () => {
		mountDataListItem({ label: 'Nom', value: 'Dupont', icon: mdiAccount })
		cy.get('.sy-data-list-item-label .v-icon').should('have.attr', 'aria-hidden', 'true')
	})

	it('7.1, 7.3 and 10.7 – exposes a keyboard reachable action', () => {
		mountDataListItem({ label: 'Nom', value: 'Dupont', action: 'Modifier le nom' })
		cy.get('.sy-data-list-item-action-btn').should('be.visible').focus().should('be.focused')
	})
})
