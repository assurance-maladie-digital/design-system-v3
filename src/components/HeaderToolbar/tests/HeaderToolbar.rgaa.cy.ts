import HeaderToolbar from '../HeaderToolbar.vue'

describe('HeaderToolbar – RGAA browser checks – CNAM theme', () => {
	it('9.2 and 12.9 – renders navigation controls', () => {
		cy.mountWithVuetify(HeaderToolbar)
		cy.get('.v-application').should('be.visible').find('a, button').should('have.length.greaterThan', 0)
	})
})
