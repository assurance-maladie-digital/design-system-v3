import DatePickerControls from '../../components/DatePickerControls.vue'
const slotProps = { viewMode: 'month' as const, monthYearText: 'Mars 2026', monthText: 'Mars', yearText: '2026', disabled: [], openMonths: () => {}, openYears: () => {}, prevMonth: () => {}, nextMonth: () => {}, prevYear: () => {}, nextYear: () => {} }
describe('DatePickerControls – RGAA browser contract – CNAM theme', () => {
	it('7.1 and 8.2 – exposes labelled navigation controls', () => {
		cy.mountWithVuetify(DatePickerControls, { props: { slotProps, displayedMonth: 2, displayedYear: 2026 } })
		cy.get('[data-testid="prev-month"]').should('be.visible').and('have.attr', 'aria-label')
		cy.get('[data-testid="next-month"]').should('be.visible').and('have.attr', 'aria-label')
	})
})
