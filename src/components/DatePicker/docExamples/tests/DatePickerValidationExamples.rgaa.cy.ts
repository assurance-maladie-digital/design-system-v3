import Example from '../DatePickerValidationExamples.vue'
describe('DatePickerValidationExamples – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 11.1 – renders the validation examples with headings', () => {
		cy.mountWithVuetify(Example)
		cy.get('.date-picker-validation-examples').should('be.visible')
		cy.get('input').should('have.length.greaterThan', 1)
		cy.get('h1').should('contain.text', 'Exemples de validation du DatePicker')
	})
})
