import SyAutocomplete from '../SyAutocomplete.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

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

	// Bouton clear (`<button>` natif) : ring DS primary scopé (2px, offset 1px).
	it('shows the DS ring on the focused clear button', () => {
		cy.mountWithVuetify(SyAutocomplete, {
			props: {
				items: defaultItems,
				label: 'Ville',
				clearable: true,
				modelValue: 'paris',
			},
		})

		focusVisible('.sy-autocomplete__clear-button')
		cy.wait(150)
		cy.matchImageSnapshot('sy-autocomplete-clear-focus', cy.get('.v-text-field'))
	})

	// Option active du menu (combobox aria-activedescendant) : ring DS primary visible.
	// On ouvre le menu et on descend d'une option au clavier.
	it('shows the DS ring on the keyboard-active menu option', () => {
		cy.mountWithVuetify(SyAutocomplete, {
			props: { items: defaultItems, label: 'Ville' },
		})

		cy.get('.v-text-field input').focus()
		cy.get('.v-text-field input').trigger('keydown', { key: 'ArrowDown' })
		cy.get('.sy-autocomplete__option--focused', { timeout: 8000 }).should('be.visible')
		cy.wait(150)
		cy.matchImageSnapshot('sy-autocomplete-menu-option-focus', cy.get('.v-application'))
	})
})
