import TextFilter from '../TextFilter.vue'
describe('TextFilter – RGAA browser checks – CNAM theme', () => {
	it('8.2 – renders a visible labelled filter', () => {
		cy.mountWithVuetify(TextFilter, { props: { header: { title: 'Département', key: 'department' } } })
		cy.get('.filter-input').should('be.visible')
		cy.contains('Département').should('be.visible')
	})
})
