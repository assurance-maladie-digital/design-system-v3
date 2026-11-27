import SearchListField from '../SearchListField.vue'

describe('SearchListField – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.2 and 9.1 – exposes a labelled search input and accessible result status', () => {
		cy.mountWithVuetify(SearchListField, { props: { label: 'Rechercher', items: [{ label: 'Alice', value: 'alice' }] } })
		cy.get('[data-test-id="search-input"] input').should('be.visible').and('have.attr', 'aria-label', 'Rechercher')
		cy.get('fieldset legend').should('exist')
		cy.get('[role="status"]').should('exist')
	})
})
