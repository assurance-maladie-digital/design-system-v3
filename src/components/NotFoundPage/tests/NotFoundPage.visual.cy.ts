import NotFoundPage from '../NotFoundPage.vue'

describe('NotFoundPage - Visual regression tests', () => {
	it('displays the not found page by default', () => {
		cy.mountWithVuetify(NotFoundPage)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('not-found-page-default', cy.get('.v-application'))
	})

	it('displays the not found page without button', () => {
		cy.mountWithVuetify(NotFoundPage, {
			props: { hideBtn: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('not-found-page-no-btn', cy.get('.v-application'))
	})

	it('displays the not found page with custom button text', () => {
		cy.mountWithVuetify(NotFoundPage, {
			props: { btnText: 'Retour à l\'accueil' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('not-found-page-custom-btn', cy.get('.v-application'))
	})
})
