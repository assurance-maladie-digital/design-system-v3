import SyAutocomplete from '../SyAutocomplete.vue'

const items = [
	{ text: 'Paris', value: 'paris' },
	{ text: 'Lyon', value: 'lyon' },
	{ text: 'Marseille', value: 'marseille' },
]

describe('SyAutocomplete – RGAA browser checks – CNAM theme', () => {
	it('8.2, 10.1 and 11.13 – exposes a labelled required combobox', () => {
		cy.mountWithVuetify(SyAutocomplete, { props: { items, label: 'Ville', required: true } })
		cy.get('input[role="combobox"]').should('be.visible').and('have.attr', 'aria-required', 'true')
		cy.get('input[role="combobox"]').invoke('attr', 'aria-label').then((label) => {
			cy.get('input[role="combobox"]').invoke('attr', 'aria-labelledby').then((labelledBy) => {
				expect(Boolean(label || labelledBy)).to.equal(true)
			})
		})
	})

	it('7.1, 7.3 and 12.9 – opens a labelled listbox and exposes selectable options', () => {
		cy.mountWithVuetify(SyAutocomplete, { props: { items, label: 'Ville' } })
		cy.get('input[role="combobox"]').click()
		cy.get('[role="listbox"]').should('be.visible').and('have.attr', 'aria-labelledby')
		cy.get('[role="option"]').should('have.length', 3).each($option => expect($option.attr('aria-selected')).to.match(/true|false/))
	})

	it('7.1 and 10.7 – exposes a labelled clear button and keyboard focus', () => {
		cy.mountWithVuetify(SyAutocomplete, { props: { items, label: 'Ville', clearable: true, modelValue: 'paris' } })
		cy.get('.sy-autocomplete__clear-button').should('be.visible').and('have.attr', 'aria-label')
		cy.get('.sy-autocomplete__clear-button').focus().should('be.focused')
	})
})
