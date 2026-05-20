import FilterInline from '../FilterInline.vue'

const defaultFilters = [
	{
		name: 'statut',
		label: 'Statut',
		choices: [
			{ label: 'Actif', value: 'actif' },
			{ label: 'Inactif', value: 'inactif' },
		],
	},
	{
		name: 'type',
		label: 'Type',
		choices: [
			{ label: 'Type A', value: 'a' },
			{ label: 'Type B', value: 'b' },
		],
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
