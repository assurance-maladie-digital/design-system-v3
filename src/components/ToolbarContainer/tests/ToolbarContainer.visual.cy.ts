import ToolbarContainer from '../ToolbarContainer.vue'
import { h } from 'vue'
import { VBtn } from 'vuetify/components'

describe('ToolbarContainer - Visual regression tests', () => {
	it('displays the toolbar container with buttons', () => {
		cy.mountWithVuetify(ToolbarContainer, {
			slots: {
				default: () => [
					h(VBtn, {}, () => 'Action 1'),
					h(VBtn, {}, () => 'Action 2'),
					h(VBtn, {}, () => 'Action 3'),
				],
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('toolbar-container-default', cy.get('.v-application'))
	})

	it('displays the toolbar container with links', () => {
		cy.mountWithVuetify(ToolbarContainer, {
			slots: {
				default: () => [
					h('a', { href: '#' }, 'Lien 1'),
					h('a', { href: '#' }, 'Lien 2'),
				],
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('toolbar-container-links', cy.get('.v-application'))
	})
})
