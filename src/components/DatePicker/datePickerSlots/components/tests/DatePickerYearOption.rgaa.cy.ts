import DatePickerYearOption from '../../components/DatePickerYearOption.vue'
describe('DatePickerYearOption – RGAA browser contract – CNAM theme', () => {
	it('8.9 – exposes the year label', () => {
		cy.mountWithVuetify(DatePickerYearOption, { props: { slotProps: { year: { text: '2026', value: 2026 }, i: 0, props: { active: true } } } })
		cy.get('[role="gridcell"]').should('have.attr', 'aria-label', '2026')
	})
})
