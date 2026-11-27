import SearchListField from '../SearchListField.vue'

describe('SearchListField – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 10.1 – exposes a labelled search input and selectable options', () => {
		cy.mountWithVuetify(SearchListField, { props: { label: 'Rechercher', items: [{ label: 'Option A', value: 'a' }] } })
		cy.get('input').should('have.attr', 'aria-label')
		cy.get('.sy-search-list').should('be.visible')
	})
})
