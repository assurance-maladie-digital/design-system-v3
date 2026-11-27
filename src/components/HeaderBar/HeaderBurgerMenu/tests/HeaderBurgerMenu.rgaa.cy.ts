import HeaderBurgerMenu from '../HeaderBurgerMenu.vue'

describe('HeaderBurgerMenu – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 9.2 – exposes modal navigation when opened', () => {
		cy.mountWithVuetify(HeaderBurgerMenu, { props: { modelValue: true } })
		cy.get('[role="dialog"]').should('be.visible').and('have.attr', 'aria-modal', 'true')
		cy.get('[role="navigation"]').should('have.attr', 'aria-label')
	})
})
