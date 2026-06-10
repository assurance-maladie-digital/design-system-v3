import SyServerTable from '../SyServerTable.vue'

const defaultHeaders = [
	{ title: 'Nom', key: 'nom', sortable: true },
	{ title: 'Prénom', key: 'prenom', sortable: true },
	{ title: 'Ville', key: 'ville' },
]

const defaultItems = [
	{ nom: 'Dupont', prenom: 'Jean', ville: 'Paris' },
	{ nom: 'Martin', prenom: 'Marie', ville: 'Lyon' },
]

describe('SyServerTable - Visual regression tests', () => {
	it('displays the server table by default', () => {
		cy.mountWithVuetify(SyServerTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				serverItemsLength: 50,
				caption: 'Tableau serveur',
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-server-table-default', cy.get('.v-application'))
	})

	it('displays the server table in loading state', () => {
		cy.mountWithVuetify(SyServerTable, {
			props: {
				headers: defaultHeaders,
				items: undefined,
				serverItemsLength: 0,
				caption: 'Tableau chargement',
				loading: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-server-table-loading', cy.get('.v-application'))
	})

	it('displays the server table with selection', () => {
		cy.mountWithVuetify(SyServerTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				serverItemsLength: 2,
				caption: 'Tableau avec sélection',
				showSelect: true,
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-server-table-with-select', cy.get('.v-application'))
	})
})
