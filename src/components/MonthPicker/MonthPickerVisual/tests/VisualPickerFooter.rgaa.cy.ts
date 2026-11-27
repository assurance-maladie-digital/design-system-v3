import VisualPickerFooter from '../VisualPickerFooter.vue'
describe('VisualPickerFooter – RGAA browser contract – CNAM theme', () => {
	it('7.1 and 8.2 – exposes the current-month action', () => {
		cy.mountWithVuetify(VisualPickerFooter)
		cy.get('button').should('be.visible').and('have.attr', 'aria-label').and('contain', 'mois')
	})
})
