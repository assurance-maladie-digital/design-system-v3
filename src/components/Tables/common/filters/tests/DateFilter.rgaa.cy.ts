import DateFilter from '../DateFilter.vue'
describe('DateFilter – RGAA browser checks – CNAM theme', () => {
	it('8.2 – renders a visible labelled date filter', () => {
		cy.mountWithVuetify(DateFilter, { props: { header: { title: 'Date de naissance', key: 'birthdate' } } })
		cy.get('.filter-input').should('be.visible')
		cy.contains('Date de naissance').should('be.visible')
	})
})
