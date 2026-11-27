import HeaderLogo from '../HeaderLogo.vue'

describe('HeaderLogo – RGAA browser checks – CNAM theme', () => {
	it('1.2 and 11.1 – exposes a visible logo with alternative text and a focusable home link', () => {
		cy.mountWithVuetify(HeaderLogo, { props: { logoAlt: 'Assurance Maladie' } })
		cy.get('img.logo-image').should('be.visible').and('have.attr', 'alt', 'Assurance Maladie')
		cy.get('a.logo').focus().should('have.focus')
	})
})
