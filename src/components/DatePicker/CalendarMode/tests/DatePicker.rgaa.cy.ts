import DatePicker from '../DatePicker.vue'
describe('DatePicker CalendarMode – RGAA browser checks – CNAM theme', () => {
	it('11.1 and 13.3 – renders the named date field', () => {
		cy.mountWithVuetify(DatePicker, { props: { label: 'Date de rendez-vous', format: 'DD/MM/YYYY', modelValue: null, noCalendar: true } })
		cy.get('input').should('have.attr', 'aria-label').and('contain', 'Date de rendez-vous')
		cy.get('input').should('have.attr', 'aria-describedby')
	})
})
