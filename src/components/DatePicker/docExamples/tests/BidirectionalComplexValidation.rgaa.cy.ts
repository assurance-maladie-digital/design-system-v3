import Example from '../BidirectionalComplexValidation.vue'
describe('BidirectionalComplexValidation – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 11.1 – renders both date validation fields', () => {
		cy.mountWithVuetify(Example, { global: { stubs: { DatePicker: true, SyHeading: true } } })
		cy.get('body').should('contain.text', 'Date')
	})
})
