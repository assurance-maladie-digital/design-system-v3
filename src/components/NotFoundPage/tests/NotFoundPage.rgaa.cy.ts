import NotFoundPage from '../NotFoundPage.vue'

describe('NotFoundPage – RGAA browser checks – CNAM theme', () => {
	it('8.2 – exposes one page heading and an optional recovery action', () => {
		cy.mountWithVuetify(NotFoundPage, { props: { btnText: 'Retour à l’accueil' } })
		cy.get('h1, h2, h3').should('exist')
		cy.get('a, button').contains('Retour').should('be.visible')
	})
})
