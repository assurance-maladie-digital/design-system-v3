import MaintenancePage from '../MaintenancePage.vue'

describe('MaintenancePage – RGAA browser checks – CNAM theme', () => {
	it('8.2 – exposes a page heading and readable maintenance message', () => {
		cy.mountWithVuetify(MaintenancePage, { props: { pageTitle: 'Site en maintenance', message: 'Réessayez plus tard.' } })
		cy.get('h1, h2, h3').should('exist').and('contain', 'maintenance')
		cy.get('.v-application').should('contain', 'Réessayez')
	})
})
