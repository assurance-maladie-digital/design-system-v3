import FilterSideBar from '../FilterSideBar.vue'

const defaultFilters = [
	{
		name: 'statut',
		title: 'Statut',
		value: ['actif'],
	},
	{
		name: 'type',
		title: 'Type',
		value: null,
	},
]

describe('FilterSideBar - Visual regression tests', () => {
	it('displays the sidebar filter button', () => {
		cy.mountWithVuetify(FilterSideBar, {
			props: { modelValue: defaultFilters },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('filter-sidebar-default', cy.get('.v-application'))
	})

	it('displays the sidebar filter in modale mode', () => {
		cy.mountWithVuetify(FilterSideBar, {
			props: {
				modelValue: defaultFilters,
				modale: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('filter-sidebar-modale', cy.get('.v-application'))
	})
})
