import SyInputSelect from '../SyInputSelect.vue'

const items = [
	{ text: 'Régime général', value: 'general' },
	{ text: 'Régime agricole', value: 'agricole' },
]

describe('SyInputSelect – RGAA browser checks – CNAM theme', () => {
	it('8.2, 11.10 and 12.9 – exposes a named keyboard trigger', () => {
		cy.mountWithVuetify(SyInputSelect, { props: { label: 'Régime', items, required: true } })
		cy.get('.sy-input-select').should('be.visible').and('have.attr', 'role', 'button').and('have.attr', 'aria-label', 'Régime')
		cy.get('.sy-input-select').should('have.attr', 'tabindex', '0').and('have.attr', 'aria-expanded', 'false')
	})

	it('7.1, 7.3 and 12.9 – opens a labelled listbox with selectable options', () => {
		cy.mountWithVuetify(SyInputSelect, { props: { label: 'Régime', items } })
		cy.get('.sy-input-select').click()
		cy.get('[role="listbox"]').should('be.visible').and('have.attr', 'aria-label', 'Régime')
		cy.get('[role="option"]').should('have.length', 2).each($option => expect($option.attr('aria-selected')).to.match(/true|false/))
	})

	it('7.1 and 10.7 – exposes a named clear action and focus indicator target', () => {
		cy.mountWithVuetify(SyInputSelect, { props: { label: 'Régime', items, modelValue: items[0], clearable: true } })
		cy.get('.sy-input-select__clear').should('be.visible').and('have.attr', 'aria-label')
		cy.get('.sy-input-select').focus().should('be.focused')
	})
})
