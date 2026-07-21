import FilterInline from '../FilterInline.vue'

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

describe('FilterInline - Visual regression tests', () => {
	it('displays the inline filters', () => {
		cy.mountWithVuetify(FilterInline, {
			props: { modelValue: defaultFilters },
		})

		cy.get('.sy-filters-inline').should('be.visible')
		cy.matchImageSnapshot('filter-inline-default', cy.get('.sy-filters-inline'))
	})

	// Déclencheur de filtre (`.v-btn` pill) : ring primary via l'override global `_btns.scss`.
	it('shows the global ring on a focused filter trigger', () => {
		cy.mountWithVuetify(FilterInline, {
			props: { modelValue: defaultFilters },
		})

		focusVisible('.sy-filter-statut')
		cy.wait(150)
		cy.matchImageSnapshot('filter-inline-trigger-focus', cy.get('.sy-filters-inline'))
	})
})
