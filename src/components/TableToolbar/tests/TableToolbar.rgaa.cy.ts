import TableToolbar from '../TableToolbar.vue'

describe('TableToolbar – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 11.1 – exposes labelled search and add controls', () => {
		cy.mountWithVuetify(TableToolbar, {
			props: { nbTotal: 12, searchLabel: 'Rechercher dans les bénéficiaires', showAddButton: true, addButtonLabel: 'Ajouter' },
		})
		cy.get('[data-test-id="search-input"]').should('be.visible').and('contain.text', 'Rechercher dans les bénéficiaires')
		cy.get('button[data-test-id="add-btn"]').should('be.visible').and('contain.text', 'Ajouter').focus()
		cy.focused().should('have.attr', 'data-test-id', 'add-btn')
	})

	it('7.1 – loading state disables the controls', () => {
		cy.mountWithVuetify(TableToolbar, { props: { showAddButton: true, loading: true } })
		cy.get('input').should('be.disabled')
		cy.get('button[data-test-id="add-btn"]').should('be.disabled')
	})
})
