import StatusPage from '../StatusPage.vue'

describe('StatusPage – RGAA browser checks – CNAM theme', () => {
	it('9.1 and 11.9 – exposes a visible heading and keyboard reachable action', () => {
		cy.mountWithVuetify(StatusPage, { props: { pageTitle: 'Erreur', message: 'Une erreur est survenue.', btnText: 'Retour', btnHref: '/' } })
		cy.get('h1').should('be.visible').and('contain', 'Erreur')
		cy.contains('a,button', 'Retour').should('be.visible').focus().should('have.focus')
	})
})
