import FilterSideBar from '../FilterSideBar.vue'

const defaultFilters = [
	{
		name: 'statut',
		label: 'Statut',
		choices: [
			{ label: 'Actif', value: 'actif' },
			{ label: 'Inactif', value: 'inactif' },
		],
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
