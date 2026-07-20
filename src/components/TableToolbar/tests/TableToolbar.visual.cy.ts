import TableToolbar from '../TableToolbar.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

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

	// Champ de recherche (VTextField color="primary") : bordure primary au focus.
	it('shows the primary field border on the focused search input', () => {
		cy.mountWithVuetify(TableToolbar, {
			props: { nbTotal: 42 },
		})

		focusVisible('[data-test-id="search-input"] input')
		cy.wait(150)
		cy.matchImageSnapshot('table-toolbar-search-focus', cy.get('.sy-table-toolbar'))
	})

	// Bouton « ajouter » (`.v-btn`) : ring primary via l'override global `_btns.scss`.
	it('shows the global ring on the focused add button', () => {
		cy.mountWithVuetify(TableToolbar, {
			props: { nbTotal: 42, showAddButton: true },
		})

		focusVisible('[data-test-id="add-btn"]')
		cy.wait(150)
		cy.matchImageSnapshot('table-toolbar-add-focus', cy.get('.sy-table-toolbar'))
	})
})
