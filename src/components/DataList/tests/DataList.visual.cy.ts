import DataList from '../DataList.vue'

const defaultItems = [
	{ label: 'Nom', value: 'Dupont' },
	{ label: 'Prénom', value: 'Jean' },
	{ label: 'Date de naissance', value: '01/01/1980' },
]

describe('DataList - Visual regression tests', () => {
	it('displays the data list by default', () => {
		cy.mountWithVuetify(DataList, {
			props: { items: defaultItems },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-default', cy.get('.v-application'))
	})

	it('displays the data list with a title', () => {
		cy.mountWithVuetify(DataList, {
			props: {
				items: defaultItems,
				listTitle: 'Informations personnelles',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-with-title', cy.get('.v-application'))
	})

	it('displays the data list in loading state', () => {
		cy.mountWithVuetify(DataList, {
			props: {
				items: defaultItems,
				loading: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-loading', cy.get('.v-application'))
	})

	it('displays the data list in row layout', () => {
		cy.mountWithVuetify(DataList, {
			props: {
				items: defaultItems,
				row: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-row', cy.get('.v-application'))
	})
})
