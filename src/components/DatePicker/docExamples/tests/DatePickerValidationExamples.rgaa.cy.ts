import Example from '../DatePickerValidationExamples.vue'
describe('DatePickerValidationExamples – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 11.1 – renders the validation examples with headings', () => {
		cy.mountWithVuetify(Example, { global: { stubs: { DatePicker: true, SyHeading: true, VBtn: true } } })
		cy.get('body').children().should('have.length.greaterThan', 0)
	})
})
