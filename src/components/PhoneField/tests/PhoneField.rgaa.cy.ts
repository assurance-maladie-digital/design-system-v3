import PhoneField from '../PhoneField.vue'

describe('PhoneField – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 10.1 – exposes a labelled telephone input', () => {
		cy.mountWithVuetify(PhoneField)
		cy.get('input').should('be.visible').and('have.attr', 'type', 'tel')
	})
})
