import ErrorPage from '../ErrorPage.vue'

describe('ErrorPage - Visual regression tests', () => {
	it('displays the error page by default', () => {
		cy.mountWithVuetify(ErrorPage)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('error-page-default', cy.get('.v-application'))
	})

	it('displays the error page with custom message', () => {
		cy.mountWithVuetify(ErrorPage, {
			props: {
				pageTitle: 'Erreur technique',
				message: 'Une erreur inattendue s\'est produite.',
				code: '500',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('error-page-custom', cy.get('.v-application'))
	})

	it('displays the error page without button', () => {
		cy.mountWithVuetify(ErrorPage, {
			props: { hideBtn: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('error-page-no-btn', cy.get('.v-application'))
	})
})
