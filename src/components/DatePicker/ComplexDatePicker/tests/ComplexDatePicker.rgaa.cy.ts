import ComplexDatePicker from '../ComplexDatePicker.vue'
describe('ComplexDatePicker – RGAA browser checks – CNAM theme', () => {
	it('7.1, 11.1 and 13.3 – exposes a keyboard-operable combobox', () => {
		cy.mountWithVuetify(ComplexDatePicker, { props: { label: 'Date', format: 'DD/MM/YYYY' } })
		cy.get('input[role="combobox"]').should('have.attr', 'aria-haspopup', 'dialog').focus().should('be.focused')
	})
})
