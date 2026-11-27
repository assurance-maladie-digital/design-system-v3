import PeriodFilter from '../PeriodFilter.vue'
describe('PeriodFilter – RGAA browser checks – CNAM theme', () => {
	it('8.2 – renders a visible labelled period filter', () => {
		cy.mountWithVuetify(PeriodFilter, { props: { header: { title: 'Période', key: 'period' } } })
		cy.get('.filter-input').should('be.visible')
	})
})
