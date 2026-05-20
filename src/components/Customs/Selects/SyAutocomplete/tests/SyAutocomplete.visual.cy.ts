import SyAutocomplete from '../SyAutocomplete.vue'

const defaultItems = [
	{ text: 'Paris', value: 'paris' },
	{ text: 'Lyon', value: 'lyon' },
	{ text: 'Marseille', value: 'marseille' },
	{ text: 'Toulouse', value: 'toulouse' },
]

describe('SyAutocomplete - Visual regression tests', () => {
	it('displays the autocomplete by default', () => {
		cy.mountWithVuetify(SyAutocomplete, {
			props: {
				items: defaultItems,
				label: 'Ville',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-autocomplete-default', cy.get('.v-text-field'))
	})

	it('displays the autocomplete with a selected value', () => {
		cy.mountWithVuetify(SyAutocomplete, {
			props: {
				items: defaultItems,
				label: 'Ville',
				modelValue: 'paris',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-autocomplete-with-value', cy.get('.v-text-field'))
	})

	it('displays the autocomplete with multiple selection', () => {
		cy.mountWithVuetify(SyAutocomplete, {
			props: {
				items: defaultItems,
				label: 'Villes',
				multiple: true,
				chips: true,
				modelValue: ['paris', 'lyon'],
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-autocomplete-multiple', cy.get('.v-text-field'))
	})

	it('displays the autocomplete with loading state', () => {
		cy.mountWithVuetify(SyAutocomplete, {
			props: {
				items: defaultItems,
				label: 'Ville',
				loading: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-autocomplete-loading', cy.get('.v-text-field'))
	})
})
