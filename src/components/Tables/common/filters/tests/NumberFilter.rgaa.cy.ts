import NumberFilter from '../NumberFilter.vue'
describe('NumberFilter – RGAA browser checks – CNAM theme', () => {
	it('8.2 – renders a visible labelled filter', () => {
		cy.mountWithVuetify(NumberFilter, { props: { header: { title: 'Âge', key: 'age' } } })
		cy.get('.filter-input').should('be.visible')
		cy.contains('Âge').should('be.visible')
	})
})
