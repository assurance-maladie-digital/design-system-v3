import FilterSideBar from '../FilterSideBar.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

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

		cy.get('.sy-filters-side-bar').should('be.visible')
		cy.matchImageSnapshot('filter-sidebar-default', cy.get('.sy-filters-side-bar'))
	})

	it('displays the sidebar filter in modale mode', () => {
		cy.mountWithVuetify(FilterSideBar, {
			props: {
				modelValue: defaultFilters,
				modale: true,
			},
		})

		cy.get('.sy-filters-side-bar').should('be.visible')
		cy.matchImageSnapshot('filter-sidebar-modale', cy.get('.sy-filters-side-bar'))
	})

	// Bouton d'ouverture (`.v-btn`) : ring DS primary scopé (2px, offset 2px), overlay masqué.
	it('shows the DS ring on the focused toggle button', () => {
		cy.mountWithVuetify(FilterSideBar, {
			props: { modelValue: defaultFilters },
		})

		focusVisible('.sy-filters-side-bar__open-btn')
		cy.wait(150)
		cy.matchImageSnapshot('filter-sidebar-toggle-focus', cy.get('.sy-filters-side-bar'))
	})
})
