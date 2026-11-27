import HeaderNavigationBar from '../HeaderNavigationBar.vue'

describe('HeaderNavigationBar – RGAA browser checks – CNAM theme', () => {
	it('9.2 – exposes a labelled navigation landmark and links', () => {
		cy.mountWithVuetify(HeaderNavigationBar, { props: { serviceTitle: 'Ameli', items: [{ label: 'Accueil', href: '/' }] } })
		cy.get('nav').should('be.visible').find('a').should('have.length.greaterThan', 0)
	})
})
