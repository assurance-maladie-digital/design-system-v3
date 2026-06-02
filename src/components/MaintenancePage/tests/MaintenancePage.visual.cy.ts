import MaintenancePage from '../MaintenancePage.vue'

describe('MaintenancePage - Visual regression tests', () => {
	it('displays the maintenance page by default', () => {
		cy.mountWithVuetify(MaintenancePage)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('maintenance-page-default', cy.get('.v-application'))
	})

	it('displays the maintenance page with custom content', () => {
		cy.mountWithVuetify(MaintenancePage, {
			props: {
				pageTitle: 'Site en maintenance',
				message: 'Nous effectuons des travaux de maintenance. Merci de réessayer plus tard.',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('maintenance-page-custom', cy.get('.v-application'))
	})
})
