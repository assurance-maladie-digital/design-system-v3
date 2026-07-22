import SearchListField from '../SearchListField.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

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

	// Ring DS de ligne : `.label:has(:focus-visible)` (2px primary, offset inset -2px) quand la
	// case d'une ligne reçoit le focus clavier. Le ring propre de SyCheckbox est neutralisé.
	it('shows the DS ring on the row of a focused checkbox', () => {
		cy.mountWithVuetify(SearchListField, {
			props: {
				label: 'Rechercher',
				items: defaultItems,
			},
		})

		focusVisible('[data-test-id="suggestions-list"] li:first-child input[type="checkbox"]')
		cy.wait(150)
		cy.matchImageSnapshot('search-list-field-row-focus', cy.get('.sy-search-list'))
	})
})
