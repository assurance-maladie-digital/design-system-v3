import OrganizeColumns from '../OrganizeColumns.vue'
describe('OrganizeColumns – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 8.2 – exposes a visible dialog trigger', () => {
		cy.mountWithVuetify(OrganizeColumns, { props: { headers: [{ key: 'name', title: 'Nom', hidden: false, order: 1 }] } })
		cy.get('button').first().should('be.visible').and('have.attr', 'aria-haspopup', 'dialog').click()
		cy.get('[role="dialog"]').should('be.visible')
	})
})
