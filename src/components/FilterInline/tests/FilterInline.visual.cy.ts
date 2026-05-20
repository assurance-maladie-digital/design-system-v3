import FilterInline from '../FilterInline.vue'

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

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('filter-inline-default', cy.get('.v-application'))
	})
})
