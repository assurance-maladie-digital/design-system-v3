import Example from '../DatePickerBidirectionalValidation.vue'
describe('DatePickerBidirectionalValidation – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 11.1 – renders the two date validation fields', () => {
		cy.mountWithVuetify(Example)
		cy.get('input').should('have.length', 2)
		cy.get('input').first().should('have.attr', 'aria-label').and('contain', 'Date')
	})
})
