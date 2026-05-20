import DataListGroup from '../DataListGroup.vue'

const defaultItems = [
	{
		listTitle: 'Identité',
		items: [
			{ label: 'Nom', value: 'Dupont' },
			{ label: 'Prénom', value: 'Jean' },
		],
	},
	{
		listTitle: 'Contact',
		items: [
			{ label: 'Email', value: 'jean.dupont@example.com' },
			{ label: 'Téléphone', value: '0102030405' },
		],
	},
]

describe('DataListGroup - Visual regression tests', () => {
	it('displays the data list group by default', () => {
		cy.mountWithVuetify(DataListGroup, {
			props: { items: defaultItems },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-group-default', cy.get('.v-application'))
	})

	it('displays the data list group in loading state', () => {
		cy.mountWithVuetify(DataListGroup, {
			props: {
				items: defaultItems,
				loading: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-group-loading', cy.get('.v-application'))
	})
})
