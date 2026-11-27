import HeaderMenuBtn from '../HeaderMenuBtn.vue'

describe('HeaderMenuBtn – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.9 and 11.9 – exposes a labelled focusable menu button', () => {
		cy.mountWithVuetify(HeaderMenuBtn)
		cy.get('button.header-menu-btn').should('be.visible').should('have.attr', 'aria-label')
		cy.get('button.header-menu-btn').should('have.attr', 'type', 'button').focus().should('have.focus')
	})
})
