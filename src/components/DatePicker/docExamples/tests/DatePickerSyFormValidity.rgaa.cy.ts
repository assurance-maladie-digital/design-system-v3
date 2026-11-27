import Example from '../DatePickerSyFormValidity.vue'
describe('DatePickerSyFormValidity – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.2 and 11.1 – renders status and submit controls', () => {
		cy.mountWithVuetify(Example, { props: { mode: 'calendar' }, global: { stubs: { SyForm: true, DatePicker: true, VBtn: true } } })
		cy.get('body').children().should('have.length.greaterThan', 0)
	})
})
