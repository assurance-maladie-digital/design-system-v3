import PaginatedTable from '../PaginatedTable.vue'

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
})
