import SearchListField from '../SearchListField.vue'

const defaultItems = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
	{ label: 'Option D', value: 'd' },
]

describe('SearchListField - Visual regression tests', () => {
	it('displays the search list field by default', () => {
		cy.mountWithVuetify(SearchListField, {
			props: {
				label: 'Rechercher',
				items: defaultItems,
			},
		})

		cy.get('.sy-search-list').should('be.visible')
		cy.matchImageSnapshot('search-list-field-default', cy.get('.sy-search-list'))
	})

	it('displays the search list field with selected items', () => {
		cy.mountWithVuetify(SearchListField, {
			props: {
				label: 'Rechercher',
				items: defaultItems,
				modelValue: ['a', 'c'],
			},
		})

		cy.get('.sy-search-list').should('be.visible')
		cy.matchImageSnapshot('search-list-field-with-selection', cy.get('.sy-search-list'))
	})
})
