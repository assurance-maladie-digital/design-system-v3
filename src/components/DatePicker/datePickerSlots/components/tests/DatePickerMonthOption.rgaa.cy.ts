import DatePickerMonthOption from '../../components/DatePickerMonthOption.vue'
describe('DatePickerMonthOption – RGAA browser contract – CNAM theme', () => {
	it('8.9 – exposes the month label', () => {
		cy.mountWithVuetify(DatePickerMonthOption, { props: { slotProps: { month: { text: 'Mars', label: 'Mars', value: 3 }, i: 0, props: {} } } })
		cy.get('[role="gridcell"]').should('have.attr', 'aria-label', 'Mars')
	})
})
