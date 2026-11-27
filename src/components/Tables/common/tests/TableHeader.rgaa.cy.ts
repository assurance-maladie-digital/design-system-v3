import TableHeader from '../TableHeader.vue'

const column = { title: 'Nom', key: 'name', value: 'name', sortable: true }
const headerParams = {
	sortBy: [], getSortIcon: () => 'mdi-arrow-up', toggleSort: () => {},
	columns: [column], headers: [], someSelected: false, allSelected: false,
	selectAll: () => {}, isSorted: () => false,
}

describe('TableHeader – RGAA browser checks – CNAM theme', () => {
	it('8.9 – sorts from a keyboard-focusable button', () => {
		cy.mountWithVuetify(TableHeader, {
			props: { column, headerParams, table: { $el: { offsetWidth: 800 } }, resizableColumns: false },
		})
		cy.get('button.sort-button').should('be.visible').and('have.attr', 'aria-label').and('contain', 'Nom')
		cy.get('button.sort-button').focus()
		cy.focused().should('have.class', 'sort-button')
	})

	it('7.1 and 12.6 – exposes a labelled vertical resizer', () => {
		cy.mountWithVuetify(TableHeader, {
			props: {
				column,
				headerParams: { ...headerParams, columns: [column, { title: 'Prénom', key: 'firstName', sortable: false }] },
				table: { $el: { offsetWidth: 800 } },
				resizableColumns: true,
				announceWidth: true,
			},
		})
		cy.get('button.resizer').should('be.visible').and('have.attr', 'role', 'separator').and('have.attr', 'aria-orientation', 'vertical')
		cy.get('button.resizer').focus()
		cy.focused().should('have.attr', 'aria-label').and('contain', 'Nom')
	})
})
