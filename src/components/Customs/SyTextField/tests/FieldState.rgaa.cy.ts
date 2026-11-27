import FieldState from '../FieldState.vue'

describe('FieldState – RGAA browser checks – CNAM theme', () => {
	it('1.2 – validation icon remains decorative', () => {
		cy.mountWithVuetify(FieldState, { props: { state: 'error' } })
		cy.get('.field-state-icon').should('exist').and('have.attr', 'aria-hidden', 'true')
	})
})
