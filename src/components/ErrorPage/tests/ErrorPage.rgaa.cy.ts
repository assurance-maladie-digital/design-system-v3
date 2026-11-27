import ErrorPage from '../ErrorPage.vue'

describe('ErrorPage – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 13.3 – exposes a page heading and an actionable link', () => {
		cy.mountWithVuetify(ErrorPage, { props: { btnText: 'Retour', btnHref: '/accueil' } })
		cy.get('h1, h2, h3').should('exist')
		cy.get('a, button').contains('Retour').should('be.visible')
	})
})
