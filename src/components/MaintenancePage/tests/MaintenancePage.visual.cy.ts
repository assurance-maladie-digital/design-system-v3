import MaintenancePage from '../MaintenancePage.vue'

describe('MaintenancePage - Visual regression tests', () => {
	// Viewport 960px : plancher desktop (sous smAndDown l'espacement et la
	// largeur maximale du conteneur changent).
	beforeEach(() => {
		cy.viewport(960, 600)
	})

	it('displays the maintenance page by default', () => {
		cy.mountWithVuetify(MaintenancePage)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('maintenance-page-default', cy.get('.vd-page-container'))
	})

	it('displays the maintenance page with custom content', () => {
		cy.mountWithVuetify(MaintenancePage, {
			props: {
				pageTitle: 'Site en maintenance',
				message: 'Nous effectuons des travaux de maintenance. Merci de réessayer plus tard.',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('maintenance-page-custom', cy.get('.vd-page-container'))
	})
})
