import DatePickerDay from '../../components/DatePickerDay.vue'
const item = { date: new Date(2026, 2, 15), isAdjacent: false, isHidden: false, isSelected: true, isWeekEnd: false, isWeekStart: false, isToday: false, isDisabled: false, isoDate: '2026-03-15', localized: '15' }
describe('DatePickerDay – RGAA browser contract – CNAM theme', () => {
	it('8.9 – preserves the date accessible name', () => {
		cy.mountWithVuetify(DatePickerDay, { props: { slotProps: { props: { 'aria-label': '15 mars 2026' }, item, i: 0 }, displayHolidayDays: false } })
		cy.get('button').should('have.attr', 'aria-label', '15 mars 2026')
	})
})
