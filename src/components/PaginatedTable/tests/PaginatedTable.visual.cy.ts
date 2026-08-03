import PaginatedTable from '../PaginatedTable.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

const defaultHeaders = [
	{ title: 'Nom', key: 'nom' },
	{ title: 'Prénom', key: 'prenom' },
	{ title: 'Date', key: 'date' },
]

const defaultItems = [
	{ nom: 'Dupont', prenom: 'Jean', date: '01/01/1990' },
	{ nom: 'Martin', prenom: 'Marie', date: '15/06/1985' },
]

describe('PaginatedTable - Visual regression tests', () => {
	it('displays the paginated table by default', () => {
		cy.mountWithVuetify(PaginatedTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				caption: 'Tableau de données',
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('paginated-table-default', cy.get('.v-application'))
	})

	it('displays the paginated table with server items', () => {
		cy.mountWithVuetify(PaginatedTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				serverItemsLength: 50,
				caption: 'Tableau serveur',
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('paginated-table-server', cy.get('.v-application'))
	})

	// En-tête de colonne triable (`<th>` focusable) : ring DS primary inset.
	it('shows the DS ring on a focused sortable column header', () => {
		cy.mountWithVuetify(PaginatedTable, {
			props: { headers: defaultHeaders, items: defaultItems, caption: 'Table' },
		})

		cy.get('.v-table thead th').first().should('have.attr', 'tabindex', '0')
		focusVisible('.v-table thead th')
		cy.wait(150)
		cy.matchImageSnapshot('paginated-table-header-focus', cy.get('.v-application'))
	})

	// Bouton de pagination (`.v-pagination`) : ring DS primary inset (token réparé).
	it('shows the DS ring on a focused pagination button', () => {
		cy.mountWithVuetify(PaginatedTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				serverItemsLength: 50,
				caption: 'Tableau serveur',
			},
		})

		cy.get('.v-pagination button[aria-disabled="false"]').first().should('be.visible')
		focusVisible('.v-pagination button[aria-disabled="false"]')
		cy.wait(150)
		cy.matchImageSnapshot('paginated-table-pagination-focus', cy.get('.v-application'))
	})
})
