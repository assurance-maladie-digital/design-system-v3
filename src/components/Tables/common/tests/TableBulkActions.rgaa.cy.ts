import TableBulkActions from '../TableBulkActions.vue'
describe('TableBulkActions – RGAA browser checks – CNAM theme', () => {
	it('7.5 and 8.2 – exposes a named region and live count', () => {
		cy.mountWithVuetify(TableBulkActions, { props: { count: 3 } })
		cy.get('[role="region"]').should('be.visible').and('have.attr', 'aria-label')
		cy.get('[aria-live="polite"]').should('contain.text', '3')
	})

	it('7.1 and 10.7 – exposes a focusable clear action', () => {
		cy.mountWithVuetify(TableBulkActions, { props: { count: 1 } })
		cy.get('button').should('be.visible').and('have.attr', 'aria-label')
		cy.get('button').focus()
		cy.focused().should('match', 'button')
	})
})
