import StatusPage from '../StatusPage.vue'

describe('StatusPage - Visual regression tests', () => {
	it('displays the status page with a title', () => {
		cy.mountWithVuetify(StatusPage, {
			props: { pageTitle: 'Erreur 404' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('status-page-default', cy.get('.v-application'))
	})

	it('displays the status page with all content', () => {
		cy.mountWithVuetify(StatusPage, {
			props: {
				pageTitle: 'Page introuvable',
				message: 'La page que vous recherchez n\'existe pas.',
				btnText: 'Retour à l\'accueil',
				btnHref: '/',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('status-page-full', cy.get('.v-application'))
	})

	it('displays the status page without button', () => {
		cy.mountWithVuetify(StatusPage, {
			props: {
				pageTitle: 'Erreur',
				hideBtn: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('status-page-no-btn', cy.get('.v-application'))
	})
})
