import HeaderBar from '../HeaderBar.vue'

describe('HeaderBar – RGAA browser checks – CNAM theme', () => {
	it('8.2 – exposes a service heading', () => {
		cy.mountWithVuetify(HeaderBar, { props: { serviceTitle: 'Mon service' } })
		cy.get('.header').should('be.visible').find('h1, h2, h3, h4, h5, h6').should('contain', 'Mon service')
	})
})
