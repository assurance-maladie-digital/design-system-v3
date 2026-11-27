import NirField from '../NirField.vue'

describe('NirField – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 10.1 – exposes a labelled input', () => {
		cy.mountWithVuetify(NirField)
		cy.get('input').should('be.visible').and('have.attr', 'aria-label')
	})
})
