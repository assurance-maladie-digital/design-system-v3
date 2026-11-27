import SelectFilter from '../SelectFilter.vue'
describe('SelectFilter – RGAA browser checks – CNAM theme', () => {
	it('8.2 – renders a visible labelled selection filter', () => {
		cy.mountWithVuetify(SelectFilter, { props: { header: { title: 'Département', key: 'department', filterOptions: [] } } })
		cy.get('.filter-input').should('be.visible')
		cy.contains('Département').should('be.visible')
	})
})
