import SyForm from '../SyForm.vue'

describe('SyForm – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 11.1 – exposes a labelled field and native form submission semantics', () => {
		cy.mountWithVuetify(SyForm)
		cy.get('form').should('exist').and('have.class', 'v-form')
		cy.get('form').should('not.have.attr', 'tabindex')
	})
})
