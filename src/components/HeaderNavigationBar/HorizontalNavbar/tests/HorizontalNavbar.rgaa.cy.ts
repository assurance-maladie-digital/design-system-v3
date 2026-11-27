import HorizontalNavbar from '../HorizontalNavbar.vue'

describe('HorizontalNavbar – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 12.1 – renders the navigation items as keyboard links', () => {
		cy.mountWithVuetify(HorizontalNavbar, {
			props: { items: [{ label: 'Accueil', href: '/' }, { label: 'Contact', href: '/contact' }] },
		})

		cy.get('.horizontal-menu').should('be.visible')
		cy.get('a').should('have.length.at.least', 2)
		cy.get('a').first().focus().should('be.focused')
	})
})
