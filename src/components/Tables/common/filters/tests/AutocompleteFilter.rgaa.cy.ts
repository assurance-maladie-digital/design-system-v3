import AutocompleteFilter from '../AutocompleteFilter.vue'
describe('AutocompleteFilter – RGAA browser checks – CNAM theme', () => {
	it('8.2 – renders a visible labelled autocomplete filter', () => {
		cy.mountWithVuetify(AutocompleteFilter, { props: { header: { title: 'Statut', key: 'status', filterOptions: [] } } })
		cy.get('.filter-input').should('be.visible')
		cy.contains('Statut').should('be.visible')
	})
})
