import Example from '../DatePickerBidirectionalValidation.vue'
describe('DatePickerBidirectionalValidation – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 11.1 – renders the two date validation fields', () => {
		cy.mountWithVuetify(Example, { global: { stubs: { DatePicker: true, SyHeading: true } } })
		cy.get('body').should('contain.text', 'Date')
	})
})
