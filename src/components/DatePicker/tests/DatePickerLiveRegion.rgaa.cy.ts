import DatePickerLiveRegion from '../DatePickerLiveRegion.vue'
describe('DatePickerLiveRegion – RGAA browser contract – CNAM theme', () => {
	it('7.5 – exposes the live announcement', () => {
		cy.mountWithVuetify(DatePickerLiveRegion, { props: { text: 'Mars 2026' } })
		cy.get('[aria-live="polite"]').should('have.attr', 'aria-atomic', 'false').and('contain.text', 'Mars 2026')
	})
})
