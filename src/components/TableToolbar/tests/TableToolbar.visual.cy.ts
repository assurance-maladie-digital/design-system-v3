import TableToolbar from '../TableToolbar.vue'

describe('TableToolbar - Visual regression tests', () => {
	it('displays the table toolbar by default', () => {
		cy.mountWithVuetify(TableToolbar, {
			props: { nbTotal: 42 },
		})

		cy.get('.sy-table-toolbar').should('be.visible')
		cy.matchImageSnapshot('table-toolbar-default', cy.get('.sy-table-toolbar'))
	})

	it('displays the table toolbar with filtered count', () => {
		cy.mountWithVuetify(TableToolbar, {
			props: {
				nbTotal: 42,
				nbFiltered: 10,
			},
		})

		cy.get('.sy-table-toolbar').should('be.visible')
		cy.matchImageSnapshot('table-toolbar-filtered', cy.get('.sy-table-toolbar'))
	})

	it('displays the table toolbar with add button', () => {
		cy.mountWithVuetify(TableToolbar, {
			props: {
				nbTotal: 42,
				showAddButton: true,
				addButtonLabel: 'Ajouter',
			},
		})

		cy.get('.sy-table-toolbar').should('be.visible')
		cy.matchImageSnapshot('table-toolbar-with-add-btn', cy.get('.sy-table-toolbar'))
	})

	it('displays the table toolbar in loading state', () => {
		cy.mountWithVuetify(TableToolbar, {
			props: {
				nbTotal: 42,
				loading: true,
			},
		})

		cy.get('.sy-table-toolbar').should('be.visible')
		cy.matchImageSnapshot('table-toolbar-loading', cy.get('.sy-table-toolbar'))
	})
})
