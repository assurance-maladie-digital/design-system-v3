import PageContainer from '../PageContainer.vue'
import { h } from 'vue'

describe('PageContainer - Visual regression tests', () => {
	it('displays the page container by default', () => {
		cy.mountWithVuetify(PageContainer, {
			slots: { default: () => h('p', 'Contenu de la page') },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('page-container-default', cy.get('.v-application'))
	})

	it('displays the page container with md size', () => {
		cy.mountWithVuetify(PageContainer, {
			props: { size: 'md' },
			slots: { default: () => h('p', 'Contenu de la page') },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('page-container-md', cy.get('.v-application'))
	})

	it('displays the page container with background color', () => {
		cy.mountWithVuetify(PageContainer, {
			props: { color: 'blue-lighten-5' },
			slots: { default: () => h('p', 'Contenu de la page') },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('page-container-color', cy.get('.v-application'))
	})
})
