import SyTable from '../SyTable.vue'

const defaultHeaders = [
	{ title: 'Nom', key: 'nom', sortable: true },
	{ title: 'Prénom', key: 'prenom', sortable: true },
	{ title: 'Ville', key: 'ville' },
]

const defaultItems = [
	{ nom: 'Dupont', prenom: 'Jean', ville: 'Paris' },
	{ nom: 'Martin', prenom: 'Marie', ville: 'Lyon' },
	{ nom: 'Bernard', prenom: 'Pierre', ville: 'Marseille' },
]

describe('SyTable - Visual regression tests', () => {
	it('displays the table by default', () => {
		cy.mountWithVuetify(SyTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				caption: 'Tableau de données',
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-table-default', cy.get('.v-application'))
	})

	it('displays the table with striped rows', () => {
		cy.mountWithVuetify(SyTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				caption: 'Tableau rayé',
				striped: true,
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-table-striped', cy.get('.v-application'))
	})

	it('displays the table with selection checkboxes', () => {
		cy.mountWithVuetify(SyTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				caption: 'Tableau avec sélection',
				showSelect: true,
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-table-with-select', cy.get('.v-application'))
	})

	it('displays the table with compact density', () => {
		cy.mountWithVuetify(SyTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				caption: 'Tableau compact',
				density: 'compact',
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-table-compact', cy.get('.v-application'))
	})
})
