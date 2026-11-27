import { h } from 'vue'
import { VBtn } from 'vuetify/components'
import ToolbarContainer from '../ToolbarContainer.vue'

describe('ToolbarContainer – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 12.9 – exposes a labelled toolbar with keyboard controls', () => {
		cy.mountWithVuetify(ToolbarContainer, { props: { ariaLabel: 'Outils' }, slots: { default: () => h(VBtn, {}, () => 'Action') } })
		cy.get('[role="toolbar"]').should('have.attr', 'aria-label', 'Outils').find('button').should('be.visible')
	})
})
